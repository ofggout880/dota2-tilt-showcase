import os
import json
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV, cross_val_predict
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, average_precision_score
from sklearn.inspection import permutation_importance
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.pipeline import Pipeline
from sklearn.ensemble import HistGradientBoostingClassifier

DATASET_FILE = "data/dota2_players_dataset.csv"
MODEL_FILE = "data/dota2_churn_model.pkl"
SCALER_FILE = "data/dota2_scaler.pkl"
METRICS_FILE = "data/ml_results.json"
FEATURES_LIST_FILE = "data/features_list.json"

os.makedirs("data", exist_ok=True)

def engineer_features(df):
    """Calcule des variables d'interaction comportementales à forte valeur prédictive."""
    df = df.copy()
    
    # 1. Frustration active (série de défaites) vs série de victoires
    df["is_on_loss_streak"] = (df["current_streak_at_cutoff"] < 0).astype(int)
    df["loss_streak_length"] = df["current_streak_at_cutoff"].apply(lambda x: abs(x) if x < 0 else 0)
    df["win_streak_length"] = df["current_streak_at_cutoff"].apply(lambda x: x if x > 0 else 0)
    
    # 2. Ratios de performance de combat
    df["kills_to_deaths_ratio"] = df["avg_kills"] / (df["avg_deaths"] + 1)
    df["assists_to_deaths_ratio"] = df["avg_assists"] / (df["avg_deaths"] + 1)
    
    # 3. Engagement de session (jeux par session / jours d'écart moyen)
    df["engagement_score"] = df["avg_session_games"] / (df["avg_session_gap_days"] + 1)
    
    # 4. Durée par partie de session
    df["session_duration_per_game"] = df["avg_session_duration"] / (df["avg_session_games"] + 1)
    
    return df

def get_feature_importances(pipeline, X, y, feature_names):
    """Calcule l'importance des variables par permutation (générique et sans fuite)."""
    print("      -> Calcul des importances des variables par permutation...")
    try:
        r = permutation_importance(pipeline, X, y, n_repeats=3, random_state=42, n_jobs=-1)
        importances = r.importances_mean
        importances = np.maximum(0, importances) # Tronquer les valeurs négatives
        total = np.sum(importances)
        if total > 0:
            importances = importances / total
    except Exception as e:
        print(f"      Avertissement : échec du calcul de permutation ({e}). Importances uniformes.")
        importances = np.ones(len(feature_names)) / len(feature_names)
        
    indices = np.argsort(importances)[::-1]
    feature_importance_list = [
        {"feature": feature_names[i], "importance": float(importances[i])}
        for i in indices
    ]
    return feature_importance_list

def train_model():
    if not os.path.exists(DATASET_FILE):
        print(f"Erreur : {DATASET_FILE} n'existe pas.")
        return
        
    print("1. Chargement et ingénierie des caractéristiques...")
    df = pd.read_csv(DATASET_FILE)
    df = df.dropna(subset=["is_churn"])
    
    # Ingénierie des features
    df = engineer_features(df)
    
    # Remplir les colonnes manquantes
    for col in ["objective_focus", "night_owl_pct", "role_consistency", "tilt_index"]:
        if col not in df.columns:
            df[col] = 0.0
            
    # Liste des features V4 (Incluant le contexte du Match T)
    feature_cols = [
        # Nouveau: Contexte Match T (Anticipation)
        "match_T_won", "match_T_imbalance", "match_T_party_size", 
        "match_T_is_night", "match_T_is_ranked",
        
        # Niveau et activité générale
        "rank_tier",
        
        # Comportement et historique de churn
        "current_streak_at_cutoff", "avg_session_games", 
        "avg_rank_imbalance",
        
        # Comportement (groupe, abandon, match classé)
        "abandon_rate", "party_play_pct", "ranked_play_pct",
        
        # Performances globales
        "win_rate", "avg_kills", "avg_deaths", "avg_assists", "avg_kda",
        "avg_duration", "hero_diversity",
        
        # Tendances récentes (Trend)
        "win_rate_trend", "kda_trend", 
        "deaths_trend", "kills_trend", "assists_trend",
        "gpm_trend", "xpm_trend",
        
        # Tilt & Rage-Quit
        "recent_abandons", "recent_avg_duration", 
        "recent_deaths_per_min", "tilt_index",
        
        # Profils psychologiques & Environnement
        "objective_focus", "night_owl_pct", "role_consistency",
        
        # Nouvelles variables ingéniérées
        "is_on_loss_streak", "loss_streak_length", "win_streak_length",
        "kills_to_deaths_ratio", "assists_to_deaths_ratio",
        "session_duration_per_game",
        
        # Variables de performance économiques
        "avg_gpm", "avg_xpm", "avg_last_hits", 
        "avg_hero_damage", "avg_tower_damage", "avg_hero_healing"
    ]
    
    # Sauvegarde du schéma exact pour le Backend (Live Predictor)
    with open(FEATURES_LIST_FILE, "w") as f:
        json.dump(feature_cols, f)
    
    X = df[feature_cols].copy()
    
    # Imputer les NaNs par la moyenne
    for col in X.columns:
        if X[col].isna().any():
            X[col] = X[col].fillna(X[col].mean())
            
    y = df["is_churn"].astype(int)
    
    churn_rate = y.mean()
    print(f"Dataset chargé : {X.shape[0]} joueurs. Taux de churn : {churn_rate:.1%}")
    
    # Calcul du weight dynamique pour XGBoost (Scale Pos Weight)
    spw = (len(y) - sum(y)) / sum(y)
    print(f"Ratio Classe Majoritaire/Minoritaire (scale_pos_weight) : {spw:.2f}")
    
    # Stratified Split (Train 80% / Test 20%)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # 3-Fold Cross-Validation Stratifiée pour gagner du temps avec le grand dataset
    cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)
    
    # Pipelines
    # Nous testons les 2 méthodologies AAA : 
    # 1. XGBoost natif avec scale_pos_weight
    # 2. XGBoost avec SMOTE (équilibrage artificiel)
    pipelines = {
        "xgboost_scale_pos": Pipeline([
            ('scaler', StandardScaler()),
            ('xgb', HistGradientBoostingClassifier(class_weight='balanced', random_state=42))
        ]),
        "xgboost_smote": ImbPipeline([
            ('scaler', StandardScaler()),
            ('smote', SMOTE(random_state=42)),
            ('xgb', HistGradientBoostingClassifier(random_state=42))
        ])
    }
    
    grids = {
        "xgboost_scale_pos": {
            'xgb__max_depth': [4, 6],
            'xgb__learning_rate': [0.05, 0.1],
            'xgb__max_iter': [100, 150]
        },
        "xgboost_smote": {
            'xgb__max_depth': [4, 6],
            'xgb__learning_rate': [0.05, 0.1],
            'xgb__max_iter': [100, 150]
        }
    }
    
    results = {}
    best_pipelines = {}
    
    print("\n2. Optimisation des modèles (XGBoost V4)...")
    
    for name, pipeline in pipelines.items():
        print(f"\n   -> Grid Search pour {name}...")
        grid = GridSearchCV(pipeline, grids[name], cv=cv, scoring='average_precision', n_jobs=-1)
        grid.fit(X_train, y_train)
        
        best_pipelines[name] = grid.best_estimator_
        print(f"      Meilleurs params : {grid.best_params_} (Meilleur PR-AUC CV = {grid.best_score_:.1%})")
        
        # Réglage du seuil optimal Out-of-Fold sur le F1-Score
        print(f"      -> Réglage du seuil optimal Out-of-Fold...")
        y_proba_oof = cross_val_predict(grid.best_estimator_, X_train, y_train, cv=cv, method='predict_proba', n_jobs=-1)[:, 1]
        
        best_threshold = 0.5
        best_f1 = -1
        for th in np.linspace(0.1, 0.9, 81):
            preds = (y_proba_oof >= th).astype(int)
            f1_th = f1_score(y_train, preds, zero_division=0)
            if f1_th > best_f1:
                best_f1 = f1_th
                best_threshold = th
                
        # Évaluation finale Test
        y_proba_test = grid.best_estimator_.predict_proba(X_test)[:, 1]
        y_pred_test = (y_proba_test >= best_threshold).astype(int)
        
        acc = accuracy_score(y_test, y_pred_test)
        prec = precision_score(y_test, y_pred_test, zero_division=0)
        rec = recall_score(y_test, y_pred_test, zero_division=0)
        f1 = f1_score(y_test, y_pred_test, zero_division=0)
        auc = roc_auc_score(y_test, y_proba_test)
        pr_auc = average_precision_score(y_test, y_proba_test)
        
        feature_importances = get_feature_importances(grid.best_estimator_, X_train, y_train, feature_cols)
        
        results[name] = {
            "accuracy": float(acc),
            "precision": float(prec),
            "recall": float(rec),
            "f1_score": float(f1),
            "auc_score": float(auc),
            "pr_auc": float(pr_auc),
            "best_threshold": float(best_threshold),
            "feature_importances": feature_importances
        }
        
        print(f"      [Test] Seuil={best_threshold:.2f} | F1={f1:.1%} | PR-AUC={pr_auc:.1%} | ROC-AUC={auc:.1%} | Précision={prec:.1%} | Rappel={rec:.1%}")
        
    # Choix du meilleur modèle basé sur le PR-AUC (Métrique AAA)
    best_model_name = max(results, key=lambda k: results[k]["pr_auc"])
    print(f"\n3. Meilleur modèle final détecté : {best_model_name} (PR-AUC = {results[best_model_name]['pr_auc']:.1%})")
    
    final_pipeline = best_pipelines[best_model_name]
    
    # Sauvegarder le scaler
    scaler = final_pipeline.named_steps['scaler']
    joblib.dump(scaler, SCALER_FILE)
    
    # Sauvegarder le modèle XGBoost final
    final_classifier = final_pipeline.named_steps['xgb']
    joblib.dump(final_classifier, MODEL_FILE)
    
    metrics_export = {
        "dataset_size": int(df.shape[0]),
        "train_size": int(X_train.shape[0]),
        "test_size": int(X_test.shape[0]),
        "churn_rate_dataset": float(churn_rate),
        "best_model_name": best_model_name,
        "uses_xgboost_library": True,
        
        "best_threshold": results[best_model_name]["best_threshold"],
        "accuracy": results[best_model_name]["accuracy"],
        "precision": results[best_model_name]["precision"],
        "recall": results[best_model_name]["recall"],
        "f1_score": results[best_model_name]["f1_score"],
        "auc_score": results[best_model_name]["auc_score"],
        "pr_auc": results[best_model_name]["pr_auc"],
        "feature_importances": results[best_model_name]["feature_importances"],
        
        "comparison": results
    }
    
    with open(METRICS_FILE, "w") as f:
        json.dump(metrics_export, f, indent=2)
        
    print(f"Modèle XGBoost V4, Scaler et Métriques sauvegardés avec succès (Features exportées dans {FEATURES_LIST_FILE}).")

if __name__ == "__main__":
    train_model()

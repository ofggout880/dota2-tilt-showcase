from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import re
import json
import uvicorn
import subprocess
import pandas as pd
import numpy as np
import joblib
from dotenv import load_dotenv
from typing import List, Dict, Any
import time
import asyncio

from opendota_client import OpenDotaClient

load_dotenv()

app = FastAPI(title="Dota 2 Churn Predictor API")

# Configuration CORS pour le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

opendota = OpenDotaClient()

@app.on_event("shutdown")
async def shutdown_event():
    await opendota.close()

async def daily_collection_scheduler():
    """Tâche de fond qui vérifie toutes les heures s'il faut lancer la collecte journalière."""
    print("Planificateur de collecte journalière initialisé.")
    status_file = "data/collection_status.json"
    
    # Laisser le serveur s'initialiser
    await asyncio.sleep(15)
    
    while True:
        try:
            auto_collect = os.getenv("OPENDOTA_AUTO_COLLECT", "True").lower() == "true"
            if auto_collect:
                last_run = None
                if os.path.exists(status_file):
                    try:
                        with open(status_file, "r") as f:
                            data = json.load(f)
                            last_run = data.get("last_run_timestamp")
                    except Exception as e:
                        print(f"[Planificateur] Erreur lecture statut: {e}")
                
                from datetime import datetime
                now_dt = datetime.now()
                now_timestamp = now_dt.timestamp()
                
                # Récupérer la date du dernier run
                last_run_date = None
                if last_run is not None:
                    try:
                        last_run_date = datetime.fromtimestamp(last_run).date()
                    except:
                        pass
                
                today_date = now_dt.date()
                current_hour = now_dt.hour
                current_minute = now_dt.minute
                
                # On déclenche la collecte si :
                # 1. Il est au moins 8h50 du matin
                # 2. Et soit on n'a jamais lancé, soit le dernier run date d'un jour précédent
                should_trigger = False
                if current_hour > 8 or (current_hour == 8 and current_minute >= 50):
                    if last_run_date is None or today_date > last_run_date:
                        should_trigger = True
                
                if should_trigger:
                    is_running = False
                    if os.path.exists(status_file):
                        try:
                            with open(status_file, "r") as f:
                                data = json.load(f)
                                if data.get("status") == "in_progress":
                                    is_running = True
                        except:
                            pass
                    
                    if not is_running:
                        print("[Planificateur] Il est 8h50 (ou plus tard) et aucune collecte n'a été faite aujourd'hui. Lancement...")
                        try:
                            python_bin = os.path.join(os.path.dirname(__file__), "venv", "bin", "python3")
                            script_path = os.path.join(os.path.dirname(__file__), "collect_data.py")
                            if not os.path.exists(python_bin) or not os.path.exists(script_path):
                                raise FileNotFoundError("Binaire Python ou script de collecte introuvable.")
                            
                            subprocess.Popen([python_bin, script_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                            
                            # Mettre à jour le timestamp pour éviter le double lancement immédiat
                            status_data = {}
                            if os.path.exists(status_file):
                                with open(status_file, "r") as f:
                                    status_data = json.load(f)
                            status_data["last_run_timestamp"] = now_timestamp
                            with open(status_file, "w") as f:
                                json.dump(status_data, f, indent=2)
                        except Exception as start_err:
                            print(f"[Planificateur] Échec du lancement de la collecte : {start_err}")
                            # Écrire l'erreur directement sur le site
                            try:
                                err_status = {
                                    "status": "failed",
                                    "matches_completed": 0,
                                    "matches_total": 0,
                                    "players_completed": 0,
                                    "players_total": 0,
                                    "current_message": f"Échec du lancement de la collecte automatique à 8h : {start_err}",
                                    "total_api_calls": 0,
                                    "estimated_cost_usd": 0.0,
                                    "last_run_timestamp": now_timestamp,
                                    "log_messages": [f"Erreur de démarrage automatique : {start_err}"]
                                }
                                with open(status_file, "w") as f:
                                    json.dump(err_status, f, indent=2)
                            except:
                                pass
        except Exception as e:
            print(f"[Planificateur] Erreur critique : {e}")
            
        # Revérifier toutes les minutes
        await asyncio.sleep(60)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(daily_collection_scheduler())

@app.get("/api/config")
async def get_config():
    """Renvoie la configuration active pour adapter le frontend."""
    return {
        "free_tier": os.getenv("OPENDOTA_FREE_TIER", "True").lower() == "true",
        "auto_collect": os.getenv("OPENDOTA_AUTO_COLLECT", "True").lower() == "true"
    }

def parse_markdown_tasks(content: str) -> List[Dict[str, Any]]:
    tasks = []
    current_category = "Général"
    lines = content.split("\n")
    for line in lines:
        line = line.strip()
        if line.startswith("##"):
            current_category = line.lstrip("#").strip()
        elif line.startswith("- ["):
            match = re.match(r"-\s*\[([ x/])\]\s*(.*)", line)
            if match:
                status_char = match.group(1)
                task_text = match.group(2)
                
                status = "todo"
                if status_char == "x":
                    status = "done"
                elif status_char == "/":
                    status = "in_progress"
                
                tasks.append({
                    "category": current_category,
                    "text": task_text,
                    "status": status
                })
    return tasks

@app.get("/api/tasks")
async def get_tasks():
    """Lit et parse le fichier task.md pour le dashboard."""
    task_file_path = os.getenv("TASK_FILE_PATH", "task.md")
    if not os.path.exists(task_file_path):
        return {"markdown": "", "tasks": [], "warning": "task.md non trouvé"}
    
    try:
        with open(task_file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        parsed_tasks = parse_markdown_tasks(content)
        return {
            "markdown": content,
            "tasks": parsed_tasks
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la lecture des tâches : {str(e)}")

@app.get("/api/collection/status")
async def get_collection_status():
    """Renvoie le statut actuel de la collecte de données."""
    status_file = "data/collection_status.json"
    dataset_file = "data/dota2_players_dataset.csv"
    
    dataset_exists = os.path.exists(dataset_file)
    dataset_size = 0
    if dataset_exists:
        try:
            with open(dataset_file, "r") as f:
                dataset_size = sum(1 for line in f) - 1
        except:
            pass
            
    if not os.path.exists(status_file):
        return {
            "status": "idle",
            "matches_completed": 0,
            "matches_total": 0,
            "players_completed": 0,
            "players_total": 0,
            "current_message": "Aucune collecte démarrée.",
            "log_messages": [],
            "dataset_exists": dataset_exists,
            "dataset_size": dataset_size
        }
        
    try:
        with open(status_file, "r") as f:
            status = json.load(f)
        status["dataset_exists"] = dataset_exists
        status["dataset_size"] = dataset_size
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la lecture du statut : {str(e)}")

@app.post("/api/collection/start")
async def start_collection():
    """Démarre le script collect_data.py en arrière-plan."""
    status_file = "data/collection_status.json"
    
    if os.path.exists(status_file):
        try:
            with open(status_file, "r") as f:
                status_data = json.load(f)
                if status_data.get("status") == "in_progress":
                    return {"message": "La collecte est déjà en cours.", "status": "in_progress"}
        except:
            pass
            
    python_bin = os.path.join(os.path.dirname(__file__), "venv", "bin", "python3")
    script_path = os.path.join(os.path.dirname(__file__), "collect_data.py")
    
    try:
        subprocess.Popen([python_bin, script_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return {"message": "Collecte démarrée en arrière-plan.", "status": "started"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Impossible de lancer la collecte : {str(e)}")

@app.get("/api/dataset/preview")
async def get_dataset_preview():
    """Renvoie les premières lignes du dataset CSV s'il existe."""
    dataset_file = "data/dota2_players_dataset.csv"
    if not os.path.exists(dataset_file):
        return {"exists": False, "data": []}
    
    try:
        df = pd.read_csv(dataset_file)
        raw_preview = df.head(10).to_dict(orient="records")
        preview = [{k: (None if pd.isna(v) else v) for k, v in record.items()} for record in raw_preview]
        return {
            "exists": True,
            "total_rows": len(df),
            "columns": list(df.columns),
            "data": preview
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Impossible de lire le dataset : {str(e)}")

# --- Helper Session Parser pour la prédiction unitaire ---

def calculate_sessions(matches: List[Dict[str, Any]]) -> Dict[str, float]:
    if not matches:
        return {"avg_session_games": 1.0, "avg_session_duration": 30.0, "avg_session_gap_days": 1.0}
    sorted_m = sorted(matches, key=lambda x: x.get("start_time", 0))
    sessions = []
    current_session = []
    for m in sorted_m:
        start_time = m.get("start_time")
        duration = m.get("duration", 0)
        if not start_time:
            continue
        if not current_session:
            current_session.append(m)
        else:
            prev_m = current_session[-1]
            prev_end = prev_m.get("start_time", 0) + prev_m.get("duration", 0)
            if start_time - prev_end < 7200:
                current_session.append(m)
            else:
                sessions.append(current_session)
                current_session = [m]
    if current_session:
        sessions.append(current_session)
    session_games = [len(s) for s in sessions]
    session_durations = []
    for s in sessions:
        if len(s) == 1:
            session_durations.append(s[0].get("duration", 0) / 60.0)
        else:
            start = s[0].get("start_time", 0)
            end = s[-1].get("start_time", 0) + s[-1].get("duration", 0)
            session_durations.append((end - start) / 60.0)
    session_gaps = []
    for i in range(1, len(sessions)):
        prev_end = sessions[i-1][-1].get("start_time", 0) + sessions[i-1][-1].get("duration", 0)
        curr_start = sessions[i][0].get("start_time", 0)
        session_gaps.append((curr_start - prev_end) / 86400.0)
    return {
        "avg_session_games": sum(session_games) / len(sessions) if sessions else 1.0,
        "avg_session_duration": sum(session_durations) / len(sessions) if sessions else 30.0,
        "avg_session_gap_days": sum(session_gaps) / len(session_gaps) if session_gaps else 2.0
    }

def get_streak_at_cutoff(matches: List[Dict[str, Any]]) -> int:
    if not matches:
        return 0
    first_match = matches[0]
    player_slot = first_match.get("player_slot", 0)
    radiant_win = first_match.get("radiant_win", False)
    is_radiant = player_slot < 128
    first_win = (is_radiant and radiant_win) or (not is_radiant and not radiant_win)
    streak = 1 if first_win else -1
    for m in matches[1:]:
        p_slot = m.get("player_slot", 0)
        r_win = m.get("radiant_win", False)
        is_rad = p_slot < 128
        win = (is_rad and r_win) or (not is_rad and not r_win)
        if win == first_win:
            if first_win: streak += 1
            else: streak -= 1
        else:
            break
    return streak

# --- Endpoints Machine Learning ---

@app.get("/api/ml/metrics")
async def get_ml_metrics():
    """Récupère les métriques du modèle entraîné."""
    metrics_file = "data/ml_results.json"
    if not os.path.exists(metrics_file):
        return {"trained": False, "metrics": None}
    try:
        with open(metrics_file, "r") as f:
            metrics = json.load(f)
        return {"trained": True, "metrics": metrics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Impossible de charger les métriques : {str(e)}")

@app.post("/api/ml/train")
async def train_ml_model():
    """Lance l'entraînement du modèle (synchrone)."""
    python_bin = os.path.join(os.path.dirname(__file__), "venv", "bin", "python3")
    script_path = os.path.join(os.path.dirname(__file__), "train.py")
    try:
        res = subprocess.run([python_bin, script_path], capture_output=True, text=True)
        if res.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Échec de l'entraînement : {res.stderr}")
            
        metrics_file = "data/ml_results.json"
        with open(metrics_file, "r") as f:
            metrics = json.load(f)
        return {"message": "Modèle de churn entraîné !", "metrics": metrics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur d'entraînement : {str(e)}")

@app.get("/api/ml/visualizations")
async def get_ml_visualizations():
    """Calcule les statistiques avancées pour les graphiques du dashboard (sélection de seuil, corrélations, bins)."""
    dataset_file = "data/dota2_players_dataset.csv"
    model_path = "data/dota2_churn_model.pkl"
    scaler_path = "data/dota2_scaler.pkl"
    
    if not os.path.exists(dataset_file):
        raise HTTPException(status_code=400, detail="Dataset non disponible.")
        
    try:
        df = pd.read_csv(dataset_file)
        df = df.dropna(subset=["is_churn"])
        
        # Calculer les variables ingéniérées
        df["is_on_loss_streak"] = (df["current_streak_at_cutoff"] < 0).astype(int)
        df["loss_streak_length"] = df["current_streak_at_cutoff"].apply(lambda x: abs(x) if x < 0 else 0)
        df["win_streak_length"] = df["current_streak_at_cutoff"].apply(lambda x: x if x > 0 else 0)
        df["kills_to_deaths_ratio"] = df["avg_kills"] / (df["avg_deaths"] + 1)
        df["assists_to_deaths_ratio"] = df["avg_assists"] / (df["avg_deaths"] + 1)
        df["engagement_score"] = df["avg_session_games"] / (df["avg_session_gap_days"] + 1)
        df["session_duration_per_game"] = df["avg_session_duration"] / (df["avg_session_games"] + 1)
        
        
        # Charger la vraie liste des features utilisées par le modèle final
        features_file = "data/features_list.json"
        if os.path.exists(features_file):
            with open(features_file, "r") as f:
                feature_cols = json.load(f)
        else:
            feature_cols = [col for col in df.columns if col not in ["is_churn", "account_id", "extraction_date", "personaname", "time_gap_days"]]
        
        # --- 1. Corrélations avec le Churn ---
        correlations = {}
        for col in feature_cols:
            if col in df.columns:
                corr_val = df[col].corr(df["is_churn"])
                correlations[col] = 0.0 if pd.isna(corr_val) else float(corr_val)
                
        # --- 2. Churn vs Déséquilibre de Match (Impact / avg_xpm) ---
        imbalance_bins = [
            {"label": "Sévèrement Dominé (< 550)", "min": 0, "max": 550.0},
            {"label": "Défavorable (550-650)", "min": 550.0, "max": 650.0},
            {"label": "Équilibré (650-750)", "min": 650.0, "max": 750.0},
            {"label": "Dominateur (> 750)", "min": 750.0, "max": 9999.0}
        ]
        
        imbalance_stats = []
        for b in imbalance_bins:
            sub = df[(df["avg_xpm"] >= b["min"]) & (df["avg_xpm"] < b["max"])]
            churn_rate = float(sub["is_churn"].mean()) if len(sub) > 0 else 0.0
            imbalance_stats.append({
                "bin": b["label"],
                "churn_rate": churn_rate,
                "player_count": int(len(sub))
            })
            
        # --- 3. Churn vs Tilt Index (Streaks/Frustration) ---
        streak_bins = [
            {"label": "Serein (Tilt 0)", "cond": df["tilt_index"] == 0},
            {"label": "Légèrement Frustré (0-1)", "cond": (df["tilt_index"] > 0) & (df["tilt_index"] <= 1.0)},
            {"label": "Enervé (1-3)", "cond": (df["tilt_index"] > 1.0) & (df["tilt_index"] <= 3.0)},
            {"label": "Tilt Extrême (3+)", "cond": df["tilt_index"] > 3.0}
        ]
        
        streak_stats = []
        for b in streak_bins:
            sub = df[b["cond"]]
            churn_rate = float(sub["is_churn"].mean()) if len(sub) > 0 else 0.0
            streak_stats.append({
                "bin": b["label"],
                "churn_rate": churn_rate,
                "player_count": int(len(sub))
            })

        # --- 4. Courbe de seuil (F1, Precision, Recall vs Threshold) ---
        threshold_curve = []
        best_threshold = 0.57
        
        if os.path.exists(model_path) and os.path.exists(scaler_path):
            from sklearn.model_selection import train_test_split
            from sklearn.metrics import precision_score, recall_score, f1_score
            
            X = df[feature_cols].copy()
            for col in X.columns:
                X[col] = X[col].fillna(X[col].mean())
            y = df["is_churn"].astype(int)
            
            _, X_test, _, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
            
            scaler = joblib.load(scaler_path)
            model = joblib.load(model_path)
            
            X_test_scaled = scaler.transform(X_test)
            y_proba = model.predict_proba(X_test_scaled)[:, 1]
            
            for th in np.linspace(0.02, 0.98, 49):
                preds = (y_proba >= th).astype(int)
                prec = precision_score(y_test, preds, zero_division=0)
                rec = recall_score(y_test, preds, zero_division=0)
                f1 = f1_score(y_test, preds, zero_division=0)
                threshold_curve.append({
                    "threshold": float(th),
                    "precision": float(prec),
                    "recall": float(rec),
                    "f1_score": float(f1)
                })
            
            metrics_file = "data/ml_results.json"
            if os.path.exists(metrics_file):
                try:
                    with open(metrics_file, "r") as f:
                        m_data = json.load(f)
                        best_threshold = m_data.get("best_threshold", 0.57)
                except:
                    pass
                    
        # --- 5. Churn vs Nombre de parties par session (avg_session_games) pour les joueurs moyens (rank_tier 30-55) ---
        df_avg = df[(df["rank_tier"] >= 30) & (df["rank_tier"] <= 55)]
        session_bins = [
            {"label": "1.0 - 1.2 partie", "min": 0.0, "max": 1.2},
            {"label": "1.2 - 1.7 parties", "min": 1.2, "max": 1.7},
            {"label": "1.7 - 2.2 parties", "min": 1.7, "max": 2.2},
            {"label": "2.2 - 3.0 parties", "min": 2.2, "max": 3.0},
            {"label": "3.0+ parties", "min": 3.0, "max": 999.0}
        ]
        session_stats = []
        for b in session_bins:
            sub = df_avg[(df_avg["avg_session_games"] >= b["min"]) & (df_avg["avg_session_games"] < b["max"])]
            churn_rate = float(sub["is_churn"].mean()) if len(sub) > 0 else 0.0
            session_stats.append({
                "bin": b["label"],
                "churn_rate": churn_rate,
                "player_count": int(len(sub))
            })
            
        return {
            "correlations": correlations,
            "imbalance_stats": imbalance_stats,
            "streak_stats": streak_stats,
            "threshold_curve": threshold_curve,
            "best_threshold": best_threshold,
            "session_stats": session_stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la génération des visualisations : {str(e)}")

@app.get("/api/predict/{account_id}")
async def predict_player_churn(account_id: str):
    """Calcule les stats d'un joueur et prédit sa probabilité de Churn (risque d'abandon)."""
    model_path = "data/dota2_churn_model.pkl"
    scaler_path = "data/dota2_scaler.pkl"
    
    if not os.path.exists(model_path) or not os.path.exists(scaler_path):
        raise HTTPException(status_code=400, detail="Modèle non entraîné. Veuillez d'abord l'entraîner.")
        
    try:
        # 1. Récupérer les données récentes du joueur
        info = await opendota.get_player_info(account_id)
        raw_matches = await opendota.get_player_recent_matches(account_id)
        
        if not raw_matches:
            raise HTTPException(status_code=400, detail="Aucun match récent trouvé.")
            
        # Exclure le mode Turbo
        valid_matches = [m for m in raw_matches if m.get("game_mode") != 23]
        if len(valid_matches) < 5:
            raise HTTPException(status_code=400, detail="Le joueur n'a pas assez de matchs standard valides (min 5).")
            
        # Trier du plus récent au plus ancien
        valid_matches = sorted(valid_matches, key=lambda x: x.get("start_time", 0), reverse=True)
        
        # 2. Calculer les caractéristiques
        win_count = 0
        kills = []
        deaths = []
        assists = []
        gpm = []
        xpm = []
        last_hits = []
        hero_damage = []
        tower_damage = []
        hero_healing = []
        durations = []
        unique_heroes = set()
        
        lanes = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        lane_roles = {1: 0, 2: 0, 3: 0, 4: 0}
        
        rank_tier = info.get("rank_tier", 40) # 40 par défaut si non dispo
        rank_imbalances = []
        
        for m in valid_matches:
            player_slot = m.get("player_slot", 0)
            radiant_win = m.get("radiant_win", False)
            is_radiant = player_slot < 128
            is_win = (is_radiant and radiant_win) or (not is_radiant and not radiant_win)
            
            if is_win:
                win_count += 1
                
            kills.append(m.get("kills", 0))
            deaths.append(m.get("deaths", 0))
            assists.append(m.get("assists", 0))
            gpm.append(m.get("gold_per_min", 0))
            xpm.append(m.get("xp_per_min", 0))
            last_hits.append(m.get("last_hits", 0))
            hero_damage.append(m.get("hero_damage", 0))
            tower_damage.append(m.get("tower_damage", 0))
            hero_healing.append(m.get("hero_healing", 0))
            durations.append(m.get("duration", 0))
            unique_heroes.add(m.get("hero_id"))
            
            lane = m.get("lane")
            if lane in lanes:
                lanes[lane] += 1
            lane_role = m.get("lane_role")
            if lane_role in lane_roles:
                lane_roles[lane_role] += 1
                
            avg_rank = m.get("average_rank")
            if avg_rank:
                rank_imbalances.append(abs(rank_tier - avg_rank))
                
        num_games = len(valid_matches)
        session_stats = calculate_sessions(valid_matches)
        streak_at_cutoff = get_streak_at_cutoff(valid_matches)
        avg_rank_imbalance = sum(rank_imbalances) / len(rank_imbalances) if rank_imbalances else 0.0
        
        # --- CALCUL DES NOUVELLES FEATURES POUR LA PRÉDICTION ---
        # Contexte Match T (le match le plus récent)
        match_T = valid_matches[0]
        p_slot_T = match_T.get("player_slot", 0)
        is_rad_T = p_slot_T < 128
        r_win_T = match_T.get("radiant_win", False)
        match_T_won = 1 if (is_rad_T and r_win_T) or (not is_rad_T and not r_win_T) else 0
        match_T_imbalance = abs(rank_tier - match_T.get("average_rank", rank_tier)) if match_T.get("average_rank") else 0.0
        match_T_party_size = match_T.get("party_size", 1) or 1
        
        from datetime import datetime
        try:
            dt_T = datetime.fromtimestamp(match_T.get("start_time", 0))
            match_T_is_night = 1 if 0 <= dt_T.hour < 6 else 0
        except Exception:
            match_T_is_night = 0
            
        match_T_is_ranked = 1 if match_T.get("lobby_type") == 7 else 0

        abandons = sum(1 for m in valid_matches if m.get("leaver_status", 0) > 0)
        abandon_rate = abandons / num_games
        
        party_games = sum(1 for m in valid_matches if m.get("party_size") is not None and m.get("party_size") > 1)
        party_play_pct = party_games / num_games
        
        ranked_games = sum(1 for m in valid_matches if m.get("lobby_type") == 7)
        ranked_play_pct = ranked_games / num_games
        
        # Separation Recent vs Older (Trend)
        split_idx = min(10, max(3, num_games // 2))
        recent_subset = valid_matches[:split_idx]
        older_subset = valid_matches[split_idx:]
        
        # Win rate trend
        recent_wins = sum(1 for m in recent_subset if ((m.get("player_slot", 0) < 128) == m.get("radiant_win", False)))
        win_rate_recent = recent_wins / split_idx
        older_wins = sum(1 for m in older_subset if ((m.get("player_slot", 0) < 128) == m.get("radiant_win", False)))
        win_rate_older = older_wins / len(older_subset) if older_subset else win_rate_recent
        win_rate_trend = win_rate_recent - win_rate_older
        
        # KDA trend
        def get_kda_sub(subset):
            if not subset: return 3.0
            k = sum(m.get("kills", 0) for m in subset)
            d = sum(m.get("deaths", 0) for m in subset)
            a = sum(m.get("assists", 0) for m in subset)
            return (k + a) / max(1, d)
        kda_recent = get_kda_sub(recent_subset)
        kda_older = get_kda_sub(older_subset)
        kda_trend = kda_recent - kda_older
        
        # GPM/XPM/Kills/Deaths/Assists trends
        def get_avg_metric(subset, metric):
            if not subset: return 0.0
            return sum(m.get(metric, 0) for m in subset) / len(subset)
        gpm_recent = get_avg_metric(recent_subset, "gold_per_min")
        gpm_older = get_avg_metric(older_subset, "gold_per_min")
        gpm_trend = gpm_recent - gpm_older
        
        xpm_recent = get_avg_metric(recent_subset, "xp_per_min")
        xpm_older = get_avg_metric(older_subset, "xp_per_min")
        xpm_trend = xpm_recent - xpm_older
        
        deaths_recent = get_avg_metric(recent_subset, "deaths")
        deaths_older = get_avg_metric(older_subset, "deaths")
        deaths_trend = deaths_recent - deaths_older
        
        kills_recent = get_avg_metric(recent_subset, "kills")
        kills_older = get_avg_metric(older_subset, "kills")
        kills_trend = kills_recent - kills_older
        
        assists_recent = get_avg_metric(recent_subset, "assists")
        assists_older = get_avg_metric(older_subset, "assists")
        assists_trend = assists_recent - assists_older
        
        # Tilt & Rage-Quit features
        recent_abandons = sum(1 for m in recent_subset if m.get("leaver_status", 0) > 0)
        recent_durations = [m.get("duration", 0) for m in recent_subset]
        recent_avg_duration = (sum(recent_durations) / len(recent_durations) / 60.0) if recent_durations else 35.0
        recent_deaths = sum(m.get("deaths", 0) for m in recent_subset)
        recent_total_duration_min = sum(recent_durations) / 60.0
        recent_deaths_per_min = recent_deaths / recent_total_duration_min if recent_total_duration_min > 0 else 0.0
        
        tilt_score = 0.0
        tilt_score += recent_abandons * 2.0
        if streak_at_cutoff <= -3:
            tilt_score += abs(streak_at_cutoff) - 2.0
        if recent_avg_duration < 25.0:
            tilt_score += (25.0 - recent_avg_duration) * 0.1
        if recent_deaths_per_min > 0.3:
            tilt_score += (recent_deaths_per_min - 0.3) * 5.0
        tilt_index = tilt_score
        
        # Profils Psychologiques
        avg_hero_damage_val = sum(hero_damage) / max(1, num_games)
        avg_tower_damage_val = sum(tower_damage) / max(1, num_games)
        objective_focus = avg_tower_damage_val / (avg_hero_damage_val + 1)
        
        night_games = 0
        for m in valid_matches:
            try:
                dt = datetime.fromtimestamp(m.get("start_time", 0))
                if 0 <= dt.hour < 6:
                    night_games += 1
            except Exception:
                pass
        night_owl_pct = night_games / max(1, num_games)
        
        dominant_role_pct = max(lane_roles.values()) / max(1, num_games) if lane_roles else 0
        role_consistency = dominant_role_pct
        
        # Calculer les variables ingéniérées dynamiquement
        is_on_loss_streak = 1 if streak_at_cutoff < 0 else 0
        loss_streak_length = abs(streak_at_cutoff) if streak_at_cutoff < 0 else 0
        win_streak_length = streak_at_cutoff if streak_at_cutoff > 0 else 0
        
        avg_kills_val = sum(kills) / num_games
        avg_deaths_val = sum(deaths) / num_games
        avg_assists_val = sum(assists) / num_games
        kills_to_deaths_ratio = avg_kills_val / (avg_deaths_val + 1)
        assists_to_deaths_ratio = avg_assists_val / (avg_deaths_val + 1)
        session_duration_per_game = session_stats["avg_session_duration"] / (session_stats["avg_session_games"] + 1)
        
        # Variables de performance économiques
        avg_gpm = sum(gpm) / num_games
        avg_xpm = sum(xpm) / num_games
        avg_last_hits = sum(last_hits) / num_games
        avg_hero_damage = avg_hero_damage_val
        avg_tower_damage = avg_tower_damage_val
        avg_hero_healing = sum(hero_healing) / num_games
        
        feature_dict = {
            "match_T_won": match_T_won,
            "match_T_imbalance": match_T_imbalance,
            "match_T_party_size": match_T_party_size,
            "match_T_is_night": match_T_is_night,
            "match_T_is_ranked": match_T_is_ranked,
            "rank_tier": rank_tier,
            "current_streak_at_cutoff": streak_at_cutoff,
            "avg_session_games": session_stats["avg_session_games"],
            "avg_rank_imbalance": avg_rank_imbalance,
            "abandon_rate": abandon_rate,
            "party_play_pct": party_play_pct,
            "ranked_play_pct": ranked_play_pct,
            "win_rate": win_count / num_games,
            "avg_kills": avg_kills_val,
            "avg_deaths": avg_deaths_val,
            "avg_assists": avg_assists_val,
            "avg_kda": (sum(kills) + sum(assists)) / max(1, sum(deaths)),
            "avg_duration": sum(durations) / num_games,
            "hero_diversity": len(unique_heroes) / num_games,
            "win_rate_trend": win_rate_trend,
            "kda_trend": kda_trend,
            "deaths_trend": deaths_trend,
            "kills_trend": kills_trend,
            "assists_trend": assists_trend,
            "gpm_trend": gpm_trend,
            "xpm_trend": xpm_trend,
            "recent_abandons": recent_abandons,
            "recent_avg_duration": recent_avg_duration,
            "recent_deaths_per_min": recent_deaths_per_min,
            "tilt_index": tilt_index,
            "objective_focus": objective_focus,
            "night_owl_pct": night_owl_pct,
            "role_consistency": role_consistency,
            "is_on_loss_streak": is_on_loss_streak,
            "loss_streak_length": loss_streak_length,
            "win_streak_length": win_streak_length,
            "kills_to_deaths_ratio": kills_to_deaths_ratio,
            "assists_to_deaths_ratio": assists_to_deaths_ratio,
            "session_duration_per_game": session_duration_per_game,
            "avg_gpm": avg_gpm,
            "avg_xpm": avg_xpm,
            "avg_last_hits": avg_last_hits,
            "avg_hero_damage": avg_hero_damage,
            "avg_tower_damage": avg_tower_damage,
            "avg_hero_healing": avg_hero_healing,
        }
        
        features_list_path = "data/features_list.json"
        if os.path.exists(features_list_path):
            with open(features_list_path, "r") as f:
                feature_order = json.load(f)
        else:
            feature_order = list(feature_dict.keys())
        
        # 3. Charger le modèle classifier et faire la prédiction de probabilité
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        
        X_df = pd.DataFrame([feature_dict])[feature_order]
        X_scaled = scaler.transform(X_df)
        
        # Obtenir la probabilité de la classe 1 (churn)
        churn_probability = float(model.predict_proba(X_scaled)[0][1])
        
        # Charger le seuil optimisé s'il existe
        threshold = 0.5
        metrics_file = "data/ml_results.json"
        if os.path.exists(metrics_file):
            try:
                with open(metrics_file, "r") as f:
                    metrics_data = json.load(f)
                    threshold = metrics_data.get("best_threshold", 0.5)
            except:
                pass
                
        predicted_churn = 1 if churn_probability >= threshold else 0
        
        # Catégorie de risque de churn adaptée au seuil optimisé
        risk_level = "Faible"
        if churn_probability >= threshold * 1.5:
            risk_level = "Très Élevé (Ragequit imminent)"
        elif churn_probability >= threshold:
            risk_level = "Élevé (Frustration)"
        elif churn_probability >= threshold * 0.5:
            risk_level = "Moyen"
            
        return {
            "account_id": account_id,
            "personaname": info.get("profile", {}).get("personaname"),
            "rank_tier": rank_tier,
            "churn_probability": churn_probability,
            "predicted_churn": predicted_churn,
            "risk_level": risk_level,
            "features": {
                "win_rate": win_count / num_games,
                "avg_kda": (sum(kills) + sum(assists)) / max(1, sum(deaths)),
                "avg_gpm": sum(gpm) / num_games,
                "avg_xpm": sum(xpm) / num_games,
                "current_streak": streak_at_cutoff,
                "avg_session_duration": session_stats["avg_session_duration"],
                "avg_rank_imbalance": avg_rank_imbalance
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la prédiction du churn : {str(e)}")

# --- Endpoints d'exploration standard ---

@app.get("/api/status")
async def get_status():
    """Vérifie le statut de l'API et la configuration de la clé."""
    api_key_set = opendota.api_key is not None
    try:
        heroes = await opendota.get_heroes()
        return {
            "status": "healthy",
            "api_key_configured": api_key_set,
            "opendota_api_connection": "success",
            "total_heroes": len(heroes)
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "api_key_configured": api_key_set,
            "opendota_api_connection": "failed",
            "error": str(e)
        }

@app.get("/api/player/{account_id}")
async def get_player(account_id: str):
    """Récupère les détails d'un joueur, ses derniers matchs, et prédit son risque de Churn."""
    try:
        player_info = await opendota.get_player_info(account_id)
        recent_matches = await opendota.get_player_recent_matches(account_id)
        
        prediction = None
        model_path = "data/dota2_churn_model.pkl"
        if os.path.exists(model_path):
            try:
                prediction_res = await predict_player_churn(account_id)
                prediction = {
                    "churn_probability": prediction_res.get("churn_probability"),
                    "risk_level": prediction_res.get("risk_level"),
                    "features": prediction_res.get("features")
                }
            except Exception as pe:
                print(f"Churn prediction failed: {pe}")
                
        return {
            "profile": player_info.get("profile"),
            "mmr_estimate": player_info.get("mmr_estimate"),
            "rank_tier": player_info.get("rank_tier"),
            "recent_matches": recent_matches,
            "prediction": prediction
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch player data: {str(e)}")

@app.get("/api/player/{account_id}/matches")
async def get_player_matches(account_id: str, limit: int = 50):
    """Récupère l'historique complet (limité) des matchs d'un joueur."""
    try:
        matches = await opendota.get_player_matches(account_id, limit=limit)
        return matches
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch player matches: {str(e)}")

@app.get("/api/heroes")
async def get_heroes():
    """Récupère la liste de tous les héros."""
    try:
        heroes = await opendota.get_heroes()
        return heroes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch heroes: {str(e)}")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    uvicorn.run(
        "main:app", 
        host=host, 
        port=port, 
        reload=True,
        reload_excludes=[
            "venv/*",
            "data/*",
            "models/*",
            "**/venv/*",
            "**/data/*",
            "**/models/*",
            "*.csv",
            "*.json",
            "*.pkl"
        ]
    )

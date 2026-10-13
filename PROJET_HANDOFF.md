# Document de Passation : Dota 2 Churn Prediction (V3.0 "Final")

Ce document sert de "Mémoire Centrale" pour reprendre le projet dans une nouvelle conversation avec une IA. Il contient tout l'historique récent, l'architecture des dossiers, les décisions prises, et l'objectif final du projet.

---

## 📍 Chemin du Projet sur l'ordinateur
**Chemin absolu :** `/Users/matthieugout/Desktop/Master - DATA/Machine Learning/Dota 2 Final`

> **Note :** Ce dossier est un "Fork" propre (une nouvelle version isolée) de l'ancien projet. L'ancien projet ("Project perso Dota 2 churn") existe toujours en guise d'archive. Le dossier `Dota 2 Final` contient la version définitive et nettoyée.

---

## 🏗 Architecture du Projet & Rôle des Fichiers

### 1. Le Backend (Python / FastAPI)
**Chemin :** `/Users/matthieugout/Desktop/Master - DATA/Machine Learning/Dota 2 Final/backend/`

C'est le moteur de l'application. Il gère la collecte de données, le traitement des features (Feature Engineering) et l'entraînement du Machine Learning.
- `main.py` : L'API locale (FastAPI) qui tourne sur le port `8000`. Elle fait le pont entre le script Python et le site web (Frontend).
- `opendota_client.py` : Le client HTTP qui communique avec l'API publique OpenDota. **Décision clé :** Gère la limitation du plan gratuit (3000 appels/jour, 60/min). Il utilise impérativement le paramètre `project` pour récupérer les stats enrichies (GPM, dégâts) + `start_time` et `leaver_status`.
- `collect_data.py` : Le cerveau de la Data. Récupère des parties publiques, isole les nouveaux joueurs, scrute leurs 100 dernières parties, et fabrique nos +29 "Features" personnalisées.
  - **Features Psychologiques :** `tilt_index` (Rage quitte ? Séries de défaite ?), `night_owl_pct` (Joueur nocturne ?), `objective_focus` (Dégâts tours vs héros).
  - **La cible (Target 'y') :** `is_churn` = 1 si le joueur a fait une pause > 14 jours.
- `train.py` : Le script de Machine Learning. Il gère le déséquilibre (SMOTE), teste 3 algorithmes (Random Forest, HistGB, Régression Logistique) via GridSearch, et sauvegarde le modèle gagnant.
- `run_rescue.py` (Script de sauvetage) : Script temporaire (actuellement en cours d'exécution) chargé de réparer 1 400 joueurs dont les dates avaient été corrompues lors de la transition.
- `data/` : Dossier contenant la base de données brute (`dota2_players_dataset.csv`), le statut de l'API (`collection_status.json`) et le modèle IA sauvegardé (`dota2_churn_model.pkl`).

### 2. Le Frontend (React / Vite)
**Chemin :** `/Users/matthieugout/Desktop/Master - DATA/Machine Learning/Dota 2 Final/frontend/`

C'est l'interface de contrôle et de visualisation, tournant sur le port `5180`.
- `src/App.jsx` : Contient toute la logique métier du site (Dashboard unique). 
  - **Onglets :** Données & Budget, Analyses (graphes dynamiques), Machine Learning, et Historique.
  - **Nettoyage :** L'historique local (`localStorage`) a été remis à zéro et renommé `dota2_final_export_history`. Les fausses données "mockées" des anciens modèles (V0.1, V0.2) ont été supprimées du code source.
- `src/index.css` & `src/App.css` : Design moderne (Glassmorphism, thèmes sombres et néons émeraudes/cyans).

---

## ⏱ État actuel (En cours d'exécution)

Au moment de la passation, une opération critique est en cours de traitement en tâche de fond : **La récupération de 1 400 joueurs propres.**
- L'API OpenDota (Gratuite) limite à 3 000 requêtes/jour.
- Le script `run_rescue.py` utilise 2 requêtes par joueur (Info + Matches), soit **2 800 appels API**. 
- Il va générer un `dota2_players_dataset.csv` de 1 400 lignes absolument parfaites (dates, statuts de leave, dégâts, GPM). Il se terminera vers 16h50/17h00.

---

## 🎯 Objectif final (Vision Long Terme)

L'objectif de demain n'est plus seulement de regarder le passé, mais d'**anticiper l'avenir direct du Matchmaking**.

> **"Faire un algorithme qui prédit le churn en fonction du prochain match que le joueur va jouer."**

**Le scénario cible :**
1. Une fois les 10 joueurs d'un match trouvés par le Matchmaking (mais la partie n'est pas encore finie/commencée).
2. L'IA analyse le "Tilt Index" du joueur X, sa série de défaites, et le déséquilibre MMR de la partie qui va se lancer.
3. L'IA prédit *en temps réel* : "Si ce joueur joue cette partie et la perd, il a 85% de chances de Churn (arrêter le jeu pendant 14j)."
4. L'idée est d'agir *avant* : adapter le matchmaking pour préserver les joueurs au bord de la rupture psychologique.

### Prochaines étapes pour la nouvelle IA :
1. **Entraîner le modèle actuel :** Lancer `python train.py` (ou via l'UI) sur le nouveau dataset de 1 400 joueurs fraîchement réparé.
2. **Analyser l'existant :** Regarder dans le Frontend l'onglet "Analyses & Hypothèses" pour valider si le Tilt Index et le GPM ressortent effectivement comme de bons prédicteurs de Churn.
3. **Pivoter vers la prédiction temps-réel (Matchmaking) :** Concevoir l'architecture pour requêter l'API de Live Matches d'OpenDota, et passer les stats instantanées des 10 joueurs au modèle ML.

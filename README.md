# Dota 2 Churn Prediction (Projet Final)

## Objectif du projet
Ce projet vise à prédire si un joueur de Dota 2 va arrêter de jouer ("churn") après un écart de 14 jours, en se basant sur ses 100 dernières parties. Le but ultime est, à terme, d'utiliser cet algorithme de prédiction avant un match pour influencer le matchmaking et éviter que le joueur ne quitte le jeu (en lui proposant une partie plus équilibrée s'il est sur le point de craquer).

## Architecture
- **Frontend** : React (Vite) sur `http://localhost:5180/`
- **Backend** : FastAPI sur `http://127.0.0.1:8000/`
- **Collecte de données** : Script `collect_data.py` exécuté en tâche de fond tous les jours à 8h50.
- **Machine Learning** : Modèle de Régression Logistique (actuellement le plus performant) entraîné via `train.py`.

## Historique et État Actuel
- **Fork (26 Juillet 2026)** : Le projet a été forké depuis `projet-perso-dota2-churn` pour créer une base de données propre (`Dota 2 Final`). L'ancienne base de données contenant des statistiques de performance vides (GPM, dégâts) a été abandonnée.
- **Data Engineering** : Le script de collecte interroge l'API OpenDota avec les paramètres `project` pour récupérer des statistiques riches. Des "Features" psychologiques ont été créées :
  - `tilt_index` : Score combinant abandons, parties courtes, morts intenses et séries de défaites.
  - `objective_focus` : Ratio dégâts bâtiments / dégâts héros.
  - `night_owl_pct` : Proportion de parties jouées la nuit.
  - `role_consistency` : Fidélité au même rôle.
  - `gpm_trend`, `damage_trend` : Évolution de l'économie sur les 10 derniers matchs.

La base de données est actuellement en cours de remplissage quotidien et le modèle ML sera ré-entraîné lorsque le volume sera suffisant.

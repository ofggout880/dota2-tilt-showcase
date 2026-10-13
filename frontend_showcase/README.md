# 🎮 Dota 2 Churn & Tilt Prediction — Public Showcase

[![React 19](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Vite 8](https://img.shields.io/badge/Vite-8.0-646cff?style=flat-square&logo=vite)](https://vite.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![XGBoost](https://img.shields.io/badge/ML-XGBoost%20v6%20%2B%20SMOTE-ff7a00?style=flat-square)](https://xgboost.readthedocs.io/)
[![Zero Secrets](https://img.shields.io/badge/Security-0%20Secrets%20%7C%20Sanitized-10b981?style=flat-square)](https://github.com)
[![Offline Fallback](https://img.shields.io/badge/Mode-100%25%20Offline%20Ready-38bdf8?style=flat-square)](https://github.com)
[![Bilingual](https://img.shields.io/badge/Language-Bilingual%20FR%20%2F%20EN-e2e8f0?style=flat-square)](https://github.com)

An industry-grade **Machine Learning & Data Science showcase application** analyzing competitive player retention, mental fatigue (*tilt*), and 14-day inactivity churn in **Dota 2**.

Designed both as an **interactive portfolio showcase** and an **engineering blueprint for competitive gaming studios**, this application demonstrates end-to-end data science: from asynchronous match telemetry extraction to behavioral feature engineering, ensemble classification, real-time API serving, and dynamic matchmaking policy design.

---

## 📑 Table of Contents / Sommaire

1. [English Documentation 🇬🇧](#-english-documentation-)
   - [Project Highlights & Key Performance](#project-highlights--key-performance)
   - [Quickstart (2 Commands)](#quickstart-2-commands)
   - [Dual Execution Modes](#dual-execution-modes)
   - [System Architecture & Tech Stack](#system-architecture--tech-stack)
   - [Security & Public GitHub Guarantees](#security--public-github-guarantees)
   - [Interactive Player Archetypes & Simulator](#interactive-player-archetypes--simulator)
   - [Matchmaking Ethics & Anti-EOMM Commitment](#matchmaking-ethics--anti-eomm-commitment)
2. [Documentation en Français 🇫🇷](#-documentation-en-français-)
   - [Présentation & Métriques Clés](#présentation--métriques-clés)
   - [Démarrage Rapide (2 Commandes)](#démarrage-rapide-2-commandes)
   - [Modes d'Exécution Doubles](#modes-dexécution-doubles)
   - [Architecture Technique](#architecture-technique)
   - [Sécurité & Confidentialité GitHub Public](#sécurité--confidentialité-github-public)
   - [Simulateur Interactif & Archétypes](#simulateur-interactif--archétypes)
   - [Éthique du Matchmaking & Engagement Anti-EOMM](#éthique-du-matchmaking--engagement-anti-eomm)
3. [NPM Scripts Reference](#-npm-scripts-reference)
4. [Legal & Trademarks](#-legal--trademarks)

---

# 🇬🇧 English Documentation

## Project Highlights & Key Performance

Player churn in competitive gaming is heavily correlated with cumulative negative emotional states (**tilt**, loss streaks, toxic interactions, role fatigue). Rather than predicting churn too late with basic vanity metrics, our model processes a **100-match rolling behavioral window** per player to detect pre-churn distress signals.

| Metric | Value | Production Significance |
| :--- | :--- | :--- |
| **Analyzed Cohort** | **16,981 Players** | High-volume empirical dataset with strictly leak-free temporal split |
| **Observation Window** | **100 Matches** | Rolling temporal analysis capturing player fatigue and economic trends |
| **Engineered Features** | **45 Behavioral Variables** | In-depth indicators (`tilt_index`, `night_owl_pct`, `role_consistency`, etc.) |
| **Optimal Churn Recall** | **85.0%** | Calibrated on decision cutoff $\theta^* = 0.36$ to prevent missed churn risks |
| **ROC-AUC Score** | **80.0%** | Discrimination power across broad player archetypes |
| **PR-AUC Score** | **79.3%** | Precision-Recall trade-off resilient to 23.4% baseline class imbalance |

---

## Quickstart (2 Commands)

Launch the interactive showcase in under 10 seconds:

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open your browser at **`http://localhost:5173`** (or `http://127.0.0.1:5173`).

> 💡 **Zero Setup Required**: The application runs immediately in **Standalone Showcase Mode** with zero external dependencies, no database setup, and no Python requirement.

---

## Dual Execution Modes

The showcase features an intelligent, resilient network layer that seamlessly adapts to the execution environment:

```
                      ┌──────────────────────────────────────┐
                      │    Showcase App Launched (5173)      │
                      └──────────────────┬───────────────────┘
                                         │
                         GET /api/status (Timeout: 1500ms)
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
            [Backend Responding]                     [Backend Unreachable]
                    │                                         │
          MODE 2: Full-Stack Mode                   MODE 1: Standalone Showcase
      🟢 Badge: "API Connectée / Online"        🟠 Badge: "Mode Démo / Demo Mode"
      • Live FastAPI inference                  • 100% Offline fallback
      • Dynamic OpenDota extraction             • 4 Calibrated player archetypes
      • Real-time feature calculation           • Deterministic player synthesizer
```

### Mode 1: Standalone Showcase (Zero Setup, 100% Offline Fallback)
- **Target Audience**: Recruiters, portfolio reviewers, GitHub visitors, offline presentations.
- **Prerequisites**: Node.js 18+ only.
- **Behavior**:
  - The client attempts a health ping to `/api/status` with a **1500ms abort controller timeout**.
  - When the backend is offline, the status indicator displays an amber **"Mode Démo / Demo Mode"** badge.
  - All benchmarks, ROC/PR curves, and confusion matrices load high-fidelity calibrated production results (`ml_results.json`).
  - The **Interactive Simulator** provides 4 pre-calibrated studio archetypes with complete SHAP-style factor attributions.
  - Any arbitrary 3-to-10-digit Steam Account ID entered is processed by an offline **deterministic synthesizer** (`synthesizePlayerProfile`), guaranteeing zero crashes and instant visual feedback.

### Mode 2: Full-Stack Mode (Local FastAPI Server & Live Telemetry)
- **Target Audience**: Data scientists and backend engineers testing live match inference.
- **Prerequisites**: Python 3.11+, virtualenv, local backend dependencies.
- **How to run**:
  1. In a separate terminal, start the Python FastAPI service:
     ```bash
     cd ../backend
     pip install -r requirements.txt
     python -m uvicorn main:app --host 127.0.0.1 --port 8001
     ```
  2. Verify backend status:
     ```bash
     curl http://127.0.0.1:8001/api/status
     # Output: {"status":"healthy","api_key_configured":true,...}
     ```
  3. Start the frontend showcase:
     ```bash
     cd ../frontend_showcase
     npm run dev
     ```
  4. The status indicator immediately switches to an emerald **"API Connectée / Online"** badge. The Vite development proxy forwards all `/api/*` requests directly to `http://127.0.0.1:8001`.
  5. Looking up a valid Steam Account ID triggers live OpenDota telemetry ingestion, real-time 45-feature extraction, and live XGBoost model evaluation.

---

## System Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                          SYSTEM ARCHITECTURE                           │
└────────────────────────────────────────────────────────────────────────┘

  [OpenDota Public API] ──(Async batch extraction / 1.05s rate limit)──┐
                                                                       │
  [Data Pipeline] ◄────────────────────────────────────────────────────┘
         │
         ├── 100-match rolling window per player
         ├── 45 engineered features (tilt, fatigue, economy, combat)
         └── Temporal cut-off (14-day inactivity label)
         │
  [Model Training]
         │
         ├── SMOTE rebalancing + Class weight tuning
         ├── Model confrontation: LogReg vs RF vs LightGBM vs XGBoost
         └── Threshold optimization: Decision boundary shifted to θ = 0.36
         │
  [FastAPI Microservice (Port 8001)]
         │
         ├── GET  /api/status               (Healthcheck & telemetry status)
         ├── GET  /api/ml/metrics           (Benchmark performance stats)
         ├── GET  /api/ml/visualizations    (Curves, matrix, feature rankings)
         └── GET  /api/predict/{account_id} (Live profile inference & factors)
         │
  [Vite Dev Proxy (Port 5173)] ◄──── Local forward: /api/* ──► :8001
         │
  [React 19 Frontend Showcase (Port 5173)]
         │
         ├── Obsidian / Braise Dark UI design system (Pure CSS tokens)
         ├── Pure SVG interactive graphics (ROC, PR, Gauge, Heatmap)
         ├── 100% Bilingual dictionary (FR/EN) with instant toggle
         └── Resilient offline fallback layer (zero-crash guarantee)
```

### Technology Highlights
- **Frontend Framework**: **React 19** (Functional components, hooks, error boundaries).
- **Build Tool**: **Vite 8** (Sub-150ms builds, ultra-fast Hot Module Replacement).
- **Styling**: **Pure CSS3 with custom properties** (`src/index.css`). No bulky component libraries (zero Tailwind, zero Bootstrap, zero MUI bloat).
- **Data Visualizations**: **100% Pure SVG & Math** (mathematically calculated SVG paths for ROC & PR curves, confusion matrices, and semicircular gauges with zero external chart dependencies).
- **Internationalization (i18n)**: Dedicated bidirectional translation store (`src/translations.js`) with 100% key parity between English and French.

---

## Security & Public GitHub Guarantees

This repository is strictly configured and audited for public distribution:

1. **ZERO API Keys Required for Frontend**:
   - The showcase requires no private keys, client tokens, or third-party credentials.
   - Live telemetry ingestion is handled server-side through OpenDota's public endpoints.
2. **ZERO Hardcoded Machine Paths**:
   - No absolute paths (`/Users/...`, `/home/...`, `C:\...`) are embedded in code or build outputs.
   - All assets and internal modules use strictly relative paths.
3. **ZERO Personal Identifiable Information (PII)**:
   - Data is restricted to publicly accessible 32-bit Steam Account IDs and anonymized match metrics.
   - No personal names, emails, IPs, or location telemetry are collected or stored.
4. **Environment Isolation**:
   - `.env.example` provides clean reference variables without exposing internal configuration.
   - `.gitignore` explicitly prevents accidental commits of `.env`, `.env.local`, and build artifacts.

---

## Interactive Player Archetypes & Simulator

The showcase embeds 4 calibrated behavioral archetypes representing classic competitive personas:

1. **🔥 The Tilting Player / Le Joueur en Tilt Aigu**
   - **Churn Probability**: `86.5%` (Critical Risk)
   - **Signature**: High `tilt_index` (4.8), active 5-loss streak, recent abandons, negative economic momentum.
   - **Studio Action**: Immediate match cooldown recommendation; high-composure teammate pairing.
2. **⏳ The Burned-out Veteran / Le Vétéran en Burnout**
   - **Churn Probability**: `57.7%` (Moderate Risk)
   - **Signature**: Decreased session frequency, late-night play (`night_owl_pct` = 48%), lower win rate momentum.
   - **Studio Action**: Casual / Arcade game mode nudge; restorative non-ranked queue incentives.
3. **🛡️ The Consistent Support / Le Support Régulier**
   - **Churn Probability**: `21.8%` (Low Risk)
   - **Signature**: High role consistency (82%), steady objective focus, low tilt, positive team contribution.
   - **Studio Action**: Standard matchmaking queue; priority team comms weighting.
4. **⚖️ The Balanced Player / Le Joueur Sain**
   - **Churn Probability**: `19.6%` (Low Risk)
   - **Signature**: Frequent party play (65%), balanced day sessions, stable KDA and win rate (>54%).
   - **Studio Action**: Natural social retention; benchmark control profile.

---

## Matchmaking Ethics & Anti-EOMM Commitment

Unlike predatory retention mechanics (such as EA's *Engagement-Optimized Matchmaking* / EOMM) that manipulate match outcomes to create artificial addiction loops, this research adheres to **Valve's 50/50 sportsmanship principle**:

- **Strict Fairness Guarantee**: Matchmaking never rigs match outcomes or feeds artificial bot matches to manipulate players.
- **Non-Punitive Interventions**: Detected churn risk triggers protective interventions (pairing tilted players with calm, high-composure teammates; encouraging breaks; offering restorative casual game modes).
- **Transparency**: Clear factor attribution highlights *why* a player is considered at risk.

---

# 🇫🇷 Documentation en Français

## Présentation & Métriques Clés

Le départ d'un joueur (*churn*) dans les jeux compétitifs est étroitement lié à l'accumulation d'états émotionnels négatifs (**tilt**, séries de défaites, parties toxiques, fatigue de rôle). Plutôt que de constater le churn a posteriori, notre modèle analyse une **fenêtre glissante de 100 parties** pour identifier les signaux précurseurs de décrochage.

| Indicateur | Valeur | Rôle dans l'Étude |
| :--- | :--- | :--- |
| **Cohorte Analysée** | **16 981 Joueurs** | Dataset empirique à grande échelle avec découpage temporel sans fuite |
| **Fenêtre d'Observation** | **100 Matchs** | Analyse glissante capturant la fatigue et l'évolution économique |
| **Variables Comportementales** | **45 Features** | Indices avancés (`tilt_index`, `night_owl_pct`, `role_consistency`, etc.) |
| **Rappel Churn Optimal** | **85.0%** | Seuil de décision calibré à $\theta^* = 0.36$ pour minimiser les faux négatifs |
| **Score ROC-AUC** | **80.0%** | Forte capacité de discrimination sur l'ensemble des profils |
| **Score PR-AUC** | **79.3%** | Précision-Rappel robuste face au déséquilibre de classe (23,4% churners) |

---

## Démarrage Rapide (2 Commandes)

Lancez l'application showcase en moins de 10 secondes :

```bash
# 1. Installation des dépendances
npm install

# 2. Lancement du serveur de développement
npm run dev
```

Rendez-vous sur **`http://localhost:5173`** dans votre navigateur.

> 💡 **Zéro Configuration Requise** : L'application démarre immédiatement en **Mode Démo Autonome** sans backend Python, sans base de données et sans clé d'API.

---

## Modes d'Exécution Doubles

### Mode 1 : Vitrine Autonome (Zéro Configuration, Fallback Hors-Ligne 100%)
- **Public visé** : Recruteurs, relecteurs techniques, visiteurs GitHub, démonstrations hors-ligne.
- **Prérequis** : Node.js 18+ uniquement.
- **Fonctionnement** :
  - Le frontend effectue un test de santé sur `/api/status` avec un délai d'expiration rapide de **1500 ms**.
  - Si le serveur est éteint, un badge ambre **"Mode Démo / Demo Mode"** s'affiche dans la barre de navigation.
  - L'application charge des métriques et courbes calibrées issues des résultats réels de production (`ml_results.json`).
  - Le simulateur propose 4 archétypes types avec décomposition des facteurs d'influence (SHAP).
  - La saisie de n'importe quel Account ID Steam (3 à 10 chiffres) génère un profil déterministe (`synthesizePlayerProfile`), éliminant tout risque de plantage.

### Mode 2 : Mode Full-Stack (Microservice FastAPI & Télémétrie en Direct)
- **Public visé** : Data scientists et ingénieurs ML testant l'inférence en direct.
- **Prérequis** : Python 3.11+, environnement virtuel, dépendances backend.
- **Procédure** :
  1. Lancez le serveur FastAPI sur le port 8001 :
     ```bash
     cd ../backend
     pip install -r requirements.txt
     python -m uvicorn main:app --host 127.0.0.1 --port 8001
     ```
  2. Lancez le frontend showcase :
     ```bash
     cd ../frontend_showcase
     npm run dev
     ```
  3. Le badge passe instantanément au vert émeraude **"API Connectée / Online"**. Le proxy Vite redirige automatiquement les appels `/api/*` vers `http://127.0.0.1:8001`.
  4. L'interrogation d'un compte Steam extrait en temps réel l'historique OpenDota, calcule les 45 features et exécute l'inférence XGBoost en direct.

---

## Architecture Technique

- **Frontend** : React 19, Vite 8, Tokens CSS personnalisés (thème Dark Obsidian `#0a0b0e` & Orange braise `#ff7a00`), graphiques 100% SVG natifs.
- **Backend** : FastAPI, Python 3.11, Pandas, Scikit-learn, XGBoost v6, client asynchrone OpenDota.
- **Pipeline de Données** :
  1. Ingestion asynchrone OpenDota (contrôle de débit à 1.05s/req).
  2. Calcul des 45 features comportementales sur 100 matchs.
  3. Rééquilibrage SMOTE & classification XGBoost v6.
  4. Calibration du seuil de décision à 0.36 pour 85% de rappel.
  5. Exposition via microservice FastAPI et rendu React haute fidélité.

---

## Sécurité & Confidentialité GitHub Public

- **Zéro clé d'API requise** côté frontend showcase.
- **Zéro chemin local de machine** (`/Users/...`) présent dans le code source ou les livrables.
- **Zéro donnée personnelle sensible (PII)** : identifiants Steam 32-bit publics et télémétrie agrégée uniquement.
- **Fichiers de configuration sains** : `.env.example` documenté et `.gitignore` protégeant tout secret local.

---

## Simulateur Interactif & Archétypes

1. **Le Joueur en Tilt Aigu** : Risque 86.5% — Tilt index élevé (4.8), série de 5 défaites, abandons récents.
2. **Le Vétéran en Burnout** : Risque 57.7% — Sessions nocturnes tardives (48%), dynamique de victoire en baisse.
3. **Le Support Régulier** : Risque 21.8% — Cohérence de rôle élevée (82%), jeu axé sur les objectifs, zéro tilt.
4. **Le Joueur Sain** : Risque 19.6% — Pratique sociale forte (65% en groupe), KDA stable, dynamique positive.

---

## Éthique du Matchmaking & Engagement Anti-EOMM

Conformément à la philosophie sportive de Valve et aux principes d'équité :
- **Refus de l'EOMM** : Aucun trucage de partie ni recours à des matchs artificiels pour manipuler la rétention.
- **Équité 50/50** : L'espérance de victoire sportive reste strictement préservée.
- **Mesures Protectrices** : Détection du tilt pour encourager des pauses, associer le joueur à des coéquipiers calmes ou proposer des modes non-classés reposants.

---

# 🛠️ NPM Scripts Reference

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite development server at `http://localhost:5173` |
| `npm run build` | Builds optimized production bundle into `dist/` |
| `npm run preview` | Previews production build locally |
| `npm run test:i18n` | Runs dictionary stress tests (fallback, unicode, symmetry, 50k ops/sec) |
| `npm run test:overflow` | Validates zero horizontal layout overflow across 320px, 768px, 1280px, 2560px |
| `npm test` | Runs complete automated test suite (i18n + responsive container audits) |

---

# 👤 Author & Research Attribution

- **Researcher / Author** : **Matthieu Gout** • Personal Project 2026 / Projet personnel 2026
- **LinkedIn** : [linkedin.com/in/matthieu-gout](https://www.linkedin.com/in/matthieu-gout)
- **GitHub** : [github.com/ofggout880](https://github.com/ofggout880)

---

# ⚖️ Legal & Trademarks

- **Valve Corporation** : *Dota 2* is a registered trademark of Valve Corporation. This project is an independent academic research initiative and engineering portfolio showcase, with no commercial endorsement or affiliation with Valve.
- **OpenDota** : Match telemetry is collected via the public OpenDota API in compliance with its terms of service.

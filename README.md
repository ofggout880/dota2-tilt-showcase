<p align="center">
  <a href="https://github.com/ofggout880/dota2-tilt-showcase">
    <img src="./assets/logo.svg" width="110" height="110" alt="Dota 2 Churn & Tilt Telemetry Logo" />
  </a>
</p>

<h1 align="center">Dota 2 Churn & Tilt Prediction</h1>
<h3 align="center">Behavioral Telemetry & Machine Learning Showcase</h3>

<p align="center">
  <em>Predicting 14-day competitive abandonment and tilt breakdown across 16,981 players using rolling behavioral telemetry, SMOTE-balanced gradient boosted trees, and ethical matchmaking policy design.</em>
</p>

<p align="center">
  <a href="https://www.linkedin.com/in/matthieu-gout">
    <img src="https://img.shields.io/badge/LinkedIn-Matthieu_Gout-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Profile" />
  </a>
  <a href="https://github.com/ofggout880">
    <img src="https://img.shields.io/badge/GitHub-ofggout880-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Profile" />
  </a>
  <a href="#-showcase-interactive-tutorial-10-seconds">
    <img src="https://img.shields.io/badge/Frontend-Interactive_Showcase-FF7A00?style=for-the-badge&logo=react&logoColor=white" alt="Interactive Showcase" />
  </a>
  <a href="https://fastapi.tiangolo.com/">
    <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  </a>
  <a href="https://xgboost.readthedocs.io/">
    <img src="https://img.shields.io/badge/Model-XGBoost_v6_%2B_SMOTE-FF5500?style=for-the-badge&logo=scikitlearn&logoColor=white" alt="XGBoost + SMOTE" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Language-English_%2F_Français_Toggle-10B981?style=flat-square" alt="Bilingual FR/EN" />
  <img src="https://img.shields.io/badge/Security-0_API_Keys_%7C_100%25_Sanitized-10B981?style=flat-square" alt="Zero Secrets" />
  <img src="https://img.shields.io/badge/Execution-Dual_Mode_(Live_%2B_Offline_Fallback)-38BDF8?style=flat-square" alt="Dual Execution" />
  <img src="https://img.shields.io/badge/Recall_on_Churn-85.0%25_(θ*_%3D_0.36)-E11D48?style=flat-square" alt="85% Recall" />
  <img src="https://img.shields.io/badge/ROC--AUC-0.801-F59E0B?style=flat-square" alt="0.801 ROC-AUC" />
</p>

---

## 📑 Table of Contents

1. [Executive Summary & Core Metrics](#-executive-summary--core-metrics)
2. [Showcase Interactive Tutorial (10 Seconds)](#-showcase-interactive-tutorial-10-seconds)
   - [Launch Commands](#1-launch-commands)
   - [Tour of the 6 Interactive Modules](#2-tour-of-the-6-interactive-modules)
   - [Simulating the 4 Behavioral Archetypes](#3-simulating-the-4-behavioral-archetypes)
   - [Interactive Threshold Tuning ($\theta^* = 0.36$)](#4-interactive-threshold-tuning-theta--036)
3. [Machine Learning Architecture & Rigor](#-machine-learning-architecture--rigor)
   - [Dataset & 14-Day Target Definition](#dataset--14-day-target-definition)
   - [The 45 Engineered Behavioral Features](#the-45-engineered-behavioral-features)
   - [Leakage-Free Cross-Validation & SMOTE Pipeline](#leakage-free-cross-validation--smote-pipeline)
   - [Permutation Feature Importance](#permutation-feature-importance)
4. [Ethical Matchmaking (Strict Anti-EOMM)](#-ethical-matchmaking-strict-anti-eomm)
5. [Monorepo Architecture](#-monorepo-architecture)
6. [Researcher & Author Attribution](#-researcher--author-attribution)

---

## 🎯 Executive Summary & Core Metrics

Player churn in competitive service games (**MOBAs**) is rarely an instantaneous, random decision. It is the cumulative psychological consequence of **unmitigated negative feedback loops**: repeated loss streaks, toxic interactions, severe stomps (< 25 min), nocturnal fatigue, and loss of competitive agency (*tilt*).

Rather than reacting once a player has already uninstalled, this research develops a **predictive telemetry pipeline** tracking rolling 100-match histories across **16,981 competitive players** to forecast 14-day inactivity churn **before the breaking point occurs**.

```
  16,981 Players           100-Match Rolling Window         45 Engineered Features
 ┌──────────────┐         ┌─────────────────────────┐     ┌────────────────────────┐
 │ OpenDota API │ ──────> │ Macro Trends + Match T  │ ──> │ Tilt, Economy, Social, │
 └──────────────┘         └─────────────────────────┘     │ Fatigue & Role Signals │
                                                                     │
                                                                     ▼
  Intervention Policy        Optimal Decision Cutoff          Calibrated Model
 ┌──────────────────────┐    ┌─────────────────────┐      ┌────────────────────────┐
 │ Cooldown Suggestion  │ <─ │   θ* = 0.36         │ <─── │ HistGradientBoosting   │
 │ Tilt-Aware Pairing   │    │ 85.0% Churn Recall  │      │ + In-Fold SMOTE        │
 └──────────────────────┘    └─────────────────────┘      └────────────────────────┘
```

### Benchmark Summary

| Evaluation Dimension | Empirical Metric | Production Significance |
| :--- | :--- | :--- |
| **Analyzed Cohort** | **16,981 Competitive Players** | Large-scale empirical validation without toy datasets |
| **Test Partition** | **3,397 Players (20% Stratified)** | Held-out validation strictly isolated from training |
| **Recall on Churn** | **85.0%** ($1,434 / 1,687$) | Captures 85 out of 100 players heading toward departure |
| **ROC-AUC Score** | **0.8004 (~0.801)** | Robust ranking ability across all player tiers |
| **PR-AUC (Avg. Precision)** | **0.7931 (~0.793)** | Resilient against 49.6% baseline class distribution |
| **F1-Score (at $\theta^*$)** | **73.9%** ($F_1 = 0.7390$) | Harmonized balance between false alerts and missed churns |
| **Optimal Cutoff $\theta^*$** | **0.36** | Calibrated via out-of-fold cross-validation on train set |

---

## 🚀 Showcase Interactive Tutorial (10 Seconds)

To make this research universally accessible to game studios, recruiters, and data scientists, the project includes an **autonomous, bilingual showcase frontend** (`frontend_showcase/`) featuring dark obsidian & ember-orange styling, pure SVG data visualizations, and real-time inference.

### 1. Launch Commands

```bash
# 1. Navigate into the showcase directory
cd frontend_showcase

# 2. Install dependencies (React 19, Vite 8)
npm install

# 3. Launch the interactive development server
npm run dev
```

Open your browser at **`http://localhost:5173`** (or `http://127.0.0.1:5173`).

> 💡 **Zero Setup Required**: The showcase includes an intelligent network layer with **100% offline fallback**. If the Python FastAPI backend is not running, the application automatically switches to **High-Fidelity Demo Mode** with deterministic telemetry simulation.

---

### 2. Tour of the 6 Interactive Modules

When navigating through the showcase, you can explore:

1. **Sticky Navigation Bar with Dual Social Pill Buttons**:
   - Direct 1-click links to **Matthieu Gout's LinkedIn** and **GitHub Profile**.
   - Live backend health indicator (`🟢 API Online` / `🟠 Demo Mode`) with interactive latency diagnostic popover.
   - Real-time bilingual switch (**🇫🇷 Français / 🇬🇧 English**).

2. **Executive KPI Ribbon**:
   - Grand stat cards displaying 16,981 match histories, 100-game rolling windows, 45 features, 85% recall, and 0.801 ROC-AUC.

3. **Psychological & Tilt Behavioral Anatomy**:
   - Interactive breakdown of the 4 behavioral dimensions: *Tilt Dynamics, Fatigue & Circadian Rhythms, Economic Deprivation (GPM/XPM),* and the *Social Party Shield*.

4. **Machine Learning Benchmark & Dynamic Threshold Lab**:
   - Pure SVG **ROC Curve** and **Precision-Recall Curve** with an interactive threshold slider from $\theta = 0.05$ to $0.95$.
   - Live **2x2 Confusion Matrix** dynamically recalculating True Positives, False Positives, True Negatives, and False Negatives in real time as you drag the slider.

5. **Real-Time Churn & Tilt Simulator**:
   - Enter any Steam 32-bit Account ID to trigger live FastAPI feature extraction, or select one of the **4 Curated Archetypes** in 1 click.
   - Semicircular SVG **Risk Gauge** with animated needle, calibrated color zones, and threshold reference line $\theta^* = 0.36$.
   - 6 Key Telemetry Indicators: *Win Rate, Current Streak, Party %, Role Specialization, Tilt Index,* and *Session Duration*.

6. **Bilateral SHAP-like Factor Attribution (Tornado Chart)**:
   - Bilateral bar breakdown decomposing why the model reached its decision:
     - 🔴 **Aggravating Factors** (Loss streaks, nocturnal games, solo queue fatigue).
     - 🟢 **Protective Factors** (High party play %, consistent hero role, economic rebound).

---

### 3. Simulating the 4 Behavioral Archetypes

In the **Simulator Section**, test these 4 calibrated profiles with a single click:

| Archetype Preset | Churn Risk | Tilt Index | Party % | Key Telemetry Characteristics |
| :--- | :---: | :---: | :---: | :--- |
| 😡 **The Acute Tilter** | **86.5% (High)** | **4.8** | 12% | 5-game loss streak, recent abandons, short stomps (< 24 min). |
| 🌙 **The Burning-Out Veteran** | **57.7% (Moderate)** | 2.1 | 24% | 48% nocturnal play, severe GPM downtrend, declining session count. |
| 🛡️ **The Steady Support** | **21.8% (Low)** | 0.4 | 42% | 82% role consistency, objective-focused play, zero recent abandons. |
| 🤝 **The Balanced Social Player** | **19.6% (Low)** | 0.0 | **65%** | Plays predominantly with friends (social shielding), positive momentum. |

---

### 4. Interactive Threshold Tuning ($\theta^* = 0.36$)

Standard ML models default to $\theta = 0.50$, missing up to 40% of churners in competitive games. Our showcase lets you manipulate the decision boundary in real time:

- **At $\theta = 0.50$ (Default)** : Precision = 73.2%, Recall = 68.4% *(1 in 3 leaving players is missed)*.
- **At $\theta^* = 0.36$ (Calibrated)** : Precision = 65.4%, **Recall = 85.0%** *(Optimal for studios)*.
- **At $\theta = 0.20$ (Aggressive)** : Precision = 54.1%, Recall = 94.2% *(High false-alert rate)*.

---

## 🧠 Machine Learning Architecture & Rigor

### Dataset & 14-Day Target Definition
- **Data Source**: Public OpenDota match telemetry.
- **Sample**: $N = 16,981$ competitive players, each evaluated over an observation horizon of up to 100 matches prior to anchor match $T$.
- **Target $y$**: Binary label where $y = 1$ if the player played **0 matches during the 14 days** following match $T$.
- **Zero Temporal Leakage**: Features are computed strictly using data up to match $T$. No calendar dates or post-$T$ telemetry enter the model.

### The 45 Engineered Behavioral Features

```python
# Sample Feature Categories in backend/train.py:
1. Tilt & Frustration   : tilt_index, current_streak_at_cutoff, is_on_loss_streak, loss_streak_length
2. Circadian Fatigue     : night_owl_pct, match_T_is_night, session_duration_per_game
3. Economic & Combat     : avg_xpm, avg_gpm, xpm_trend, gpm_trend, avg_hero_damage, avg_tower_damage
4. Social & Environment  : party_play_pct, match_T_party_size, role_consistency, ranked_play_pct
5. Psychological Friction: abandon_rate, recent_abandons, recent_deaths_per_min, avg_rank_imbalance
```

### Leakage-Free Cross-Validation & SMOTE Pipeline

To prevent data contamination, class balancing via **SMOTE** is strictly contained within each training fold using `imblearn.pipeline.Pipeline`:

```
Fold k: [Train Split (80%)] ──> StandardScaler ──> SMOTE(k_neighbors=5) ──> HistGradientBoosting
        [Validation Split (20%)] ──> Evaluated on RAW empirical samples only (Zero Synthetic Data)
```

Threshold calibration is performed out-of-fold via `cross_val_predict(..., method='predict_proba')` maximizing the $F_1$-score on the training split before any evaluation on the final test set.

### Permutation Feature Importance

Computed via 3-repeat permutation on the test set:

```
avg_xpm                     ██████████████████████████████ 31.5% (Economic progression & game impact)
session_duration_per_game   ████████████ 12.6% (Prolonged fatiguing sessions)
party_play_pct              █████████ 9.6% (Social shielding: playing in stack protects retention)
role_consistency            ███████ 7.1% (Specialization vs fill-frustration)
ranked_play_pct             ██████ 5.8% (Competitive engagement pressure)
match_T_is_ranked           █████ 5.3% (Context of the pivotal game)
rank_tier                   ████ 4.8% (Skill bracket vulnerability)
avg_hero_damage             ████ 3.8% (Active combat participation)
avg_tower_damage            ███ 2.8% (Objective completion focus)
abandon_rate                ██ 2.3% (Ragequit disposition)
```

---

## ⚖️ Ethical Matchmaking (Strict Anti-EOMM)

In competitive gaming, Engagement-Optimized Matchmaking (**EOMM**) patents often manipulate match outcomes (rigged teams, forced coin-flips) to trigger dopamine cycles.

**This project explicitly rejects predatory matchmaking manipulation.**

- **Strict 50/50 Competitive Fairness**: Win probability expectation remains determined solely by skill and MMR.
- **Compassionate Interventions**: When high tilt ($> 0.36$) is detected, the suggested policy:
  1. Prompts a respectful recommendation for a rest cooldown.
  2. Avoids clustering multiple tilted players into the same team.
  3. Suggests low-stakes recreational game modes (Ability Draft, Turbo, Co-op).

---

## 📁 Monorepo Architecture

```
dota2-tilt-showcase/
├── assets/
│   └── logo.svg                     # High-res vector emblem
├── frontend_showcase/               # 🌟 Public Showcase App (Vite + React 19)
│   ├── src/
│   │   ├── components/              # Navbar, Hero, Benchmark, Simulator, Gauge, Footer
│   │   ├── data/mockData.js         # Calibrated empirical fallbacks (N = 3,397 test set)
│   │   ├── translations.js          # Bilingual FR/EN reactive dictionary (76+ tests)
│   │   └── index.css                # Dark Obsidian (#0d0e12) & Ember Orange design tokens
│   ├── tests/                       # Automated i18n stress & responsive overflow audits
│   └── package.json
├── backend/                         # FastAPI Inference & ML Engine
│   ├── train.py                     # 45-feature pipeline, SMOTE, HistGradientBoosting
│   ├── main.py                      # Asynchronous FastAPI endpoints (/api/predict, /api/ml)
│   └── data/
│       ├── ml_results.json          # Ground-truth benchmark metrics & weights
│       └── features_list.json       # 45-feature schema definition
├── frontend/                        # Internal Data Engineering & Monitoring Dashboard
├── .gitignore                       # Zero secrets, zero datasets, zero node_modules
└── README.md                        # Master documentation
```

---

## 👤 Researcher & Author Attribution

<table align="center" style="border: 1px solid #26282f; background: #0d0e12; border-radius: 12px; padding: 16px;">
  <tr>
    <td align="center" width="120">
      <img src="./assets/logo.svg" width="80" height="80" alt="Matthieu Gout" />
    </td>
    <td>
      <h3 style="margin: 0; color: #ffffff;">Matthieu Gout</h3>
      <p style="margin: 4px 0 12px; color: #ff7a00; font-weight: 600;">Personal Project 2026 • Machine Learning & Data Science</p>
      <p style="margin: 0; color: #9ca3af; font-size: 14px;">
        Focused on competitive gaming analytics, telemetry feature engineering, and ethical predictive systems.
      </p>
      <br/>
      <a href="https://www.linkedin.com/in/matthieu-gout">
        <img src="https://img.shields.io/badge/Connect_on_LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
      </a>
      &nbsp;
      <a href="https://github.com/ofggout880">
        <img src="https://img.shields.io/badge/Follow_on_GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
      </a>
    </td>
  </tr>
</table>

---

## ⚖️ Legal & Trademarks

- **Valve Corporation**: *Dota 2* is a registered trademark of Valve Corporation. This project is an independent academic research and portfolio showcase with no commercial affiliation or endorsement from Valve.
- **OpenDota**: Match telemetry is acquired via the public OpenDota API in compliance with its terms of service.
- **Data Protection**: Zero player personal data (PII) is stored; only public 32-bit Steam Account IDs and aggregated in-game match statistics are utilized.

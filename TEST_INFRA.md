# TEST_INFRA: Dota 2 Churn & Tilt Prediction — Public Showcase Frontend

**Project:** Dota 2 Churn & Tilt Prediction — Public Showcase Frontend (`frontend_showcase`)  
**Target Root:** `/Users/matthieugout/Desktop/Master - DATA/Machine Learning/Dota 2 Final`  
**Test Suite Directory:** `Dota 2 Final/tests_showcase/`  
**Test Architecture:** 4-Tier Opaque-Box E2E Testing Framework  
**Author:** Automated E2E Test Writer (`teamwork_preview_test_writer`)  
**Date:** 2026-10-12  

---

## 1. Testing Philosophy & Guiding Principles

The testing framework for the Dota 2 Showcase Frontend adheres to the **Dual Track: Opaque-Box E2E Verification** paradigm. It evaluates the application strictly from the external perspective of end users, data scientists, and public GitHub visitors without coupling to internal component private implementation details.

### Core Principles

1. **Authoritative Expected Output Derivation:**
   Every test assertion is anchored in an immutable ground-truth oracle:
   - Live backend endpoints (`/api/status`, `/api/ml/metrics`, `/api/ml/visualizations`, `/api/predict/{account_id}`) served on port 8001 / 8000.
   - Verified ML artifacts (`ml_results.json`, `features_list.json`).
   - Mined mathematical formulas (`tilt_index`, `objective_focus`, Bayes' prevalence corrections).
   - Documented requirements from `ORIGINAL_REQUEST.md` (§R1 through §R6) and `PROJECT.md`.

2. **Progressive Testability & Contract Independence:**
   Tests verify behavioral contracts, interface signatures, and mathematical properties at each milestone. As filesystem components are scaffolded and assembled, tests dynamically validate the concrete files, build bundles, and UI attributes.

3. **Adversarial Edge-Case Hardening:**
   Extreme boundary conditions—such as 0 deaths in KDA calculations, probability clamping at [0.0%, 100.0%], 320px mobile viewport constraints, negative loss streaks, SQL/XSS injections, network disconnects, and rapid language toggles—are systematically exercised.

4. **Zero-Flakiness & High Performance:**
   The entire test suite executes in under 2 seconds, with zero external network dependencies (falling back to mocked server responses when needed), deterministic assertion logic, and clean exit codes.

---

## 2. Feature Inventory (11 Core Features)

| Feature ID | Feature Name | Specification Scope | Primary Milestone | Authoritative Source |
|:-----------|:-------------|:-------------------|:-----------------:|:---------------------|
| **F1** | Project Scaffolding & Build Infrastructure | Vite + React 19 structure, dev/build scripts, clean directory layout, index.html fonts (`Outfit`, `Plus Jakarta Sans`) | M1 | `ORIGINAL_REQUEST.md:104-108`, `PROJECT.md:16` |
| **F2** | Dark UI Design System & Ember Tokens | Obsidian/Anthracite backgrounds (`#0a0b0e`, `#121316`, `#16171b`), braise orange accents (`#ff7a00`, `#f59e0b`), hairline borders (`#26282f`), pill badges (`9999px`) | M1 | `ORIGINAL_REQUEST.md:84-91`, `PROJECT.md:17` |
| **F3** | Bilingual Internationalization (i18n) | Complete FR/EN dictionary, 100% key parity, instant language switcher, persistent `localStorage('dota2_showcase_lang')`, safe fallback | M1 | `ORIGINAL_REQUEST.md:73-78`, `PROJECT.md:18` |
| **F4** | Hero Section & Value Proposition | 14-day churn economics, high-impact bilingual headlines, tilt dynamics overview, proactive matchmaking intervention CTA | M2 | `ORIGINAL_REQUEST.md:67-68`, `PROJECT.md:19` |
| **F5** | Grand Format Executive KPIs | Bold ember stats: 16,981 players, 100-match rolling window, 45 features, 85.0% recall, 80.0% ROC-AUC / 79.3% PR-AUC | M2 | `ORIGINAL_REQUEST.md:69`, `ml_results.json` |
| **F6** | Behavioral Feature Deep-Dive | Formula explainers: `tilt_index`, `night_owl_pct` (00h-06h), `objective_focus`, `role_consistency`, `gpm_trend`, `kda_trend` | M2 | `ORIGINAL_REQUEST.md:70-71`, `backend/main.py` |
| **F7** | ML Benchmark & Explainability | Comparative table (V6 SMOTE vs ScalePosWeight vs Baselines), SVG ROC & PR curves with 0.36 threshold, 2x2 confusion matrix (1434/253/760/950), feature importances | M2 | `ORIGINAL_REQUEST.md:71-72`, `ml_results.json` |
| **F8** | Interactive Simulator & 1-Click Archetypes | Live Steam ID lookup (`GET /api/predict/{account_id}`) + 4 calibrated presets (Tilting Player 88%, Burned-out Veteran 64%, Consistent Support 28%, Balanced Player 14%) | M3 | `ORIGINAL_REQUEST.md:79-83`, `PROJECT.md:23` |
| **F9** | Churn Risk Gauge & Factor Attribution | Semicircular 180° SVG gauge, 3 color-coded tiers (Low <36%, Moderate 36-60%, Critical >60%), decision cut-off marker at 36%, positive/negative driver breakdown | M3 | `ORIGINAL_REQUEST.md:82-83`, `PROJECT.md:24` |
| **F10** | Backend Integration & Offline Fallback | Native API connector (`/api/status`, `/api/ml/metrics`, `/api/ml/visualizations`, `/api/predict`), auto-detecting offline demo fallback, architecture pipeline panel, 2-command start | M4 | `ORIGINAL_REQUEST.md:97-101`, `PROJECT.md:25` |
| **F11** | Public GitHub Sanitization & Final Hardening | Zero secrets/tokens, zero personal paths (`/Users/...`), zero PII, mobile/desktop responsiveness pass (320px to 4K), clean production build | M5 | `ORIGINAL_REQUEST.md:92-96`, `PROJECT.md:26` |

---

## 3. 4-Tier Test Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │       Tier 4: Real-World Scenarios           │
                    │   (6 End-to-End Multi-Step User Journeys)    │
                    └──────────────────────┬───────────────────────┘
                                           │
                    ┌──────────────────────▼───────────────────────┐
                    │   Tier 3: Cross-Feature Combinations         │
                    │  (11 Pairwise Interaction Tests Across Hubs) │
                    └──────────────────────┬───────────────────────┘
                                           │
                    ┌──────────────────────▼───────────────────────┐
                    │   Tier 2: Boundary & Corner Cases            │
                    │   (55+ Tests: Extremes, Injections, Resets)  │
                    └──────────────────────┬───────────────────────┘
                                           │
                    ┌──────────────────────▼───────────────────────┐
                    │   Tier 1: Feature Coverage (Core Paths)      │
                    │   (55+ Tests: 5 per Feature Across F1 - F11) │
                    └──────────────────────────────────────────────┘
```

### Tier 1: Feature Coverage (>= 55 tests, >= 5 per feature)
- Validates the happy path, primary contracts, data shapes, and expected visual outputs for each of the 11 features.
- Ensures all UI elements, translations, mathematical definitions, and API responses match project specifications.

### Tier 2: Boundary & Corner Cases (>= 55 tests, >= 5 per feature)
- Exercises extreme values: probability $0.0$ and $1.0$, needle transform limits $[-90^\circ, +90^\circ]$, zero deaths in KDA ratio `max(1, deaths)`, extreme win/loss streaks ($\pm 15$), zero nocturnal games.
- Tests input sanitization: non-numeric account IDs, empty strings, spaces, script injection strings.
- Tests network and failure modes: offline backend fallback, rate-limit simulation (HTTP 429), player with $<5$ matches (HTTP 400).
- Tests responsive constraints: ultra-narrow 320px viewport (zero overflow, touch targets $\ge 44$px) and ultra-wide 2560px 4K viewport (container clamping).

### Tier 3: Cross-Feature Combinations (>= 11 pairwise tests)
- Evaluates interplay between coupled subsystems:
  1. Language switching during live inference while preserving prediction state.
  2. Offline mode active with rapid archetype switching.
  3. Dark mode theme color tokens applied dynamically to Risk Gauge SVG arcs and needle.
  4. Factor attribution sorting with positive vs negative streak values.
  5. Architecture panel responsive reflow between desktop grid and mobile stack.
  6. KPI counter formatting switching between French (space) and English (comma).
  7. Simulator risk level synchronized with the Executive KPI recall/threshold standards.
  8. Model benchmark threshold marker interacting with confusion matrix counts.
  9. Behavioral feature tabs updating formulas and titles synchronously across language toggles.
  10. Backend connection failure cascading seamlessly into representative archetype profile.
  11. Security sanitization pass combined with comprehensive translation dictionary scanning.

### Tier 4: Real-World Application Scenarios (>= 6 comprehensive workflows)
- **Scenario 1:** Complete Public Portfolio Visit (Hero ➔ KPIs ➔ Psychology ➔ ML Benchmark ➔ Architecture ➔ Footer).
- **Scenario 2:** Consecutive 4-Archetype Psychological Stress-Test (Tilting ➔ Burnout ➔ Support ➔ Balanced).
- **Scenario 3:** Live Player Account ID Lookup with Fallback (`144915671` live query ➔ simulated offline fallback).
- **Scenario 4:** Full Bilingual Parity & Feature Explainer Tour in FR and EN (100% term fidelity and formula verification).
- **Scenario 5:** Edge-to-Edge Responsive Device Adaptability (320px Mobile ➔ 768px Tablet ➔ 1440px Desktop ➔ 2560px 4K).
- **Scenario 6:** Zero-Knowledge Public GitHub Clone Experience (Offline demo mode, 2-command start, 0 private credentials).

---

## 4. Test Scenarios & Traceability Matrix

| Test ID | Tier | Target Feature / Flow | Expected Behavioral Output | Authoritative Reference |
|:--------|:----:|:---------------------|:---------------------------|:------------------------|
| `test_t1_f1_*` | 1 | F1: Project Scaffolding | Valid `package.json`, Vite 8/React 19 deps, fonts in `index.html` | `ORIGINAL_REQUEST.md:104` |
| `test_t1_f2_*` | 1 | F2: Design System | `--bg-base`, `--bg-card`, `--accent-braise`, pill radius 9999px | `ORIGINAL_REQUEST.md:85-90` |
| `test_t1_f3_*` | 1 | F3: Bilingual i18n | 100% key parity FR/EN, persistent `localStorage`, fallback | `ORIGINAL_REQUEST.md:73-74` |
| `test_t1_f4_*` | 1 | F4: Hero Section | 14-day churn explanation, bilingual headlines, matchmaking CTA | `ORIGINAL_REQUEST.md:67-68` |
| `test_t1_f5_*` | 1 | F5: Executive KPIs | 16,981 players, 100-match window, 45 feats, 85% recall, 80% AUC | `ml_results.json:2-14` |
| `test_t1_f6_*` | 1 | F6: Behavioral Deep-Dive | `tilt_index` formula, `night_owl_pct`, `objective_focus` | `backend/main.py:685` |
| `test_t1_f7_*` | 1 | F7: ML Benchmark | V6 SMOTE vs Baselines, ROC/PR at 0.36, confusion matrix | `ml_results.json:8-125` |
| `test_t1_f8_*` | 1 | F8: Simulator & Archetypes | Live ID lookup + 4 presets (88%, 64%, 28%, 14%) | `spec_miner:178-308` |
| `test_t1_f9_*` | 1 | F9: Risk Gauge | 180° arc, 3 color tiers (Emerald, Amber, Braise), cut-off 0.36 | `ORIGINAL_REQUEST.md:82` |
| `test_t1_f10_*`| 1 | F10: Backend & Offline | API routes check, offline fallback mode, architecture panel | `ORIGINAL_REQUEST.md:97-100` |
| `test_t1_f11_*`| 1 | F11: Security & Hardening | Zero secrets, zero `/Users/...` paths, zero PII, clean build | `ORIGINAL_REQUEST.md:92-96` |
| `test_t2_*`    | 2 | Boundary & Corner Cases | 0 deaths KDA guard, 0.0 & 1.0 clamping, 320px/4K, 429/400 errors | `spec_miner:58-76` |
| `test_t3_*`    | 3 | Cross-Feature Pairs | Language toggle during inference, offline archetype presets | `PROJECT.md:37-47` |
| `test_t4_*`    | 4 | Real-World Workflows | 6 end-to-end studio & visitor multi-step workflows | `ORIGINAL_REQUEST.md:67-101` |

---

## 5. Coverage Thresholds & Quality Gates

To achieve `TEST_READY` certification:
1. **Total Minimum Test Count:** $\ge 127$ test cases (target: 132 tests).
2. **Pass Rate Threshold:** 100% pass rate (0 failures, 0 errors).
3. **Execution Time:** $< 5$ seconds total execution time for all 4 tiers.
4. **Translation Key Parity:** 100% identical keys between French and English dictionaries.
5. **Security Gate:** Zero matches for `api_key=`, `/Users/`, private tokens, or PII.
6. **Production Build Gate:** `npm run build` exits with code 0.

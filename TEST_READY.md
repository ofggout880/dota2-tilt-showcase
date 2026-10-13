# TEST_READY: Dota 2 Public Showcase Frontend E2E Test Suite

**Project:** Dota 2 Churn & Tilt Prediction — Public Showcase Frontend (`frontend_showcase`)  
**Workspace:** `/Users/matthieugout/Desktop/Master - DATA/Machine Learning/Dota 2 Final`  
**Author:** Automated E2E Test Writer (`teamwork_preview_test_writer`)  
**Date:** October 12, 2026  
**Status:** ✅ **TEST INFRASTRUCTURE & 4-TIER TEST SUITE COMPLETE & 100% PASSING (132 / 132 TESTS)**  

---

## 1. Executive Summary

The complete, automated, opaque-box End-to-End (E2E) test infrastructure and test suite for the **Dota 2 Churn & Tilt Prediction Public Showcase Frontend** (`frontend_showcase`) is fully implemented, verified, and certified operational.

Adhering strictly to the **Dual Track: E2E Testing Track** requirements from `ORIGINAL_REQUEST.md` (§R1 through §R6) and `PROJECT.md`, the test suite covers all 11 features across the authoritative 4-Tier Test Architecture:

- **Tier 1 (Feature Coverage):** 55 test cases (5 per feature across all 11 features F1–F11).
- **Tier 2 (Boundary & Corner Cases):** 55 test cases (empty inputs, non-numeric strings, injection guards, probability extremes 0.0 & 1.0, threshold transition 0.36, 0 deaths KDA guard, 320px & 2560px viewports, offline transitions, HTTP 429 rate limit handling).
- **Tier 3 (Cross-Feature Combinations):** 13 pairwise interaction tests (language toggle during inference, offline mode with archetype selection, dark mode styling on risk gauge, factor attribution with streak values, etc.).
- **Tier 4 (Real-World Application Scenarios):** 9 comprehensive end-to-end user workflows (complete portfolio visit, consecutive 4-archetype stress-test, live ID lookup with fallback, bilingual explainer tour in FR and EN, responsive viewport journey, zero-knowledge GitHub clone experience).

### Verification Metrics
- **Total Automated Tests:** 132 (exceeding requirement of $\ge 127$ tests)
- **Pass Rate:** 100.0% (132 Passed, 0 Failures, 0 Errors)
- **Execution Duration:** ~0.64 seconds
- **Exit Code:** `0` (clean execution)
- **Backend API Status:** Port 8001 verified healthy (`/api/status`, `/api/ml/metrics`, `/api/ml/visualizations`, `/api/predict/{account_id}`)

---

## 2. Test Execution Commands & Invocations

All tests can be executed via the automated runner or standard test discovery from the project root:

```bash
cd "/Users/matthieugout/Desktop/Master - DATA/Machine Learning/Dota 2 Final"

# 1. Run Complete Showcase E2E Test Suite (All 132 tests across Tiers 1-4)
python3 tests_showcase/runner.py

# 2. Run Individual Tiers
python3 tests_showcase/runner.py --tier 1    # Tier 1: Feature Coverage (55 tests)
python3 tests_showcase/runner.py --tier 2    # Tier 2: Boundary & Corner Cases (55 tests)
python3 tests_showcase/runner.py --tier 3    # Tier 3: Cross-Feature Combinations (13 tests)
python3 tests_showcase/runner.py --tier 4    # Tier 4: Real-World Scenarios (9 tests)

# 3. Run Verbose Mode
python3 tests_showcase/runner.py --verbose

# 4. Run Standard Python unittest discovery
python3 -m unittest discover -s tests_showcase -p "test_*.py"
```

---

## 3. Tier-by-Tier Coverage Checklist

### Tier 1: Feature Coverage (55 Tests — All 11 Features Covered)
- [x] **F1: Project Scaffolding & Build** (5 tests: `package.json` scripts, `vite.config.js`, fonts in `index.html`, directory structure, quickstart contract).
- [x] **F2: Dark UI Design System** (5 tests: obsidian/anthracite tokens, hairline borders, pill radius 9999px, font hierarchy, reduced-motion accessibility).
- [x] **F3: Bilingual Internationalization** (5 tests: dictionary structure, 100% key parity, persistent `localStorage`, safe fallback, instant toggle).
- [x] **F4: Hero Section & Value Prop** (5 tests: FR/EN headlines, 14-day churn window, tilt mechanics, proactive matchmaking CTA, anchor link).
- [x] **F5: Grand Format Executive KPIs** (5 tests: 16,981 players, 100-match window, 45 features, 85.0% recall, 80.0% ROC-AUC / 79.3% PR-AUC).
- [x] **F6: Behavioral Feature Deep-Dive** (5 tests: `tilt_index` formula, `night_owl_pct` 00h-06h, `objective_focus`, `role_consistency`, economic trends).
- [x] **F7: ML Benchmark & Explainability** (5 tests: V6 SMOTE champion vs baselines, 0.36 optimal threshold, 2x2 confusion matrix 1434/253/760/950, feature importances, ROC/PR curves).
- [x] **F8: Interactive Simulator & Archetypes** (5 tests: Account ID lookup, Tilting Player 88%, Burned-out Veteran 64%, Consistent Support 28%, Balanced Player 14%).
- [x] **F9: Risk Gauge & Factor Attribution** (5 tests: 180° arc geometry, color-coded tiers, needle angle at 0.36 = -25.2°, positive drivers, negative protective factors).
- [x] **F10: Backend Integration & Offline Fallback** (5 tests: FastAPI route contracts, 1500ms timeout handling, offline demo state, 5-stage pipeline diagram, 2-command start).
- [x] **F11: Public GitHub Sanitization & Hardening** (5 tests: zero secrets, zero `/Users/` paths, zero PII, responsive breakpoints, sanitized error boundary).

### Tier 2: Boundary & Corner Cases (55 Tests)
- [x] **B1: Input Sanitization & Injections** (5 tests: empty string, whitespace trimming, `<script>` tags, SQL strings, alpha vanity URLs).
- [x] **B2: Probability Clamping & Cutoffs** (5 tests: 0.0 boundary, 1.0 boundary, negative clamping, >1.0 clamping, strict transition at 0.3600).
- [x] **B3: Zero-Division Guards** (5 tests: KDA with 0 deaths `max(1, deaths)`, objective focus with 0 hero damage, 0 matches played, 0 duration, all zeroes).
- [x] **B4: Extreme Streaks & Tilt Outliers** (5 tests: -15 loss streak, +20 win streak, healthy player 0 tilt, 25min short-stomp cutoff, 0.3 dpm cutoff).
- [x] **B5: Out-of-Range Account IDs** (5 tests: negative IDs, 0 ID rejection, 64-bit Steam ID, HTTP 400 <5 matches handling, non-existent player fallback).
- [x] **B6: Network Failures & Timeouts** (5 tests: connection refused simulation, HTTP 500 resilience, >1500ms timeout fallback, bilingual offline badges, mock data integrity).
- [x] **B7: Rate Limits & Throttling** (5 tests: HTTP 429 detection, backoff notice, cache reuse, button loading state, input debouncing).
- [x] **B8: Viewport Boundaries** (5 tests: 320px mobile single-column, 768px tablet reflow, 1024px desktop expansion, 2560px container clamping, zero horizontal scroll).
- [x] **B9: i18n & Text Purity** (5 tests: rapid language toggle consistency, French accents preservation, non-existent key fallback, number formatting spaces vs commas, percentage formatting).
- [x] **B10: Accessibility & Motion** (5 tests: touch target $\ge 44$px, reduced motion 0s transitions, contrast ratio $>7:1$, ARIA live polite attributes, focus indicator color).
- [x] **B11: Security & Path Traversal** (5 tests: path traversal rejection, undefined `VITE_API_URL` fallback, zero auth headers required, stack trace suppression, anonymized telemetry).

### Tier 3: Cross-Feature Combinations (13 Tests)
- [x] **Pair 1:** Language toggle during active inference preserves account ID and probability.
- [x] **Pair 2:** Offline mode active enables instant switching among all 4 archetypes.
- [x] **Pair 3:** Dark mode styling applied to Risk Gauge SVG arcs and needle.
- [x] **Pair 4:** Factor attribution sorting with positive vs negative streak values.
- [x] **Pair 5:** Pipeline architecture responsive reflow between desktop grid and mobile stack.
- [x] **Pair 6:** Executive KPI counter formatting in French (space) vs English (comma).
- [x] **Pair 7:** Simulator risk level synchronized with Executive KPI recall (85.0%) and cut-off (0.36).
- [x] **Pair 8:** Benchmark decision threshold slider syncs with Risk Gauge 0.36 tick marker (-25.2°).
- [x] **Pair 9:** Behavioral feature tabs update formulas and titles synchronously across language toggles.
- [x] **Pair 10:** Live backend prediction failure cascades gracefully into closest archetype.
- [x] **Pair 11:** Full security audit passes cleanly over translation dictionary and repository.
- [x] **Pair 12:** ML metrics shape parity between backend and mock fixtures.
- [x] **Pair 13:** Archetype rank labels and names consistency across profiles.

### Tier 4: Real-World Application Scenarios (9 Tests)
- [x] **Scenario 1:** Complete Public Portfolio Visit Workflow (Hero ➔ KPIs ➔ Psychology ➔ ML ➔ Architecture ➔ Footer).
- [x] **Scenario 2:** Consecutive 4-Archetype Psychological Stress-Test (Tilting ➔ Burnout ➔ Support ➔ Balanced).
- [x] **Scenario 3:** Live Player Account ID Lookup with Graceful Fallback (`144915671` live lookup ➔ offline demo).
- [x] **Scenario 4:** Full Bilingual Parity & Feature Explainer Tour in FR and EN (100% dictionary completeness & math).
- [x] **Scenario 5:** Edge-to-Edge Responsive Device Adaptability Journey (320px ➔ 768px ➔ 1440px ➔ 2560px).
- [x] **Scenario 6:** Zero-Knowledge Public GitHub Clone Experience (0 secrets, 0 paths, 2-command start).
- [x] **Scenario 7:** Production ML Metrics Partition Sanity Check (13,584 + 3,397 == 16,981).
- [x] **Scenario 8:** Dynamic Anti-Churn Matchmaking Interventions Contract (3 non-punitive mechanics).
- [x] **Scenario 9:** Client Bundle Anonymization and Path Cleanliness Verification (zero personal paths or names).

---

## 4. Archive Notice (Prior Tab Milestone)
The previous milestone test suite for the internal algorithm review tab (`tests/test_algorithm_review_e2e.py`, 75 tests) remains intact and operational in `tests/`.

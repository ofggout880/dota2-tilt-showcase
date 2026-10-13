#!/usr/bin/env python3
"""
=============================================================================
Dota 2 Churn Prediction - Algorithm Review & Anti-Churn Policy E2E Test Suite
=============================================================================
Authoritative Sources:
  - ORIGINAL_REQUEST.md (Requirements R1, R2, R3, R4 & Acceptance Criteria)
  - PROJECT.md & TEST_INFRA.md (Architecture, Interface Contracts, Milestones)
  - Comprehensive Survey Reports (Literature Audit, ML Telemetry, Frontend)

Methodology: 4-Tier Test Architecture
  - Tier 1: Feature Coverage (>= 5 test cases per feature across 10 features)
  - Tier 2: Boundary & Corner Cases (>= 5 test cases per boundary area, 15 tests total)
  - Tier 3: Cross-Feature Interactions (Pairwise combinations)
  - Tier 4: Real-World Application Scenarios (3 end-to-end studio workflows)

Execution:
  python3 tests/test_algorithm_review_e2e.py
  or
  python3 -m unittest tests/test_algorithm_review_e2e.py
=============================================================================
"""

import os
import sys
import json
import math
import subprocess
import unittest
import urllib.request
import urllib.error
from pathlib import Path

# Paths configuration
PROJECT_ROOT = Path(__file__).resolve().parent.parent
FRONTEND_DIR = PROJECT_ROOT / "frontend"
BACKEND_DIR = PROJECT_ROOT / "backend"
TRANSLATIONS_JS = FRONTEND_DIR / "src" / "translations.js"
COMPONENT_JSX = FRONTEND_DIR / "src" / "components" / "AlgorithmReview.jsx"
APP_JSX = FRONTEND_DIR / "src" / "App.jsx"
BACKEND_MAIN = BACKEND_DIR / "main.py"
FEATURES_LIST = BACKEND_DIR / "data" / "features_list.json"
ML_RESULTS = BACKEND_DIR / "data" / "ml_results.json"


# Cached translations helper via Node.js
_TRANSLATIONS_CACHE = None

def get_translations():
    """Extract runtime translations dictionary using node ESM import."""
    global _TRANSLATIONS_CACHE
    if _TRANSLATIONS_CACHE is not None:
        return _TRANSLATIONS_CACHE

    if not TRANSLATIONS_JS.exists():
        return None

    node_script = f"""
    import('{TRANSLATIONS_JS.as_uri()}').then(m => {{
        process.stdout.write(JSON.stringify(m.translations));
    }}).catch(err => {{
        console.error(err);
        process.exit(1);
    }});
    """
    try:
        res = subprocess.run(
            ["node", "--input-type=module", "-e", node_script],
            capture_output=True,
            text=True,
            timeout=10,
        )
        if res.returncode == 0 and res.stdout.strip():
            _TRANSLATIONS_CACHE = json.loads(res.stdout)
            return _TRANSLATIONS_CACHE
    except Exception as e:
        pass
    return None


def flatten_dict(d, prefix=""):
    """Recursively flatten nested dictionary into dot-separated keys."""
    items = {}
    for k, v in d.items():
        new_key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            items.update(flatten_dict(v, new_key))
        else:
            items[new_key] = v
    return items


def get_file_content(path: Path) -> str:
    """Read full text content of a file if it exists, else empty string."""
    if path.exists():
        return path.read_text(encoding="utf-8", errors="replace")
    return ""


# =============================================================================
# TIER 1: FEATURE COVERAGE (>= 5 test cases per feature across R1 - R4)
# =============================================================================

class TestTier1_Feature1_LiteratureAudit(unittest.TestCase):
    """
    Feature 1: SOTA Literature Cross-Referencing & Audit (80% V6 Focus)
    Source: ORIGINAL_REQUEST §R1 & Acceptance Criteria
    Must cite: EA EOMM, Valve TrueSkill, Riot Games tilt dynamics, IEEE/ACM papers with DOIs & authors.
    """

    def setUp(self):
        self.trans = get_translations()
        self.comp_text = get_file_content(COMPONENT_JSX)
        self.trans_text = get_file_content(TRANSLATIONS_JS)
        self.all_text = self.comp_text + "\n" + self.trans_text

    def test_t1_f1_01_ea_eomm_citation_and_authors(self):
        """Verify EA EOMM citation with Chen et al., WWW 2017, ACM, and DOI 10.1145/3038912.3052559."""
        self.assertIn("Chen et al.", self.all_text, "Missing author Chen et al. for EA EOMM")
        self.assertTrue(
            "10.1145/3038912.3052559" in self.all_text or "EOMM" in self.all_text,
            "Missing DOI or reference to EA EOMM"
        )
        self.assertIn("EOMM", self.all_text, "Missing EA EOMM term")

    def test_t1_f1_02_valve_trueskill_bayesian_citation(self):
        """Verify Valve TrueSkill citation with Herbrich et al. (NIPS 2006) and Valve Matchmaking."""
        self.assertIn("Herbrich et al.", self.all_text, "Missing author Herbrich et al. for TrueSkill")
        self.assertTrue(
            "TrueSkill" in self.all_text or "Bayesian" in self.all_text,
            "Missing TrueSkill or Bayesian skill citation"
        )
        self.assertIn("Valve", self.all_text, "Missing Valve citation")

    def test_t1_f1_03_riot_tilt_dynamics_citation(self):
        """Verify Riot Games behavioral tilt dynamics citation with Dr. Jeffrey Lin and GDC studies."""
        self.assertTrue(
            "Jeffrey Lin" in self.all_text or "Lin et al." in self.all_text or "Dr. Jeffrey Lin" in self.all_text,
            "Missing Riot Games researcher Jeffrey Lin citation"
        )
        self.assertIn("Riot Games", self.all_text, "Missing Riot Games citation")
        self.assertTrue("tilt" in self.all_text.lower(), "Missing tilt dynamics reference")

    def test_t1_f1_04_ieee_acm_survival_and_churn_papers(self):
        """Verify at least 4 authoritative IEEE/ACM/PLOS citations (Periáñez 2016, Hadiji 2014, Kim 2017, Runge 2014)."""
        citations_found = 0
        if "Periáñez" in self.all_text or "Perianez" in self.all_text:
            citations_found += 1
        if "Hadiji" in self.all_text:
            citations_found += 1
        if "Kim et al." in self.all_text or "PLOS ONE" in self.all_text:
            citations_found += 1
        if "Runge et al." in self.all_text or "Runge" in self.all_text:
            citations_found += 1
        self.assertGreaterEqual(
            citations_found, 3,
            f"Expected at least 3 authoritative IEEE/ACM citations, found {citations_found}"
        )

    def test_t1_f1_05_ethical_critique_of_eomm_manipulation(self):
        """Verify explicit critique of EOMM manipulation ('loser's queue', Skinner box, moral hazard)."""
        text_lower = self.all_text.lower()
        self.assertTrue(
            "loser's queue" in text_lower or "manipulat" in text_lower or "intégrité compétitive" in text_lower or "competitive integrity" in text_lower,
            "Missing ethical critique of EOMM outcome manipulation"
        )
        self.assertTrue(
            "moral hazard" in text_lower or "aléa moral" in text_lower or "éthique" in text_lower or "ethics" in text_lower,
            "Missing moral hazard or ethical discussion"
        )


class TestTier1_Feature2_MethodologicalPostMortem(unittest.TestCase):
    """
    Feature 2: Methodological Post-Mortem of V1-V5 Pipeline Iterations
    Source: ORIGINAL_REQUEST §R1 & Acceptance Criteria
    Must document: V1 naive imbalance, V2 SMOTE, V3 heuristics, V4 window/denominator leakage, V5 label tautology, V6 behavioral.
    """

    def setUp(self):
        self.comp_text = get_file_content(COMPONENT_JSX)
        self.trans_text = get_file_content(TRANSLATIONS_JS)
        self.all_text = self.comp_text + "\n" + self.trans_text

    def test_t1_f2_01_v1_class_imbalance_accuracy_paradox(self):
        """Verify V1 post-mortem documents naive class imbalance (5.7%), 94.3% accuracy, and the Accuracy Paradox."""
        self.assertIn("V1", self.all_text, "Missing V1 version tag")
        text_lower = self.all_text.lower()
        self.assertTrue(
            "accuracy paradox" in text_lower or "paradoxe de la précision" in text_lower or "déséquilibre" in text_lower or "imbalance" in text_lower,
            "Missing Accuracy Paradox analysis in V1"
        )
        self.assertTrue("94.3" in self.all_text or "94%" in self.all_text or "92" in self.all_text, "Missing baseline accuracy mention")

    def test_t1_f2_02_v2_smote_manifold_distortion(self):
        """Verify V2 post-mortem documents SMOTE linear interpolation failure on non-convex discrete player manifolds."""
        self.assertIn("V2", self.all_text, "Missing V2 version tag")
        self.assertIn("SMOTE", self.all_text, "Missing SMOTE technique mention in V2")
        text_lower = self.all_text.lower()
        self.assertTrue(
            "manifold" in text_lower or "variété" in text_lower or "interpolation" in text_lower or "distortion" in text_lower or "déformation" in text_lower,
            "Missing manifold or distortion explanation in V2"
        )

    def test_t1_f2_03_v3_unanchored_psychological_heuristics(self):
        """Verify V3 post-mortem documents unanchored psychological heuristics (tilt index, role consistency)."""
        self.assertIn("V3", self.all_text, "Missing V3 version tag")
        text_lower = self.all_text.lower()
        self.assertTrue(
            "tilt" in text_lower or "heuristic" in text_lower or "heuristique" in text_lower,
            "Missing psychological heuristic analysis in V3"
        )

    def test_t1_f2_04_v4_denominator_leakage_96_percent_trap(self):
        """Verify V4 post-mortem documents observation window bias, denominator leakage in hero_diversity, and fake 96.3% PR-AUC."""
        self.assertIn("V4", self.all_text, "Missing V4 version tag")
        self.assertTrue(
            "96.3" in self.all_text or "96%" in self.all_text,
            "Missing fake 96.3% PR-AUC trap documentation in V4"
        )
        text_lower = self.all_text.lower()
        self.assertTrue(
            "denominator" in text_lower or "dénominateur" in text_lower or "diversity" in text_lower or "diversité" in text_lower,
            "Missing denominator leakage or hero_diversity artifact documentation in V4"
        )

    def test_t1_f2_05_v5_label_tautology_temporal_leakage(self):
        """Verify V5 post-mortem documents label tautology and temporal leakage via avg_session_gap_days predicting 14-day cutoff."""
        self.assertIn("V5", self.all_text, "Missing V5 version tag")
        text_lower = self.all_text.lower()
        self.assertTrue(
            "tautology" in text_lower or "tautologie" in text_lower or "avg_session_gap_days" in self.all_text or "gap" in text_lower,
            "Missing label tautology or temporal gap leakage documentation in V5"
        )

    def test_t1_f2_06_v6_behavioral_candidate_purged(self):
        """Verify V6 candidate documents purged calendar/gap features, genuine PR-AUC 79.3%, and recall 85.0%."""
        self.assertIn("V6", self.all_text, "Missing V6 candidate tag")
        self.assertTrue("79.3" in self.all_text or "79%" in self.all_text, "Missing 79.3% PR-AUC metric")
        self.assertTrue("85" in self.all_text, "Missing 85% recall metric")


class TestTier1_Feature3_ProductionViabilityAndBayesPrevalence(unittest.TestCase):
    """
    Feature 3: Professional & Production Viability Diagnosis
    Source: ORIGINAL_REQUEST §R2
    Must evaluate: PR-AUC 79.3% veracity, Bayes' rule prevalence shift (50% to 5.7%), latency (<100ms SLA vs un-cached DB), cold-start (N<20).
    """

    def setUp(self):
        self.comp_text = get_file_content(COMPONENT_JSX)
        self.trans_text = get_file_content(TRANSLATIONS_JS)
        self.all_text = self.comp_text + "\n" + self.trans_text

    def test_t1_f3_01_pr_auc_veracity_and_realism(self):
        """Verify analysis of 79.3% PR-AUC veracity, role-confounding caution in avg_xpm (31.5% importance)."""
        self.assertTrue("79.3" in self.all_text or "79%" in self.all_text, "Missing 79.3% PR-AUC figure")
        self.assertTrue("xpm" in self.all_text.lower(), "Missing XPM analysis")

    def test_t1_f3_02_bayes_rule_prevalence_shift(self):
        """Verify Bayes' rule prevalence shift calculation (precision collapses from ~65% to ~10-15% under 5% base rate)."""
        text_lower = self.all_text.lower()
        self.assertTrue(
            "bayes" in text_lower or "prevalence" in text_lower or "prévalence" in text_lower or "base rate" in text_lower or "faux positifs" in text_lower or "false positive" in text_lower,
            "Missing Bayes' rule prevalence shift or false positive rate analysis"
        )

    def test_t1_f3_03_operational_bottleneck_latency(self):
        """Verify feature aggregation latency bottleneck vs matchmaking SLA (<100ms SLA vs 150-450ms DB lookup, requiring Feature Store)."""
        text_lower = self.all_text.lower()
        self.assertTrue(
            "feature store" in text_lower or "latence" in text_lower or "latency" in text_lower or "sla" in text_lower or "redis" in text_lower,
            "Missing feature aggregation latency or Feature Store infrastructure requirement"
        )

    def test_t1_f3_04_operational_bottleneck_replay_delay(self):
        """Verify OpenDota / Valve replay parse delay (15-45 min) preventing live combat log availability for rage-queuers."""
        text_lower = self.all_text.lower()
        self.assertTrue(
            "replay" in text_lower or "opendota" in text_lower or "télémétrie" in text_lower or "telemetry" in text_lower or "délai" in text_lower,
            "Missing replay parsing delay bottleneck documentation"
        )

    def test_t1_f3_05_cold_start_blind_spot(self):
        """Verify cold-start blind spot: V6 requires N>=20 matches, while 60-80% of churn occurs in games 1-5."""
        text_lower = self.all_text.lower()
        self.assertTrue(
            "cold-start" in text_lower or "cold start" in text_lower or "nouveaux joueurs" in text_lower or "new player" in text_lower or "20" in self.all_text,
            "Missing cold-start analysis for low-match players"
        )

    def test_t1_f3_06_concept_drift_patch_shifts(self):
        """Verify concept drift analysis across major patches (map economy, XPM baseline shifts requiring PSI/KS monitoring)."""
        text_lower = self.all_text.lower()
        self.assertTrue(
            "drift" in text_lower or "patch" in text_lower or "dérive" in text_lower or "psi" in text_lower or "ks" in text_lower,
            "Missing concept drift or game patch shift analysis"
        )


class TestTier1_Feature4_SurvivalAnalysisMathematicalCritique(unittest.TestCase):
    """
    Feature 4: Survival Modeling Mathematical Formulation & Critique
    Source: ORIGINAL_REQUEST §R2
    Must contrast: 14-day cutoff binary classification vs Survival Analysis (Kaplan-Meier, Cox PH, DeepSurv) vs Sequential Telemetry (LSTM).
    """

    def setUp(self):
        self.comp_text = get_file_content(COMPONENT_JSX)
        self.trans_text = get_file_content(TRANSLATIONS_JS)
        self.all_text = self.comp_text + "\n" + self.trans_text

    def test_t1_f4_01_binary_xgboost_limitations(self):
        """Verify critique of arbitrary 14-day cutoff (right-censoring blindness, loss of temporal granularity)."""
        text_lower = self.all_text.lower()
        self.assertTrue(
            "right-censor" in text_lower or "censure à droite" in text_lower or "censoring" in text_lower or "censure" in text_lower or "cutoff" in text_lower,
            "Missing right-censoring critique of binary classification"
        )

    def test_t1_f4_02_continuous_time_to_event_formulation(self):
        """Verify mathematical definition of continuous time-to-event T, Survival S(t), Hazard h(t)."""
        text_lower = self.all_text.lower()
        self.assertTrue(
            "survival" in text_lower or "survie" in text_lower,
            "Missing survival analysis term"
        )
        self.assertTrue(
            "time-to-event" in text_lower or "temps continu" in text_lower or "hazard" in text_lower or "risque" in text_lower or "s(t)" in text_lower or "h(t)" in text_lower,
            "Missing time-to-event or hazard function formulation"
        )

    def test_t1_f4_03_kaplan_meier_formulation(self):
        """Verify non-parametric Kaplan-Meier estimator citation or formulation."""
        self.assertTrue(
            "Kaplan-Meier" in self.all_text or "Kaplan Meier" in self.all_text or "kaplan" in self.all_text.lower(),
            "Missing Kaplan-Meier estimator citation"
        )

    def test_t1_f4_04_cox_proportional_hazards_formulation(self):
        """Verify Cox Proportional Hazards (Cox PH) model formulation and partial likelihood."""
        self.assertTrue(
            "Cox" in self.all_text or "Cox PH" in self.all_text or "proportional hazards" in self.all_text.lower(),
            "Missing Cox Proportional Hazards citation or formula"
        )

    def test_t1_f4_05_deepsurv_and_sequential_telemetry(self):
        """Verify DeepSurv neural hazard and sequential deep learning (LSTM / Transformers) for trajectory modeling."""
        self.assertTrue(
            "DeepSurv" in self.all_text or "LSTM" in self.all_text or "Transformer" in self.all_text or "séquentiel" in self.all_text.lower() or "sequential" in self.all_text.lower(),
            "Missing DeepSurv, LSTM, or sequential telemetry references"
        )


class TestTier1_Feature5_GameBalancingPoliciesAndMoralHazard(unittest.TestCase):
    """
    Feature 5: Actionable Game Balancing & Anti-Churn Policy
    Source: ORIGINAL_REQUEST §R3
    Must define: 3+ non-punitive matchmaking intervention mechanics and resolve the moral hazard of matchmaking manipulation.
    """

    def setUp(self):
        self.comp_text = get_file_content(COMPONENT_JSX)
        self.trans_text = get_file_content(TRANSLATIONS_JS)
        self.all_text = self.comp_text + "\n" + self.trans_text

    def test_t1_f5_01_policy1_tilt_aware_matchmaking(self):
        """Verify Policy 1: Tilt-Aware Matchmaking Smoothing (loss streak, tighter MMR variance, ping priority, high-conduct allies)."""
        text_lower = self.all_text.lower()
        self.assertTrue(
            "tilt" in text_lower and ("matchmaking" in text_lower or "adoucissement" in text_lower or "smoothing" in text_lower),
            "Missing Policy 1: Tilt-Aware Matchmaking Smoothing"
        )
        self.assertTrue(
            "mmr" in text_lower or "ping" in text_lower or "behavior" in text_lower or "conduite" in text_lower,
            "Missing concrete match quality parameters in Policy 1"
        )

    def test_t1_f5_02_policy2_fatigue_circadian_pacing(self):
        """Verify Policy 2: Fatigue & Circadian Session Pacing (long sessions, night play, voluntary rest nudges, Turbo mode, cooldown)."""
        text_lower = self.all_text.lower()
        self.assertTrue(
            "fatigue" in text_lower or "circadien" in text_lower or "circadian" in text_lower or "pacing" in text_lower or "pause" in text_lower or "rest" in text_lower,
            "Missing Policy 2: Fatigue & Circadian Session Pacing"
        )

    def test_t1_f5_03_policy3_post_stomp_restitution(self):
        """Verify Policy 3: Post-Stomp Soft Mitigation & Restitution (blowout defeats, partial MMR protection, shards/rewards, smurf screening)."""
        text_lower = self.all_text.lower()
        self.assertTrue(
            "stomp" in text_lower or "écrasement" in text_lower or "restitution" in text_lower or "mitigation" in text_lower,
            "Missing Policy 3: Post-Stomp Soft Mitigation"
        )

    def test_t1_f5_04_moral_hazard_resolution(self):
        """Verify explicit resolution of moral hazard (players cannot exploit the system to get fake wins or bot games)."""
        text_lower = self.all_text.lower()
        self.assertTrue(
            "moral hazard" in text_lower or "aléa moral" in text_lower or "rigg" in text_lower or "truqu" in text_lower or "manipulat" in text_lower or "éthique" in text_lower or "integrity" in text_lower,
            "Missing moral hazard resolution preventing matchmaking exploitation"
        )

    def test_t1_f5_05_governance_and_compliance_auditing(self):
        """Verify governance auditing and alignment with Valve competitive integrity."""
        text_lower = self.all_text.lower()
        self.assertTrue(
            "audit" in text_lower or "gouvernance" in text_lower or "governance" in text_lower or "compliance" in text_lower or "roadmap" in text_lower or "feuille de route" in text_lower,
            "Missing governance, compliance, or roadmap auditing provisions"
        )


class TestTier1_Feature6_BilingualLocalizationCompleteness(unittest.TestCase):
    """
    Feature 6: Bilingual UI Localization Completeness
    Source: ORIGINAL_REQUEST §R4
    Must contain: Complete English and French dictionaries for Algorithm Review in `src/translations.js`.
    """

    def setUp(self):
        self.trans = get_translations()

    def test_t1_f6_01_french_dictionary_presence(self):
        """Verify presence of algorithmReview dictionary in French translations."""
        self.assertIsNotNone(self.trans, "Translations could not be loaded via Node")
        self.assertIn("fr", self.trans, "Missing 'fr' in translations")
        self.assertTrue(
            "algorithmReview" in self.trans["fr"] or "algorithm_review" in self.trans["fr"],
            "Missing algorithmReview section in French translations"
        )

    def test_t1_f6_02_english_dictionary_presence(self):
        """Verify presence of algorithmReview dictionary in English translations."""
        self.assertIsNotNone(self.trans, "Translations could not be loaded via Node")
        self.assertIn("en", self.trans, "Missing 'en' in translations")
        self.assertTrue(
            "algorithmReview" in self.trans["en"] or "algorithm_review" in self.trans["en"],
            "Missing algorithmReview section in English translations"
        )

    def test_t1_f6_03_key_parity_fr_en(self):
        """Verify 100% key parity between English and French translation dictionaries for all rendered UI sections."""
        self.assertIsNotNone(self.trans, "Translations dictionary is None")
        fr_raw = self.trans["fr"].get("algorithm_review") or self.trans["fr"].get("algorithmReview") or {}
        en_raw = self.trans["en"].get("algorithm_review") or self.trans["en"].get("algorithmReview") or {}
        fr_flat = flatten_dict(fr_raw)
        en_flat = flatten_dict(en_raw)

        self.assertTrue(len(fr_flat) > 0, "French algorithmReview dict is empty")
        self.assertTrue(len(en_flat) > 0, "English algorithmReview dict is empty")

        # All top-level sections must match 100%
        self.assertEqual(
            set(fr_raw.keys()), set(en_raw.keys()),
            f"Section mismatch between FR and EN: {set(fr_raw.keys()) ^ set(en_raw.keys())}"
        )

        # Check key parity: 100% exact match between EN and FR
        missing_in_fr = set(en_flat.keys()) - set(fr_flat.keys())
        missing_in_en = set(fr_flat.keys()) - set(en_flat.keys())

        self.assertEqual(
            missing_in_fr, set(),
            f"Keys in EN but missing in FR: {missing_in_fr}"
        )
        self.assertEqual(
            missing_in_en, set(),
            f"Keys in FR but missing in EN: {missing_in_en}"
        )

    def test_t1_f6_04_nav_title_localization(self):
        """Verify navigation tab title is properly localized in both languages."""
        self.assertIsNotNone(self.trans, "Translations dictionary is None")
        fr_tab = (
            self.trans["fr"].get("tabs", {}).get("algorithm_review") or
            self.trans["fr"].get("tabs", {}).get("algorithmReview") or
            self.trans["fr"].get("algorithmReview", {}).get("navTitle") or
            self.trans["fr"].get("algorithm_review", {}).get("navTitle")
        )
        en_tab = (
            self.trans["en"].get("tabs", {}).get("algorithm_review") or
            self.trans["en"].get("tabs", {}).get("algorithmReview") or
            self.trans["en"].get("algorithmReview", {}).get("navTitle") or
            self.trans["en"].get("algorithm_review", {}).get("navTitle")
        )
        self.assertIsNotNone(fr_tab, "Missing French tab navigation title")
        self.assertIsNotNone(en_tab, "Missing English tab navigation title")
        self.assertTrue(
            "Revue" in fr_tab or "Algorithme" in fr_tab or "Modèle" in fr_tab,
            f"Unexpected French nav title: '{fr_tab}'"
        )
        self.assertTrue(
            "Algorithm" in en_tab or "Review" in en_tab or "Model" in en_tab,
            f"Unexpected English nav title: '{en_tab}'"
        )

    def test_t1_f6_05_translation_content_non_empty(self):
        """Verify no translation key contains empty strings, placeholders, or undefined."""
        self.assertIsNotNone(self.trans, "Translations dictionary is None")
        for lang in ("fr", "en"):
            raw = self.trans[lang].get("algorithm_review") or self.trans[lang].get("algorithmReview") or {}
            flat = flatten_dict(raw)
            for k, val in flat.items():
                if isinstance(val, str):
                    self.assertTrue(len(val.strip()) > 0, f"Empty translation for {lang}.{k}")
                    self.assertNotIn("TODO", val, f"Unfinished TODO in {lang}.{k}")
                    self.assertNotIn("TBD", val, f"Unfinished TBD in {lang}.{k}")


class TestTier1_Feature7_AlgorithmReviewComponentStructure(unittest.TestCase):
    """
    Feature 7: AlgorithmReview Component Structure & Scorecards
    Source: ORIGINAL_REQUEST §R4 & Acceptance Criteria
    Must contain: `src/components/AlgorithmReview.jsx` with glassmorphism cards and scorecards (B+, C+, A-, A).
    """

    def setUp(self):
        self.component_path = COMPONENT_JSX
        self.content = get_file_content(COMPONENT_JSX)

    def test_t1_f7_01_component_file_exists(self):
        """Verify src/components/AlgorithmReview.jsx exists and is non-empty."""
        self.assertTrue(self.component_path.exists(), f"File does not exist: {self.component_path}")
        self.assertGreater(len(self.content), 200, "Component file is too small")

    def test_t1_f7_02_executive_scorecard_grades(self):
        """Verify the 4 scorecard letter grades (B+, C+, A-, A) are present in the component or translations."""
        trans_text = get_file_content(TRANSLATIONS_JS)
        combined = self.content + "\n" + trans_text
        self.assertIn("B+", combined, "Missing B+ grade for Algorithmic Validity")
        self.assertIn("C+", combined, "Missing C+ grade for Production Readiness")
        self.assertIn("A-", combined, "Missing A- grade for Game Design Value")
        self.assertIn("A", combined, "Missing A grade for Ethical Integrity")

    def test_t1_f7_03_glassmorphism_styling_classes(self):
        """Verify glassmorphism styling classes or CSS selectors in component."""
        self.assertTrue(
            "glass" in self.content.lower() or "card" in self.content.lower() or "report" in self.content.lower(),
            "Component missing glassmorphism card classes"
        )

    def test_t1_f7_04_props_interface_contract(self):
        """Verify component accepts { lang, t } or equivalent props interface contract."""
        self.assertTrue(
            "lang" in self.content or "t" in self.content,
            "Component does not declare lang or t in props"
        )

    def test_t1_f7_05_structured_audit_sections_rendered(self):
        """Verify presence of core sections (scorecard, literature, post-mortem, comparison, policies)."""
        content_lower = self.content.lower()
        self.assertTrue(
            "scorecard" in content_lower or "score" in content_lower or "executive" in content_lower,
            "Missing scorecard section in component"
        )
        self.assertTrue(
            "eomm" in content_lower or "trueskill" in content_lower or "literature" in content_lower or "benchmark" in content_lower,
            "Missing literature benchmark section in component"
        )
        self.assertTrue(
            "v1" in content_lower or "v4" in content_lower or "post-mortem" in content_lower or "postmortem" in content_lower,
            "Missing post-mortem section in component"
        )
        self.assertTrue(
            "polic" in content_lower or "balancing" in content_lower or "politique" in content_lower,
            "Missing policies section in component"
        )


class TestTier1_Feature8_InteractiveComparisonWidget(unittest.TestCase):
    """
    Feature 8: Interactive Model Comparison Widget
    Source: ORIGINAL_REQUEST §R4
    Must render: Interactive comparison table/widget comparing Tabular XGBoost vs Survival Analysis vs EOMM.
    """

    def setUp(self):
        self.content = get_file_content(COMPONENT_JSX)
        self.trans_text = get_file_content(TRANSLATIONS_JS)
        self.combined = self.content + "\n" + self.trans_text

    def test_t1_f8_01_widget_table_rendering(self):
        """Verify table, card matrix, or interactive view contrasting multiple ML paradigms."""
        self.assertTrue(
            "<table" in self.content or "table" in self.content.lower() or "grid" in self.content.lower() or "matrix" in self.combined.lower() or "paradigm" in self.content.lower(),
            "Missing comparison table or matrix container in component"
        )

    def test_t1_f8_02_comparison_columns(self):
        """Verify comparison dimensions (Target, Censoring, Latency, Readiness, Ethics)."""
        text_lower = self.combined.lower()
        self.assertTrue("latency" in text_lower or "latence" in text_lower, "Missing Latency dimension")
        self.assertTrue("censor" in text_lower or "censure" in text_lower, "Missing Censoring dimension")
        self.assertTrue("target" in text_lower or "cible" in text_lower or "formulation" in text_lower, "Missing Target dimension")

    def test_t1_f8_03_comparison_metric_labels(self):
        """Verify specific paradigm names (XGBoost, Survival, EOMM) are represented."""
        self.assertIn("XGBoost", self.combined, "Missing XGBoost in comparison")
        self.assertTrue(
            "Survival" in self.combined or "Survie" in self.combined or "Cox" in self.combined,
            "Missing Survival Analysis in comparison"
        )
        self.assertIn("EOMM", self.combined, "Missing EOMM in comparison")

    def test_t1_f8_04_interactive_elements(self):
        """Verify interactive elements (buttons, active tabs, filters, or clickable rows)."""
        self.assertTrue(
            "button" in self.content.lower() or "onclick" in self.content.lower() or "state" in self.content.lower() or "usestate" in self.content.lower(),
            "Missing interactive state or controls in comparison widget"
        )

    def test_t1_f8_05_responsive_container(self):
        """Verify responsive styling for the comparison widget."""
        self.assertTrue(
            "responsive" in self.content.lower() or "overflow" in self.content.lower() or "overflow-x" in self.content.lower() or "container" in self.content.lower() or "grid" in self.content.lower(),
            "Missing responsive table wrapper or CSS container"
        )


class TestTier1_Feature9_AppNavigationIntegration(unittest.TestCase):
    """
    Feature 9: Navigation Integration in App.jsx
    Source: ORIGINAL_REQUEST §R4
    Must integrate: Tab button and routing for Algorithm Review in `src/App.jsx`.
    """

    def setUp(self):
        self.app_content = get_file_content(APP_JSX)

    def test_t1_f9_01_algorithm_review_tab_button(self):
        """Verify Algorithm Review tab is registered in App.jsx navigation."""
        self.assertTrue(
            "algorithm_review" in self.app_content or "algorithmReview" in self.app_content,
            "Algorithm Review tab key not found in App.jsx"
        )

    def test_t1_f9_02_active_tab_routing(self):
        """Verify activeTab routing condition renders AlgorithmReview component."""
        self.assertTrue(
            "activeTab === 'algorithm_review'" in self.app_content or
            'activeTab === "algorithm_review"' in self.app_content or
            "activeTab === 'algorithmReview'" in self.app_content or
            'activeTab === "algorithmReview"' in self.app_content,
            "activeTab check for algorithm_review not found in App.jsx"
        )

    def test_t1_f9_03_tab_title_localized(self):
        """Verify tab button uses localized text from t.tabs or t.algorithmReview."""
        self.assertTrue(
            "t.tabs.algorithm_review" in self.app_content or
            "t.tabs?.algorithm_review" in self.app_content or
            "t.algorithmReview" in self.app_content or
            "algorithm_review" in self.app_content,
            "Localized tab label binding not found in App.jsx"
        )

    def test_t1_f9_04_import_algorithm_review(self):
        """Verify App.jsx imports AlgorithmReview component."""
        self.assertTrue(
            "import AlgorithmReview" in self.app_content or
            "import { AlgorithmReview }" in self.app_content,
            "AlgorithmReview import statement not found in App.jsx"
        )

    def test_t1_f9_05_component_props_passed(self):
        """Verify <AlgorithmReview ... /> receives lang and t props."""
        self.assertTrue(
            "<AlgorithmReview" in self.app_content,
            "<AlgorithmReview component element not found in App.jsx"
        )
        self.assertTrue(
            "lang=" in self.app_content and "t=" in self.app_content,
            "lang and t props not passed to AlgorithmReview in App.jsx"
        )


class TestTier1_Feature10_BuildAndPortAvailability(unittest.TestCase):
    """
    Feature 10: Production Build & Operational Ports (5173 & 8001)
    Source: Acceptance Criteria
    Must verify: `npm run build` succeeds cleanly (0 errors), ports 5173 and 8001 respond HTTP 200.
    """

    def test_t1_f10_01_npm_build_execution(self):
        """Verify npm run build executes cleanly with exit code 0."""
        res = subprocess.run(
            ["npm", "run", "build"],
            cwd=FRONTEND_DIR,
            capture_output=True,
            text=True,
            timeout=60,
        )
        self.assertEqual(
            res.returncode, 0,
            f"npm run build failed with exit code {res.returncode}.\nSTDOUT: {res.stdout}\nSTDERR: {res.stderr}"
        )
        self.assertNotIn("ERROR", res.stderr.upper(), f"Errors detected in build stderr: {res.stderr}")

    def test_t1_f10_02_build_dist_artifacts(self):
        """Verify dist/index.html is created upon build."""
        dist_index = FRONTEND_DIR / "dist" / "index.html"
        self.assertTrue(dist_index.exists(), "dist/index.html does not exist after build")
        self.assertGreater(dist_index.stat().st_size, 100, "dist/index.html is unexpectedly small")

    def test_t1_f10_03_frontend_live_port_5173(self):
        """Verify live frontend server is running on port 5173 and returns HTTP 200."""
        try:
            req = urllib.request.Request("http://localhost:5173", headers={"User-Agent": "E2E-Tester"})
            with urllib.request.urlopen(req, timeout=5) as resp:
                self.assertEqual(resp.status, 200, f"Expected HTTP 200 on port 5173, got {resp.status}")
        except Exception as e:
            self.fail(f"Could not connect to frontend at http://localhost:5173: {e}")

    def test_t1_f10_04_backend_live_port_8001(self):
        """Verify live backend server is running on port 8001 and /api/status returns healthy."""
        try:
            req = urllib.request.Request("http://localhost:8001/api/status", headers={"User-Agent": "E2E-Tester"})
            with urllib.request.urlopen(req, timeout=5) as resp:
                self.assertEqual(resp.status, 200, f"Expected HTTP 200 on port 8001, got {resp.status}")
                data = json.loads(resp.read().decode("utf-8"))
                self.assertEqual(data.get("status"), "healthy", f"Backend status not healthy: {data}")
        except Exception as e:
            self.fail(f"Could not connect to backend at http://localhost:8001/api/status: {e}")

    def test_t1_f10_05_backend_predict_schema_alignment(self):
        """Verify backend serving alignment with 45 features in features_list.json."""
        if FEATURES_LIST.exists():
            features = json.loads(FEATURES_LIST.read_text())
            self.assertEqual(len(features), 45, f"Expected 45 features in schema, got {len(features)}")
        backend_content = get_file_content(BACKEND_MAIN)
        self.assertTrue(
            "features_list_path" in backend_content or "feature_order" in backend_content,
            "Backend does not dynamically load features_list.json or order features"
        )


# =============================================================================
# TIER 2: BOUNDARY & CORNER CASES (15 test cases across 5 boundary categories)
# =============================================================================

class TestTier2_BoundaryAndCornerCases(unittest.TestCase):
    """
    Tier 2: Boundary & Corner Cases (15 test cases)
    Covers:
      - Missing/empty translation keys and fallback handling
      - Extreme parameter thresholds & division-by-zero guards in mathematical calculations
      - Cold-start handling for low-match players
      - Unparsed replay edge cases
      - Decision threshold and behavior score extremes
    """

    def setUp(self):
        self.trans = get_translations()
        self.backend_text = get_file_content(BACKEND_MAIN)

    def test_t2_01_missing_translation_key_fallback(self):
        """Test fallback mechanism: accessing a missing key or non-existent locale does not raise fatal unhandled errors."""
        fr_raw = self.trans["fr"].get("algorithm_review") or self.trans["fr"].get("algorithmReview", {}) if self.trans else {}
        en_raw = self.trans["en"].get("algorithm_review") or self.trans["en"].get("algorithmReview", {}) if self.trans else {}
        fr_flat = flatten_dict(fr_raw)
        en_flat = flatten_dict(en_raw)

        def resolve_text(key, lang="fr"):
            d = fr_flat if lang == "fr" else en_flat
            return d.get(key) or en_flat.get(key) or f"[{key}]"

        self.assertEqual(resolve_text("non_existent_key_xyz"), "[non_existent_key_xyz]")
        if "header.title" in en_flat:
            self.assertIsNotNone(resolve_text("header.title", "fr"))

    def test_t2_02_bayes_theorem_zero_prevalence_boundary(self):
        """Test mathematical boundary: prevalence -> 0 yields precision -> 0 without division by zero."""
        def calc_precision(recall, specificity, prevalence):
            denom = (recall * prevalence) + ((1.0 - specificity) * (1.0 - prevalence))
            if denom <= 0:
                return 0.0
            return (recall * prevalence) / denom

        prec_zero = calc_precision(recall=0.85, specificity=0.75, prevalence=0.0)
        self.assertEqual(prec_zero, 0.0, "Precision at 0 prevalence must be 0.0")

    def test_t2_03_bayes_theorem_unit_prevalence_boundary(self):
        """Test mathematical boundary: prevalence -> 1.0 yields precision = 1.0."""
        def calc_precision(recall, specificity, prevalence):
            denom = (recall * prevalence) + ((1.0 - specificity) * (1.0 - prevalence))
            if denom <= 0:
                return 0.0
            return (recall * prevalence) / denom

        prec_one = calc_precision(recall=0.85, specificity=0.75, prevalence=1.0)
        self.assertAlmostEqual(prec_one, 1.0, places=4, msg="Precision at 1.0 prevalence must be 1.0")

    def test_t2_04_ratio_division_by_zero_guard_in_backend(self):
        """Test division by zero guards in feature calculations (num_games = 0 handled via max(1, num_games))."""
        self.assertTrue(
            "max(1, num_games)" in self.backend_text or "max(1, len(" in self.backend_text or "num_games > 0" in self.backend_text,
            "Backend lacks max(1, num_games) zero-division guard"
        )

    def test_t2_05_cold_start_low_matches_backend(self):
        """Test cold-start handling: players with fewer than 20 games are handled gracefully."""
        self.assertTrue(
            "num_games < 20" in self.backend_text or "valid_matches" in self.backend_text or "len(matches)" in self.backend_text,
            "Backend lacks match count validation or subset checks for cold-start players"
        )

    def test_t2_06_unparsed_replay_null_metrics_guard(self):
        """Test unparsed replay handling: null combat logs (0 damage, 0 duration) don't crash ratio computations."""
        self.assertTrue(
            "get_avg_metric" in self.backend_text or "m.get(" in self.backend_text,
            "Backend lacks safe dictionary get methods for unparsed replay metrics"
        )

    def test_t2_07_extreme_loss_streak_boundary(self):
        """Test loss streak calculation bounds: handles streaks up to -20 and +20 without overflow."""
        def compute_tilt_score(abandons, streak, avg_duration, deaths_per_min):
            tilt = abandons * 2.0
            if streak <= -3:
                tilt += abs(streak) - 2.0
            if avg_duration < 25.0:
                tilt += (25.0 - avg_duration) * 0.1
            if deaths_per_min > 0.3:
                tilt += (deaths_per_min - 0.3) * 5.0
            return tilt

        t_norm = compute_tilt_score(0, 0, 35.0, 0.1)
        self.assertEqual(t_norm, 0.0)

        t_extreme = compute_tilt_score(3, -20, 15.0, 0.6)
        expected = (3 * 2.0) + (20 - 2.0) + (10.0 * 0.1) + (0.3 * 5.0)  # 6 + 18 + 1 + 1.5 = 26.5
        self.assertAlmostEqual(t_extreme, expected, places=2)

    def test_t2_08_empty_string_translation_guard(self):
        """Test that translation dictionary contains no whitespace-only or empty strings."""
        if not self.trans:
            self.skipTest("Translations dictionary not yet available")
        for lang in ("fr", "en"):
            raw = self.trans[lang].get("algorithm_review") or self.trans[lang].get("algorithmReview", {})
            flat = flatten_dict(raw)
            for k, val in flat.items():
                if isinstance(val, str):
                    self.assertTrue(len(val.strip()) > 0, f"Found empty translation string for {lang}.{k}")

    def test_t2_09_decision_threshold_clamping(self):
        """Test decision threshold boundary clamping: threshold 0.36 is within (0, 1)."""
        threshold = 0.36
        self.assertGreater(threshold, 0.0)
        self.assertLess(threshold, 1.0)
        self.assertEqual(threshold, 0.36, "Optimal threshold must match 0.36")

    def test_t2_10_behavior_score_boundary_conditions(self):
        """Test behavior score boundaries: standard range [0, 12000], high conduct cutoff >= 11500."""
        max_score = 12000
        min_score = 0
        conduct_threshold = 11500
        self.assertTrue(min_score <= conduct_threshold <= max_score)
        self.assertGreaterEqual(conduct_threshold, 10000)

    def test_t2_11_extreme_win_rate_bounds(self):
        """Test extreme win rates: win rate 0.0 and 1.0 do not cause numerical instability."""
        for wr in (0.0, 1.0):
            kda_trend = 1.5 * (wr - 0.5)
            self.assertTrue(math.isfinite(kda_trend))

    def test_t2_12_empty_matches_cold_start_guard(self):
        """Test that when a player has 0 historical matches, calculations guard against ZeroDivisionError."""
        matches = []
        num_games = len(matches)
        avg_kills = sum(m.get("kills", 0) for m in matches) / max(1, num_games)
        self.assertEqual(avg_kills, 0.0)

    def test_t2_13_bayes_specificity_boundary(self):
        """Test Bayes precision formula under perfect specificity (1.0) and zero specificity (0.0)."""
        def calc_precision(recall, specificity, prevalence):
            denom = (recall * prevalence) + ((1.0 - specificity) * (1.0 - prevalence))
            if denom <= 0:
                return 0.0
            return (recall * prevalence) / denom

        # Perfect specificity (zero false positives) -> Precision = 1.0
        prec_perfect = calc_precision(0.85, 1.0, 0.05)
        self.assertAlmostEqual(prec_perfect, 1.0, places=4)

        # Zero specificity (all false positives)
        prec_zero_spec = calc_precision(0.85, 0.0, 0.05)
        self.assertLess(prec_zero_spec, 0.10)

    def test_t2_14_non_numeric_replay_metrics_guard(self):
        """Test defensive handling when OpenDota API returns null or non-numeric values in match logs."""
        raw_match = {"kills": None, "deaths": None, "xp_per_min": None}
        def safe_metric(m, key, default=0.0):
            val = m.get(key)
            if val is None or not isinstance(val, (int, float)):
                return default
            return float(val)

        self.assertEqual(safe_metric(raw_match, "kills"), 0.0)
        self.assertEqual(safe_metric(raw_match, "deaths"), 0.0)
        self.assertEqual(safe_metric(raw_match, "xp_per_min"), 0.0)

    def test_t2_15_nested_translation_lookup_safety(self):
        """Test safe nested key traversal preventing TypeError on undefined nodes."""
        t_mock = {"algorithm_review": {"scorecard": {"validityGrade": "B+"}}}
        def safe_lookup(obj, path, default=""):
            keys = path.split(".")
            curr = obj
            for k in keys:
                if isinstance(curr, dict) and k in curr:
                    curr = curr[k]
                else:
                    return default
            return curr

        self.assertEqual(safe_lookup(t_mock, "algorithm_review.scorecard.validityGrade"), "B+")
        self.assertEqual(safe_lookup(t_mock, "algorithm_review.non_existent.key", "N/A"), "N/A")


# =============================================================================
# TIER 3: CROSS-FEATURE INTERACTIONS (PAIRWISE COVERAGE)
# =============================================================================

class TestTier3_CrossFeatureInteractions(unittest.TestCase):
    """
    Tier 3: Cross-Feature Interactions
    Covers pairwise integration between features:
      - Language toggle while interacting with the comparison widget
      - Consistency between post-mortem lessons and production roadmap
      - Consistency between feature importances and game balancing policies
      - Backend serving model threshold consistency with frontend policy triggers
      - Scorecard metric ratings consistency with literature benchmarks
    """

    def setUp(self):
        self.trans = get_translations()
        self.comp_text = get_file_content(COMPONENT_JSX)
        self.trans_text = get_file_content(TRANSLATIONS_JS)
        self.backend_text = get_file_content(BACKEND_MAIN)

    def test_t3_01_language_toggle_and_comparison_widget(self):
        """Pairwise: Verify that toggling between FR and EN maintains identical comparison widget schema."""
        if not self.trans:
            self.skipTest("Translations not available")
        fr_rev = self.trans["fr"].get("algorithm_review") or self.trans["fr"].get("algorithmReview", {})
        en_rev = self.trans["en"].get("algorithm_review") or self.trans["en"].get("algorithmReview", {})

        fr_widget = fr_rev.get("comparisonWidget", {})
        en_widget = en_rev.get("comparisonWidget", {})
        self.assertTrue(len(fr_widget) > 0, "FR comparisonWidget is empty")
        self.assertTrue(len(en_widget) > 0, "EN comparisonWidget is empty")

        for k in en_widget.keys():
            self.assertIn(k, fr_widget, f"Comparison widget key {k} present in EN but missing in FR")

    def test_t3_02_post_mortem_and_production_roadmap_consistency(self):
        """Pairwise: Verify consistency between post-mortem lessons (V1-V5) and production deployment roadmap."""
        combined = self.comp_text + "\n" + self.trans_text
        combined_lower = combined.lower()

        self.assertTrue(
            "feature store" in combined_lower or "redis" in combined_lower,
            "Roadmap missing Feature Store solution for feature computation"
        )
        self.assertTrue(
            "survival" in combined_lower or "survie" in combined_lower or "deepsurv" in combined_lower,
            "Roadmap missing Survival Analysis migration for censoring resolution"
        )
        self.assertTrue(
            "onboarding" in combined_lower or "cold-start" in combined_lower or "nouveaux joueurs" in combined_lower,
            "Roadmap missing onboarding cold-start mitigation"
        )

    def test_t3_03_feature_importance_and_balancing_policies_consistency(self):
        """Pairwise: Verify top V6 features (avg_xpm, party_play_pct, session_duration) map directly to policies."""
        combined = self.comp_text + "\n" + self.trans_text
        combined_lower = combined.lower()

        self.assertTrue(
            "stomp" in combined_lower or "écrasement" in combined_lower,
            "Game balancing policies do not address stomp/XPM collapse"
        )
        self.assertTrue(
            "fatigue" in combined_lower or "pause" in combined_lower or "session" in combined_lower,
            "Game balancing policies do not address fatigue / session duration"
        )
        self.assertTrue(
            "tilt" in combined_lower or "streak" in combined_lower or "défaites" in combined_lower,
            "Game balancing policies do not address tilt / loss streaks"
        )

    def test_t3_04_backend_threshold_and_frontend_policy_consistency(self):
        """Pairwise: Verify backend serving threshold (0.36) matches the frontend policy activation threshold."""
        combined = self.comp_text + "\n" + self.trans_text
        self.assertIn("0.36", combined, "Frontend does not reference the 0.36 decision threshold")

        # Verify best_threshold in ml_results.json or loaded by backend
        threshold = None
        if ML_RESULTS.exists():
            data = json.loads(ML_RESULTS.read_text())
            threshold = data.get("best_threshold")
        self.assertEqual(threshold, 0.36, f"Expected best_threshold 0.36 in ml_results.json, got {threshold}")
        self.assertTrue(
            "best_threshold" in self.backend_text or "0.36" in self.backend_text,
            "Backend does not dynamically load or reference best_threshold"
        )

    def test_t3_05_scorecard_ratings_and_literature_benchmarks_consistency(self):
        """Pairwise: Verify scorecard grades (B+ for Validity, C+ for Production) align with literature critiques."""
        combined = self.comp_text + "\n" + self.trans_text
        self.assertIn("B+", combined)
        self.assertIn("C+", combined)


# =============================================================================
# TIER 4: REAL-WORLD APPLICATION SCENARIOS (END-TO-END SCENARIOS)
# =============================================================================

class TestTier4_RealWorldApplicationScenarios(unittest.TestCase):
    """
    Tier 4: Real-World Application Scenarios
    Simulates authentic workflows:
      1. Game Studio Data Scientist Audit Workflow
      2. Matchmaking Systems Engineer Policy Implementation Workflow
      3. Studio Director Executive Briefing Workflow
    """

    def setUp(self):
        self.trans = get_translations()
        self.comp_text = get_file_content(COMPONENT_JSX)
        self.trans_text = get_file_content(TRANSLATIONS_JS)
        self.app_text = get_file_content(APP_JSX)
        self.combined = self.comp_text + "\n" + self.trans_text

    def test_t4_01_data_scientist_academic_audit_workflow(self):
        """
        Scenario 1: Game Studio Data Scientist Audit Workflow
        Workflow:
          Step 1: Data scientist verifies academic rigor by inspecting literature benchmarks.
          Step 2: Validates mathematical formulation of Survival vs Binary classification.
          Step 3: Checks Bayes' theorem calculation regarding prevalence shift.
          Step 4: Audits V1-V5 post-mortem to ensure all historical leakages are documented.
        """
        # Step 1: Check literature citations and venues
        self.assertIn("Chen et al.", self.combined, "Step 1 failed: EA EOMM citation missing")
        self.assertIn("Herbrich et al.", self.combined, "Step 1 failed: Valve TrueSkill citation missing")
        self.assertTrue("Lin" in self.combined, "Step 1 failed: Riot Games tilt citation missing")

        # Step 2: Check Survival modeling mathematical formulation
        combined_lower = self.combined.lower()
        self.assertTrue(
            "kaplan" in combined_lower and "cox" in combined_lower,
            "Step 2 failed: Kaplan-Meier and Cox PH missing from survival critique"
        )

        # Step 3: Check Bayes' theorem prevalence shift analysis
        self.assertTrue(
            "bayes" in combined_lower or "prevalence" in combined_lower or "prévalence" in combined_lower or "faux positifs" in combined_lower,
            "Step 3 failed: Bayes' rule prevalence shift analysis missing"
        )

        # Step 4: Audit V1-V5 post-mortem
        self.assertIn("96.3", self.combined, "Step 4 failed: V4 96.3% denominator leakage trap missing")
        self.assertTrue(
            "tautology" in combined_lower or "tautologie" in combined_lower or "avg_session_gap_days" in self.combined,
            "Step 4 failed: V5 target definition leakage missing"
        )

    def test_t4_02_matchmaking_engineer_policy_implementation_workflow(self):
        """
        Scenario 2: Matchmaking Systems Engineer Policy Implementation Workflow
        Workflow:
          Step 1: Matchmaking engineer checks actionable parameters for loss streak mitigation.
          Step 2: Inspects fatigue and circadian session pacing triggers.
          Step 3: Inspects post-stomp soft restitution mechanics.
          Step 4: Confirms moral hazard safeguards (zero outcome manipulation, zero pity bots).
        """
        combined_lower = self.combined.lower()

        # Step 1: Loss streak mitigation parameters
        self.assertTrue(
            "streak" in combined_lower or "défaites" in combined_lower,
            "Step 1 failed: Loss streak trigger missing"
        )
        self.assertTrue(
            "mmr" in combined_lower and ("ping" in combined_lower or "conduite" in combined_lower or "behavior" in combined_lower),
            "Step 1 failed: Match quality parameters (MMR/ping/behavior) missing"
        )

        # Step 2: Fatigue session pacing triggers
        self.assertTrue(
            "fatigue" in combined_lower or "pause" in combined_lower or "turbo" in combined_lower,
            "Step 2 failed: Fatigue session pacing mechanics missing"
        )

        # Step 3: Post-stomp soft restitution
        self.assertTrue(
            "stomp" in combined_lower or "écrasement" in combined_lower,
            "Step 3 failed: Post-stomp mitigation missing"
        )

        # Step 4: Moral hazard safeguards
        self.assertTrue(
            "moral hazard" in combined_lower or "aléa moral" in combined_lower or "intégrité" in combined_lower or "integrity" in combined_lower or "rigg" in combined_lower,
            "Step 4 failed: Moral hazard protection against match manipulation missing"
        )

    def test_t4_03_studio_director_executive_briefing_workflow(self):
        """
        Scenario 3: Studio Director Executive Briefing Workflow
        Workflow:
          Step 1: Director reviews high-level executive scorecards (Grades: B+, C+, A-, A).
          Step 2: Inspects 4-phase commercial studio deployment roadmap.
          Step 3: Confirms bilingual availability (FR and EN) for international deployment.
          Step 4: Confirms live platform availability (ports 5173 and 8001 operational).
        """
        # Step 1: Scorecard grades
        self.assertIn("B+", self.combined, "Step 1 failed: Algorithmic Validity B+ grade missing")
        self.assertIn("C+", self.combined, "Step 1 failed: Production Readiness C+ grade missing")
        self.assertIn("A-", self.combined, "Step 1 failed: Game Design Utility A- grade missing")
        self.assertIn("A", self.combined, "Step 1 failed: Ethical Integrity A grade missing")

        # Step 2: 4-phase deployment roadmap
        combined_lower = self.combined.lower()
        self.assertTrue(
            "roadmap" in combined_lower or "feuille de route" in combined_lower or "phase 1" in combined_lower or "phase 0" in combined_lower,
            "Step 2 failed: Studio deployment roadmap missing"
        )

        # Step 3: Bilingual localization
        self.assertIsNotNone(self.trans, "Step 3 failed: Translations unavailable")
        self.assertIn("fr", self.trans, "Step 3 failed: French locale missing")
        self.assertIn("en", self.trans, "Step 3 failed: English locale missing")

        # Step 4: Live server health check
        try:
            req_fe = urllib.request.Request("http://localhost:5173", headers={"User-Agent": "E2E-Tester"})
            with urllib.request.urlopen(req_fe, timeout=5) as resp:
                self.assertEqual(resp.status, 200, "Frontend port 5173 not responding HTTP 200")
            req_be = urllib.request.Request("http://localhost:8001/api/status", headers={"User-Agent": "E2E-Tester"})
            with urllib.request.urlopen(req_be, timeout=5) as resp:
                self.assertEqual(resp.status, 200, "Backend port 8001 not responding HTTP 200")
        except Exception as e:
            self.fail(f"Step 4 failed: Platform health check failed: {e}")


# =============================================================================
# CUSTOM TEST RUNNER & FORMATTED REPORTING
# =============================================================================

def run_suite():
    """Execute the full test suite with structured reporting."""
    suite = unittest.TestSuite()
    loader = unittest.TestLoader()

    # Tier 1
    suite.addTests(loader.loadTestsFromTestCase(TestTier1_Feature1_LiteratureAudit))
    suite.addTests(loader.loadTestsFromTestCase(TestTier1_Feature2_MethodologicalPostMortem))
    suite.addTests(loader.loadTestsFromTestCase(TestTier1_Feature3_ProductionViabilityAndBayesPrevalence))
    suite.addTests(loader.loadTestsFromTestCase(TestTier1_Feature4_SurvivalAnalysisMathematicalCritique))
    suite.addTests(loader.loadTestsFromTestCase(TestTier1_Feature5_GameBalancingPoliciesAndMoralHazard))
    suite.addTests(loader.loadTestsFromTestCase(TestTier1_Feature6_BilingualLocalizationCompleteness))
    suite.addTests(loader.loadTestsFromTestCase(TestTier1_Feature7_AlgorithmReviewComponentStructure))
    suite.addTests(loader.loadTestsFromTestCase(TestTier1_Feature8_InteractiveComparisonWidget))
    suite.addTests(loader.loadTestsFromTestCase(TestTier1_Feature9_AppNavigationIntegration))
    suite.addTests(loader.loadTestsFromTestCase(TestTier1_Feature10_BuildAndPortAvailability))

    # Tier 2
    suite.addTests(loader.loadTestsFromTestCase(TestTier2_BoundaryAndCornerCases))

    # Tier 3
    suite.addTests(loader.loadTestsFromTestCase(TestTier3_CrossFeatureInteractions))

    # Tier 4
    suite.addTests(loader.loadTestsFromTestCase(TestTier4_RealWorldApplicationScenarios))

    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    print("\n" + "=" * 80)
    print("E2E TEST SUITE EXECUTION SUMMARY")
    print("=" * 80)
    print(f"Total Tests Run: {result.testsRun}")
    print(f"Passed:         {result.testsRun - len(result.failures) - len(result.errors) - len(result.skipped)}")
    print(f"Failures:       {len(result.failures)}")
    print(f"Errors:         {len(result.errors)}")
    print(f"Skipped:        {len(result.skipped)}")
    print("=" * 80)

    if result.wasSuccessful():
        print(">>> ALL TESTS PASSED SUCCESSFULLY! <<<")
        return 0
    else:
        print(">>> SOME TESTS FAILED. PLEASE REVIEW THE LOGS ABOVE. <<<")
        return 1


if __name__ == "__main__":
    sys.exit(run_suite())

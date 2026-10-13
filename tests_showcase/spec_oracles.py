#!/usr/bin/env python3
"""
=============================================================================
Authoritative Specification Oracles & Ground Truth Contracts
Dota 2 Churn & Tilt Prediction — Public Showcase Frontend
=============================================================================
Authoritative Sources:
- ORIGINAL_REQUEST.md (§R1 through §R6, Acceptance Criteria)
- PROJECT.md (Architecture, Interface Contracts, Feature Inventory F1-F11)
- backend/data/ml_results.json & backend/data/features_list.json
- Live backend API (http://127.0.0.1:8001 / 8000)
=============================================================================
"""

import os
import re
import json
import math
import subprocess
import urllib.request
import urllib.error
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

PROJECT_ROOT = Path(__file__).resolve().parent.parent
FRONTEND_SHOWCASE_DIR = PROJECT_ROOT / "frontend_showcase"
BACKEND_DIR = PROJECT_ROOT / "backend"
ML_RESULTS_PATH = BACKEND_DIR / "data" / "ml_results.json"
FEATURES_LIST_PATH = BACKEND_DIR / "data" / "features_list.json"

# Default live backend URLs (auto-probing 8001 then 8000)
PRIMARY_API_URL = "http://127.0.0.1:8001"
SECONDARY_API_URL = "http://127.0.0.1:8000"


# =============================================================================
# 1. GROUND TRUTH ML METRICS (Authoritative Oracle from ml_results.json)
# =============================================================================
EXPECTED_ML_METRICS = {
    "dataset_size": 16981,
    "train_size": 13584,
    "test_size": 3397,
    "churn_rate_dataset": 0.4965,
    "best_model_name": "xgboost_smote",
    "best_threshold": 0.36,
    "accuracy": 0.7018,
    "precision": 0.6536,
    "recall": 0.8500,
    "f1_score": 0.7390,
    "auc_score": 0.8004,
    "pr_auc": 0.7931,
    "top_features": [
        ("avg_xpm", 0.3152),
        ("session_duration_per_game", 0.1260),
        ("party_play_pct", 0.0958),
        ("role_consistency", 0.0712),
        ("ranked_play_pct", 0.0582),
        ("match_T_is_ranked", 0.0526),
        ("rank_tier", 0.0478),
        ("avg_hero_damage", 0.0379),
        ("avg_tower_damage", 0.0280),
        ("abandon_rate", 0.0229),
    ],
    "confusion_matrix_36": {
        "tp": 1434,
        "fn": 253,
        "fp": 760,
        "tn": 950,
        "total": 3397,
    }
}


# =============================================================================
# 2. CALIBRATED PLAYER ARCHETYPES (Authoritative Spec Miner Presets)
# =============================================================================
CALIBRATED_ARCHETYPES = [
    {
        "id": "tilting_player",
        "name_fr": "Le Joueur en Tilt Aigu",
        "name_en": "The Tilting Player",
        "subtitle_fr": "Série de défaites & frustration toxique",
        "subtitle_en": "Severe loss streak & toxic frustration",
        "rank_tier": 34,
        "rank_label": "Archon IV",
        "churn_probability": 0.88,
        "risk_tier": "critical",
        "risk_level_fr": "Critique (Ragequit imminent)",
        "risk_level_en": "Critical (Imminent ragequit)",
        "features": {
            "current_streak": -5,
            "tilt_index": 4.8,
            "abandon_rate": 0.15,
            "party_play_pct": 0.0,
            "recent_avg_duration": 21.4,
            "win_rate": 0.35,
            "avg_kda": 1.45,
            "avg_gpm": 340,
            "avg_xpm": 395,
            "role_consistency": 0.30,
            "night_owl_pct": 0.65,
        },
        "drivers_count": 4,
    },
    {
        "id": "burned_out_veteran",
        "name_fr": "Le Vétéran en Burnout",
        "name_en": "The Burned-out Veteran",
        "subtitle_fr": "Haut niveau, désengagement passif",
        "subtitle_en": "High rank, passive disengagement",
        "rank_tier": 74,
        "rank_label": "Divine IV",
        "churn_probability": 0.64,
        "risk_tier": "critical",
        "risk_level_fr": "Élevé (Désengagement)",
        "risk_level_en": "High (Disengagement)",
        "features": {
            "current_streak": -1,
            "tilt_index": 0.5,
            "abandon_rate": 0.0,
            "party_play_pct": 0.10,
            "recent_avg_duration": 38.5,
            "win_rate": 0.49,
            "avg_kda": 2.80,
            "avg_gpm": 465,
            "avg_xpm": 510,
            "role_consistency": 0.45,
            "night_owl_pct": 0.20,
        },
        "drivers_count": 4,
    },
    {
        "id": "consistent_support",
        "name_fr": "Le Support Régulier",
        "name_en": "The Consistent Support",
        "subtitle_fr": "Rôle stable, résilience collective",
        "subtitle_en": "Stable role, high team resilience",
        "rank_tier": 45,
        "rank_label": "Legend V",
        "churn_probability": 0.28,
        "risk_tier": "low",
        "risk_level_fr": "Faible (Joueur Stable)",
        "risk_level_en": "Low (Stable Player)",
        "features": {
            "current_streak": 2,
            "tilt_index": 0.0,
            "abandon_rate": 0.01,
            "party_play_pct": 0.55,
            "recent_avg_duration": 41.2,
            "win_rate": 0.54,
            "avg_kda": 3.40,
            "avg_gpm": 390,
            "avg_xpm": 520,
            "role_consistency": 0.85,
            "night_owl_pct": 0.05,
        },
        "drivers_count": 4,
    },
    {
        "id": "balanced_player",
        "name_fr": "Le Joueur Équilibré",
        "name_en": "The Balanced Player",
        "subtitle_fr": "Pratique saine, forte fidélisation",
        "subtitle_en": "Healthy play habits, high retention",
        "rank_tier": 52,
        "rank_label": "Ancient II",
        "churn_probability": 0.14,
        "risk_tier": "low",
        "risk_level_fr": "Très Faible (Fidélisé)",
        "risk_level_en": "Very Low (Retained)",
        "features": {
            "current_streak": 3,
            "tilt_index": 0.0,
            "abandon_rate": 0.0,
            "party_play_pct": 0.70,
            "recent_avg_duration": 39.0,
            "win_rate": 0.58,
            "avg_kda": 3.95,
            "avg_gpm": 560,
            "avg_xpm": 640,
            "role_consistency": 0.75,
            "night_owl_pct": 0.0,
        },
        "drivers_count": 4,
    },
]


# =============================================================================
# 3. MATHEMATICAL SPECIFICATION ORACLES
# =============================================================================

def compute_tilt_index(abandons_recent: int, loss_streak: int, avg_duration: float, dpm: float) -> float:
    """
    Authoritative tilt index formula from backend/collect_data.py & spec_miner:
    tilt_score = (abandons_recent * 2)
                 + max(0, abs(loss_streak) - 2)
                 + max(0, (25 - avg_duration) * 0.1)
                 + max(0, (dpm - 0.3) * 5)
    """
    abandons_term = max(0, abandons_recent) * 2.0
    streak_term = max(0.0, float(abs(loss_streak) - 2)) if loss_streak < 0 else 0.0
    duration_term = max(0.0, (25.0 - avg_duration) * 0.1)
    dpm_term = max(0.0, (dpm - 0.3) * 5.0)
    return round(abandons_term + streak_term + duration_term + dpm_term, 2)


def compute_objective_focus(avg_tower_damage: float, avg_hero_damage: float) -> float:
    """
    Ratio distinguishing macro tower pushers from chaotic teamfight brawlers:
    objective_focus = avg_tower_damage / (avg_hero_damage + 1.0)
    """
    return round(avg_tower_damage / (avg_hero_damage + 1.0), 4)


def compute_kda(kills: float, deaths: float, assists: float) -> float:
    """
    Safe KDA ratio preventing division by zero:
    kda = (kills + assists) / max(1.0, deaths)
    """
    return round((kills + assists) / max(1.0, float(deaths)), 2)


def map_probability_to_gauge_angle(probability: float) -> float:
    """
    Maps churn probability [0.0, 1.0] to a 180-degree semicircular gauge needle:
    0.0 -> -90.0 degrees (far left)
    0.36 (threshold) -> -25.2 degrees
    0.50 -> 0.0 degrees (straight up)
    1.0 -> +90.0 degrees (far right)
    """
    clamped_prob = max(0.0, min(1.0, float(probability)))
    # Range is 180 degrees (-90 to +90)
    angle = -90.0 + (clamped_prob * 180.0)
    return round(angle, 2)


def get_risk_tier(probability: float) -> Tuple[str, str, str]:
    """
    Maps probability to risk tier, label and color code:
    < 0.36: Low (Emerald #10b981)
    0.36 - 0.60: Moderate (Amber #f59e0b)
    > 0.60: Critical (Braise/Rose #ff7a00 / #ef4444)
    """
    p = max(0.0, min(1.0, float(probability)))
    if p < 0.36:
        return "low", "Faible", "#10b981"
    elif p <= 0.60:
        return "moderate", "Modéré", "#f59e0b"
    else:
        return "critical", "Critique", "#ff7a00"


# =============================================================================
# 4. DESIGN SYSTEM TOKENS SPECIFICATION
# =============================================================================
DESIGN_SYSTEM_TOKENS = {
    "--bg-base": "#0a0b0e",
    "--bg-section": "#121316",
    "--bg-card": "#16171b",
    "--bg-card-hover": "#1c1d22",
    "--border-subtle": "#26282f",
    "--border-focus": "#ff7a00",
    "--text-primary": "#ffffff",
    "--text-secondary": "#94a3b8",
    "--text-muted": "#64748b",
    "--accent-braise": "#ff7a00",
    "--accent-amber": "#f59e0b",
    "--accent-emerald": "#10b981",
    "--accent-rose": "#ef4444",
}


# =============================================================================
# 5. TRANSLATION REQUIREMENTS & HEADLINE ORACLES
# =============================================================================
REQUIRED_TRANSLATION_KEYS = [
    # Navigation & Header
    "nav_title", "nav_tagline", "nav_simulator", "nav_features", "nav_benchmarks", "nav_architecture",
    "lang_toggle_fr", "lang_toggle_en",
    # Hero Section
    "hero_title", "hero_subtitle", "hero_cta_simulator", "hero_cta_docs", "hero_badge",
    # Executive KPIs
    "kpi_dataset_value", "kpi_dataset_label", "kpi_window_value", "kpi_window_label",
    "kpi_features_value", "kpi_features_label", "kpi_recall_value", "kpi_recall_label",
    "kpi_auc_value", "kpi_auc_label",
    # Psychology & Behavioral Features
    "psych_title", "psych_subtitle", "feat_tilt_index_name", "feat_tilt_index_desc",
    "feat_night_owl_name", "feat_night_owl_desc", "feat_objective_focus_name", "feat_objective_focus_desc",
    "feat_role_consistency_name", "feat_role_consistency_desc", "feat_gpm_trend_name", "feat_gpm_trend_desc",
    # ML Benchmark
    "ml_title", "ml_subtitle", "model_champion", "model_threshold", "roc_title", "pr_title",
    "confusion_matrix_title", "feature_importance_title",
    # Simulator & Archetypes
    "sim_title", "sim_subtitle", "sim_input_placeholder", "sim_btn_analyze", "sim_btn_loading",
    "archetype_title", "gauge_title", "drivers_title", "risk_low", "risk_moderate", "risk_critical",
    # Offline & Fallback
    "mode_offline_badge", "offline_toast",
    # Architecture
    "arch_title", "arch_step1", "arch_step2", "arch_step3", "arch_step4", "arch_step5",
    # Footer
    "footer_author", "footer_disclaimer",
]


# =============================================================================
# 6. NETWORK & BACKEND PROBING HELPERS
# =============================================================================

def probe_backend_endpoint(path: str, timeout: float = 1.5) -> Tuple[bool, Optional[Dict[str, Any]]]:
    """Attempts to fetch from 8001 then 8000; returns (is_healthy, response_dict)."""
    for base in [PRIMARY_API_URL, SECONDARY_API_URL]:
        try:
            url = f"{base}{path}"
            req = urllib.request.Request(url, headers={"User-Agent": "E2ETestSuite/1.0"})
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode("utf-8"))
                    return True, data
        except Exception:
            continue
    return False, None


def get_frontend_file_content(relative_path: str) -> str:
    """Reads content of a file inside frontend_showcase or returns empty string."""
    target = FRONTEND_SHOWCASE_DIR / relative_path
    if target.exists() and target.is_file():
        return target.read_text(encoding="utf-8", errors="replace")
    return ""


def check_security_violations(directory: Path) -> List[str]:
    """Scans files for forbidden API keys, tokens, or personal absolute paths."""
    violations = []
    if not directory.exists():
        return violations

    forbidden_patterns = [
        (re.compile(r'/Users/[a-zA-Z0-9_\-]+/', re.IGNORECASE), "Absolute macOS user path detected"),
        (re.compile(r'C:\\[Uu]sers\\[a-zA-Z0-9_\-]+\\', re.IGNORECASE), "Absolute Windows user path detected"),
        (re.compile(r'api_key\s*=\s*["\'][a-zA-Z0-9_\-]{20,}["\']', re.IGNORECASE), "Hardcoded API key detected"),
        (re.compile(r'AIzaSy[a-zA-Z0-9_\-]{30,}', re.IGNORECASE), "Google/Firebase API key detected"),
    ]

    for p in directory.rglob("*"):
        if p.is_file() and not p.name.startswith(".") and not "node_modules" in p.parts:
            # Skip binary assets
            if p.suffix.lower() in [".png", ".jpg", ".jpeg", ".ico", ".svg", ".lock"]:
                continue
            try:
                content = p.read_text(encoding="utf-8", errors="ignore")
                for pattern, msg in forbidden_patterns:
                    if pattern.search(content):
                        violations.append(f"{p.name}: {msg}")
            except Exception:
                pass

    return violations

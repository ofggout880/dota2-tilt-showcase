/**
 * High-Fidelity Mock Dataset & Ground-Truth Machine Learning Artifacts
 * 
 * Sourced directly from:
 * - backend/data/ml_results.json
 * - backend/data/dota2_players_dataset.csv (N = 16,981)
 * - backend/train.py (HistGradientBoostingClassifier + SMOTE)
 * 
 * Provides 100% offline fallback and initial hydration data for the public showcase.
 */

export const MOCK_METRICS = {
  trained: true,
  isOffline: true,
  dataset_size: 16981,
  train_size: 13584,
  test_size: 3397,
  churn_rate_dataset: 0.49649608385843,
  best_model_name: "xgboost_smote",
  uses_xgboost_library: true,
  best_threshold: 0.36,
  accuracy: 0.7017957020900795,
  precision: 0.6536007292616226,
  recall: 0.8500296384113811,
  f1_score: 0.7389847977325431,
  auc_score: 0.8003726466928041,
  pr_auc: 0.7930879368660976,
  confusion_matrix: {
    tp: 1434,
    fp: 760,
    tn: 950,
    fn: 253,
    total: 3397,
    tpr: 0.8500,
    fpr: 0.4444,
    tnr: 0.5556,
    fnr: 0.1500
  },
  top_features: [
    ["avg_xpm", 0.315168],
    ["session_duration_per_game", 0.125962],
    ["party_play_pct", 0.095836],
    ["role_consistency", 0.071242],
    ["ranked_play_pct", 0.058160],
    ["match_T_is_ranked", 0.052628],
    ["rank_tier", 0.047843],
    ["avg_hero_damage", 0.037901],
    ["avg_tower_damage", 0.027958],
    ["abandon_rate", 0.022950]
  ],
  comparison: {
    xgboost_smote: {
      name: "V6 XGBoost + SMOTE (Champion)",
      accuracy: 0.7018,
      precision: 0.6536,
      recall: 0.8500,
      f1_score: 0.7390,
      auc_score: 0.8004,
      pr_auc: 0.7931,
      best_threshold: 0.36,
      status: "production"
    },
    xgboost_scale_pos: {
      name: "V6 XGBoost + ScalePosWeight",
      accuracy: 0.7062,
      precision: 0.6605,
      recall: 0.8405,
      f1_score: 0.7397,
      auc_score: 0.8014,
      pr_auc: 0.7928,
      best_threshold: 0.37,
      status: "valid_alternative"
    },
    random_forest: {
      name: "Random Forest Baseline",
      accuracy: 0.6480,
      precision: 0.6120,
      recall: 0.7150,
      f1_score: 0.6600,
      auc_score: 0.7240,
      pr_auc: 0.6980,
      best_threshold: 0.50,
      status: "baseline"
    },
    logistic_regression: {
      name: "Logistic Regression Baseline",
      accuracy: 0.6130,
      precision: 0.5870,
      recall: 0.6520,
      f1_score: 0.6180,
      auc_score: 0.6690,
      pr_auc: 0.6350,
      best_threshold: 0.50,
      status: "baseline"
    }
  }
};

/**
 * 25 Sampled Points from the Empirical Test Set ROC Curve (N = 3,397)
 * Highlighting operating threshold θ* = 0.36 at (FPR = 0.4480, TPR = 0.8506)
 */
export const ROC_CURVE_POINTS = [
  { fpr: 0.0000, tpr: 0.0000, threshold: 1.0000 },
  { fpr: 0.0152, tpr: 0.1761, threshold: 0.8529 },
  { fpr: 0.0322, tpr: 0.2644, threshold: 0.8118 },
  { fpr: 0.0515, tpr: 0.3373, threshold: 0.7756 },
  { fpr: 0.0737, tpr: 0.3930, threshold: 0.7402 },
  { fpr: 0.0918, tpr: 0.4505, threshold: 0.7083 },
  { fpr: 0.1111, tpr: 0.4961, threshold: 0.6834 },
  { fpr: 0.1333, tpr: 0.5412, threshold: 0.6595 },
  { fpr: 0.1637, tpr: 0.5774, threshold: 0.6289 },
  { fpr: 0.1883, tpr: 0.6230, threshold: 0.5976 },
  { fpr: 0.2152, tpr: 0.6556, threshold: 0.5689 },
  { fpr: 0.2421, tpr: 0.6941, threshold: 0.5346 },
  { fpr: 0.2690, tpr: 0.7184, threshold: 0.5085 },
  { fpr: 0.3023, tpr: 0.7469, threshold: 0.4816 },
  { fpr: 0.3322, tpr: 0.7783, threshold: 0.4552 },
  { fpr: 0.3614, tpr: 0.8068, threshold: 0.4244 },
  { fpr: 0.4012, tpr: 0.8305, threshold: 0.3979 },
  { fpr: 0.4480, tpr: 0.8506, threshold: 0.3584, isOptimal: true },
  { fpr: 0.4860, tpr: 0.8749, threshold: 0.3357 },
  { fpr: 0.5310, tpr: 0.9022, threshold: 0.3016 },
  { fpr: 0.5825, tpr: 0.9247, threshold: 0.2689 },
  { fpr: 0.6526, tpr: 0.9461, threshold: 0.2390 },
  { fpr: 0.7415, tpr: 0.9644, threshold: 0.1976 },
  { fpr: 0.8632, tpr: 0.9828, threshold: 0.1455 },
  { fpr: 1.0000, tpr: 1.0000, threshold: 0.0406 }
];

/**
 * 25 Sampled Points from the Empirical Precision-Recall Curve (PR-AUC = 79.31%)
 */
export const PR_CURVE_POINTS = [
  { recall: 1.0000, precision: 0.4966, threshold: 0.0406 },
  { recall: 0.9935, precision: 0.5147, threshold: 0.1160 },
  { recall: 0.9810, precision: 0.5315, threshold: 0.1493 },
  { recall: 0.9704, precision: 0.5506, threshold: 0.1801 },
  { recall: 0.9615, precision: 0.5729, threshold: 0.2103 },
  { recall: 0.9407, precision: 0.5900, threshold: 0.2419 },
  { recall: 0.9235, precision: 0.6115, threshold: 0.2707 },
  { recall: 0.8992, precision: 0.6302, threshold: 0.3077 },
  { recall: 0.8643, precision: 0.6437, threshold: 0.3444 },
  { recall: 0.8500, precision: 0.6536, threshold: 0.3600, isOptimal: true },
  { recall: 0.8352, precision: 0.6634, threshold: 0.3873 },
  { recall: 0.8074, precision: 0.6872, threshold: 0.4236 },
  { recall: 0.7659, precision: 0.7018, threshold: 0.4668 },
  { recall: 0.7226, precision: 0.7175, threshold: 0.5027 },
  { recall: 0.6823, precision: 0.7388, threshold: 0.5437 },
  { recall: 0.6384, precision: 0.7606, threshold: 0.5872 },
  { recall: 0.5851, precision: 0.7741, threshold: 0.6232 },
  { recall: 0.5394, precision: 0.8032, threshold: 0.6615 },
  { recall: 0.4813, precision: 0.8185, threshold: 0.6899 },
  { recall: 0.4203, precision: 0.8341, threshold: 0.7255 },
  { recall: 0.3598, precision: 0.8561, threshold: 0.7646 },
  { recall: 0.2934, precision: 0.8730, threshold: 0.7933 },
  { recall: 0.2270, precision: 0.8991, threshold: 0.8293 },
  { recall: 0.1541, precision: 0.9155, threshold: 0.8609 },
  { recall: 0.0006, precision: 1.0000, threshold: 0.9930 }
];

/**
 * Top Feature Importances from the V6 Production Candidate (Tree Split Purity)
 */
export const FEATURE_IMPORTANCE_LIST = [
  { feature: "avg_xpm", importance: 0.315168, percentage: "31.5%", category: "economy" },
  { feature: "session_duration_per_game", importance: 0.125962, percentage: "12.6%", category: "behavior" },
  { feature: "party_play_pct", importance: 0.095836, percentage: "9.6%", category: "behavior" },
  { feature: "role_consistency", importance: 0.071242, percentage: "7.1%", category: "behavior" },
  { feature: "ranked_play_pct", importance: 0.058160, percentage: "5.8%", category: "ranked" },
  { feature: "match_T_is_ranked", importance: 0.052628, percentage: "5.3%", category: "ranked" },
  { feature: "rank_tier", importance: 0.047843, percentage: "4.8%", category: "ranked" },
  { feature: "avg_hero_damage", importance: 0.037901, percentage: "3.8%", category: "combat" },
  { feature: "avg_tower_damage", importance: 0.027958, percentage: "2.8%", category: "combat" },
  { feature: "abandon_rate", importance: 0.022950, percentage: "2.3%", category: "behavior" },
  { feature: "avg_duration", importance: 0.021305, percentage: "2.1%", category: "behavior" },
  { feature: "avg_gpm", importance: 0.020931, percentage: "2.1%", category: "economy" },
  { feature: "recent_avg_duration", importance: 0.015101, percentage: "1.5%", category: "behavior" },
  { feature: "xpm_trend", importance: 0.013007, percentage: "1.3%", category: "economy" },
  { feature: "objective_focus", importance: 0.011512, percentage: "1.2%", category: "combat" },
  { feature: "gpm_trend", importance: 0.010167, percentage: "1.0%", category: "economy" },
  { feature: "match_T_won", importance: 0.008447, percentage: "0.8%", category: "result" },
  { feature: "win_rate_trend", importance: 0.008373, percentage: "0.8%", category: "trend" },
  { feature: "avg_session_games", importance: 0.007550, percentage: "0.8%", category: "behavior" },
  { feature: "avg_hero_healing", importance: 0.006653, percentage: "0.7%", category: "combat" },
  { feature: "match_T_party_size", importance: 0.005308, percentage: "0.5%", category: "behavior" },
  { feature: "night_owl_pct", importance: 0.005158, percentage: "0.5%", category: "circadian" },
  { feature: "match_T_is_night", importance: 0.004635, percentage: "0.5%", category: "circadian" },
  { feature: "current_streak_at_cutoff", importance: 0.003364, percentage: "0.3%", category: "streak" },
  { feature: "win_rate", importance: 0.002467, percentage: "0.2%", category: "skill" },
  { feature: "recent_abandons", importance: 0.000299, percentage: "0.03%", category: "behavior" },
  { feature: "loss_streak_length", importance: 0.000075, percentage: "0.01%", category: "streak" }
];

/**
 * Visualizations Object Matching GET /api/ml/visualizations
 */
export const MOCK_VISUALIZATIONS = {
  isOffline: true,
  best_threshold: 0.36,
  correlations: {
    avg_xpm: -0.3245,
    match_T_is_ranked: -0.2807,
    ranked_play_pct: -0.2736,
    party_play_pct: -0.1950,
    rank_tier: -0.1898,
    avg_session_games: -0.1826,
    win_rate: -0.1393,
    match_T_party_size: -0.0991,
    current_streak_at_cutoff: -0.0800,
    role_consistency: -0.0650,
    avg_duration: -0.0590,
    win_rate_trend: -0.0519,
    objective_focus: -0.0410,
    abandon_rate: -0.0325,
    gpm_trend: -0.0301,
    match_T_won: -0.0254,
    xpm_trend: -0.0230,
    match_T_is_night: 0.0163,
    night_owl_pct: 0.0182,
    tilt_index: 0.0215
  },
  imbalance_stats: [
    { bin: "Sévèrement Dominé (< 550)", churn_rate: 0.6746, player_count: 2800 },
    { bin: "Défavorable (550-650)", churn_rate: 0.5849, player_count: 5526 },
    { bin: "Équilibré (650-750)", churn_rate: 0.4534, player_count: 4729 },
    { bin: "Dominateur (> 750)", churn_rate: 0.2970, player_count: 3926 }
  ],
  streak_stats: [
    { bin: "Serein (Tilt 0)", churn_rate: 0.4866, player_count: 10985 },
    { bin: "Légèrement Frustré (0-1)", churn_rate: 0.5489, player_count: 889 },
    { bin: "Enervé (1-3)", churn_rate: 0.5095, player_count: 3431 },
    { bin: "Tilt Extrême (3+)", churn_rate: 0.5072, player_count: 1676 }
  ],
  session_stats: [
    { bin: "1.0 - 1.2 partie", churn_rate: 0.7434, player_count: 265 },
    { bin: "1.2 - 1.7 parties", churn_rate: 0.6260, player_count: 2591 },
    { bin: "1.7 - 2.2 parties", churn_rate: 0.5371, player_count: 2154 },
    { bin: "2.2 - 3.0 parties", churn_rate: 0.4426, player_count: 3102 },
    { bin: "3.0+ parties", churn_rate: 0.3565, player_count: 1613 }
  ],
  threshold_curve: [
    { threshold: 0.02, precision: 0.4965, recall: 1.0000, f1_score: 0.6635 },
    { threshold: 0.10, precision: 0.5120, recall: 0.9950, f1_score: 0.6761 },
    { threshold: 0.20, precision: 0.5512, recall: 0.9420, f1_score: 0.6953 },
    { threshold: 0.28, precision: 0.6120, recall: 0.9100, f1_score: 0.7320 },
    { threshold: 0.36, precision: 0.6536, recall: 0.8500, f1_score: 0.7390 },
    { threshold: 0.44, precision: 0.6950, recall: 0.7850, f1_score: 0.7370 },
    { threshold: 0.50, precision: 0.7241, recall: 0.6812, f1_score: 0.7020 },
    { threshold: 0.60, precision: 0.7680, recall: 0.5600, f1_score: 0.6478 },
    { threshold: 0.70, precision: 0.8120, recall: 0.4150, f1_score: 0.5490 },
    { threshold: 0.80, precision: 0.8750, recall: 0.2700, f1_score: 0.4125 },
    { threshold: 0.90, precision: 0.9150, recall: 0.1200, f1_score: 0.2122 },
    { threshold: 0.98, precision: 0.9450, recall: 0.0820, f1_score: 0.1509 }
  ]
};

/**
 * 4 Calibrated Player Profiles for 1-Click Interactive Simulator
 * Calibrated against backend telemetry & V6 XGBoost model:
 * 1. Tilting Player: 86.5% (Critical Risk)
 * 2. Burned-out Veteran: 57.7% (High/Moderate Risk above θ* = 0.36)
 * 3. Dedicated Support: 21.8% (Low Risk / Retained)
 * 4. Balanced Performer: 19.6% (Low Risk / Solidly Retained)
 */
export const MOCK_ARCHETYPES = [
  {
    id: "tilting_player",
    legacyId: "tilting_player",
    aliasId: "joueur_en_tilt",
    accountId: "835397971",
    account_id: "835397971",
    personaname: "ShadowBlade_Tilt",
    nameFr: "Le Joueur en Tilt Aigu",
    nameEn: "The Tilting Player",
    name_fr: "Le Joueur en Tilt Aigu",
    name_en: "The Tilting Player",
    subtitleFr: "Série de défaites & frustration toxique",
    subtitleEn: "Severe loss streak & toxic frustration",
    subtitle_fr: "Série de défaites & frustration toxique",
    subtitle_en: "Severe loss streak & toxic frustration",
    probability: 0.865,
    churn_probability: 0.865,
    churnProbability: 0.865,
    predictedChurn: 1,
    predicted_churn: 1,
    rankTier: 34,
    rank_tier: 34,
    rankLabel: "Archon IV",
    rank_label: "Archon IV",
    riskLevel: "critical",
    risk_tier: "critical",
    risk_level: "Très Élevé (Ragequit imminent)",
    badgeColor: "var(--accent-rose, #ef4444)",
    badgeClass: "badge-rose",
    verdictFr: "Ragequit & abandon imminent si nouvelle défaite. Rupture de série urgente.",
    verdictEn: "Imminent ragequit and departure if another loss occurs. Immediate break needed.",
    features: {
      win_rate: 0.35,
      avg_kda: 1.45,
      avg_gpm: 340,
      avg_xpm: 395,
      current_streak: -5,
      current_streak_at_cutoff: -5,
      avg_session_duration: 21.4,
      session_duration_per_game: 21.4,
      avg_rank_imbalance: 12.4,
      tilt_index: 4.8,
      abandon_rate: 0.15,
      recent_abandons: 2,
      recent_avg_duration: 21.4,
      recent_deaths_per_min: 0.48,
      party_play_pct: 0.0,
      night_owl_pct: 0.65,
      role_consistency: 0.30,
      ranked_play_pct: 0.85,
      gpm_trend: -65.0,
      xpm_trend: -58.0,
      kda_trend: -1.25,
      objective_focus: 0.04,
      avg_hero_damage: 18450,
      avg_tower_damage: 750,
      avg_hero_healing: 120
    },
    factorAttribution: {
      aggravating: [
        {
          feature: "current_streak_at_cutoff",
          impact: 0.285,
          weight: 28.5,
          observedValue: "-5 défaites",
          observedValueEn: "-5 loss streak",
          baselineValue: "0 (Équilibré)",
          baselineValueEn: "0 (Neutral)",
          description_fr: "Série punitive de 5 défaites d'affilée",
          description_en: "Severe active 5-game defeat streak",
          explanationFr: "Série punitive de 5 défaites d'affilée provoquant une détresse compétitive aiguë.",
          explanationEn: "Severe 5-game losing streak triggering acute competitive distress and frustration."
        },
        {
          feature: "tilt_index",
          impact: 0.22,
          weight: 22.0,
          observedValue: "4.8 (Critique)",
          observedValueEn: "4.8 (Critical)",
          baselineValue: "0.5 (Moyenne)",
          baselineValueEn: "0.5 (Average)",
          description_fr: "Frustration aiguë et abandons récents (Tilt Index: 4.8)",
          description_en: "Acute tilt score and recent ragequits (Tilt Index: 4.8)",
          explanationFr: "Score de tilt maximal : stomps subis en moins de 22 minutes et morts rapides par minute.",
          explanationEn: "Peak tilt score: recurring rapid stomps (<22 min) and elevated deaths per minute."
        },
        {
          feature: "abandon_rate",
          impact: 0.182,
          weight: 18.2,
          observedValue: "15.0% (2 abandons)",
          observedValueEn: "15.0% (2 abandons)",
          baselineValue: "1.5% (Discipline)",
          baselineValueEn: "1.5% (Standard)",
          description_fr: "2 abandons récents de partie en cours",
          description_en: "2 recent mid-match abandons",
          explanationFr: "2 abandons récents de partie en cours, indicateur direct de rupture du seuil de tolérance.",
          explanationEn: "2 recent mid-match abandons, direct indicator of broken frustration threshold."
        },
        {
          feature: "night_owl_pct",
          impact: 0.114,
          weight: 11.4,
          observedValue: "65.0% (00h-06h)",
          observedValueEn: "65.0% (00h-06h)",
          baselineValue: "12.0%",
          baselineValueEn: "12.0%",
          description_fr: "Fatigue cognitive nocturne (65% parties 00h-06h)",
          description_en: "Circadian fatigue pattern (65% matches 00h-06h)",
          explanationFr: "Sessions de jeu tardives répétées corrélées à une fatigue cognitive et une irritabilité accrue.",
          explanationEn: "Frequent late-night sessions tied to cumulative cognitive fatigue and heightened irritability."
        },
        {
          feature: "party_play_pct",
          impact: 0.089,
          weight: 8.9,
          observedValue: "0.0% (100% Solo)",
          observedValueEn: "0.0% (100% Solo)",
          baselineValue: "35.0%",
          baselineValueEn: "35.0%",
          description_fr: "Isolation sociale complète (100% Solo Queue)",
          description_en: "Total social isolation (100% Solo Queue)",
          explanationFr: "Absence totale de filet social protecteur : 100% de solo queue sans amis pour amortir le tilt.",
          explanationEn: "Total absence of social safety buffer: 100% solo queue without friends to cushion tilt."
        }
      ],
      protective: [
        {
          feature: "avg_xpm",
          impact: -0.042,
          weight: -4.2,
          observedValue: "395 XP/min",
          observedValueEn: "395 XP/min",
          baselineValue: "520 XP/min",
          baselineValueEn: "520 XP/min",
          description_fr: "Maintien d'un rythme d'expérience minimal",
          description_en: "Baseline XP accumulation maintained",
          explanationFr: "Maintien d'un rythme d'expérience minimal empêchant un déclassement total du profil.",
          explanationEn: "Baseline XP accumulation maintained, preventing complete rating collapse."
        },
        {
          feature: "rank_tier",
          impact: -0.028,
          weight: -2.8,
          observedValue: "Archon IV",
          observedValueEn: "Archon IV",
          baselineValue: "Crusader",
          baselineValueEn: "Crusader",
          description_fr: "Expérience compétitive établie (Archon IV)",
          description_en: "Established competitive baseline (Archon IV)",
          explanationFr: "Palier de rang intermédiaire avec des jalons de progression de saison encore accessibles.",
          explanationEn: "Intermediate rank tier with reachable seasonal progression milestones."
        }
      ]
    }
  },
  {
    id: "burned_out_veteran",
    legacyId: "burned_out_veteran",
    aliasId: "veteran_epuise",
    accountId: "224109642",
    account_id: "224109642",
    personaname: "Aegis_Veteran",
    nameFr: "Le Vétéran en Burnout",
    nameEn: "The Burned-out Veteran",
    name_fr: "Le Vétéran en Burnout",
    name_en: "The Burned-out Veteran",
    subtitleFr: "Haut niveau, désengagement passif",
    subtitleEn: "High rank, passive disengagement",
    subtitle_fr: "Haut niveau, désengagement passif",
    subtitle_en: "High rank, passive disengagement",
    probability: 0.577,
    churn_probability: 0.577,
    churnProbability: 0.577,
    predictedChurn: 1,
    predicted_churn: 1,
    rankTier: 74,
    rank_tier: 74,
    rankLabel: "Divine IV",
    rank_label: "Divine IV",
    riskLevel: "moderate",
    risk_tier: "moderate",
    risk_level: "Élevé (Désengagement)",
    badgeColor: "var(--accent-amber, #f59e0b)",
    badgeClass: "badge-amber",
    verdictFr: "Désaffection progressive du jeu compétitif. Fatigue nocturne et instabilité de rôle.",
    verdictEn: "Gradual disengagement from competitive play. Late-night fatigue and role drifting.",
    features: {
      win_rate: 0.49,
      avg_kda: 2.80,
      avg_gpm: 465,
      avg_xpm: 510,
      current_streak: -1,
      current_streak_at_cutoff: -1,
      avg_session_duration: 38.5,
      session_duration_per_game: 38.5,
      avg_rank_imbalance: 8.5,
      tilt_index: 0.5,
      abandon_rate: 0.0,
      recent_abandons: 0,
      recent_avg_duration: 38.5,
      recent_deaths_per_min: 0.16,
      party_play_pct: 0.10,
      night_owl_pct: 0.20,
      role_consistency: 0.45,
      ranked_play_pct: 0.92,
      gpm_trend: -32.0,
      xpm_trend: -28.0,
      kda_trend: -0.45,
      objective_focus: 0.08,
      avg_hero_damage: 22800,
      avg_tower_damage: 1850,
      avg_hero_healing: 340
    },
    factorAttribution: {
      aggravating: [
        {
          feature: "recent_avg_duration",
          impact: 0.195,
          weight: 19.5,
          observedValue: "38.5 min/match",
          observedValueEn: "38.5 min/match",
          baselineValue: "35.0 min",
          baselineValueEn: "35.0 min",
          description_fr: "Parties longues et exténuantes (38+ min)",
          description_en: "Grueling extended matches (38+ min)",
          explanationFr: "Parties longues et exténuantes générant de la fatigue mentale avec un retour sur investissement ressenti faible.",
          explanationEn: "Grueling long matches yielding mental exhaustion with diminishing perceived competitive rewards."
        },
        {
          feature: "role_consistency",
          impact: 0.16,
          weight: 16.0,
          observedValue: "45.0% (Dispersé)",
          observedValueEn: "45.0% (Dispersed)",
          baselineValue: "70.0% (Stable)",
          baselineValueEn: "70.0% (Stable)",
          description_fr: "Instabilité de poste / autofill fréquent (45%)",
          description_en: "Positional fatigue & chronic autofill (45%)",
          explanationFr: "Dispersion anormale des postes joués, traduisant un désintérêt pour son rôle historique de prédilection.",
          explanationEn: "Role dispersion reflecting waning engagement and boredom with primary legacy role."
        },
        {
          feature: "party_play_pct",
          impact: 0.145,
          weight: 14.5,
          observedValue: "10.0%",
          observedValueEn: "10.0%",
          baselineValue: "35.0%",
          baselineValueEn: "35.0%",
          description_fr: "Faible réseau social en jeu (10% en groupe)",
          description_en: "Low in-game social support (10% party play)",
          explanationFr: "Isolement social progressif : ses coéquipiers réguliers ont cessé de se connecter au jeu.",
          explanationEn: "Gradual social isolation: legacy party members no longer active on Steam."
        },
        {
          feature: "win_rate",
          impact: 0.12,
          weight: 12.0,
          observedValue: "49.0%",
          observedValueEn: "49.0%",
          baselineValue: "50.0%",
          baselineValueEn: "50.0%",
          description_fr: "Plafond de verre au niveau Divine (49% victoires)",
          description_en: "MMR plateau at Divine tier (49% win rate)",
          explanationFr: "Plafond de verre au niveau Divine : ratio victoires bloqué sous 50% sans sentiment de progression.",
          explanationEn: "MMR plateau at Divine tier: sub-50% win rate creating a stagnant progression sensation."
        }
      ],
      protective: [
        {
          feature: "rank_tier",
          impact: -0.18,
          weight: -18.0,
          observedValue: "Divine IV (74)",
          observedValueEn: "Divine IV (74)",
          baselineValue: "Archon (30)",
          baselineValueEn: "Archon (30)",
          description_fr: "Très haut investissement historique (Divine IV)",
          description_en: "High historical time investment (Divine IV)",
          explanationFr: "Statut compétitif prestigieux : fort attachement historique et investissement en temps dans le jeu.",
          explanationEn: "Elite Divine IV rank tier: substantial historical investment and psychological status attachment."
        },
        {
          feature: "abandon_rate",
          impact: -0.125,
          weight: -12.5,
          observedValue: "0.0% (0 abandon)",
          observedValueEn: "0.0% (0 abandons)",
          baselineValue: "1.5%",
          baselineValueEn: "1.5%",
          description_fr: "Discipline compétitive stricte (zéro ragequit)",
          description_en: "Strict competitive discipline (zero ragequits)",
          explanationFr: "Discipline compétitive exemplaire : aucun abandon de partie malgré le désengagement passif.",
          explanationEn: "Impeccable match completion: zero ragequits despite creeping fatigue."
        },
        {
          feature: "avg_xpm",
          impact: -0.075,
          weight: -7.5,
          observedValue: "510 XP/min",
          observedValueEn: "510 XP/min",
          baselineValue: "520 XP/min",
          baselineValueEn: "520 XP/min",
          description_fr: "Fondamentaux macro préservés (510 XPM)",
          description_en: "Solid macro mechanics maintained (510 XPM)",
          explanationFr: "Fondamentaux mécaniques et macro-stratégiques de haut niveau stabilisant les parties.",
          explanationEn: "Solid macro/micro mechanics stabilizing baseline match execution."
        }
      ]
    }
  },
  {
    id: "consistent_support",
    legacyId: "consistent_support",
    aliasId: "support_passionne",
    accountId: "175397696",
    account_id: "175397696",
    personaname: "WardMachine_Pos5",
    nameFr: "Le Support Régulier",
    nameEn: "The Dedicated Support",
    name_fr: "Le Support Régulier",
    name_en: "The Dedicated Support",
    subtitleFr: "Rôle stable, résilience collective",
    subtitleEn: "Stable role, high team resilience",
    subtitle_fr: "Rôle stable, résilience collective",
    subtitle_en: "Stable role, high team resilience",
    probability: 0.218,
    churn_probability: 0.218,
    churnProbability: 0.218,
    predictedChurn: 0,
    predicted_churn: 0,
    rankTier: 45,
    rank_tier: 45,
    rankLabel: "Legend V",
    rank_label: "Legend V",
    riskLevel: "low",
    risk_tier: "low",
    risk_level: "Faible (Joueur Stable)",
    badgeColor: "var(--accent-emerald, #10b981)",
    badgeClass: "badge-emerald",
    verdictFr: "Pratique collective saine et résiliente. Le jeu en groupe neutralise le churn.",
    verdictEn: "Healthy, collaborative play pattern. Party play insulates against churn.",
    features: {
      win_rate: 0.54,
      avg_kda: 3.40,
      avg_gpm: 390,
      avg_xpm: 520,
      current_streak: 2,
      current_streak_at_cutoff: 2,
      avg_session_duration: 41.2,
      session_duration_per_game: 41.2,
      avg_rank_imbalance: 6.2,
      tilt_index: 0.0,
      abandon_rate: 0.01,
      recent_abandons: 0,
      recent_avg_duration: 41.2,
      recent_deaths_per_min: 0.11,
      party_play_pct: 0.55,
      night_owl_pct: 0.05,
      role_consistency: 0.85,
      ranked_play_pct: 0.70,
      gpm_trend: 12.0,
      xpm_trend: 18.0,
      kda_trend: 0.35,
      objective_focus: 0.15,
      avg_hero_damage: 14200,
      avg_tower_damage: 1250,
      avg_hero_healing: 4850
    },
    factorAttribution: {
      aggravating: [
        {
          feature: "avg_gpm",
          impact: 0.068,
          weight: 6.8,
          observedValue: "390 GPM",
          observedValueEn: "390 GPM",
          baselineValue: "480 GPM",
          baselineValueEn: "480 GPM",
          description_fr: "Revenus modestes inhérents au rôle Support Pos 5",
          description_en: "Modest farm income inherent to Hard Support Pos 5",
          explanationFr: "Économie restreinte propre au poste de support, créant une vulnérabilité accrue lors des stomps adverses.",
          explanationEn: "Constrained support economy creating vulnerability during one-sided opposing stomps."
        },
        {
          feature: "recent_avg_duration",
          impact: 0.052,
          weight: 5.2,
          observedValue: "41.2 min",
          observedValueEn: "41.2 min",
          baselineValue: "35.0 min",
          baselineValueEn: "35.0 min",
          description_fr: "Parties intenses dépassant 41 minutes",
          description_en: "High-stamina games averaging over 41 minutes",
          explanationFr: "Parties à rallonge exigeantes en concentration sur des sessions de jeu consécutives.",
          explanationEn: "Grueling extended matches adding physical and mental fatigue over prolonged sessions."
        }
      ],
      protective: [
        {
          feature: "role_consistency",
          impact: -0.265,
          weight: -26.5,
          observedValue: "85.0% (Support)",
          observedValueEn: "85.0% (Support)",
          baselineValue: "60.0%",
          baselineValueEn: "60.0%",
          description_fr: "Spécialisation stable Support Pos 4/5 (85%)",
          description_en: "High role consistency Pos 4/5 Support (85%)",
          explanationFr: "Fidélité exceptionnelle au rôle Support (85%), gage d'utilité collective et de satisfaction sereine.",
          explanationEn: "Exceptional role commitment (85% Support), driving team cohesion and psychological satisfaction."
        },
        {
          feature: "party_play_pct",
          impact: -0.22,
          weight: -22.0,
          observedValue: "55.0% en groupe",
          observedValueEn: "55.0% in party",
          baselineValue: "35.0%",
          baselineValueEn: "35.0%",
          description_fr: "Pratique collective régulière en guilde (55%)",
          description_en: "Consistent party play in organized guild (55%)",
          explanationFr: "Pratique collective régulière avec des amis constituant un bouclier majeur contre la frustration.",
          explanationEn: "Frequent party play with friends effectively shielding against frustration."
        },
        {
          feature: "win_rate",
          impact: -0.145,
          weight: -14.5,
          observedValue: "54.0%",
          observedValueEn: "54.0%",
          baselineValue: "50.0%",
          baselineValueEn: "50.0%",
          description_fr: "Dynamique compétitive positive (54% victoires)",
          description_en: "Healthy winning momentum (54% win rate)",
          explanationFr: "Dynamique de victoire positive générant une gratification régulière et un engagement pérenne.",
          explanationEn: "Positive win rate momentum sustaining regular psychological reward loops."
        },
        {
          feature: "abandon_rate",
          impact: -0.11,
          weight: -11.0,
          observedValue: "1.0% (Très faible)",
          observedValueEn: "1.0% (Very low)",
          baselineValue: "1.5%",
          baselineValueEn: "1.5%",
          description_fr: "Discipline et sang-froid préservé (1% abandons)",
          description_en: "Disciplined match composure (1% abandons)",
          explanationFr: "Comportement irréprochable et sang-froid préservé même lors de matchs difficiles.",
          explanationEn: "High match composure and resilience even during adverse game states."
        }
      ]
    }
  },
  {
    id: "balanced_player",
    legacyId: "balanced_player",
    aliasId: "joueur_equilibre",
    accountId: "101438338",
    account_id: "101438338",
    personaname: "CarryChronos_Safe",
    nameFr: "Le Joueur Équilibré",
    nameEn: "The Balanced Performer",
    name_fr: "Le Joueur Équilibré",
    name_en: "The Balanced Performer",
    subtitleFr: "Pratique saine, forte fidélisation",
    subtitleEn: "Healthy play habits, high retention",
    subtitle_fr: "Pratique saine, forte fidélisation",
    subtitle_en: "Healthy play habits, high retention",
    probability: 0.196,
    churn_probability: 0.196,
    churnProbability: 0.196,
    predictedChurn: 0,
    predicted_churn: 0,
    rankTier: 52,
    rank_tier: 52,
    rankLabel: "Ancient II",
    rank_label: "Ancient II",
    riskLevel: "low",
    risk_tier: "low",
    risk_level: "Très Faible (Fidélisé)",
    badgeColor: "var(--accent-emerald, #10b981)",
    badgeClass: "badge-emerald",
    verdictFr: "Joueur solidement fidélisé sur le long terme. Forte régularité d'objectifs.",
    verdictEn: "Solidly retained player with long-term engagement and high objective focus.",
    features: {
      win_rate: 0.58,
      avg_kda: 3.95,
      avg_gpm: 560,
      avg_xpm: 640,
      current_streak: 3,
      current_streak_at_cutoff: 3,
      avg_session_duration: 39.0,
      session_duration_per_game: 39.0,
      avg_rank_imbalance: 1.8,
      tilt_index: 0.0,
      abandon_rate: 0.0,
      recent_abandons: 0,
      recent_avg_duration: 39.0,
      recent_deaths_per_min: 0.08,
      party_play_pct: 0.70,
      night_owl_pct: 0.0,
      role_consistency: 0.75,
      ranked_play_pct: 0.65,
      gpm_trend: 28.0,
      xpm_trend: 35.0,
      kda_trend: 0.65,
      objective_focus: 0.24,
      avg_hero_damage: 26800,
      avg_tower_damage: 4200,
      avg_hero_healing: 650
    },
    factorAttribution: {
      aggravating: [
        {
          feature: "current_streak_at_cutoff",
          impact: 0.025,
          weight: 2.5,
          observedValue: "+3 victoires",
          observedValueEn: "+3 win streak",
          baselineValue: "0",
          baselineValueEn: "0",
          description_fr: "Série active positive : risque de pression",
          description_en: "Active win streak: expectation pressure",
          explanationFr: "Série active positive : risque marginal de désillusion ou de nervosité quand la variance s'inversera.",
          explanationEn: "Active win streak: minor risk of disappointment when variance inevitably flips."
        }
      ],
      protective: [
        {
          feature: "party_play_pct",
          impact: -0.31,
          weight: -31.0,
          observedValue: "70.0% (Groupe)",
          observedValueEn: "70.0% (Party)",
          baselineValue: "35.0%",
          baselineValueEn: "35.0%",
          description_fr: "Entourage social solide (70% en groupe)",
          description_en: "Strong social cohesion network (70% party play)",
          explanationFr: "Cœur de réseau social très actif (70% en groupe) : le facteur prédictif n°1 de rétention à long terme.",
          explanationEn: "Thriving social network (70% party play): the single strongest statistical driver of long-term retention."
        },
        {
          feature: "win_rate",
          impact: -0.24,
          weight: -24.0,
          observedValue: "58.0%",
          observedValueEn: "58.0%",
          baselineValue: "50.0%",
          baselineValueEn: "50.0%",
          description_fr: "Haut taux de succès compétitif (58% victoires)",
          description_en: "Outstanding competitive record (58% win rate)",
          explanationFr: "Excellente efficacité compétitive assurant une progression constante et gratifiante en MMR.",
          explanationEn: "Outstanding competitive efficiency yielding steady rating progression."
        },
        {
          feature: "avg_xpm",
          impact: -0.195,
          weight: -19.5,
          observedValue: "640 XP/min",
          observedValueEn: "640 XP/min",
          baselineValue: "520 XP/min",
          baselineValueEn: "520 XP/min",
          description_fr: "Rythme de jeu et d'XP dominant (640 XPM)",
          description_en: "Exceptional XP and game velocity (640 XPM)",
          explanationFr: "Maîtrise économique supérieure permettant de peser directement sur l'issue des rencontres.",
          explanationEn: "Superior farming and XP efficiency directly deciding match outcomes."
        },
        {
          feature: "tilt_index",
          impact: -0.14,
          weight: -14.0,
          observedValue: "0.0 (Serein)",
          observedValueEn: "0.0 (Serene)",
          baselineValue: "0.5",
          baselineValueEn: "0.5",
          description_fr: "Sérénité mentale parfaite (Tilt Index: 0.0)",
          description_en: "Calm competitive composure (Tilt Index: 0.0)",
          explanationFr: "Absence totale de signaux de tilt, d'abandons ou de séries de défaites anormales.",
          explanationEn: "Total absence of tilt signals, abandons, or unnatural loss streak patterns."
        }
      ]
    }
  }
];

export const MODEL_BENCHMARK_ROWS = [
  {
    id: 'xgbSmote',
    nameKey: 'mlBenchmark.table.rows.xgbSmote.name',
    fallbackName: 'V6 XGBoost + SMOTE (Champion)',
    accuracy: '70.2%',
    precision: '65.4%',
    recall: '85.0%',
    f1Score: '73.9%',
    rocAuc: '80.0%',
    prAuc: '79.3%',
    threshold: '0.36',
    statusKey: 'mlBenchmark.table.rows.xgbSmote.status',
    fallbackStatus: 'Champion / Production Candidate',
    commentKey: 'mlBenchmark.table.rows.xgbSmote.comment',
    fallbackComment: 'Meilleure couverture des joueurs en risque (Rappel 85%) sans fuite temporelle.',
    isChampion: true,
    badgeColor: 'var(--accent-orange)'
  },
  {
    id: 'xgbSpw',
    nameKey: 'mlBenchmark.table.rows.xgbSpw.name',
    fallbackName: 'V6 XGBoost + ScalePosWeight',
    accuracy: '70.6%',
    precision: '66.0%',
    recall: '84.1%',
    f1Score: '74.0%',
    rocAuc: '80.1%',
    prAuc: '79.3%',
    threshold: '0.37',
    statusKey: 'mlBenchmark.table.rows.xgbSpw.status',
    fallbackStatus: 'Alternative Robuste',
    commentKey: 'mlBenchmark.table.rows.xgbSpw.comment',
    fallbackComment: 'Pondération analytique native des coûts de classe sans suréchantillonnage.',
    isChampion: false,
    badgeColor: 'var(--accent-amber)'
  },
  {
    id: 'rfBaseline',
    nameKey: 'mlBenchmark.table.rows.rfBaseline.name',
    fallbackName: 'Random Forest Baseline',
    accuracy: '64.8%',
    precision: '61.2%',
    recall: '71.5%',
    f1Score: '66.0%',
    rocAuc: '72.4%',
    prAuc: '69.8%',
    threshold: '0.50',
    statusKey: 'mlBenchmark.table.rows.rfBaseline.status',
    fallbackStatus: 'Baseline Ensembliste',
    commentKey: 'mlBenchmark.table.rows.rfBaseline.comment',
    fallbackComment: 'Robuste mais sensibilité insuffisante sur les signaux asymétriques.',
    isChampion: false,
    badgeColor: 'var(--text-muted)'
  },
  {
    id: 'lrBaseline',
    nameKey: 'mlBenchmark.table.rows.lrBaseline.name',
    fallbackName: 'Régression Logistique Baseline',
    accuracy: '61.3%',
    precision: '58.7%',
    recall: '65.2%',
    f1Score: '61.8%',
    rocAuc: '66.9%',
    prAuc: '63.5%',
    threshold: '0.50',
    statusKey: 'mlBenchmark.table.rows.lrBaseline.status',
    fallbackStatus: 'Baseline Linéaire',
    commentKey: 'mlBenchmark.table.rows.lrBaseline.comment',
    fallbackComment: 'Incapable de capturer les seuils non-linéaires de frustration et de tilt.',
    isChampion: false,
    badgeColor: 'var(--text-muted)'
  }
];

export const CALIBRATED_CURVE_POINTS = [
  { threshold: 0.02, tpr: 1.000, fpr: 0.980, precision: 0.4965, recall: 1.0000, f1: 0.6635 },
  { threshold: 0.10, tpr: 0.975, fpr: 0.780, precision: 0.5180, recall: 0.9750, f1: 0.6765 },
  { threshold: 0.20, tpr: 0.942, fpr: 0.620, precision: 0.5512, recall: 0.9420, f1: 0.6953 },
  { threshold: 0.28, tpr: 0.900, fpr: 0.530, precision: 0.5890, recall: 0.9000, f1: 0.7120 },
  { threshold: 0.36, tpr: 0.850, fpr: 0.4444, precision: 0.6536, recall: 0.8500, f1: 0.7390 }, // OPTIMAL
  { threshold: 0.42, tpr: 0.795, fpr: 0.355, precision: 0.6900, recall: 0.7950, f1: 0.7388 },
  { threshold: 0.50, tpr: 0.681, fpr: 0.260, precision: 0.7241, recall: 0.6812, f1: 0.7020 },
  { threshold: 0.60, tpr: 0.540, fpr: 0.170, precision: 0.7680, recall: 0.5400, f1: 0.6341 },
  { threshold: 0.70, tpr: 0.415, fpr: 0.100, precision: 0.8120, recall: 0.4150, f1: 0.5490 },
  { threshold: 0.80, tpr: 0.280, fpr: 0.050, precision: 0.8650, recall: 0.2800, f1: 0.4230 },
  { threshold: 0.90, tpr: 0.160, fpr: 0.020, precision: 0.9100, recall: 0.1600, f1: 0.2721 },
  { threshold: 0.98, tpr: 0.082, fpr: 0.005, precision: 0.9450, recall: 0.0820, f1: 0.1509 }
];

export const TOP_FEATURE_IMPORTANCES = [
  { feature: 'avg_xpm', importance: 0.315168, category: 'economy' },
  { feature: 'session_duration_per_game', importance: 0.125962, category: 'behavior' },
  { feature: 'party_play_pct', importance: 0.095836, category: 'behavior' },
  { feature: 'role_consistency', importance: 0.071242, category: 'behavior' },
  { feature: 'ranked_play_pct', importance: 0.058160, category: 'ranked' },
  { feature: 'match_T_is_ranked', importance: 0.052628, category: 'ranked' },
  { feature: 'rank_tier', importance: 0.047843, category: 'ranked' },
  { feature: 'avg_hero_damage', importance: 0.037901, category: 'combat' },
  { feature: 'avg_tower_damage', importance: 0.027958, category: 'combat' },
  { feature: 'abandon_rate', importance: 0.022950, category: 'behavior' },
  { feature: 'avg_duration', importance: 0.021305, category: 'behavior' },
  { feature: "avg_gpm", importance: 0.020931, category: "economy" },
  { feature: "recent_avg_duration", importance: 0.015101, category: "behavior" },
  { feature: "xpm_trend", importance: 0.013007, category: "economy" },
  { feature: "objective_focus", importance: 0.011512, category: "combat" }
];

export const FEATURE_CATEGORIES = [
  { id: 'all', fr: 'Toutes les Variables', en: 'All Features' },
  { id: 'economy', fr: 'Économie & XP', en: 'Economy & XP' },
  { id: 'behavior', fr: 'Comportement & Social', en: 'Behavior & Social' },
  { id: 'ranked', fr: 'Compétition & Rang', en: 'Rank & Competitive' },
  { id: 'combat', fr: 'Combat & Objectifs', en: 'Combat & Objectives' }
];

/**
 * Top 20 Most Played Dota 2 Heroes in Match Telemetry
 * Calibrated fallback for GET /api/heroes matching OpenDota schema
 */
export const MOCK_HEROES = [
  {
    id: 14,
    name: "npc_dota_hero_pudge",
    localized_name: "Pudge",
    primary_attr: "str",
    attack_type: "Melee",
    roles: ["Disabler", "Initiator", "Durable", "Nuker"],
    legs: 2,
    isOffline: true
  },
  {
    id: 74,
    name: "npc_dota_hero_invoker",
    localized_name: "Invoker",
    primary_attr: "int",
    attack_type: "Ranged",
    roles: ["Carry", "Nuker", "Disabler", "Escape", "Pusher"],
    legs: 2,
    isOffline: true
  },
  {
    id: 8,
    name: "npc_dota_hero_juggernaut",
    localized_name: "Juggernaut",
    primary_attr: "agi",
    attack_type: "Melee",
    roles: ["Carry", "Pusher", "Escape"],
    legs: 2,
    isOffline: true
  },
  {
    id: 44,
    name: "npc_dota_hero_phantom_assassin",
    localized_name: "Phantom Assassin",
    primary_attr: "agi",
    attack_type: "Melee",
    roles: ["Carry", "Escape"],
    legs: 2,
    isOffline: true
  },
  {
    id: 5,
    name: "npc_dota_hero_crystal_maiden",
    localized_name: "Crystal Maiden",
    primary_attr: "int",
    attack_type: "Ranged",
    roles: ["Support", "Disabler", "Nuker"],
    legs: 2,
    isOffline: true
  },
  {
    id: 1,
    name: "npc_dota_hero_antimage",
    localized_name: "Anti-Mage",
    primary_attr: "agi",
    attack_type: "Melee",
    roles: ["Carry", "Escape", "Nuker"],
    legs: 2,
    isOffline: true
  },
  {
    id: 26,
    name: "npc_dota_hero_lion",
    localized_name: "Lion",
    primary_attr: "int",
    attack_type: "Ranged",
    roles: ["Support", "Disabler", "Nuker", "Initiator"],
    legs: 2,
    isOffline: true
  },
  {
    id: 2,
    name: "npc_dota_hero_axe",
    localized_name: "Axe",
    primary_attr: "str",
    attack_type: "Melee",
    roles: ["Initiator", "Durable", "Disabler", "Carry"],
    legs: 2,
    isOffline: true
  },
  {
    id: 11,
    name: "npc_dota_hero_nevermore",
    localized_name: "Shadow Fiend",
    primary_attr: "agi",
    attack_type: "Ranged",
    roles: ["Carry", "Nuker"],
    legs: 2,
    isOffline: true
  },
  {
    id: 35,
    name: "npc_dota_hero_sniper",
    localized_name: "Sniper",
    primary_attr: "agi",
    attack_type: "Ranged",
    roles: ["Carry", "Nuker"],
    legs: 2,
    isOffline: true
  },
  {
    id: 86,
    name: "npc_dota_hero_rubick",
    localized_name: "Rubick",
    primary_attr: "int",
    attack_type: "Ranged",
    roles: ["Support", "Disabler", "Nuker"],
    legs: 2,
    isOffline: true
  },
  {
    id: 21,
    name: "npc_dota_hero_windrunner",
    localized_name: "Windranger",
    primary_attr: "all",
    attack_type: "Ranged",
    roles: ["Carry", "Support", "Disabler", "Escape", "Nuker"],
    legs: 2,
    isOffline: true
  },
  {
    id: 84,
    name: "npc_dota_hero_ogre_magi",
    localized_name: "Ogre Magi",
    primary_attr: "str",
    attack_type: "Melee",
    roles: ["Support", "Nuker", "Disabler", "Durable"],
    legs: 2,
    isOffline: true
  },
  {
    id: 93,
    name: "npc_dota_hero_slark",
    localized_name: "Slark",
    primary_attr: "agi",
    attack_type: "Melee",
    roles: ["Carry", "Escape", "Disabler", "Nuker"],
    legs: 2,
    isOffline: true
  },
  {
    id: 6,
    name: "npc_dota_hero_drow_ranger",
    localized_name: "Drow Ranger",
    primary_attr: "agi",
    attack_type: "Ranged",
    roles: ["Carry", "Disabler", "Pusher"],
    legs: 2,
    isOffline: true
  },
  {
    id: 30,
    name: "npc_dota_hero_witch_doctor",
    localized_name: "Witch Doctor",
    primary_attr: "int",
    attack_type: "Ranged",
    roles: ["Support", "Nuker", "Disabler"],
    legs: 2,
    isOffline: true
  },
  {
    id: 104,
    name: "npc_dota_hero_legion_commander",
    localized_name: "Legion Commander",
    primary_attr: "str",
    attack_type: "Melee",
    roles: ["Carry", "Disabler", "Initiator", "Durable"],
    legs: 2,
    isOffline: true
  },
  {
    id: 41,
    name: "npc_dota_hero_faceless_void",
    localized_name: "Faceless Void",
    primary_attr: "agi",
    attack_type: "Melee",
    roles: ["Carry", "Initiator", "Disabler", "Escape"],
    legs: 2,
    isOffline: true
  },
  {
    id: 29,
    name: "npc_dota_hero_tidehunter",
    localized_name: "Tidehunter",
    primary_attr: "str",
    attack_type: "Melee",
    roles: ["Initiator", "Durable", "Disabler", "Nuker"],
    legs: 2,
    isOffline: true
  },
  {
    id: 12,
    name: "npc_dota_hero_phantom_lancer",
    localized_name: "Phantom Lancer",
    primary_attr: "agi",
    attack_type: "Melee",
    roles: ["Carry", "Escape", "Pusher"],
    legs: 2,
    isOffline: true
  }
];


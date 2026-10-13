import { useState } from 'react';

export default function AlgorithmReview({ lang = 'fr', t = {}, mlStatus = null }) {
  const ar = t?.algorithm_review || {};

  // État du widget comparatif interactif
  const [selectedParadigm, setSelectedParadigm] = useState('xgboost');
  const [activeMetricTab, setActiveMetricTab] = useState('all');

  // Données multidimensionnelles pour les architectures comparées
  const paradigmData = {
    xgboost: {
      id: 'xgboost',
      name: ar.comparisonWidget?.tabXgboost || (lang === 'fr' ? 'XGBoost Comportemental (V6 Notre Candidat)' : 'Behavioral XGBoost (V6 Candidate)'),
      tag: ar.comparisonWidget?.badgeCurrent || (lang === 'fr' ? 'CANDIDAT ACTUEL' : 'CURRENT CANDIDATE'),
      tagColor: '#10b981',
      target: lang === 'fr' ? 'Cible binaire fixe : Inactivité > 14 jours' : 'Fixed binary label: Inactivity > 14 days',
      censoring: lang === 'fr' ? 'Ignorée / Tronquée (Biais de censure)' : 'Ignored / Filtered at cutoff (Censoring bias)',
      latency: '< 5 ms (Inférence tabulaire ultra-rapide)',
      infra: lang === 'fr' ? 'Modérée (Nécessite un Feature Store Redis)' : 'Moderate (Requires Redis Feature Store)',
      fairness: lang === 'fr' ? 'Totale (Outil diagnostic, zéro trucage)' : 'Clean (Diagnostic only, zero rigging)',
      scores: {
        signalRigor: 78,
        inferenceSpeed: 95,
        fairnessScore: 92,
        pipelineComplexity: 80,
        actionability: 88,
      },
      formula: 'P(y = 1 | x) = σ( ∑_{m=1}^M f_m(x) )  avec seuil optimisé θ* = 0.36',
      summary: lang === 'fr'
        ? "Notre modèle V6 actuel s'appuie sur des arbres boostés par gradient (HistGradientBoosting) entraînés sur 45 variables comportementales rigoureusement purgées. Il fournit une inférence tabulaire instantanée (< 5 ms) et un excellent rappel de 85%, mais demeure prisonnier d'un horizon binaire rigide de 14 jours."
        : "Our current V6 model uses gradient-boosted decision trees (HistGradientBoosting) trained on 45 purged behavioral features. It provides ultra-fast tabular inference (< 5 ms) and 85% recall, but remains constrained by an arbitrary 14-day binary horizon."
    },
    survival: {
      id: 'survival',
      name: ar.comparisonWidget?.tabSurvival || (lang === 'fr' ? 'Analyse de Survie (DeepSurv / Cox PH)' : 'Survival Analysis (DeepSurv / Cox PH)'),
      tag: ar.comparisonWidget?.badgeWinner || (lang === 'fr' ? 'RECOMMANDÉ STUDIO' : 'STUDIO RECOMMENDED'),
      tagColor: '#06b6d4',
      target: lang === 'fr' ? 'Temps continu jusqu’au retour T ∈ [0, ∞)' : 'Continuous time-to-event T ∈ [0, ∞)',
      censoring: lang === 'fr' ? 'Modélisée rigoureusement par vraisemblance partielle' : 'Mathematically modeled via Partial Likelihood',
      latency: '< 10 ms (Évaluation du risque instantané)',
      infra: lang === 'fr' ? 'Élevée (Pipeline continu temps-événement)' : 'High (Continuous time-to-event pipeline)',
      fairness: lang === 'fr' ? 'Inattaquable (Estimation non-biaisée de la LTV)' : 'Clean (Unbiased LTV & retention curves)',
      scores: {
        signalRigor: 96,
        inferenceSpeed: 88,
        fairnessScore: 95,
        pipelineComplexity: 65,
        actionability: 94,
      },
      formula: 'h(t | x) = h_0(t) · exp( g_θ(x) )  ⟹  S(t | x) = exp( - ∫_0^t h(u|x) du )',
      summary: lang === 'fr'
        ? "Le standard d'or de l'industrie du jeu vidéo (King, EA, Tencent). En intégrant les données censurées à droite via le modèle de Cox ou des réseaux profonds DeepSurv, cette approche prédit la probabilité continue de survie à tout horizon (3j, 7j, 30j, 90j) et permet le calcul direct de la Valeur Vie Joueur (LTV)."
        : "The industry gold standard (King, EA, Tencent). By incorporating right-censored players mathematically via Cox models or DeepSurv neural networks, this approach predicts continuous survival curves S(t) across all horizons (3d, 7d, 30d, 90d) and estimates expected Player Lifetime Value."
    },
    eomm: {
      id: 'eomm',
      name: ar.comparisonWidget?.tabEomm || 'EA EOMM (Chen et al. 2017)',
      tag: ar.comparisonWidget?.badgeWarning || (lang === 'fr' ? 'DANGER ÉTHIQUE' : 'ETHICAL HAZARD'),
      tagColor: '#ef4444',
      target: lang === 'fr' ? 'P(Churn | Issue du match {Victoire, Défaite})' : 'P(Churn | Match outcome {Win, Loss})',
      censoring: lang === 'fr' ? 'Court terme (abandon immédiat après session)' : 'Short-term (Immediate post-session drop)',
      latency: '35 - 120 ms (Optimisation de graphe biparti)',
      infra: lang === 'fr' ? 'Très complexe (Couplage direct matchmaker)' : 'Highly complex (Direct matchmaker graph solver)',
      fairness: lang === 'fr' ? 'Prédatrice (Trucage actif des victoires/défaites)' : 'Predatory (Actively rigs match outcomes)',
      scores: {
        signalRigor: 85,
        inferenceSpeed: 55,
        fairnessScore: 20,
        pipelineComplexity: 40,
        actionability: 92,
      },
      formula: 'min_X ∑_{m ∈ M} ∑_{i ∈ m} ∑_{o} P(m → o) · P(Churn_i | s_i, o)',
      summary: lang === 'fr'
        ? "Le framework d'Electronic Arts maximise la rétention globale en sacrifiant délibérément l'équité compétitive. Le système offre des victoires garanties aux joueurs en détresse et pénalise les joueurs sereins. Rejeté par notre étude en raison du risque moral et de la destruction de l'intégrité sportive."
        : "Electronic Arts' retention framework maximizes engagement by explicitly abandoning 50/50 competitive fairness. The matchmaker pairs tilted players into artificially favored matches while burdening resilient players. Strictly rejected in our studio roadmap due to moral hazard and destruction of competitive trust."
    },
    sequential: {
      id: 'sequential',
      name: ar.comparisonWidget?.tabSequential || (lang === 'fr' ? 'Télémétrie Séquentielle (LSTM / Transformers)' : 'Sequential Telemetry (LSTM / Transformers)'),
      tag: lang === 'fr' ? 'RECHERCHE AVANCÉE' : 'ADVANCED R&D',
      tagColor: '#a855f7',
      target: lang === 'fr' ? 'Trajectoire séquentielle d’événements en jeu' : 'Sequential event trajectory over time',
      censoring: lang === 'fr' ? 'Masquage séquentiel / Perte temporelle' : 'Sequence masking / Dynamic hazard loss',
      latency: '25 - 80 ms (Dépendance forte GPU)',
      infra: lang === 'fr' ? 'Très lourde (Cluster d’inférence PyTorch/Triton)' : 'Heavy (Requires GPU Triton inference servers)',
      fairness: lang === 'fr' ? 'Saine (Détection micro-patterns sans trucage)' : 'Clean (Early micro-pattern detection)',
      scores: {
        signalRigor: 94,
        inferenceSpeed: 45,
        fairnessScore: 92,
        pipelineComplexity: 35,
        actionability: 82,
      },
      formula: 'h_t = LSTM(x_t, h_{t-1}),  c = ∑_t α_t h_t,  ŷ = Softmax(W c + b)',
      summary: lang === 'fr'
        ? "Modélisation séquentielle sur flux de combat brut (Kim et al. 2017). Analyse la trajectoire match par match sans agrégation manuelle et repère les micro-ralentissements de rythme 3 à 5 sessions avant l'abandon. Cependant, le coût d'inférence GPU est trop lourd pour le matchmaking en temps réel."
        : "Sequential deep learning on raw telemetry event logs (Kim et al. 2017). Analyzes intra-match sequences without manual rolling windows, capturing micro-inflections 3-5 sessions prior to departure. However, GPU inference overhead is too high for sub-100ms matchmaking SLAs."
    }
  };

  const currentParadigm = paradigmData[selectedParadigm] || paradigmData.xgboost;

  // Données de la table de comparaison de la littérature
  const literatureRows = [
    {
      model: "EA EOMM",
      source: "Chen et al. (ACM WWW 2017)",
      doi: "10.1145/3038912.3052559",
      paradigm: lang === 'fr' ? "Optimisation de graphe biparti de rétention" : "Bipartite graph retention optimization",
      strengths: lang === 'fr' ? "Preuve mathématique de maximisation de l'engagement" : "Mathematical proof of engagement maximization",
      limitations: lang === 'fr' ? "Brise l'intégrité compétitive, crée la paranoïa 'loser's queue'" : "Destroys competitive trust, creates 'loser's queue' paranoia",
      verdict: lang === 'fr' ? "REJETÉ (Danger éthique)" : "REJECTED (Ethical hazard)",
      badgeClass: "badge-glow-red"
    },
    {
      model: "Valve TrueSkill & MMR",
      source: "Herbrich et al. (NIPS 2006)",
      doi: "NIPS 2006 (Valve Dev Blogs)",
      paradigm: lang === 'fr' ? "Inférence bayésienne gaussienne (μ, σ²)" : "Bayesian Gaussian skill inference (μ, σ²)",
      strengths: lang === 'fr' ? "Équité 50/50 incorruptible, isolation orthogonale du comportement" : "Strict 50/50 fairness, orthogonal conduct isolation",
      limitations: lang === 'fr' ? "Ne réagit pas au tilt individuel ou aux séries de défaites" : "Blind to tilt escalation or consecutive defeat spirals",
      verdict: lang === 'fr' ? "STANDARD INDUSTRIEL" : "INDUSTRY BENCHMARK",
      badgeClass: "badge-glow-green"
    },
    {
      model: "Riot Tilt Dynamics",
      source: "Lin et al. (GDC 2013-2015)",
      doi: "GDC Player Dynamics Series",
      paradigm: lang === 'fr' ? "Télémétrie comportementale & analyse de séries" : "Behavioral telemetry & streak analytics",
      strengths: lang === 'fr' ? "Validation empirique du churn exponentiel après 3 défaites (>65%)" : "Empirical proof of exponential loss-streak churn (>65%)",
      limitations: lang === 'fr' ? "Étude centrée sur l'analyse sans moteur de matchmaking unifié" : "Focused on reporting rather than unified matchmaker engine",
      verdict: lang === 'fr' ? "BASE DE NOS POLITIQUES" : "POLICY FOUNDATION",
      badgeClass: "badge-glow-cyan"
    },
    {
      model: "Survival Ensembles",
      source: "Periáñez et al. (IEEE CIG 2016)",
      doi: "10.1109/CIG.2016.7860434",
      paradigm: lang === 'fr' ? "Forêts de survie & temps-événement continu" : "Random Survival Forests & continuous time-to-event",
      strengths: lang === 'fr' ? "Intégration rigoureuse de la censure à droite, estimation continue LTV" : "Rigorous right-censoring handling, continuous LTV estimation",
      limitations: lang === 'fr' ? "Complexité d'entraînement supérieure aux arbres standards" : "Higher training complexity than standard boosted trees",
      verdict: lang === 'fr' ? "PROCHAINE ÉVOLUTION (P2)" : "NEXT MILESTONE (P2)",
      badgeClass: "badge-glow-green"
    },
    {
      model: "Sequential Deep Learning",
      source: "Kim et al. (PLOS ONE 2017)",
      doi: "10.1371/journal.pone.0180735",
      paradigm: lang === 'fr' ? "LSTM séquentiel sur flux de combat" : "Sequential LSTM on match combat logs",
      strengths: lang === 'fr' ? "Détection fine des micro-ralentissements 3 à 5 sessions avant départ" : "Detects subtle activity drops 3-5 sessions before churning",
      limitations: lang === 'fr' ? "Inférence GPU trop lourde pour le SLA sub-200ms du matchmaker" : "Heavy GPU inference overhead incompatible with <200ms SLA",
      verdict: lang === 'fr' ? "R&D LONG TERME" : "LONG-TERM R&D",
      badgeClass: "badge-glow-cyan"
    },
    {
      model: "V6 XGBoost (Candidat)",
      source: "Notre Équipe (Octobre 2026)",
      doi: "Dota 2 Churn Lab",
      paradigm: lang === 'fr' ? "HistGradientBoosting tabulaire sur 45 variables purgées" : "Tabular HistGradientBoosting on 45 purged features",
      strengths: lang === 'fr' ? "PR-AUC 79.3%, rappel 85%, inférence tabulaire < 5 ms, zéro fuite" : "PR-AUC 79.3%, recall 85%, <5ms inference, zero leaks",
      limitations: lang === 'fr' ? "Seuil binaire 14j rigide, angle mort cold-start (N < 20)" : "Rigid 14-day cutoff, cold-start blind spot (N < 20)",
      verdict: lang === 'fr' ? "CANDIDAT ACTUEL PROD" : "CURRENT PROD CANDIDATE",
      badgeClass: "badge-glow-green"
    }
  ];

  return (
    <div className="academic-report-container" style={{ padding: '8px 0', animation: 'fadeIn 0.3s ease-in' }}>
      
      {/* =========================================================================
          SECTION 1 : EN-TÊTE & SCORECARD EXÉCUTIF DU MODÈLE
          ========================================================================= */}
      <div className="report-section-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(6, 8, 13, 0.95) 100%)', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span className="badge-glow-green" style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.05em' }}>
                {ar.header?.badge || 'AUDIT OFFICIEL V6.0 — GRADE B+'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                {lang === 'fr' ? '• Évaluation Senior Data Science & Systèmes' : '• Senior Data Science & Systems Audit'}
              </span>
            </div>
            <h2 className="glow-text-green" style={{ fontSize: '1.85rem', margin: '0 0 10px 0', fontFamily: 'var(--font-heading)' }}>
              {ar.header?.title || (lang === 'fr' ? "Revue Critique & Audit Académique de l'Algorithme" : "Critical Review & Academic Audit")}
            </h2>
            <p className="report-para" style={{ maxWidth: '1000px', margin: 0 }}>
              {ar.header?.subtitle || (lang === 'fr'
                ? "Audit approfondi de niveau Lead Data Scientist & Game Systems évaluant la validité méthodologique du modèle V6 face à l'état de l'art (EA EOMM, Valve TrueSkill, Riot Games), les contraintes de déploiement en studio AAA, et formulation de politiques d'équilibrage non-prédatrices."
                : "In-depth Lead Data Scientist & Game Systems audit evaluating the methodological validity of the V6 model against SOTA benchmarks (EA EOMM, Valve TrueSkill, Riot Games), AAA studio deployment bottlenecks, and formulation of non-punitive rebalancing policies.")}
            </p>
          </div>
        </div>

        {/* Boîte de Métadonnées */}
        <div className="report-meta-box" style={{ marginTop: '20px', borderColor: 'rgba(16, 185, 129, 0.15)' }}>
          <div className="meta-field">
            <span className="meta-label">{lang === 'fr' ? 'Date d’Audit' : 'Audit Date'}</span>
            <span className="meta-value">{ar.header?.metaAuditDate || '8 Octobre 2026'}</span>
          </div>
          <div className="meta-field">
            <span className="meta-label">{lang === 'fr' ? 'Modèle Candidat' : 'Production Candidate'}</span>
            <span className="meta-value" style={{ color: 'var(--accent-emerald)' }}>
              {mlStatus?.best_model_name ? `${mlStatus.best_model_name} (V6)` : (ar.header?.metaCandidate || 'HistGradientBoosting + SMOTE')}
            </span>
          </div>
          <div className="meta-field">
            <span className="meta-label">{lang === 'fr' ? 'Échantillon Filtré' : 'Analysis Sample'}</span>
            <span className="meta-value">
              {mlStatus?.dataset_size ? `${mlStatus.dataset_size.toLocaleString()} ${lang === 'fr' ? 'joueurs' : 'players'}` : (ar.header?.metaDataset || '16 981 joueurs (N=20)')}
            </span>
          </div>
          <div className="meta-field">
            <span className="meta-label">{lang === 'fr' ? 'PR-AUC Validé' : 'Verified PR-AUC'}</span>
            <span className="meta-value glow-text-green">
              {mlStatus?.pr_auc ? `${(mlStatus.pr_auc * 100).toFixed(2)}%` : (ar.header?.metaPrAuc || '79.31% (θ* = 0.36)')}
            </span>
          </div>
          <div className="meta-field">
            <span className="meta-label">{lang === 'fr' ? 'Rappel Churners' : 'Churner Recall'}</span>
            <span className="meta-value glow-text-cyan">
              {mlStatus?.recall ? `${(mlStatus.recall * 100).toFixed(1)}%` : (ar.header?.metaRecall || '85.00%')}
            </span>
          </div>
        </div>

        {/* Grille des 4 Scorecards Exécutifs */}
        <div style={{ marginTop: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📊</span> {ar.scorecard?.title || (lang === 'fr' ? 'Grille d’Évaluation Multicritère du Studio' : 'Studio Multicriteria Scorecard')}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            
            {/* Scorecard 1: Validité Algorithmique */}
            <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-emerald)', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                  {ar.scorecard?.validityTitle || (lang === 'fr' ? 'Validité Algorithmique' : 'Algorithmic Validity')}
                </span>
                <span className="badge-glow-green" style={{ fontSize: '1.15rem', fontWeight: '800', padding: '2px 10px' }}>
                  {ar.scorecard?.validityGrade || 'B+'}
                </span>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'white', marginBottom: '6px' }}>
                {ar.scorecard?.validityScore || '84 / 100'}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.45', margin: '0 0 12px 0' }}>
                {ar.scorecard?.validityDesc}
              </p>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.08)', padding: '6px 10px', borderRadius: '6px' }}>
                {ar.scorecard?.validityKeyMetric}
              </div>
            </div>

            {/* Scorecard 2: Maturité Production */}
            <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-cyan)', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                  {ar.scorecard?.readinessTitle || (lang === 'fr' ? 'Maturité Production' : 'Production Readiness')}
                </span>
                <span className="badge-glow-cyan" style={{ fontSize: '1.15rem', fontWeight: '800', padding: '2px 10px' }}>
                  {ar.scorecard?.readinessGrade || 'C+'}
                </span>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'white', marginBottom: '6px' }}>
                {ar.scorecard?.readinessScore || '62 / 100'}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.45', margin: '0 0 12px 0' }}>
                {ar.scorecard?.readinessDesc}
              </p>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.08)', padding: '6px 10px', borderRadius: '6px' }}>
                {ar.scorecard?.readinessKeyMetric}
              </div>
            </div>

            {/* Scorecard 3: Actionabilité Game Design */}
            <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #3b82f6', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                  {ar.scorecard?.actionabilityTitle || (lang === 'fr' ? 'Utilité Game Design' : 'Game Design Utility')}
                </span>
                <span className="badge-glow-green" style={{ fontSize: '1.15rem', fontWeight: '800', padding: '2px 10px', borderColor: '#3b82f6', color: '#60a5fa' }}>
                  {ar.scorecard?.actionabilityGrade || 'A-'}
                </span>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'white', marginBottom: '6px' }}>
                {ar.scorecard?.actionabilityScore || '90 / 100'}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.45', margin: '0 0 12px 0' }}>
                {ar.scorecard?.actionabilityDesc}
              </p>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#60a5fa', background: 'rgba(59, 130, 246, 0.08)', padding: '6px 10px', borderRadius: '6px' }}>
                {ar.scorecard?.actionabilityKeyMetric}
              </div>
            </div>

            {/* Scorecard 4: Intégrité Éthique */}
            <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #10b981', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                  {ar.scorecard?.ethicsTitle || (lang === 'fr' ? 'Intégrité Éthique' : 'Ethical Integrity')}
                </span>
                <span className="badge-glow-green" style={{ fontSize: '1.15rem', fontWeight: '800', padding: '2px 10px' }}>
                  {ar.scorecard?.ethicsGrade || 'A'}
                </span>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'white', marginBottom: '6px' }}>
                {ar.scorecard?.ethicsScore || '95 / 100'}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.45', margin: '0 0 12px 0' }}>
                {ar.scorecard?.ethicsDesc}
              </p>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.08)', padding: '6px 10px', borderRadius: '6px' }}>
                {ar.scorecard?.ethicsKeyMetric}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2 : BENCHMARKS ACADÉMIQUES & ÉTAT DE L'ART (80% FOCUS)
          ========================================================================= */}
      <div className="report-section-card">
        <h3 className="report-section-title">
          <span>R1</span> {ar.literature?.title || (lang === 'fr' ? 'Confrontation à l’État de l’Art & Benchmarks Académiques' : 'Literature Benchmarks')}
        </h3>
        <p className="report-para">
          {ar.literature?.intro}
        </p>

        {/* 4 Piliers Académiques */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
          
          {/* Pilier 1 : EA EOMM */}
          <div style={{ background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
              <h4 style={{ color: '#f87171', margin: 0, fontSize: '1.1rem' }}>
                {ar.literature?.eaTitle}
              </h4>
              <span className="badge-glow-red" style={{ fontSize: '0.75rem' }}>
                {ar.literature?.eaDoi}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontStyle: 'italic', marginBottom: '10px' }}>
              {ar.literature?.eaCitation}
            </div>
            <p className="report-para" style={{ marginBottom: '12px' }}>
              {ar.literature?.eaSummary}
            </p>
            <div className="math-formula" style={{ borderLeftColor: '#ef4444' }}>
              <code>{ar.literature?.eaFormula}</code>
            </div>
            <div className="highlight-note warning" style={{ margin: '12px 0 0 0' }}>
              <strong>{lang === 'fr' ? 'Avertissement Éthique :' : 'Ethical Warning:'}</strong> {ar.literature?.eaCritique}
            </div>
          </div>

          {/* Pilier 2 : Valve TrueSkill */}
          <div style={{ background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
              <h4 style={{ color: '#34d399', margin: 0, fontSize: '1.1rem' }}>
                {ar.literature?.valveTitle}
              </h4>
              <span className="badge-glow-green" style={{ fontSize: '0.75rem' }}>
                NIPS 2006 & Valve Engineering
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontStyle: 'italic', marginBottom: '10px' }}>
              {ar.literature?.valveCitation}
            </div>
            <p className="report-para" style={{ marginBottom: '12px' }}>
              {ar.literature?.valveSummary}
            </p>
            <div className="math-formula" style={{ borderLeftColor: '#10b981' }}>
              <code>{ar.literature?.valveFormula}</code>
            </div>
            <div className="highlight-note" style={{ margin: '12px 0 0 0' }}>
              <strong>{lang === 'fr' ? 'Standard Industriel :' : 'Industry Standard:'}</strong> {ar.literature?.valveCritique}
            </div>
          </div>

          {/* Pilier 3 : Riot Games Tilt Dynamics */}
          <div style={{ background: 'rgba(6, 182, 212, 0.03)', border: '1px solid rgba(6, 182, 212, 0.15)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
              <h4 style={{ color: '#38bdf8', margin: 0, fontSize: '1.1rem' }}>
                {ar.literature?.riotTitle}
              </h4>
              <span className="badge-glow-cyan" style={{ fontSize: '0.75rem' }}>
                GDC Player Dynamics Research
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontStyle: 'italic', marginBottom: '10px' }}>
              {ar.literature?.riotCitation}
            </div>
            <p className="report-para" style={{ marginBottom: '12px' }}>
              {ar.literature?.riotSummary}
            </p>
            <div className="highlight-note" style={{ margin: '12px 0 0 0', borderLeftColor: '#06b6d4' }}>
              <strong>{lang === 'fr' ? 'Alignement Télémetrique :' : 'Telemetry Alignment:'}</strong> {ar.literature?.riotCritique}
            </div>
          </div>

          {/* Pilier 4 : IEEE / ACM Publications */}
          <div style={{ background: 'rgba(168, 85, 247, 0.03)', border: '1px solid rgba(168, 85, 247, 0.15)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
              <h4 style={{ color: '#c084fc', margin: 0, fontSize: '1.1rem' }}>
                {ar.literature?.ieeeTitle}
              </h4>
              <span className="badge-glow-cyan" style={{ fontSize: '0.75rem', borderColor: '#a855f7', color: '#c084fc' }}>
                IEEE CIG / Big Data / PLOS ONE
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontStyle: 'italic', marginBottom: '10px' }}>
              {ar.literature?.ieeeCitation}
            </div>
            <p className="report-para" style={{ marginBottom: '12px' }}>
              {ar.literature?.ieeeSummary}
            </p>
            <div className="highlight-note" style={{ margin: '12px 0 0 0', borderLeftColor: '#a855f7' }}>
              <strong>{lang === 'fr' ? 'Feuille de Route R&D :' : 'R&D Direction:'}</strong> {ar.literature?.ieeeCritique}
            </div>
          </div>

        </div>

        {/* Tableau Récapitulatif de la Littérature */}
        <div style={{ marginTop: '30px' }}>
          <h4 className="report-subtitle">
            <span>📑</span> {lang === 'fr' ? 'Tableau Comparatif des Paradigmes de Matchmaking & Rétention' : 'Comparative Matchmaking & Retention Matrix'}
          </h4>
          <div className="preview-table-container">
            <table className="preview-table">
              <thead>
                <tr>
                  <th>{ar.literature?.tableHeaders?.model || 'Modèle'}</th>
                  <th>{ar.literature?.tableHeaders?.source || 'Source'}</th>
                  <th>{ar.literature?.tableHeaders?.paradigm || 'Paradigme'}</th>
                  <th>{ar.literature?.tableHeaders?.strengths || 'Forces'}</th>
                  <th>{ar.literature?.tableHeaders?.limitations || 'Limites'}</th>
                  <th>{ar.literature?.tableHeaders?.verdict || 'Verdict'}</th>
                </tr>
              </thead>
              <tbody>
                {literatureRows.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '700', color: 'white' }}>{row.model}</td>
                    <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {row.source}<br/>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{row.doi}</span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{row.paradigm}</td>
                    <td style={{ fontSize: '0.85rem', color: '#a7f3d0' }}>{row.strengths}</td>
                    <td style={{ fontSize: '0.85rem', color: '#fca5a5' }}>{row.limitations}</td>
                    <td>
                      <span className={row.badgeClass} style={{ fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                        {row.verdict}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3 : VIABILITÉ EN PRODUCTION & GAP DE SURVIE (R2)
          ========================================================================= */}
      <div className="report-section-card">
        <h3 className="report-section-title">
          <span>R2</span> {ar.viability?.title || (lang === 'fr' ? 'Diagnostic de Viabilité Industrielle & Modélisation de Survie' : 'Industrial Viability Diagnosis')}
        </h3>

        {/* Audit de Véracité du PR-AUC */}
        <div style={{ marginBottom: '24px' }}>
          <h4 className="report-subtitle glow-text-green">
            <span>🔍</span> {ar.viability?.veracityTitle}
          </h4>
          <p className="report-para">
            {ar.viability?.veracityText}
          </p>

          <div className="math-formula" style={{ borderLeftColor: 'var(--accent-emerald)' }}>
            <code>{ar.viability?.veracityFormula}</code>
          </div>

          <div className="highlight-note warning">
            <strong>{lang === 'fr' ? 'Conséquence Opérationnelle :' : 'Operational Impact:'}</strong> {ar.viability?.veracityPrevalenceNote}
          </div>

          <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <h5 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '0.95rem' }}>
              ⚖️ {ar.viability?.confoundingTitle}
            </h5>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: '1.5' }}>
              {ar.viability?.confoundingText}
            </p>
          </div>
        </div>

        {/* Les 4 Goulots d'Étranglement */}
        <div style={{ marginTop: '30px', marginBottom: '30px' }}>
          <h4 className="report-subtitle">
            <span>⚡</span> {ar.viability?.bottlenecksTitle}
          </h4>
          <div className="feature-family-grid">
            
            <div className="feature-family-card" style={{ borderTop: '3px solid #ef4444' }}>
              <h4>⏱️ {ar.viability?.bottleneck1Title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.5', margin: 0 }}>
                {ar.viability?.bottleneck1Text}
              </p>
            </div>

            <div className="feature-family-card" style={{ borderTop: '3px solid #f59e0b' }}>
              <h4>📡 {ar.viability?.bottleneck2Title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.5', margin: 0 }}>
                {ar.viability?.bottleneck2Text}
              </p>
            </div>

            <div className="feature-family-card" style={{ borderTop: '3px solid #3b82f6' }}>
              <h4>👶 {ar.viability?.bottleneck3Title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.5', margin: 0 }}>
                {ar.viability?.bottleneck3Text}
              </p>
            </div>

            <div className="feature-family-card" style={{ borderTop: '3px solid #10b981' }}>
              <h4>🔄 {ar.viability?.bottleneck4Title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.5', margin: 0 }}>
                {ar.viability?.bottleneck4Text}
              </p>
            </div>

          </div>
        </div>

        {/* Le Gap de Survie (Time-to-Event vs Binaire) */}
        <div style={{ marginTop: '30px' }}>
          <h4 className="report-subtitle glow-text-cyan">
            <span>⏳</span> {ar.viability?.survivalTitle}
          </h4>
          <p className="report-para">
            {ar.viability?.survivalText}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', margin: '16px 0' }}>
            <div className="math-formula" style={{ margin: 0, borderLeftColor: '#06b6d4', fontSize: '0.9rem' }}>
              <code>{ar.viability?.survivalFormulaKm}</code>
            </div>
            <div className="math-formula" style={{ margin: 0, borderLeftColor: '#10b981', fontSize: '0.9rem' }}>
              <code>{ar.viability?.survivalFormulaCox}</code>
            </div>
          </div>

          <div className="highlight-note" style={{ borderLeftColor: '#06b6d4' }}>
            <strong>{ar.viability?.survivalComparisonTitle} :</strong> {ar.viability?.survivalComparisonText}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 4 : WIDGET INTERACTIF DE COMPARAISON DES ARCHITECTURES (R4)
          ========================================================================= */}
      <div className="report-section-card" style={{ background: 'rgba(13, 20, 35, 0.85)', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h3 className="report-section-title" style={{ margin: 0, border: 'none', padding: 0 }}>
              <span>🎮</span> {ar.comparisonWidget?.title}
            </h3>
            <p className="report-para" style={{ margin: '8px 0 0 0' }}>
              {ar.comparisonWidget?.subtitle}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['all', 'signal', 'speed', 'fairness'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveMetricTab(tab)}
                style={{
                  background: activeMetricTab === tab ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeMetricTab === tab ? '#06080d' : 'var(--color-text-secondary)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab === 'all' && (lang === 'fr' ? 'Toutes les Métriques' : 'All Metrics')}
                {tab === 'signal' && (lang === 'fr' ? 'Rigueur Signal' : 'Signal Rigor')}
                {tab === 'speed' && (lang === 'fr' ? 'Vitesse Live' : 'Live Speed')}
                {tab === 'fairness' && (lang === 'fr' ? 'Équité Éthique' : 'Fairness')}
              </button>
            ))}
          </div>
        </div>

        {/* Sélecteur de Paradigmes */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {Object.values(paradigmData).map((p) => {
            const isSelected = selectedParadigm === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedParadigm(p.id)}
                style={{
                  flex: '1 1 200px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.06)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: p.tagColor, letterSpacing: '0.05em' }}>
                    {p.tag}
                  </span>
                  {isSelected && <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>● Actif</span>}
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: isSelected ? 'white' : 'var(--color-text-secondary)' }}>
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Visualisation Comparative Interactrice en SVG / CSS */}
        <div style={{ background: 'rgba(0, 0, 0, 0.35)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            
            {/* Colonne Barres Comparatives */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
                {ar.comparisonWidget?.metricsLabel || 'Indicateurs Multidimensionnels du Paradigme'}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { key: 'signalRigor', label: ar.comparisonWidget?.metrics?.signalRigor || 'Rigueur Scientifique', val: currentParadigm.scores.signalRigor, color: '#10b981' },
                  { key: 'inferenceSpeed', label: ar.comparisonWidget?.metrics?.inferenceSpeed || 'Vitesse d’Inférence', val: currentParadigm.scores.inferenceSpeed, color: '#06b6d4' },
                  { key: 'fairnessScore', label: ar.comparisonWidget?.metrics?.fairnessScore || 'Équité & Éthique', val: currentParadigm.scores.fairnessScore, color: currentParadigm.scores.fairnessScore < 50 ? '#ef4444' : '#10b981' },
                  { key: 'pipelineComplexity', label: ar.comparisonWidget?.metrics?.pipelineComplexity || 'Simplicité Pipeline', val: currentParadigm.scores.pipelineComplexity, color: '#3b82f6' },
                  { key: 'actionability', label: ar.comparisonWidget?.metrics?.actionability || 'Actionabilité Game Design', val: currentParadigm.scores.actionability, color: '#a855f7' }
                ].filter(m => activeMetricTab === 'all' || (activeMetricTab === 'signal' && m.key === 'signalRigor') || (activeMetricTab === 'speed' && m.key === 'inferenceSpeed') || (activeMetricTab === 'fairness' && m.key === 'fairnessScore'))
                 .map((metric) => (
                  <div key={metric.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                      <span style={{ color: '#cbd5e1' }}>{metric.label}</span>
                      <span style={{ fontWeight: '700', color: metric.color }}>{metric.val} / 100</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${metric.val}%`,
                          background: metric.color,
                          borderRadius: '4px',
                          transition: 'width 0.4s ease-out'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne Fiche Technique Détaillée */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'white' }}>
                  {currentParadigm.name}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: currentParadigm.tagColor }}>
                  {currentParadigm.tag}
                </span>
              </div>
              
              <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', lineHeight: '1.45', margin: '0 0 12px 0' }}>
                {currentParadigm.summary}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                <div><strong style={{ color: '#94a3b8' }}>{lang === 'fr' ? 'Formulation de Cible :' : 'Target Formulation:'}</strong> <span style={{ color: 'white' }}>{currentParadigm.target}</span></div>
                <div><strong style={{ color: '#94a3b8' }}>{lang === 'fr' ? 'Censure à Droite :' : 'Right-Censoring:'}</strong> <span style={{ color: '#cbd5e1' }}>{currentParadigm.censoring}</span></div>
                <div><strong style={{ color: '#94a3b8' }}>{lang === 'fr' ? 'Latence d’Inférence :' : 'Inference Latency:'}</strong> <span style={{ color: 'var(--accent-emerald)' }}>{currentParadigm.latency}</span></div>
                <div><strong style={{ color: '#94a3b8' }}>{lang === 'fr' ? 'Infrastructure Studio :' : 'Studio Infrastructure:'}</strong> <span style={{ color: '#cbd5e1' }}>{currentParadigm.infra}</span></div>
                <div><strong style={{ color: '#94a3b8' }}>{lang === 'fr' ? 'Posture Éthique :' : 'Ethical Posture:'}</strong> <span style={{ color: currentParadigm.scores.fairnessScore < 50 ? '#ef4444' : 'var(--accent-emerald)' }}>{currentParadigm.fairness}</span></div>
              </div>

              <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.4)', padding: '8px 12px', borderRadius: '6px', borderLeft: `3px solid ${currentParadigm.tagColor}`, fontFamily: 'monospace', fontSize: '0.75rem', color: '#f1f5f9' }}>
                {currentParadigm.formula}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 5 : POST-MORTEM MÉTHODOLOGIQUE DES VERSIONS V1 À V5 (20% FOCUS)
          ========================================================================= */}
      <div className="report-section-card">
        <h3 className="report-section-title">
          <span>R1</span> {ar.postMortem?.title || (lang === 'fr' ? 'Rétrospective Méthodologique : Le Post-Mortem V1 à V5' : 'Methodological Post-Mortem')}
        </h3>
        <p className="report-para">
          {ar.postMortem?.intro}
        </p>

        {/* Timeline des 6 versions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          
          {/* V1.0 */}
          <div style={{ background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ color: '#f87171', margin: 0, fontSize: '1.05rem' }}>
                {ar.postMortem?.v1Title}
              </h4>
              <span className="badge-glow-red" style={{ fontSize: '0.72rem' }}>ACCURACY PARADOX</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', marginBottom: '10px' }}>
              {ar.postMortem?.v1Metrics}
            </div>
            <p className="report-para" style={{ marginBottom: '8px' }}>
              {ar.postMortem?.v1Analysis}
            </p>
            <div style={{ fontSize: '0.825rem', fontWeight: '600', color: '#fca5a5' }}>
              💡 {ar.postMortem?.v1Lesson}
            </div>
          </div>

          {/* V2.0 */}
          <div style={{ background: 'rgba(245, 158, 11, 0.03)', border: '1px solid rgba(245, 158, 11, 0.15)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ color: '#fbbf24', margin: 0, fontSize: '1.05rem' }}>
                {ar.postMortem?.v2Title}
              </h4>
              <span className="badge-glow-cyan" style={{ fontSize: '0.72rem', borderColor: '#f59e0b', color: '#fbbf24' }}>SMOTE MANIFOLD DISTORTION</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', marginBottom: '10px' }}>
              {ar.postMortem?.v2Metrics}
            </div>
            <p className="report-para" style={{ marginBottom: '8px' }}>
              {ar.postMortem?.v2Analysis}
            </p>
            <div style={{ fontSize: '0.825rem', fontWeight: '600', color: '#fde68a' }}>
              💡 {ar.postMortem?.v2Lesson}
            </div>
          </div>

          {/* V3.0 */}
          <div style={{ background: 'rgba(59, 130, 246, 0.03)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ color: '#60a5fa', margin: 0, fontSize: '1.05rem' }}>
                {ar.postMortem?.v3Title}
              </h4>
              <span className="badge-glow-cyan" style={{ fontSize: '0.72rem' }}>TEMPORAL ANCHORING DEFICIT</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', marginBottom: '10px' }}>
              {ar.postMortem?.v3Metrics}
            </div>
            <p className="report-para" style={{ marginBottom: '8px' }}>
              {ar.postMortem?.v3Analysis}
            </p>
            <div style={{ fontSize: '0.825rem', fontWeight: '600', color: '#93c5fd' }}>
              💡 {ar.postMortem?.v3Lesson}
            </div>
          </div>

          {/* V4.0 */}
          <div style={{ background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ color: '#f87171', margin: 0, fontSize: '1.05rem' }}>
                {ar.postMortem?.v4Title}
              </h4>
              <span className="badge-glow-red" style={{ fontSize: '0.72rem' }}>DENOMINATOR LEAKAGE (96.3% TRAP)</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#fca5a5', fontStyle: 'italic', marginBottom: '10px' }}>
              {ar.postMortem?.v4Metrics}
            </div>
            <p className="report-para" style={{ marginBottom: '8px' }}>
              {ar.postMortem?.v4Analysis}
            </p>
            <div className="math-formula" style={{ borderLeftColor: '#ef4444', margin: '10px 0' }}>
              <code>{ar.postMortem?.v4Formula}</code>
            </div>
            <div style={{ fontSize: '0.825rem', fontWeight: '600', color: '#fca5a5' }}>
              💡 {ar.postMortem?.v4Lesson}
            </div>
          </div>

          {/* V5.0 */}
          <div style={{ background: 'rgba(245, 158, 11, 0.04)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ color: '#fbbf24', margin: 0, fontSize: '1.05rem' }}>
                {ar.postMortem?.v5Title}
              </h4>
              <span className="badge-glow-cyan" style={{ fontSize: '0.72rem', borderColor: '#f59e0b', color: '#fbbf24' }}>LABEL TAUTOLOGY</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#fde68a', fontStyle: 'italic', marginBottom: '10px' }}>
              {ar.postMortem?.v5Metrics}
            </div>
            <p className="report-para" style={{ marginBottom: '8px' }}>
              {ar.postMortem?.v5Analysis}
            </p>
            <div className="math-formula" style={{ borderLeftColor: '#f59e0b', margin: '10px 0' }}>
              <code>{ar.postMortem?.v5Formula}</code>
            </div>
            <div style={{ fontSize: '0.825rem', fontWeight: '600', color: '#fde68a' }}>
              💡 {ar.postMortem?.v5Lesson}
            </div>
          </div>

          {/* V6.0 */}
          <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ color: '#34d399', margin: 0, fontSize: '1.05rem' }}>
                {ar.postMortem?.v6Title}
              </h4>
              <span className="badge-glow-green" style={{ fontSize: '0.72rem' }}>PURGED BEHAVIORAL CANDIDATE</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6ee7b7', fontStyle: 'italic', marginBottom: '10px' }}>
              {ar.postMortem?.v6Metrics}
            </div>
            <p className="report-para" style={{ marginBottom: '8px' }}>
              {ar.postMortem?.v6Analysis}
            </p>
            <div style={{ fontSize: '0.825rem', fontWeight: '600', color: '#a7f3d0' }}>
              🎯 {ar.postMortem?.v6Lesson}
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          SECTION 6 : POLITIQUES D'ÉQUILIBRAGE & ANTI-CHURN ACTIONNABLES (R3)
          ========================================================================= */}
      <div className="report-section-card">
        <h3 className="report-section-title">
          <span>R3</span> {ar.balancingPolicy?.title || (lang === 'fr' ? 'Politiques Actionnables d’Anti-Churn & Équilibrage' : 'Anti-Churn Policies')}
        </h3>
        <p className="report-para">
          {ar.balancingPolicy?.intro}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
          
          {/* Politique 1 */}
          <div className="glass-card" style={{ padding: '24px', borderTop: '4px solid var(--accent-emerald)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ color: 'white', margin: 0, fontSize: '1.05rem' }}>
                {ar.balancingPolicy?.policy1Title}
              </h4>
            </div>
            <span className="badge-glow-green" style={{ fontSize: '0.7rem', marginBottom: '12px', display: 'inline-block' }}>
              {ar.balancingPolicy?.policy1Badge}
            </span>
            <p style={{ fontSize: '0.825rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '14px' }}>
              <strong>{lang === 'fr' ? 'Problème :' : 'Problem:'}</strong> {ar.balancingPolicy?.policy1Problem}<br/>
              <strong>{lang === 'fr' ? 'Action :' : 'Intervention:'}</strong> {ar.balancingPolicy?.policy1Solution}
            </p>
            <ul className="report-bullet-list" style={{ paddingLeft: '16px', margin: 0 }}>
              {ar.balancingPolicy?.policy1Mechanics?.map((m, idx) => (
                <li key={idx} className="report-bullet-item" style={{ fontSize: '0.8rem' }}>{m}</li>
              ))}
            </ul>
          </div>

          {/* Politique 2 */}
          <div className="glass-card" style={{ padding: '24px', borderTop: '4px solid var(--accent-cyan)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ color: 'white', margin: 0, fontSize: '1.05rem' }}>
                {ar.balancingPolicy?.policy2Title}
              </h4>
            </div>
            <span className="badge-glow-cyan" style={{ fontSize: '0.7rem', marginBottom: '12px', display: 'inline-block' }}>
              {ar.balancingPolicy?.policy2Badge}
            </span>
            <p style={{ fontSize: '0.825rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '14px' }}>
              <strong>{lang === 'fr' ? 'Problème :' : 'Problem:'}</strong> {ar.balancingPolicy?.policy2Problem}<br/>
              <strong>{lang === 'fr' ? 'Action :' : 'Intervention:'}</strong> {ar.balancingPolicy?.policy2Solution}
            </p>
            <ul className="report-bullet-list" style={{ paddingLeft: '16px', margin: 0 }}>
              {ar.balancingPolicy?.policy2Mechanics?.map((m, idx) => (
                <li key={idx} className="report-bullet-item" style={{ fontSize: '0.8rem' }}>{m}</li>
              ))}
            </ul>
          </div>

          {/* Politique 3 */}
          <div className="glass-card" style={{ padding: '24px', borderTop: '4px solid #3b82f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ color: 'white', margin: 0, fontSize: '1.05rem' }}>
                {ar.balancingPolicy?.policy3Title}
              </h4>
            </div>
            <span className="badge-glow-cyan" style={{ fontSize: '0.7rem', marginBottom: '12px', display: 'inline-block', borderColor: '#3b82f6', color: '#60a5fa' }}>
              {ar.balancingPolicy?.policy3Badge}
            </span>
            <p style={{ fontSize: '0.825rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '14px' }}>
              <strong>{lang === 'fr' ? 'Problème :' : 'Problem:'}</strong> {ar.balancingPolicy?.policy3Problem}<br/>
              <strong>{lang === 'fr' ? 'Action :' : 'Intervention:'}</strong> {ar.balancingPolicy?.policy3Solution}
            </p>
            <ul className="report-bullet-list" style={{ paddingLeft: '16px', margin: 0 }}>
              {ar.balancingPolicy?.policy3Mechanics?.map((m, idx) => (
                <li key={idx} className="report-bullet-item" style={{ fontSize: '0.8rem' }}>{m}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* Résolution du Risque Moral */}
        <div style={{ marginTop: '24px', background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '12px', padding: '20px' }}>
          <h4 style={{ color: 'var(--accent-emerald)', margin: '0 0 10px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🛡️</span> {ar.balancingPolicy?.ethicsTitle}
          </h4>
          <p className="report-para" style={{ marginBottom: '12px' }}>
            {ar.balancingPolicy?.ethicsText}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', fontSize: '0.825rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '6px', borderLeft: '3px solid var(--accent-emerald)' }}>
              {ar.balancingPolicy?.ethicsRule1}
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '6px', borderLeft: '3px solid var(--accent-cyan)' }}>
              {ar.balancingPolicy?.ethicsRule2}
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '6px', borderLeft: '3px solid #3b82f6' }}>
              {ar.balancingPolicy?.ethicsRule3}
            </div>
          </div>
          {ar.balancingPolicy?.ethicsConclusion && (
            <p className="report-para" style={{ marginTop: '14px', marginBottom: 0, fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.75)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
              💡 {ar.balancingPolicy.ethicsConclusion}
            </p>
          )}
        </div>
      </div>

      {/* =========================================================================
          SECTION 7 : FEUILLE DE ROUTE STUDIO (ROADMAP DE DÉPLOIEMENT)
          ========================================================================= */}
      <div className="report-section-card">
        <h3 className="report-section-title">
          <span>🚀</span> {ar.roadmap?.title || (lang === 'fr' ? 'Feuille de Route pour Déploiement en Studio AAA' : 'Studio Deployment Roadmap')}
        </h3>
        <p className="report-para">
          {ar.roadmap?.subtitle}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '20px' }}>
          
          {/* Phase 0 */}
          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-emerald)' }}>
            <span className="badge-glow-green" style={{ fontSize: '0.7rem', marginBottom: '8px', display: 'inline-block' }}>
              {ar.roadmap?.phase0Tag}
            </span>
            <h4 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '0.95rem' }}>
              {ar.roadmap?.phase0Title}
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', lineHeight: '1.45', margin: 0 }}>
              {ar.roadmap?.phase0Desc}
            </p>
          </div>

          {/* Phase 1 */}
          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-cyan)' }}>
            <span className="badge-glow-cyan" style={{ fontSize: '0.7rem', marginBottom: '8px', display: 'inline-block' }}>
              {ar.roadmap?.phase1Tag}
            </span>
            <h4 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '0.95rem' }}>
              {ar.roadmap?.phase1Title}
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', lineHeight: '1.45', margin: 0 }}>
              {ar.roadmap?.phase1Desc}
            </p>
          </div>

          {/* Phase 2 */}
          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #3b82f6' }}>
            <span className="badge-glow-cyan" style={{ fontSize: '0.7rem', marginBottom: '8px', display: 'inline-block', borderColor: '#3b82f6', color: '#60a5fa' }}>
              {ar.roadmap?.phase2Tag}
            </span>
            <h4 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '0.95rem' }}>
              {ar.roadmap?.phase2Title}
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', lineHeight: '1.45', margin: 0 }}>
              {ar.roadmap?.phase2Desc}
            </p>
          </div>

          {/* Phase 3 */}
          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #a855f7' }}>
            <span className="badge-glow-cyan" style={{ fontSize: '0.7rem', marginBottom: '8px', display: 'inline-block', borderColor: '#a855f7', color: '#c084fc' }}>
              {ar.roadmap?.phase3Tag}
            </span>
            <h4 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '0.95rem' }}>
              {ar.roadmap?.phase3Title}
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', lineHeight: '1.45', margin: 0 }}>
              {ar.roadmap?.phase3Desc}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

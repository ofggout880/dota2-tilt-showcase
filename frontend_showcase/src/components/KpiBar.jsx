import React from 'react';

/**
 * KpiBar Component
 * Milestone M2 Storytelling Component
 * 
 * Features:
 * - 5 grand-format KPI cards in glowing ember orange (#ff7a00) on dark card surfaces (#16171b)
 * - 16,981 Joueurs / Matches Analyzed
 * - 100 Parties par Profil (Rolling Window)
 * - 45 Variables Comportementales
 * - 85.0% Recall Churn
 * - 80.0% ROC-AUC / 79.3% PR-AUC
 * - Micro-interaction badge tags & tooltips explaining the ML significance
 * - Responsive 5-column layout adapting gracefully across Desktop, Tablet, and Mobile
 * - Full translation integration via t()
 */
export default function KpiBar({ lang, t, metricsData }) {
  const isFr = lang === 'fr';

  const datasetSizeVal = metricsData?.dataset_size
    ? (isFr ? metricsData.dataset_size.toLocaleString('fr-FR') : metricsData.dataset_size.toLocaleString('en-US'))
    : (t('kpis.cards.datasetSize.value', lang) || '16 981');

  const recallVal = metricsData?.recall
    ? `${(metricsData.recall * 100).toFixed(1)}%`
    : (t('kpis.cards.recall.value', lang) || '85.0%');

  const rocAucVal = metricsData?.auc_score
    ? `${(metricsData.auc_score * 100).toFixed(1)}%`
    : '80.0%';

  const prAucVal = metricsData?.pr_auc
    ? `${(metricsData.pr_auc * 100).toFixed(1)}%`
    : '79.3%';

  const rocPrAucVal = `${rocAucVal} / ${prAucVal}`;

  const kpiData = [
    {
      id: 'datasetSize',
      val: datasetSizeVal,
      label: t('kpis.cards.datasetSize.label', lang) || (isFr ? 'Joueurs / Profils Analysés' : 'Analyzed Player Profiles'),
      sub: t('kpis.cards.datasetSize.desc', lang) || (isFr ? "Dataset extrait via l'API OpenDota avec filtrage d'intégrité" : 'Curated OpenDota dataset with strict integrity filtering'),
      badge: 'OpenDota API',
      badgeColor: 'badge-orange',
      highlight: false
    },
    {
      id: 'windowSize',
      val: t('kpis.cards.windowSize.value', lang) || '100',
      label: t('kpis.cards.windowSize.label', lang) || (isFr ? 'Parties par Profil' : 'Rolling Matches Analyzed'),
      sub: t('kpis.cards.windowSize.desc', lang) || (isFr ? 'Fenêtre temporelle glissante pour isoler les tendances réelles' : 'Rolling temporal baseline capturing genuine player momentum'),
      badge: isFr ? 'Fenêtre Glissante' : 'Rolling Window',
      badgeColor: 'badge-amber',
      highlight: false
    },
    {
      id: 'featuresCount',
      val: t('kpis.cards.featuresCount.value', lang) || '45',
      label: t('kpis.cards.featuresCount.label', lang) || (isFr ? 'Variables Comportementales' : 'Engineered Features'),
      sub: t('kpis.cards.featuresCount.desc', lang) || (isFr ? 'Indicateurs de combat, économie, fatigue nocturne et tilt' : 'Combat economics, nocturnal fatigue, and tilt dynamics'),
      badge: isFr ? 'Vecteur Télémétrique' : 'Telemetry Vector',
      badgeColor: 'badge-emerald',
      highlight: false
    },
    {
      id: 'recall',
      val: recallVal,
      label: t('kpis.cards.recall.label', lang) || (isFr ? 'Rappel Détection Churn' : 'Churn Detection Recall'),
      sub: t('kpis.cards.recall.desc', lang) || (isFr ? "85 joueurs sur 100 en phase de départ sont interceptés avant l'abandon" : '85 out of 100 at-risk players correctly identified prior to exit'),
      badge: 'θ* = 0.36',
      badgeColor: 'badge-rose',
      highlight: true
    },
    {
      id: 'rocPrAuc',
      val: rocPrAucVal,
      label: t('kpis.cards.rocPrAuc.label', lang) || 'ROC-AUC / PR-AUC',
      sub: t('kpis.cards.rocPrAuc.desc', lang) || (isFr ? 'Capacité de discrimination robuste au seuil optimal θ* = 0.36 sans fuite temporelle' : 'Robust discrimination power at optimal threshold θ* = 0.36 with zero temporal leakage'),
      badge: 'Test N=3,397',
      badgeColor: 'badge-orange',
      highlight: true
    }
  ];

  return (
    <section id="kpis" className="section section-alt" aria-labelledby="kpis-title">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge badge-amber header-badge-margin">
            {isFr ? 'PERFORMANCE DU MODÈLE' : 'MODEL PERFORMANCE'}
          </div>
          <h2 id="kpis-title">{t('kpis.sectionTitle', lang)}</h2>
          <p>{t('kpis.sectionSubtitle', lang)}</p>
        </div>

        {/* 5 Grand-Format KPI Cards Grid */}
        <div className="grid-kpi-5" role="region" aria-label="Key Performance Indicators">
          {kpiData.map((kpi) => (
            <div
              key={kpi.id}
              className={`kpi-card ${kpi.highlight ? 'kpi-card-highlight' : ''}`}
            >
              <div className="kpi-card-top">
                <span className="kpi-label">{kpi.label}</span>
                <span className={`badge ${kpi.badgeColor} kpi-pill-badge`}>
                  {kpi.badge}
                </span>
              </div>
              <div className="kpi-val glow-orange tabular-nums">
                {kpi.val}
              </div>
              <p className="kpi-sub">
                {kpi.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

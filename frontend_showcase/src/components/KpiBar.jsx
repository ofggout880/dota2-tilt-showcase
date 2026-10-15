import React from 'react';
import { useDictionary } from '../context/DictionaryContext';

/**
 * KpiBar Component
 * Redesigned Free-Floating Horizon Layout (No Rigid Boxes)
 * 
 * Features:
 * - Monumental display typography (Syne display font)
 * - 5 Seamless horizontal metric columns floating directly on the dark obsidian canvas
 * - Subtle bottom horizon floor with warm ember neon beam
 * - Free-flowing explanatory commentary without claustrophobic card borders
 */
export default function KpiBar({ lang, t, metricsData }) {
  const { openDictionary } = useDictionary();

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
      label: t('kpis.cards.datasetSize.label', lang) || (isFr ? 'Joueurs Analysés' : 'Analyzed Players'),
      sub: t('kpis.cards.datasetSize.desc', lang) || (isFr ? "Dataset extrait via l'API OpenDota avec filtrage d'intégrité" : 'Curated OpenDota cohort with strict integrity filtering'),
      badge: 'OpenDota API',
      badgeClass: 'badge-orange',
      highlight: false,
      termId: null
    },
    {
      id: 'windowSize',
      val: t('kpis.cards.windowSize.value', lang) || '100',
      label: t('kpis.cards.windowSize.label', lang) || (isFr ? 'Parties / Profil' : 'Rolling Matches'),
      sub: t('kpis.cards.windowSize.desc', lang) || (isFr ? 'Fenêtre temporelle glissante pour isoler la dynamique réelle' : 'Rolling temporal baseline capturing genuine player momentum'),
      badge: isFr ? 'Fenêtre Glissante ✦' : 'Rolling Window ✦',
      badgeClass: 'badge-amber',
      highlight: false,
      termId: 'rolling_window'
    },
    {
      id: 'featuresCount',
      val: t('kpis.cards.featuresCount.value', lang) || '45',
      label: t('kpis.cards.featuresCount.label', lang) || (isFr ? 'Signaux Télémétriques' : 'Engineered Signals'),
      sub: t('kpis.cards.featuresCount.desc', lang) || (isFr ? 'Indicateurs de combat, économie, fatigue nocturne et tilt' : 'Combat economics, nocturnal fatigue, and tilt dynamics'),
      badge: isFr ? 'Vecteur ML' : 'ML Vector',
      badgeClass: 'badge-emerald',
      highlight: false,
      termId: null
    },
    {
      id: 'recall',
      val: recallVal,
      label: t('kpis.cards.recall.label', lang) || (isFr ? 'Rappel Churn (θ* = 0.36)' : 'Churn Recall (θ* = 0.36)'),
      sub: t('kpis.cards.recall.desc', lang) || (isFr ? "85 joueurs sur 100 en phase de départ sont interceptés avant l'abandon" : '85 out of 100 at-risk players correctly intercepted prior to exit'),
      badge: 'θ* = 0.36 ✦',
      badgeClass: 'badge-rose',
      highlight: true,
      termId: 'threshold'
    },
    {
      id: 'rocPrAuc',
      val: rocPrAucVal,
      label: t('kpis.cards.rocPrAuc.label', lang) || 'ROC-AUC / PR-AUC',
      sub: t('kpis.cards.rocPrAuc.desc', lang) || (isFr ? 'Capacité de discrimination robuste sur test indépendant (N = 3 397)' : 'Robust discrimination power on independent test set (N = 3,397)'),
      badge: 'PR-AUC 79.3% ✦',
      badgeClass: 'badge-orange',
      highlight: true,
      termId: 'pr_auc'
    }
  ];

  return (
    <section id="kpis" className="section kpi-horizon-section" aria-labelledby="kpis-title">
      <div className="container">
        
        {/* Editorial Section Header */}
        <div className="kpi-header-row">
          <div>
            <div className="editorial-badge">
              <span className="badge-sparkle">✦</span>
              <span>{isFr ? 'MÉTRIQUES DE VALIDATION' : 'VALIDATION METRICS'}</span>
            </div>
            <h2 id="kpis-title" className="kpi-horizon-heading">
              {isFr ? (
                <>Indicateurs Clés & <span className="title-bold">Impact Prédictif</span></>
              ) : (
                <>Key Performance & <span className="title-bold">Predictive Impact</span></>
              )}
            </h2>
          </div>
          <p className="kpi-header-desc">
            {t('kpis.sectionSubtitle', lang)}
          </p>
        </div>

        {/* Free-Floating Seamless Horizon */}
        <div className="kpi-seamless-horizon" role="region" aria-label="Key Performance Indicators">
          {kpiData.map((kpi, idx) => (
            <div
              key={kpi.id}
              className={`horizon-metric-col ${kpi.highlight ? 'horizon-highlight' : ''}`}
            >
              <div className="horizon-top-meta">
                <span className="horizon-index">0{idx + 1}</span>
                {kpi.termId ? (
                  <button
                    type="button"
                    onClick={() => openDictionary(kpi.termId)}
                    className={`badge ${kpi.badgeClass} horizon-badge`}
                    style={{ cursor: 'pointer', border: 'none' }}
                    title={isFr ? "Voir la définition dans le dictionnaire" : "View definition in dictionary"}
                  >
                    {kpi.badge}
                  </button>
                ) : (
                  <span className={`badge ${kpi.badgeClass} horizon-badge`}>
                    {kpi.badge}
                  </span>
                )}
              </div>
              
              <div className="horizon-number-row">
                <span className={`horizon-large-number glow-orange tabular-nums ${kpi.id === 'rocPrAuc' ? 'horizon-dual-val' : ''}`}>
                  {kpi.val}
                </span>
              </div>

              <div className="horizon-label">
                {kpi.label}
              </div>

              <p className="horizon-sub-text">
                {kpi.sub}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

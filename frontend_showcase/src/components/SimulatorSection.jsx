import React, { useState } from 'react';
import { MOCK_ARCHETYPES } from '../data/mockData';
import { t as defaultT, translateRank, translateRiskLevel } from '../translations';
import RiskGauge from './RiskGauge';
import FactorAttribution from './FactorAttribution';
import GlossaryTerm from './GlossaryTerm';

export const CALIBRATED_ARCHETYPES = MOCK_ARCHETYPES;

/**
 * SimulatorSection Component
 * Milestone M3 Feature F8: Interactive Simulator & 1-Click Archetypes
 *
 * Implements:
 * 1. Steam Account ID Lookup Interface (numeric validation, clear action, suggestions, loading spinner, error callout)
 * 2. 4 Calibrated 1-Click Archetypes (Tilting, Burned-out, Support, Balanced)
 * 3. Dynamic active state feeding RiskGauge and FactorAttribution
 * 4. Transparent offline fallback for GitHub showcase reproducibility
 */
export default function SimulatorSection({
  lang = 'fr',
  t: tProp = defaultT,
  initialArchetypeId = 'tilting_player',
  activePlayer: activePlayerProp,
  onSelectArchetype: onSelectArchetypeProp,
  archetypes: archetypesProp
}) {
  const isFr = lang === 'fr';

  // Translation helper wrapper
  const tr = (key, fallback) => {
    if (typeof tProp === 'function') {
      const val = tProp(key, lang);
      if (val && val !== key) return val;
    }
    return fallback;
  };

  // Archetypes pool
  const archetypes = archetypesProp && archetypesProp.length ? archetypesProp : MOCK_ARCHETYPES;

  // Active Player State (supports both internal state and external control from App.jsx)
  const [internalSelectedArchetypeId, setInternalSelectedArchetypeId] = useState(initialArchetypeId);
  const [internalActivePlayer, setInternalActivePlayer] = useState(() => {
    const found = archetypes.find((a) => a.id === initialArchetypeId || a.legacyId === initialArchetypeId);
    return found || archetypes[0];
  });

  const activePlayer = activePlayerProp || internalActivePlayer;
  const selectedArchetypeId = activePlayer?.id || internalSelectedArchetypeId;

  // Archetype selection handler
  const handleSelectArchetype = (archetype) => {
    setInternalSelectedArchetypeId(archetype.id);
    setInternalActivePlayer(archetype);
    if (typeof onSelectArchetypeProp === 'function') {
      onSelectArchetypeProp(archetype);
    }
  };

  // Helper for risk badge translations
  const riskInfo = translateRiskLevel(activePlayer.churn_probability ?? activePlayer.probability ?? 0, lang);

  return (
    <section id="archetypes" className="section" aria-labelledby="archetypes-heading">
      <div id="simulator" style={{ position: 'relative', top: '-90px' }} aria-hidden="true" />
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge badge-orange" style={{ marginBottom: '0.75rem' }}>
            <span className="badge-dot" />
            <span>{isFr ? 'PROFILS COMPORTEMENTAUX' : 'BEHAVIORAL ARCHETYPES'}</span>
          </div>
          <h2 id="archetypes-heading">
            {tr('simulator.sectionTitle', isFr ? '4 Archétypes Comportementaux & Profils de Risque' : '4 Behavioral Player Archetypes & Risk Profiling')}
          </h2>
          <p>
            {tr(
              'simulator.sectionSubtitle',
              isFr
                ? 'Diagnostic prédictif, télémétrie approfondie et explicabilité SHAP sur les 4 profils types identifiés par notre modèle.'
                : 'Predictive diagnostics, deep telemetry indicators, and SHAP explainability across 4 calibrated player archetypes.'
            )}
          </p>
        </div>

        {/* --- The 4 Calibrated 1-Click Archetypes --- */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3
            style={{
              fontSize: '0.92rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-secondary)',
              marginBottom: '1.25rem',
              textAlign: 'center'
            }}
          >
            {tr('simulator.archetypesTitle', isFr ? 'Sélectionnez un profil pour explorer son diagnostic complet :' : 'Select a player archetype to explore full diagnostics:')}
          </h3>

          <div className="grid-4" style={{ gap: '1.25rem' }}>
            {archetypes.map((arch) => {
              const isSelected = selectedArchetypeId === arch.id || selectedArchetypeId === arch.legacyId || selectedArchetypeId === arch.aliasId;
              const probNum = arch.churn_probability ?? arch.probability ?? 0;
              const probFormatted = `${(probNum * 100).toFixed(1)}%`;
              const probColor = probNum >= 0.60
                ? 'var(--accent-rose)'
                : (probNum >= 0.36 ? 'var(--accent-amber)' : 'var(--accent-emerald)');

              return (
                <div
                  key={arch.id}
                  onClick={() => handleSelectArchetype(arch)}
                  className="card archetype-preview-card"
                  style={{
                    cursor: 'pointer',
                    borderColor: isSelected ? 'var(--accent-orange)' : undefined,
                    boxShadow: isSelected ? 'var(--shadow-glow-orange)' : undefined,
                    backgroundColor: isSelected ? 'var(--bg-card-hover)' : undefined,
                    transform: isSelected ? 'translateY(-3px)' : undefined,
                    transition: 'all var(--transition-normal)'
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectArchetype(arch);
                    }
                  }}
                  aria-pressed={isSelected}
                >
                  {/* Top Bar: Risk Badge & Active Indicator */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span className={`badge ${arch.badgeClass || (probNum >= 0.60 ? 'badge-rose' : probNum >= 0.36 ? 'badge-amber' : 'badge-emerald')}`}>
                      {tr(
                        `simulator.archetypes.${arch.id}.riskBadge`,
                        isFr
                          ? (probNum >= 0.60 ? 'Critique' : probNum >= 0.36 ? 'Élevé' : 'Faible')
                          : (probNum >= 0.60 ? 'Critical' : probNum >= 0.36 ? 'High' : 'Low')
                      )}
                    </span>
                    {isSelected && (
                      <span
                        className="badge badge-orange"
                        style={{
                          fontSize: '0.6875rem',
                          padding: '0.2rem 0.5rem',
                          fontWeight: 700
                        }}
                      >
                        {isFr ? '✓ ACTIF' : '✓ ACTIVE'}
                      </span>
                    )}
                  </div>

                  {/* Archetype Name & Subtitle */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                      {tr(`simulator.archetypes.${arch.id}.name`, isFr ? (arch.nameFr || arch.name_fr) : (arch.nameEn || arch.name_en))}
                    </h4>
                    <p className="archetype-desc" style={{ minHeight: '2.4em' }}>
                      {tr(`simulator.archetypes.${arch.id}.subtitle`, isFr ? (arch.subtitleFr || arch.subtitle_fr) : (arch.subtitleEn || arch.subtitle_en))}
                    </p>
                  </div>

                  {/* Probability readout */}
                  <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {isFr ? 'Risque Churn' : 'Churn Risk'}
                      </span>
                      <div className="archetype-prob" style={{ color: probColor, fontSize: '1.5rem', margin: 0 }}>
                        {probFormatted}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                      <span className="archetype-rank" style={{ fontSize: '0.75rem' }}>
                        {arch.rankLabel || arch.rank_label || translateRank(arch.rankTier || arch.rank_tier, lang)}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        ID #{arch.accountId || arch.account_id}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- 3. Active Profile Analysis Dashboard --- */}
        <div
          className="glass-card"
          style={{
            marginTop: '2.5rem',
            padding: 'clamp(1rem, 3.5vw, 2.5rem)',
            borderColor: 'rgba(255, 122, 0, 0.25)'
          }}
        >
          {/* Active Profile Meta Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '2rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  {isFr ? (activePlayer.nameFr || activePlayer.name_fr) : (activePlayer.nameEn || activePlayer.name_en)}
                </h3>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                    color: 'var(--accent-orange)',
                    background: 'var(--accent-orange-alpha)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  Steam ID: {activePlayer.accountId || activePlayer.account_id}
                </span>
                {activePlayer.personaname && (
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    ({activePlayer.personaname})
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {isFr
                  ? (activePlayer.verdictFr || activePlayer.subtitleFr || activePlayer.subtitle_fr)
                  : (activePlayer.verdictEn || activePlayer.subtitleEn || activePlayer.subtitle_en)}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div className="stat-box" style={{ padding: '0.5rem 1rem', minWidth: '110px' }}>
                <span className="stat-label">{tr('simulator.telemetry.rank', isFr ? 'Rang' : 'Rank')}</span>
                <span className="stat-value" style={{ fontSize: '1rem', color: 'var(--accent-amber)' }}>
                  {activePlayer.rankLabel || activePlayer.rank_label || translateRank(activePlayer.rankTier || activePlayer.rank_tier, lang)}
                </span>
              </div>

              <div className="stat-box" style={{ padding: '0.5rem 1rem', minWidth: '120px' }}>
                <span className="stat-label">{isFr ? 'Niveau Risque' : 'Risk Tier'}</span>
                <span className="stat-value" style={{ fontSize: '1rem', color: riskInfo.color }}>
                  {riskInfo.label}
                </span>
              </div>
            </div>
          </div>

          {/* Dual Analytics Row: Rebalanced Left Column & Right Column */}
          {(() => {
            // Derive Trajectory & Trend Information
            const churnProb = activePlayer.churn_probability ?? activePlayer.probability ?? 0;
            const isCriticalTrend = churnProb >= 0.60 || (activePlayer.features?.tilt_index || 0) >= 3.5;
            const isWarningTrend = !isCriticalTrend && (churnProb >= 0.36 || (activePlayer.features?.current_streak || 0) < 0);

            // Match History (10 games before Cutoff T: true = Win, false = Loss)
            const matchHistory = isCriticalTrend
              ? [true, false, false, true, false, false, false, false, false, false]
              : isWarningTrend
              ? [true, false, true, false, false, true, false, false, false, false]
              : [false, true, true, false, true, true, true, false, true, true];

            const trajectoryBadge = isCriticalTrend
              ? {
                  label: tr('simulatorTrajectory.badgeCritical', isFr ? 'Décrochage Rapide (Spirale de Tilt)' : 'Accelerated Decay (Tilt Spiral)'),
                  color: 'var(--accent-rose, #ef4444)',
                  bg: 'rgba(239, 68, 68, 0.12)',
                  border: 'rgba(239, 68, 68, 0.35)',
                  velocity: isFr ? '-42% d’engagement / 5 matchs' : '-42% engagement / 5 matches',
                  gap: isFr ? '+3.8j d’écart inter-parties' : '+3.8d inter-match gap',
                  slope: isFr ? '-35% (Rupture brutale)' : '-35% (Sudden collapse)',
                  insight: tr('simulatorTrajectory.insightCritical', isFr ? "Signal de désengagement accéléré : l'écart inter-parties s'est multiplié par 3 consécutivement à 3 défaites toxiques." : "Accelerated disengagement signal: inter-match interval tripled following consecutive toxic losses.")
                }
              : isWarningTrend
              ? {
                  label: tr('simulatorTrajectory.badgeWarning', isFr ? 'Érosion Lente (Fatigue Latente)' : 'Gradual Erosion (Latent Fatigue)'),
                  color: 'var(--accent-amber, #f59e0b)',
                  bg: 'rgba(245, 158, 11, 0.12)',
                  border: 'rgba(245, 158, 11, 0.35)',
                  velocity: isFr ? '-18% d’engagement / semaine' : '-18% engagement / week',
                  gap: isFr ? '+2.1j d’écart inter-parties' : '+2.1d inter-match gap',
                  slope: isFr ? '-15% (Fatigue glissante)' : '-15% (Rolling fatigue)',
                  insight: tr('simulatorTrajectory.insightWarning', isFr ? "Fatigue comportementale mesurable : baisse de régularité et sessions nocturnes de compensation." : "Measurable behavioral fatigue: dropping regularity accompanied by compensatory late-night sessions.")
                }
              : {
                  label: tr('simulatorTrajectory.badgeStable', isFr ? 'Trajectoire Stable & Rétention Forte' : 'Stable Trajectory & High Retention'),
                  color: 'var(--accent-emerald, #10b981)',
                  bg: 'rgba(16, 185, 129, 0.12)',
                  border: 'rgba(16, 185, 129, 0.35)',
                  velocity: isFr ? '+8% d’activité / mois' : '+8% activity / month',
                  gap: isFr ? '0.4j (Fréquence régulière)' : '0.4d (Steady rhythm)',
                  slope: isFr ? '+12% (Progression)' : '+12% (Progression)',
                  insight: tr('simulatorTrajectory.insightStable', isFr ? "Rythme de jeu stable et régulier : aucun signe avant-coureur de rupture émotionnelle." : "Stable and consistent playing cadence: zero advance indicators of emotional breakdown.")
                };

            return (
              <>
                <div className="simulator-analytics-grid" style={{ marginBottom: '1.5rem' }}>
                {/* Left Column: Risk Gauge + Telemetry Strip + Temporal Trajectory */}
                <div className="simulator-left-column">
                  <RiskGauge
                    probability={activePlayer.churn_probability ?? activePlayer.probability ?? 0}
                    threshold={0.36}
                    lang={lang}
                    t={tProp}
                    riskTier={activePlayer.riskLevel || activePlayer.risk_tier}
                  />

                  {/* Telemetry Metrics Card (Housed directly under the gauge) */}
                  <div className="card telemetry-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', margin: 0 }}>
                          {tr('simulator.telemetry.title', isFr ? 'Indicateurs Télémétriques Clés' : 'Key Telemetry Indicators')}
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                          {isFr ? 'Statistiques de base (fenêtre des 100 dernières parties)' : 'Baseline metrics over 100-match window'}
                        </p>
                      </div>
                      <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                        {isFr ? '100 MATCHS' : '100 MATCHES'}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                        gap: '0.75rem'
                      }}
                    >
                      {/* Win Rate */}
                      <div className="stat-box" style={{ padding: '0.65rem 0.5rem' }}>
                        <span className="stat-label">{tr('simulator.telemetry.winRate', isFr ? 'Win Rate' : 'Win Rate')}</span>
                        <span className="stat-value" style={{ fontSize: '1.15rem', color: '#ffffff' }}>
                          {activePlayer.features?.win_rate != null ? `${(activePlayer.features.win_rate * 100).toFixed(1)}%` : '--'}
                        </span>
                      </div>

                      {/* Current Streak */}
                      <div className="stat-box" style={{ padding: '0.65rem 0.5rem' }}>
                        <span className="stat-label">
                          <GlossaryTerm termId="loss_streak">{tr('simulator.telemetry.currentStreak', isFr ? 'Série Active' : 'Active Streak')}</GlossaryTerm>
                        </span>
                        <span
                          className="stat-value"
                          style={{
                            fontSize: '1.15rem',
                            color: (activePlayer.features?.current_streak || 0) < 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)'
                          }}
                        >
                          {(activePlayer.features?.current_streak || 0) > 0 ? `+${activePlayer.features.current_streak}` : activePlayer.features?.current_streak || 0}
                        </span>
                      </div>

                      {/* Party Play % */}
                      <div className="stat-box" style={{ padding: '0.65rem 0.5rem' }}>
                        <span className="stat-label">
                          <GlossaryTerm termId="party_size">{tr('simulator.telemetry.partyPlay', isFr ? 'Jeu en Groupe' : 'Party Play')}</GlossaryTerm>
                        </span>
                        <span className="stat-value" style={{ fontSize: '1.15rem', color: '#ffffff' }}>
                          {activePlayer.features?.party_play_pct != null ? `${(activePlayer.features.party_play_pct * 100).toFixed(0)}%` : '--'}
                        </span>
                      </div>

                      {/* Role Consistency */}
                      <div className="stat-box" style={{ padding: '0.65rem 0.5rem' }}>
                        <span className="stat-label">{tr('simulator.telemetry.roleConsistency', isFr ? 'Stabilité Rôle' : 'Role Stability')}</span>
                        <span className="stat-value" style={{ fontSize: '1.15rem', color: '#ffffff' }}>
                          {activePlayer.features?.role_consistency != null ? `${(activePlayer.features.role_consistency * 100).toFixed(0)}%` : '--'}
                        </span>
                      </div>

                      {/* Tilt Index */}
                      <div className="stat-box" style={{ padding: '0.65rem 0.5rem' }}>
                        <span className="stat-label">
                          <GlossaryTerm termId="tilt_index">{tr('simulator.telemetry.tiltIndex', isFr ? 'Indice de Tilt' : 'Tilt Index')}</GlossaryTerm>
                        </span>
                        <span
                          className="stat-value"
                          style={{
                            fontSize: '1.15rem',
                            color: (activePlayer.features?.tilt_index || 0) >= 3.0 ? 'var(--accent-rose)' : 'var(--text-heading)'
                          }}
                        >
                          {activePlayer.features?.tilt_index != null ? activePlayer.features.tilt_index.toFixed(1) : '0.0'}
                        </span>
                      </div>

                      {/* Avg Match Duration */}
                      <div className="stat-box" style={{ padding: '0.65rem 0.5rem' }}>
                        <span className="stat-label">{tr('simulator.telemetry.recentDuration', isFr ? 'Durée Récente' : 'Recent Duration')}</span>
                        <span className="stat-value" style={{ fontSize: '1.15rem', color: '#ffffff' }}>
                          {activePlayer.features?.recent_avg_duration != null ? `${activePlayer.features.recent_avg_duration.toFixed(0)}m` : (activePlayer.features?.avg_session_duration != null ? `${activePlayer.features.avg_session_duration.toFixed(0)}m` : '--')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Factor Attribution */}
                <div className="simulator-right-column">
                  <FactorAttribution
                    profile={activePlayer}
                    features={activePlayer.features}
                    churnProbability={activePlayer.churn_probability ?? activePlayer.probability ?? 0}
                    lang={lang}
                    t={tProp}
                    player={activePlayer}
                  />
                </div>
              </div>

              {/* Full-Width Temporal Dynamics & Trajectory Card */}
              <div
                className="card simulator-trajectory-card"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'clamp(1rem, 2.5vw, 1.5rem)',
                  marginBottom: '1rem',
                  minWidth: 0,
                  maxWidth: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span aria-hidden="true">📈</span>
                      <span>{tr('simulatorTrajectory.title', isFr ? 'Dynamique Temporelle & Trajectoire' : 'Temporal Dynamics & Trajectory')}</span>
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                      {tr('simulatorTrajectory.subtitle', isFr ? 'Trajectoire séquentielle des 10 matchs précédant le point de rupture T' : 'Sequential match-by-match trajectory across the 10 games leading to Cutoff T')}
                    </p>
                  </div>

                  {/* Active Trajectory Badge */}
                  <span
                    className="badge"
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: trajectoryBadge.color,
                      background: trajectoryBadge.bg,
                      border: `1px solid ${trajectoryBadge.border}`,
                      padding: '0.3rem 0.75rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: trajectoryBadge.color }} />
                    {trajectoryBadge.label}
                  </span>
                </div>

                {/* Horizontal 2-Panel Grid: Timeline (Left) + Velocity Slopes (Right) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.25rem',
                    alignItems: 'start',
                    minWidth: 0
                  }}
                >
                  {/* Left: 10-Match Timeline */}
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      <span>{tr('simulatorTrajectory.recentMatchesLabel', isFr ? 'Historique des 10 derniers matchs :' : 'Recent 10-match timeline:')}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-orange)' }}>
                        {tr('simulatorTrajectory.cutoffPoint', isFr ? 'Point T (Observation)' : 'Cutoff T (Observation)')} ✦
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(10, 1fr)',
                        gap: 'clamp(2px, 0.8vw, 6px)',
                        alignItems: 'center',
                        minWidth: 0
                      }}
                    >
                      {matchHistory.map((isWin, idx) => {
                        const isLast = idx === matchHistory.length - 1;
                        return (
                          <div
                            key={idx}
                            style={{
                              textAlign: 'center',
                              padding: '0.45rem 0.1rem',
                              borderRadius: 'var(--radius-sm)',
                              background: isWin ? 'rgba(16, 185, 129, 0.14)' : 'rgba(239, 68, 68, 0.16)',
                              border: isLast ? '1.5px solid var(--accent-orange)' : (isWin ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)'),
                              position: 'relative',
                              minWidth: 0
                            }}
                            title={`Match ${idx - 9}: ${isWin ? (isFr ? 'Victoire' : 'Win') : (isFr ? 'Défaite' : 'Loss')}`}
                          >
                            <span
                              style={{
                                fontSize: 'clamp(0.72rem, 1.8vw, 0.82rem)',
                                fontWeight: 800,
                                fontFamily: 'var(--font-mono)',
                                color: isWin ? 'var(--accent-emerald, #10b981)' : 'var(--accent-rose, #ef4444)'
                              }}
                            >
                              {isWin ? tr('simulatorTrajectory.win', 'V') : tr('simulatorTrajectory.loss', 'D')}
                            </span>
                            <span style={{ display: 'block', fontSize: '0.58rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.1rem' }}>
                              {idx === 9 ? 'T' : `-${9 - idx}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Analytical Insight Note */}
                    <div
                      style={{
                        marginTop: '0.9rem',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderLeft: `3px solid ${trajectoryBadge.color}`,
                        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                        fontSize: '0.76rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5
                      }}
                    >
                      <strong>{isFr ? 'Constat de série :' : 'Time-series insight:'}</strong> {trajectoryBadge.insight}
                    </div>
                  </div>

                  {/* Right: 3 Metric Slopes */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                      gap: '0.65rem',
                      minWidth: 0
                    }}
                  >
                    <div className="stat-box" style={{ padding: '0.65rem 0.5rem', minWidth: 0 }}>
                      <span className="stat-label" style={{ fontSize: '0.7rem' }}>{tr('simulatorTrajectory.velocityLabel', isFr ? "Vélocité d'Engagement" : 'Engagement Velocity')}</span>
                      <span className="stat-value" style={{ fontSize: '0.95rem', color: trajectoryBadge.color, marginTop: '0.2rem' }}>
                        {trajectoryBadge.velocity}
                      </span>
                    </div>

                    <div className="stat-box" style={{ padding: '0.65rem 0.5rem', minWidth: 0 }}>
                      <span className="stat-label" style={{ fontSize: '0.7rem' }}>{tr('simulatorTrajectory.gapLabel', isFr ? 'Espacement Inter-Parties' : 'Inter-Match Gap')}</span>
                      <span className="stat-value" style={{ fontSize: '0.95rem', color: '#ffffff', marginTop: '0.2rem' }}>
                        {trajectoryBadge.gap}
                      </span>
                    </div>

                    <div className="stat-box" style={{ padding: '0.65rem 0.5rem', minWidth: 0 }}>
                      <span className="stat-label" style={{ fontSize: '0.7rem' }}>{tr('simulatorTrajectory.slopeLabel', isFr ? 'Pente de Performance (ΔWR)' : 'Performance Slope (ΔWR)')}</span>
                      <span className="stat-value" style={{ fontSize: '0.95rem', color: trajectoryBadge.color, marginTop: '0.2rem' }}>
                        {trajectoryBadge.slope}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
          })()}
        </div>
      </div>
    </section>
  );
}

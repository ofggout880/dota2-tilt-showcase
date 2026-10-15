import React, { useState, useId } from 'react';
import { MOCK_ARCHETYPES } from '../data/mockData';
import { t as defaultT, translateRank, translateRiskLevel } from '../translations';
import { predictPlayer, sanitizeAccountId } from '../services/api';
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
  onPredictPlayer: onPredictPlayerProp,
  isPredicting: isPredictingProp,
  predictionError: predictionErrorProp,
  backendStatus = 'checking',
  archetypes: archetypesProp
}) {
  const isFr = lang === 'fr';
  const inputId = useId();

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

  // Search Input State
  const [inputVal, setInputVal] = useState(activePlayer.accountId || activePlayer.account_id || '835397971');
  const [internalIsLoading, setInternalIsLoading] = useState(false);
  const [internalErrorNotice, setInternalErrorNotice] = useState(null);
  const [isOfflineFallback, setIsOfflineFallback] = useState(false);

  const isLoading = typeof isPredictingProp === 'boolean' ? isPredictingProp : internalIsLoading;
  const errorNotice = predictionErrorProp ? { type: 'api', message: tr(predictionErrorProp, predictionErrorProp) } : internalErrorNotice;

  // Sync input value when archetype changes
  const handleSelectArchetype = (archetype) => {
    setInternalSelectedArchetypeId(archetype.id);
    setInternalActivePlayer(archetype);
    setInputVal(archetype.accountId || archetype.account_id || '');
    setInternalErrorNotice(null);
    setIsOfflineFallback(false);
    if (typeof onSelectArchetypeProp === 'function') {
      onSelectArchetypeProp(archetype);
    }
  };

  // Handle Input change with strict numeric filtering & 64-bit Steam ID support
  const handleInputChange = (e) => {
    let rawVal = e.target.value;
    if (rawVal.includes('.')) {
      rawVal = rawVal.split('.')[0];
    }
    const numericVal = rawVal.replace(/\D/g, '').slice(0, 17);
    setInputVal(numericVal);
    if (internalErrorNotice) setInternalErrorNotice(null);
  };

  // Clear Input Action
  const handleClearInput = () => {
    setInputVal('');
    setInternalErrorNotice(null);
  };

  // Quick preset click
  const handlePresetClick = (presetId) => {
    const target = archetypes.find(
      (a) => a.accountId === presetId || a.account_id === presetId || a.id === presetId || a.legacyId === presetId
    );
    if (target) {
      handleSelectArchetype(target);
    } else {
      setInputVal(presetId);
    }
  };

  // Execute Search / Predict Lookup
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const cleanId = inputVal.trim();

    const sanitizedId = sanitizeAccountId(cleanId);

    // 1. Numeric & Length Validation
    if (!sanitizedId) {
      setInternalErrorNotice({
        type: 'validation',
        message: isFr
          ? 'Veuillez saisir un Account ID Steam / Dota 2 valide (3 à 10 chiffres ou SteamID64 à 17 chiffres, ex: 835397971).'
          : 'Please enter a valid numeric Dota 2 / Steam Account ID (3 to 10 digits or 17-digit SteamID64, e.g. 835397971).'
      });
      return;
    }

    if (sanitizedId !== cleanId) {
      setInputVal(sanitizedId);
    }

    // 2. Check if entered ID matches one of our calibrated archetypes directly
    const directMatch = archetypes.find(
      (a) => a.accountId === cleanId || a.account_id === cleanId
    );
    if (directMatch) {
      handleSelectArchetype(directMatch);
      return;
    }

    // 3. Delegate to external onPredictPlayerProp if provided, otherwise run predictPlayer
    if (typeof onPredictPlayerProp === 'function') {
      onPredictPlayerProp(sanitizedId || cleanId);
      return;
    }

    setInternalIsLoading(true);
    setInternalErrorNotice(null);
    setIsOfflineFallback(false);

    try {
      const result = await predictPlayer(sanitizedId || cleanId);
      if (result && result.success !== false) {
        setInternalSelectedArchetypeId(null);
        setInternalActivePlayer(result);
        if (result.isOffline || result.isSynthesized) {
          setIsOfflineFallback(true);
          setInternalErrorNotice({
            type: 'offline',
            message: isFr
              ? 'Serveur API local inaccessible ou profil privé. Inférence calibrée hors-ligne chargée.'
              : 'Local API server unreachable or private Steam profile. Calibrated offline inference loaded.'
          });
        }
      } else {
        setInternalErrorNotice({
          type: 'validation',
          message: tr(result?.errorKey, isFr ? 'Erreur lors de la prédiction.' : 'Error during prediction.')
        });
      }
    } catch {
      setIsOfflineFallback(true);
      setInternalErrorNotice({
        type: 'offline',
        message: isFr
          ? 'Serveur API local inaccessible. Mode démo calibré chargé.'
          : 'Local API server unreachable. Calibrated demo mode loaded.'
      });
    } finally {
      setInternalIsLoading(false);
    }
  };

  // Helper for risk badge translations
  const riskInfo = translateRiskLevel(activePlayer.churn_probability ?? activePlayer.probability ?? 0, lang);

  return (
    <section id="simulator" className="section" aria-labelledby="simulator-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge badge-orange" style={{ marginBottom: '0.75rem' }}>
            <span className="badge-dot" />
            <span>{isFr ? 'INFÉRENCE & PROFILS TYPES' : 'LIVE INFERENCE & ARCHETYPES'}</span>
          </div>
          <h2 id="simulator-heading">
            {tr('simulator.sectionTitle', isFr ? 'Simulateur Interactif & Archétypes Joueurs' : 'Interactive Risk Simulator & Player Archetypes')}
          </h2>
          <p>
            {tr(
              'simulator.sectionSubtitle',
              isFr
                ? 'Évaluez la probabilité de churn en direct via l\'API ou explorez instantanément 4 profils types calibrés.'
                : 'Evaluate real-time churn probability via live API or test 4 calibrated player archetypes.'
            )}
          </p>
        </div>

        {/* --- 1. Steam Account ID Lookup Interface --- */}
        <div
          className="glass-card"
          style={{
            maxWidth: '860px',
            margin: '0 auto 2.5rem auto',
            padding: 'clamp(1.25rem, 3vw, 2rem)'
          }}
        >
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <label
                htmlFor={inputId}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-heading)'
                }}
              >
                {tr('simulator.query.label', isFr ? 'Interrogation par ID de Compte Dota 2 / Steam (32-bit)' : 'Query by Dota 2 / Steam 32-bit Account ID')}
              </label>

              {/* Status Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: isOfflineFallback ? 'var(--accent-amber)' : 'var(--accent-emerald)',
                    boxShadow: isOfflineFallback ? '0 0 8px var(--accent-amber)' : '0 0 8px var(--accent-emerald)'
                  }}
                />
                <span>
                  {isOfflineFallback
                    ? (isFr ? 'Mode Démo Calibré' : 'Calibrated Demo Mode')
                    : (isFr ? 'Prêt pour l\'inférence' : 'Ready for inference')}
                </span>
              </div>
            </div>

            {/* Input Bar & Actions */}
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                flexWrap: 'wrap',
                alignItems: 'stretch'
              }}
            >
              <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '220px' }}>
                <input
                  id={inputId}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="input-field"
                  placeholder={tr('simulator.query.placeholder', isFr ? 'Ex: 835397971, 224109642...' : 'e.g. 835397971, 224109642...')}
                  value={inputVal}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  style={{
                    paddingRight: inputVal ? '2.5rem' : '1rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.05rem',
                    letterSpacing: '0.03em'
                  }}
                />
                {inputVal && !isLoading && (
                  <button
                    type="button"
                    onClick={handleClearInput}
                    aria-label={isFr ? 'Effacer la saisie' : 'Clear input'}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      transition: 'color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Predict CTA Button */}
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading || !inputVal.trim()}
                style={{
                  flex: '0 0 auto',
                  minWidth: '180px'
                }}
              >
                {isLoading ? (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ animation: 'spin 1s linear infinite' }}
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <span>{tr('simulator.query.btnLoading', isFr ? 'Inférence...' : 'Analyzing...')}</span>
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span>{tr('simulator.query.btnSubmit', isFr ? 'Analyser le Joueur' : 'Analyze Player')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Clickable Quick Suggestions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {tr('simulator.query.quickFillLabel', isFr ? 'Suggestions Rapides :' : 'Quick Presets:')}
              </span>
              {archetypes.map((arch) => {
                const archIdVal = arch.accountId || arch.account_id;
                const isSelectedPreset = inputVal === archIdVal;
                const shortLabel = isFr
                  ? (arch.nameFr?.split(' ')[2] || arch.nameFr || arch.id)
                  : (arch.nameEn?.split(' ')[1] || arch.nameEn || arch.id);

                return (
                  <button
                    key={arch.id}
                    type="button"
                    onClick={() => handlePresetClick(archIdVal)}
                    style={{
                      background: isSelectedPreset ? 'var(--accent-orange-alpha)' : 'var(--bg-card)',
                      color: isSelectedPreset ? 'var(--accent-orange)' : 'var(--text-secondary)',
                      border: `1px solid ${isSelectedPreset ? 'var(--accent-orange)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-full)',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {archIdVal} ({shortLabel})
                  </button>
                );
              })}
            </div>

            {/* Error / Offline Notice Callout */}
            {errorNotice && (
              <div
                style={{
                  marginTop: '0.5rem',
                  padding: '0.85rem 1.15rem',
                  borderRadius: 'var(--radius-md)',
                  background: errorNotice.type === 'validation' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                  border: `1px solid ${errorNotice.type === 'validation' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
                  color: errorNotice.type === 'validation' ? 'var(--accent-rose)' : 'var(--accent-amber)',
                  fontSize: '0.8125rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div style={{ flex: 1 }}>
                  <strong>{errorNotice.type === 'validation' ? (isFr ? 'Format Invalide : ' : 'Invalid Format: ') : (isFr ? 'Information Démo : ' : 'Demo Notice: ')}</strong>
                  {errorNotice.message}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* --- 2. The 4 Calibrated 1-Click Archetypes --- */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-secondary)',
              marginBottom: '1rem',
              textAlign: 'center'
            }}
          >
            {tr('simulator.archetypesTitle', isFr ? 'Ou sélectionnez un Archétype en 1 Clic :' : 'Or select a 1-Click Player Archetype:')}
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
          <div className="simulator-analytics-grid" style={{ marginBottom: '1.5rem' }}>
            {/* Left Column: Risk Gauge + Telemetry Strip */}
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
        </div>
      </div>
    </section>
  );
}

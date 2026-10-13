import React, { useId } from 'react';
import { t as defaultT, translateRiskLevel } from '../translations';

/**
 * RiskGauge Component (F9: Risk Gauge & Factor Attribution)
 * 
 * Pure React SVG Semicircular Gauge (180-degree arc, zero external charting libraries).
 * Architecture & Features:
 * - 180-degree semicircular arc spanning from 0% (left) to 100% (right)
 * - Three distinct calibrated risk zones:
 *   * Low Risk (< 36%): Calm Emerald (#10b981 / #059669)
 *   * Moderate Risk (36% - 60%): Warm Amber (#f59e0b / #d97706)
 *   * Critical Risk (> 60%): Glowing Ember Orange (#ff7a00) to Crimson (#ef4444)
 * - Prominent Optimal Threshold Marker at θ* = 0.36 (radial tick, glowing pin, callout label)
 * - Smooth animated needle rotating around pivot (cx, cy) with spring-damped CSS transition
 * - Large central percentage readout (e.g. 86.5%) with tabular-nums
 * - Glowing status badge pill ("Critique", "Modéré", "Faible")
 * - Contextual anti-churn matchmaking policy recommendation card for game designers
 * - 100% fluid & responsive down to 320px mobile screens without container overflow
 * 
 * @param {Object} props
 * @param {number} props.probability - Churn probability in [0, 1]
 * @param {number} [props.threshold=0.36] - Optimal operating threshold θ*
 * @param {string} [props.lang='fr'] - Language code ('fr' | 'en')
 * @param {Function} [props.t] - Optional translation resolver
 * @param {boolean} [props.showRecommendation=true] - Whether to render intervention recommendations
 * @param {string} [props.className=''] - Additional CSS classes
 */
export default function RiskGauge({
  probability = 0,
  threshold = 0.36,
  lang = 'fr',
  t = defaultT,
  showRecommendation = true,
  className = ''
}) {
  const isFr = lang === 'fr';
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, '');

  // Clamp probability into [0, 1]
  const p = Math.max(0, Math.min(1, typeof probability === 'number' && !isNaN(probability) ? probability : 0));
  const th = Math.max(0.01, Math.min(0.99, typeof threshold === 'number' && !isNaN(threshold) ? threshold : 0.36));

  // Determine active risk tier
  let tierKey = 'low';
  let tierColor = '#10b981';
  let tierGlowClass = 'glow-emerald';
  let badgeClass = 'badge-emerald';
  let tierLabel = isFr ? 'Faible (< 36%)' : 'Low (< 36%)';
  let statusText = isFr ? 'Fidélisé — Maintien Standard' : 'Retained — Standard Play';

  if (p >= 0.60) {
    tierKey = 'critical';
    tierColor = '#ff7a00';
    tierGlowClass = 'glow-orange';
    badgeClass = 'badge-rose';
    tierLabel = isFr ? 'Critique (> 60%)' : 'Critical (> 60%)';
    statusText = isFr ? 'Alerte Churn — Intervention Recommandée' : 'Churn Alert — Intervention Recommended';
  } else if (p >= th) {
    tierKey = 'moderate';
    tierColor = '#f59e0b';
    tierGlowClass = 'glow-amber';
    badgeClass = 'badge-amber';
    tierLabel = isFr ? 'Modéré (36% - 60%)' : 'Moderate (36% - 60%)';
    statusText = isFr ? "Vigilance — Risque d'Érosion" : 'Watchlist — Erosion Risk';
  }

  // --- SVG GEOMETRY CONFIGURATION ---
  // Coordinate Space: 340 x 205
  const cx = 170;
  const cy = 150;
  const radius = 110;
  const strokeWidth = 18;

  // Polar conversion helpers:
  // phi in [0, pi] where phi=0 is left (p=0), phi=pi/2 is top (p=0.5), phi=pi is right (p=1.0)
  const getPointOnArc = (ratio, r = radius) => {
    const phi = ratio * Math.PI;
    const x = cx - r * Math.cos(phi);
    const y = cy - r * Math.sin(phi);
    return { x, y };
  };

  // Build SVG arc path from startRatio to endRatio (clockwise sweep flag = 1)
  // For any sub-arc of a 180-degree semicircle, the angle is always <= 180 degrees, so largeArcFlag is strictly 0.
  const buildArcPath = (startRatio, endRatio, r = radius) => {
    const start = getPointOnArc(startRatio, r);
    const end = getPointOnArc(endRatio, r);
    return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
  };

  // 1. Zone Paths
  const zone1Path = buildArcPath(0, th);      // Low Risk [0, 0.36]
  const zone2Path = buildArcPath(th, 0.60);    // Moderate Risk [0.36, 0.60]
  const zone3Path = buildArcPath(0.60, 1.0);   // Critical Risk [0.60, 1.0]
  const fullTrackPath = buildArcPath(0, 1.0);  // Background track
  const progressPath = p > 0.005 ? buildArcPath(0, p, radius - 15) : ''; // Inner indicator track

  // 2. Threshold Marker Geometry at θ* = 0.36
  const thPointIn = getPointOnArc(th, radius - 14);
  const thPointOut = getPointOnArc(th, radius + 14);
  const thPinPoint = getPointOnArc(th, radius + 20);
  const thLabelPos = {
    x: thPinPoint.x - 6,
    y: thPinPoint.y - 6
  };

  // 3. Animated Needle Geometry
  // Needle points straight UP when rot=0, so angle = (p - 0.5) * 180 deg
  // p=0 => -90deg (horizontal left); p=0.5 => 0deg (vertical top); p=1 => +90deg (horizontal right)
  const needleAngle = (p - 0.5) * 180;

  // Formatting strings
  const percentageStr = `${(p * 100).toFixed(1)}%`;
  const diffFromThreshold = (p - th) * 100;
  const diffSign = diffFromThreshold >= 0 ? '+' : '';
  const diffStr = `${diffSign}${diffFromThreshold.toFixed(1)}%`;

  return (
    <div className={`risk-gauge-card card ${className}`}>
      {/* Gauge Header */}
      <div className="gauge-header-row">
        <div>
          <h3 className="gauge-card-title">
            {t('simulator.gauge.title', lang) || (isFr ? 'Probabilité Prédite de Churn' : 'Predicted Churn Probability')}
          </h3>
          <p className="gauge-card-subtitle">
            {isFr
              ? 'Inférence en temps réel par le modèle champion V6 XGBoost'
              : 'Real-time inference by Champion V6 XGBoost model'}
          </p>
        </div>
        <span className={`badge ${badgeClass} gauge-tier-badge`}>
          <span className="badge-dot"></span>
          <span>{tierLabel}</span>
        </span>
      </div>

      {/* Pure React SVG Semicircular Canvas */}
      <div className="gauge-svg-container" style={{ position: 'relative', width: '100%', maxWidth: '380px', margin: '0 auto' }}>
        <svg
          viewBox="0 0 340 215"
          width="100%"
          height="auto"
          preserveAspectRatio="xMidYMid meet"
          className="gauge-svg"
          aria-label={`Risk Gauge displaying ${(p * 100).toFixed(1)}% churn probability`}
          role="img"
          style={{ display: 'block', maxWidth: '100%' }}
        >
          <defs>
            {/* Zone Gradients */}
            <linearGradient id={`grad-low-${uid}`} x1="0" y1="1" x2="0.6" y2="0">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <linearGradient id={`grad-mod-${uid}`} x1="0.3" y1="0" x2="0.8" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>

            <linearGradient id={`grad-crit-${uid}`} x1="0.5" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff7a00" />
              <stop offset="60%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>

            {/* Glowing Drop Shadows */}
            <filter id={`glow-orange-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#ff7a00" floodOpacity="0.45" />
            </filter>
            <filter id={`glow-amber-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.4" />
            </filter>
            <filter id={`glow-emerald-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#10b981" floodOpacity="0.4" />
            </filter>
            <filter id={`needle-shadow-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.75" />
            </filter>
          </defs>

          {/* Background Arc Track */}
          <path
            d={fullTrackPath}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
          />

          {/* Zone 1: Low Risk Arc (< 36%) */}
          <path
            d={zone1Path}
            fill="none"
            stroke={`url(#grad-low-${uid})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={tierKey === 'low' ? 1.0 : 0.45}
            filter={tierKey === 'low' ? `url(#glow-emerald-${uid})` : undefined}
          />

          {/* Zone 2: Moderate Risk Arc (36% - 60%) */}
          <path
            d={zone2Path}
            fill="none"
            stroke={`url(#grad-mod-${uid})`}
            strokeWidth={strokeWidth}
            opacity={tierKey === 'moderate' ? 1.0 : 0.45}
            filter={tierKey === 'moderate' ? `url(#glow-amber-${uid})` : undefined}
          />

          {/* Zone 3: Critical Risk Arc (> 60%) */}
          <path
            d={zone3Path}
            fill="none"
            stroke={`url(#grad-crit-${uid})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={tierKey === 'critical' ? 1.0 : 0.45}
            filter={tierKey === 'critical' ? `url(#glow-orange-${uid})` : undefined}
          />

          {/* Inner Active Progress Trace */}
          {progressPath && (
            <path
              d={progressPath}
              fill="none"
              stroke={tierColor}
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.85"
            />
          )}

          {/* Zone Boundary Dividers */}
          {/* Tick at 60% */}
          {(() => {
            const p60In = getPointOnArc(0.60, radius - strokeWidth / 2 - 2);
            const p60Out = getPointOnArc(0.60, radius + strokeWidth / 2 + 2);
            return (
              <line
                x1={p60In.x}
                y1={p60In.y}
                x2={p60Out.x}
                y2={p60Out.y}
                stroke="#0a0b0e"
                strokeWidth="2.5"
              />
            );
          })()}

          {/* --- OPTIMAL THRESHOLD MARKER (θ* = 0.36) --- */}
          <g className="gauge-threshold-group">
            {/* Radial Tick Line across arc */}
            <line
              x1={thPointIn.x}
              y1={thPointIn.y}
              x2={thPointOut.x}
              y2={thPointOut.y}
              stroke="#fbbf24"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Glowing Marker Pin Dot */}
            <circle
              cx={thPinPoint.x}
              cy={thPinPoint.y}
              r="4.5"
              fill="#fbbf24"
              stroke="#0a0b0e"
              strokeWidth="1.5"
              filter={`url(#glow-amber-${uid})`}
            />

            {/* Threshold Callout Label */}
            <text
              x={thLabelPos.x}
              y={thLabelPos.y}
              textAnchor="end"
              fill="#fbbf24"
              fontSize="10.5"
              fontWeight="700"
              fontFamily="var(--font-mono)"
            >
              θ* = 36%
            </text>
            <text
              x={thLabelPos.x}
              y={thLabelPos.y + 11}
              textAnchor="end"
              fill="var(--text-muted)"
              fontSize="8"
              fontFamily="var(--font-heading)"
              fontWeight="600"
              letterSpacing="0.04em"
            >
              {isFr ? 'SEUIL CRITIQUE' : 'OPTIMAL CUTOFF'}
            </text>
          </g>

          {/* Scale Endpoint Labels */}
          <text
            x={cx - radius - 8}
            y={cy + 16}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="9"
            fontFamily="var(--font-mono)"
          >
            0%
          </text>
          <text
            x={cx}
            y={cy - radius - 10}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="9"
            fontFamily="var(--font-mono)"
          >
            50%
          </text>
          <text
            x={cx + radius + 8}
            y={cy + 16}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="9"
            fontFamily="var(--font-mono)"
          >
            100%
          </text>

          {/* --- ANIMATED NEEDLE --- */}
          <g
            className="gauge-needle-group"
            transform={`rotate(${needleAngle} ${cx} ${cy})`}
            filter={`url(#needle-shadow-${uid})`}
          >
            {/* Needle Shaft */}
            <polygon
              points={`${cx - 3.5},${cy} ${cx - 1},${cy - radius + 22} ${cx},${cy - radius + 15} ${cx + 1},${cy - radius + 22} ${cx + 3.5},${cy}`}
              fill="#f8fafc"
            />
            {/* Colored Needle Tip */}
            <polygon
              points={`${cx - 1.5},${cy - radius + 22} ${cx},${cy - radius + 10} ${cx + 1.5},${cy - radius + 22}`}
              fill={tierColor}
            />
            {/* Rear Counterweight */}
            <polygon
              points={`${cx - 3},${cy} ${cx},${cy + 14} ${cx + 3},${cy}`}
              fill="#334155"
            />
          </g>

          {/* Center Pivot Hub */}
          <circle
            cx={cx}
            cy={cy}
            r="13"
            fill="#16171b"
            stroke="var(--border-subtle)"
            strokeWidth="2"
          />
          <circle
            cx={cx}
            cy={cy}
            r="7"
            fill="#0a0b0e"
            stroke={tierColor}
            strokeWidth="2"
          />
          <circle
            cx={cx}
            cy={cy}
            r="3"
            fill={tierColor}
          />
        </svg>
      </div>

      {/* Central Numeric Readout & Tier Banner */}
      <div className="gauge-readout-panel">
        <div className={`gauge-percentage-value ${tierGlowClass} tabular-nums`} style={{ color: tierColor }}>
          {percentageStr}
        </div>

        <div className="gauge-status-line">
          <span className="gauge-status-text">
            {statusText}
          </span>
        </div>

        <div className="gauge-threshold-delta">
          <span className="font-mono text-muted" style={{ fontSize: '0.8125rem' }}>
            {isFr ? 'Position par rapport au seuil : ' : 'Relative to cutoff: '}
            <strong style={{ color: diffFromThreshold >= 0 ? 'var(--accent-orange)' : 'var(--accent-emerald)' }}>
              {diffStr}
            </strong>
            {' '}(θ* = 36.0%)
          </span>
        </div>
      </div>

      {/* Contextual Anti-Churn Recommendation Card */}
      {showRecommendation && (
        <div
          className="gauge-recommendation-box"
          style={{
            marginTop: '1.25rem',
            borderLeft: `4px solid ${tierColor}`,
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-subtle)',
            borderRight: '1px solid var(--border-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.15rem'
          }}
        >
          <div className="recommendation-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: tierColor,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>●</span>
              {tierKey === 'critical' && (isFr ? 'Intervention Prioritaire Immédiate' : 'Immediate Priority Intervention')}
              {tierKey === 'moderate' && (isFr ? 'Vigilance Matchmaking Activée' : 'Matchmaking Watchlist Active')}
              {tierKey === 'low' && (isFr ? 'Maintien Standard 50/50' : 'Standard 50/50 Integrity')}
            </span>

            <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
              {isFr ? 'POLITIQUE STUDIO' : 'STUDIO POLICY'}
            </span>
          </div>

          <ul className="recommendation-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {tierKey === 'critical' && (
              <>
                <li style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>1. {isFr ? 'Cooldown Non-Punitif :' : 'Non-Punitive Cooldown:'}</strong>{' '}
                  {isFr
                    ? 'Proposer un nudge vers un mode détente (Turbo/Arcade) ou une pause de 15 minutes sans perte de MMR.'
                    : 'Suggest a gentle nudge to casual mode (Turbo/Arcade) or 15-minute cooldown with zero MMR penalty.'}
                </li>
                <li style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>2. {isFr ? 'Isolation du Tilt :' : 'Tilt Isolation:'}</strong>{' '}
                  {isFr
                    ? 'Ne jamais apparier ce joueur avec d\'autres coéquipiers en série de défaites ou tilt élevé.'
                    : 'Never pair this player with teammates undergoing active loss streaks or elevated tilt scores.'}
                </li>
                <li style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>3. {isFr ? 'Coéquipier Haute Composure :' : 'High-Composure Teammate:'}</strong>{' '}
                  {isFr
                    ? 'Attribuer prioritairement au moins un coéquipier à composure maximale (score comportement 10 000+).'
                    : 'Prioritize pairing with a teammate possessing top composure telemetry (behavior score 10,000+).'}
                </li>
              </>
            )}

            {tierKey === 'moderate' && (
              <>
                <li style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>1. {isFr ? 'Protection du Rôle Principal :' : 'Role Protection:'}</strong>{' '}
                  {isFr
                    ? 'Garantir l\'attribution de son poste préférentiel et désactiver l\'autofill sur la prochaine partie.'
                    : 'Ensure primary role assignment and suppress autofill on the subsequent queue.'}
                </li>
                <li style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>2. {isFr ? 'Contrainte de Variance Lobby :' : 'Lobby Variance Restriction:'}</strong>{' '}
                  {isFr
                    ? 'Réduire la dispersion de niveau MMR entre les deux équipes (écart maximal < 120 points).'
                    : 'Tighten lobby MMR variance between radiant and dire (maximum dispersion < 120 points).'}
                </li>
                <li style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>3. {isFr ? 'Surveillance Anti-Streak :' : 'Anti-Streak Monitoring:'}</strong>{' '}
                  {isFr
                    ? 'Surveiller l\'issue du match : en cas de revers, activer une compensation cosmétique / bonus Shards.'
                    : 'Monitor match resolution: if defeated, deploy cosmetic compensation or shard quest bonus.'}
                </li>
              </>
            )}

            {tierKey === 'low' && (
              <>
                <li style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>1. {isFr ? 'Matchmaking 50/50 Standard :' : 'Standard 50/50 Matchmaking:'}</strong>{' '}
                  {isFr
                    ? 'Conserver l\'algorithme standard équitable. Zéro distorsion ou biais d\'intervention requis.'
                    : 'Maintain standard competitive fairness. Zero artificial manipulation or distortion required.'}
                </li>
                <li style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>2. {isFr ? 'Santé de Rétention Solide :' : 'Robust Retention Health:'}</strong>{' '}
                  {isFr
                    ? 'Comportement stable et résilience collective élevée assurant la pérennité de l\'engagement.'
                    : 'Stable behavior and solid collective resilience ensuring long-term retention sustainability.'}
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

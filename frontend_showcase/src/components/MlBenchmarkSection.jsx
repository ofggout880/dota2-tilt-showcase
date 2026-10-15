import React, { useState } from 'react';
import {
  MODEL_BENCHMARK_ROWS,
  CALIBRATED_CURVE_POINTS,
  TOP_FEATURE_IMPORTANCES,
  FEATURE_CATEGORIES
} from '../data/mockData';
import { translateFeature } from '../translations';
import GlossaryTerm from './GlossaryTerm';

/**
 * Interpolates metrics for any continuous threshold value [0.05, 0.95]
 */
function interpolateAtThreshold(th) {
  const points = CALIBRATED_CURVE_POINTS;
  if (th <= points[0].threshold) return points[0];
  if (th >= points[points.length - 1].threshold) return points[points.length - 1];

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    if (th >= p1.threshold && th <= p2.threshold) {
      const ratio = (th - p1.threshold) / (p2.threshold - p1.threshold);
      return {
        threshold: th,
        tpr: p1.tpr + ratio * (p2.tpr - p1.tpr),
        fpr: p1.fpr + ratio * (p2.fpr - p1.fpr),
        precision: p1.precision + ratio * (p2.precision - p1.precision),
        recall: p1.recall + ratio * (p2.recall - p1.recall),
        f1: p1.f1 + ratio * (p2.f1 - p1.f1)
      };
    }
  }
  return points[4]; // Default to 0.36
}

/**
 * Subcomponent 1: ModelComparisonTable
 */
function ModelComparisonTable({ lang, t }) {
  const isFr = lang === 'fr';

  return (
    <div className="card benchmark-table-card" style={{ marginBottom: '2.5rem', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)' }}>
            {t('mlBenchmark.table.title', lang)}
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {isFr
              ? 'Évaluation comparative sur test indépendant sans fuite (N = 3 397)'
              : 'Comparative test evaluation on leakage-free test partition (N = 3,397)'}
          </p>
        </div>
        <div className="badge badge-orange">
          <span className="badge-dot"></span>
          <span>{isFr ? 'CANDIDAT PRODUCTION : V6 XGBOOST' : 'PRODUCTION CANDIDATE: V6 XGBOOST'}</span>
        </div>
      </div>

      <div className="table-responsive" style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="benchmark-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.02)' }}>
              <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('mlBenchmark.table.headers.model', lang)}
              </th>
              <th style={{ padding: '0.85rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                {t('mlBenchmark.table.headers.accuracy', lang)}
              </th>
              <th style={{ padding: '0.85rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                {t('mlBenchmark.table.headers.precision', lang)}
              </th>
              <th style={{ padding: '0.85rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                {t('mlBenchmark.table.headers.recall', lang)}
              </th>
              <th style={{ padding: '0.85rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                {t('mlBenchmark.table.headers.f1Score', lang)}
              </th>
              <th style={{ padding: '0.85rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                {t('mlBenchmark.table.headers.rocAuc', lang)}
              </th>
              <th style={{ padding: '0.85rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                {t('mlBenchmark.table.headers.prAuc', lang)}
              </th>
              <th style={{ padding: '0.85rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                {t('mlBenchmark.table.headers.threshold', lang)}
              </th>
              <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                {t('mlBenchmark.table.headers.status', lang)}
              </th>
            </tr>
          </thead>
          <tbody>
            {MODEL_BENCHMARK_ROWS.map((row) => {
              const isChamp = row.isChampion;
              return (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    background: isChamp ? 'rgba(255, 122, 0, 0.05)' : 'transparent',
                    transition: 'background 0.2s ease'
                  }}
                  className={isChamp ? 'row-champion' : ''}
                >
                  <td data-label={t('mlBenchmark.table.headers.model', lang)} style={{ padding: '1rem', fontWeight: isChamp ? 700 : 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {isChamp && <span style={{ color: 'var(--accent-orange)', fontSize: '1rem' }}>★</span>}
                      <span style={{ color: isChamp ? '#ffffff' : 'var(--text-primary)' }}>
                        {t(row.nameKey, lang) || row.fallbackName}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {t(row.commentKey, lang) || row.fallbackComment}
                    </div>
                  </td>
                  <td data-label={t('mlBenchmark.table.headers.accuracy', lang)} style={{ padding: '1rem 0.75rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    {row.accuracy}
                  </td>
                  <td data-label={t('mlBenchmark.table.headers.precision', lang)} style={{ padding: '1rem 0.75rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    {row.precision}
                  </td>
                  <td data-label={t('mlBenchmark.table.headers.recall', lang)} style={{ padding: '1rem 0.75rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: isChamp ? 'var(--accent-orange)' : 'inherit', fontWeight: isChamp ? 800 : 500 }}>
                      {row.recall}
                    </span>
                  </td>
                  <td data-label={t('mlBenchmark.table.headers.f1Score', lang)} style={{ padding: '1rem 0.75rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    {row.f1Score}
                  </td>
                  <td data-label={t('mlBenchmark.table.headers.rocAuc', lang)} style={{ padding: '1rem 0.75rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    {row.rocAuc}
                  </td>
                  <td data-label={t('mlBenchmark.table.headers.prAuc', lang)} style={{ padding: '1rem 0.75rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: isChamp ? 'var(--accent-orange)' : 'inherit', fontWeight: isChamp ? 800 : 500 }}>
                      {row.prAuc}
                    </span>
                  </td>
                  <td data-label={t('mlBenchmark.table.headers.threshold', lang)} style={{ padding: '1rem 0.75rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                    <span style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      background: isChamp ? 'rgba(255, 122, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      color: isChamp ? 'var(--accent-orange)' : 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      {row.threshold}
                    </span>
                  </td>
                  <td data-label={t('mlBenchmark.table.headers.status', lang)} style={{ padding: '1rem', textAlign: 'right' }}>
                    <span className={`badge ${isChamp ? 'badge-orange' : 'badge-neutral'}`} style={{ fontSize: '0.72rem' }}>
                      {t(row.statusKey, lang) || row.fallbackStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <strong style={{ color: 'var(--accent-orange)' }}>💡 {isFr ? 'Décision Méthodologique :' : 'Methodological Rationale:'}</strong>{' '}
        {isFr
          ? "Bien que XGBoost + ScalePosWeight obtienne un F1 très proche (74.0%), SMOTE maximise le Rappel (85.0% vs 84.1%) et le PR-AUC (79.31%), offrant la fenêtre d'anticipation la plus précoce pour les interventions de matchmaking anti-désinstallation."
          : "While XGBoost + ScalePosWeight reaches a close F1 (74.0%), SMOTE maximizes Recall (85.0% vs 84.1%) and PR-AUC (79.31%), unlocking the earliest possible anticipation window for anti-churn matchmaking balancing."}
      </div>
    </div>
  );
}

/**
 * Subcomponent 2: InteractiveCurves (Pure React SVG)
 */
function InteractiveCurves({ lang, t, threshold, onThresholdChange }) {
  const [curveMode, setCurveMode] = useState('roc'); // 'roc' | 'pr'
  const isFr = lang === 'fr';

  const currentTh = threshold !== undefined ? threshold : 0.36;
  const currentMetrics = interpolateAtThreshold(currentTh);

  // SVG Geometry Dimensions
  const svgWidth = 500;
  const svgHeight = 320;
  const padLeft = 52;
  const padRight = 20;
  const padTop = 24;
  const padBottom = 44;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  // Coordinate transforms
  const getX = (val) => padLeft + val * chartW;
  const getY = (val) => padTop + chartH - val * chartH;

  // Construct SVG Paths
  const points = CALIBRATED_CURVE_POINTS;
  
  // ROC Curve: X = fpr, Y = tpr
  const rocCoords = points.map((p) => `${getX(p.fpr)},${getY(p.tpr)}`);
  const rocPath = `M ${getX(0)},${getY(0)} L ${rocCoords.join(' L ')} L ${getX(1)},${getY(1)}`;
  const rocAreaPath = `${rocPath} L ${getX(1)},${getY(0)} L ${getX(0)},${getY(0)} Z`;

  // PR Curve: X = recall, Y = precision
  const prCoords = points.map((p) => `${getX(p.recall)},${getY(p.precision)}`);
  const prPath = `M ${prCoords.join(' L ')}`;
  const prAreaPath = `M ${getX(points[0].recall)},${getY(0)} L ${prCoords.join(' L ')} L ${getX(points[points.length - 1].recall)},${getY(0)} Z`;

  // Active Marker Coordinates
  const markerX = curveMode === 'roc' ? getX(currentMetrics.fpr) : getX(currentMetrics.recall);
  const markerY = curveMode === 'roc' ? getY(currentMetrics.tpr) : getY(currentMetrics.precision);

  // Bayes' Rule Live PPV Calculation (π_live ≈ 5.74% background churn prevalence)
  const piLive = 0.0574;
  const livePPV = (currentMetrics.recall * piLive) / Math.max(0.0001, (currentMetrics.recall * piLive + currentMetrics.fpr * (1 - piLive)));

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      {/* Header & Tab Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)' }}>
            {t('mlBenchmark.curves.title', lang)}
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {curveMode === 'roc'
              ? (isFr ? 'ROC-AUC : 80.0% (Capacité discriminante)' : 'ROC-AUC : 80.0% (Discriminative power)')
              : (isFr ? 'PR-AUC : 79.3% (Précision sous asymétrie)' : 'PR-AUC : 79.3% (Precision under imbalance)')}
          </p>
        </div>

        <div className="curve-tab-switch" style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-surface)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => setCurveMode('roc')}
            className={`tab-btn ${curveMode === 'roc' ? 'active' : ''}`}
            style={{
              background: curveMode === 'roc' ? 'var(--accent-orange)' : 'transparent',
              color: curveMode === 'roc' ? '#ffffff' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            ROC Curve (80.0%)
          </button>
          <button
            type="button"
            onClick={() => setCurveMode('pr')}
            className={`tab-btn ${curveMode === 'pr' ? 'active' : ''}`}
            style={{
              background: curveMode === 'pr' ? 'var(--accent-cyan)' : 'transparent',
              color: curveMode === 'pr' ? '#0a0b0e' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            PR Curve (79.3%)
          </button>
        </div>
      </div>

      {/* Pure React SVG Canvas */}
      <div className="svg-curve-container" style={{ position: 'relative', width: '100%', flex: 1, minHeight: '240px', boxSizing: 'border-box' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          width="100%"
          height="auto"
          preserveAspectRatio="xMidYMid meet"
          style={{ display: 'block', maxWidth: '100%' }}
        >
          <defs>
            <linearGradient id="roc-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff7a00" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#ff7a00" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="pr-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y labels */}
          {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((val, idx) => (
            <g key={idx}>
              <line
                x1={padLeft}
                y1={getY(val)}
                x2={padLeft + chartW}
                y2={getY(val)}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="4 4"
              />
              <text
                x={padLeft - 8}
                y={getY(val) + 4}
                fill="var(--text-muted)"
                fontSize="10"
                textAnchor="end"
                fontFamily="var(--font-mono)"
              >
                {(val * 100).toFixed(0)}%
              </text>
            </g>
          ))}

          {/* X axis labels */}
          {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((val, idx) => (
            <text
              key={idx}
              x={getX(val)}
              y={svgHeight - padBottom + 16}
              fill="var(--text-muted)"
              fontSize="10"
              textAnchor="middle"
              fontFamily="var(--font-mono)"
            >
              {(val * 100).toFixed(0)}%
            </text>
          ))}

          {/* Axis Titles */}
          <text
            x={padLeft + chartW / 2}
            y={svgHeight - 8}
            fill="var(--text-secondary)"
            fontSize="10"
            textAnchor="middle"
            fontWeight="600"
          >
            {curveMode === 'roc'
              ? (isFr ? 'Taux de Faux Positifs (FPR = 1 - Spécificité)' : 'False Positive Rate (FPR = 1 - Specificity)')
              : (isFr ? 'Rappel (Recall / Sensibilité)' : 'Recall (Sensitivity)')}
          </text>

          <text
            transform="rotate(-90)"
            x={-(padTop + chartH / 2)}
            y={15}
            fill="var(--text-secondary)"
            fontSize="10"
            textAnchor="middle"
            fontWeight="600"
          >
            {curveMode === 'roc'
              ? (isFr ? 'Vrais Positifs (TPR / Rappel)' : 'True Positive Rate (TPR / Recall)')
              : (isFr ? 'Précision (PPV)' : 'Precision (PPV)')}
          </text>

          {/* Baseline reference */}
          {curveMode === 'roc' ? (
            <line
              x1={getX(0)}
              y1={getY(0)}
              x2={getX(1)}
              y2={getY(1)}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeDasharray="4 4"
              strokeWidth="1.2"
            />
          ) : (
            <line
              x1={getX(0)}
              y1={getY(0.4965)}
              x2={getX(1)}
              y2={getY(0.4965)}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeDasharray="4 4"
              strokeWidth="1.2"
            />
          )}

          {/* Area Fill */}
          <path
            d={curveMode === 'roc' ? rocAreaPath : prAreaPath}
            fill={curveMode === 'roc' ? 'url(#roc-glow)' : 'url(#pr-glow)'}
          />

          {/* Curve Stroke */}
          <path
            d={curveMode === 'roc' ? rocPath : prPath}
            fill="none"
            stroke={curveMode === 'roc' ? 'var(--accent-orange)' : 'var(--accent-cyan)'}
            strokeWidth="2.5"
          />

          {/* Threshold Crosshair Reference Lines */}
          <line
            x1={markerX}
            y1={padTop}
            x2={markerX}
            y2={padTop + chartH}
            stroke="rgba(255, 255, 255, 0.25)"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <line
            x1={padLeft}
            y1={markerY}
            x2={markerX}
            y2={markerY}
            stroke="rgba(255, 255, 255, 0.25)"
            strokeDasharray="3 3"
            strokeWidth="1"
          />

          {/* Pulsing Active Marker */}
          <circle
            cx={markerX}
            cy={markerY}
            r="8"
            fill={curveMode === 'roc' ? 'rgba(255, 122, 0, 0.25)' : 'rgba(6, 182, 212, 0.25)'}
            stroke={curveMode === 'roc' ? 'var(--accent-orange)' : 'var(--accent-cyan)'}
            strokeWidth="1.5"
          />
          <circle
            cx={markerX}
            cy={markerY}
            r="4"
            fill="#ffffff"
          />

          {/* Optimal Badge Callout */}
          <g transform={`translate(${Math.min(padLeft + chartW - 75, markerX + 8)}, ${Math.max(padTop + 12, markerY - 12)})`}>
            <rect
              x="0"
              y="-12"
              width="70"
              height="20"
              rx="4"
              fill="rgba(18, 19, 22, 0.9)"
              stroke="var(--border-subtle)"
            />
            <text
              x="35"
              y="2"
              fill={curveMode === 'roc' ? 'var(--accent-orange)' : 'var(--accent-cyan)'}
              fontSize="9"
              fontWeight="800"
              textAnchor="middle"
              fontFamily="var(--font-mono)"
            >
              θ = {currentTh.toFixed(2)} {Math.abs(currentTh - 0.36) < 0.02 ? '★' : ''}
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Threshold Slider */}
      <div style={{ marginTop: '1rem', padding: '0.85rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            <GlossaryTerm termId="threshold">
              {isFr ? 'Seuil de Décision (θ) :' : 'Decision Threshold (θ):'}
            </GlossaryTerm>{' '}
            <span style={{ color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
              {currentTh.toFixed(2)}
            </span>
          </label>
          <button
            type="button"
            onClick={() => onThresholdChange && onThresholdChange(0.36)}
            style={{
              background: Math.abs(currentTh - 0.36) < 0.01 ? 'var(--accent-orange-alpha)' : 'transparent',
              color: 'var(--accent-orange)',
              border: '1px solid rgba(255, 122, 0, 0.35)',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {isFr ? 'Seuil Optimal θ* = 0.36' : 'Studio Optimum θ* = 0.36'}
          </button>
        </div>

        <input
          type="range"
          min="0.05"
          max="0.95"
          step="0.01"
          value={currentTh}
          onChange={(e) => onThresholdChange && onThresholdChange(parseFloat(e.target.value))}
          style={{
            width: '100%',
            accentColor: 'var(--accent-orange)',
            cursor: 'pointer'
          }}
        />

        {/* Live Dynamic Metric Readouts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: '0.5rem', marginTop: '0.75rem', textAlign: 'center' }}>
          <div style={{ background: 'var(--bg-card)', padding: '0.4rem', borderRadius: '4px' }}>
            <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)' }}>Rappel (TPR)</span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>
              {(currentMetrics.recall * 100).toFixed(1)}%
            </strong>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '0.4rem', borderRadius: '4px' }}>
            <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)' }}>Faux Pos (FPR)</span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              {(currentMetrics.fpr * 100).toFixed(1)}%
            </strong>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '0.4rem', borderRadius: '4px' }}>
            <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)' }}>Score F1 (Test)</span>
            <strong style={{ fontSize: '0.95rem', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              {(currentMetrics.f1 * 100).toFixed(1)}%
            </strong>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '0.4rem', borderRadius: '4px' }}>
            <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)' }}>PPV Prod (Bayes)</span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
              {(livePPV * 100).toFixed(1)}%
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Subcomponent 3: ConfusionMatrixHeatmap
 */
function ConfusionMatrixHeatmap({ lang, t, threshold = 0.36 }) {
  const [selectedCell, setSelectedCell] = useState('tp');
  const isFr = lang === 'fr';

  const N_TOTAL = 3397;
  const N_CHURN = 1687;
  const N_RETAINED = 1710;

  let tp, fn, fp, tn;
  if (Math.abs(threshold - 0.36) < 0.015) {
    tp = 1434;
    fn = 253;
    fp = 760;
    tn = 950;
  } else {
    const recall = Math.max(0.1, Math.min(1.0, 1.0 - Math.pow(threshold, 1.3) * 0.95));
    const fpr = Math.max(0.01, Math.min(0.98, Math.pow(1.0 - threshold, 1.6)));
    tp = Math.round(recall * N_CHURN);
    fn = N_CHURN - tp;
    fp = Math.round(fpr * N_RETAINED);
    tn = N_RETAINED - fp;
  }

  const cells = {
    tp: {
      id: 'tp',
      labelKey: 'mlBenchmark.confusionMatrix.tp.label',
      fallbackLabel: 'Vrais Positifs (TP)',
      count: tp,
      pctTotal: ((tp / N_TOTAL) * 100).toFixed(1),
      pctClass: ((tp / N_CHURN) * 100).toFixed(1),
      bg: 'rgba(255, 122, 0, 0.12)',
      border: 'rgba(255, 122, 0, 0.55)',
      color: 'var(--accent-orange)',
      descFr: "Joueurs en churn imminent correctement interceptés à l'avance (Rappel de 85.0%). Déclenche des mécanismes préventifs d'équilibrage.",
      descEn: "Imminent churners correctly intercepted in advance (85.0% Recall). Triggers preventative matchmaking rebalancing."
    },
    fn: {
      id: 'fn',
      labelKey: 'mlBenchmark.confusionMatrix.fn.label',
      fallbackLabel: 'Faux Négatifs (FN)',
      count: fn,
      pctTotal: ((fn / N_TOTAL) * 100).toFixed(1),
      pctClass: ((fn / N_CHURN) * 100).toFixed(1),
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.55)',
      color: 'var(--accent-rose)',
      descFr: "Abandons non détectés (taux d'échappement maîtrisé à 15%). Le joueur quitte le jeu sans alerte préventive.",
      descEn: "Undetected churners (escape rate constrained to 15%). Player quietly departs without preventative alert."
    },
    fp: {
      id: 'fp',
      labelKey: 'mlBenchmark.confusionMatrix.fp.label',
      fallbackLabel: 'Faux Positifs (FP)',
      count: fp,
      pctTotal: ((fp / N_TOTAL) * 100).toFixed(1),
      pctClass: ((fp / N_RETAINED) * 100).toFixed(1),
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.55)',
      color: 'var(--accent-amber)',
      descFr: "Fausses alertes sur des joueurs qui auraient continué. Grâce aux politiques bienveillantes (anti-stomp, cooldowns positifs), l'impact est neutre ou bénéfique.",
      descEn: "False alarms on players who stayed active. With non-punitive interventions (loss mitigation, positive cooldowns), impact remains safe."
    },
    tn: {
      id: 'tn',
      labelKey: 'mlBenchmark.confusionMatrix.tn.label',
      fallbackLabel: 'Vrais Négatifs (TN)',
      count: tn,
      pctTotal: ((tn / N_TOTAL) * 100).toFixed(1),
      pctClass: ((tn / N_RETAINED) * 100).toFixed(1),
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.55)',
      color: 'var(--accent-emerald)',
      descFr: "Joueurs fidélisés correctement identifiés sans intervention superflue (Spécificité 55.6%).",
      descEn: "Retained players correctly identified without unnecessary intervention (Specificity 55.6%)."
    }
  };

  const activeCell = cells[selectedCell] || cells.tp;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)' }}>
          {t('mlBenchmark.confusionMatrix.title', lang)}
        </h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {t('mlBenchmark.confusionMatrix.subtitle', lang)}
        </p>
      </div>

      {/* 2x2 Heatmap Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(60px, auto) repeat(2, minmax(0, 1fr))', gap: '8px', alignItems: 'center' }}>
        {/* Header row */}
        <div></div>
        <div style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-orange)', textTransform: 'uppercase' }}>
          {isFr ? 'Prédit Churn (1)' : 'Pred Churn (1)'}
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-emerald)', textTransform: 'uppercase' }}>
          {isFr ? 'Prédit Actif (0)' : 'Pred Active (0)'}
        </div>

        {/* Row 1: Actual Churn */}
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-orange)', textAlign: 'right', paddingRight: '4px' }}>
          {isFr ? 'Réel Churn' : 'Actual Churn'}
        </div>

        {/* TP Cell */}
        <div
          onClick={() => setSelectedCell('tp')}
          style={{
            background: cells.tp.bg,
            border: `1.5px solid ${selectedCell === 'tp' ? 'var(--accent-orange)' : cells.tp.border}`,
            boxShadow: selectedCell === 'tp' ? '0 0 14px rgba(255, 122, 0, 0.35)' : 'none',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 0.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minWidth: 0
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent-orange)', textTransform: 'uppercase' }}>
            True Pos (TP)
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-heading)', margin: '0.2rem 0' }}>
            {cells.tp.count.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            {cells.tp.pctTotal}% total ({cells.tp.pctClass}% rec)
          </div>
        </div>

        {/* FN Cell */}
        <div
          onClick={() => setSelectedCell('fn')}
          style={{
            background: cells.fn.bg,
            border: `1.5px solid ${selectedCell === 'fn' ? 'var(--accent-rose)' : cells.fn.border}`,
            boxShadow: selectedCell === 'fn' ? '0 0 14px rgba(239, 68, 68, 0.35)' : 'none',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 0.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minWidth: 0
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent-rose)', textTransform: 'uppercase' }}>
            False Neg (FN)
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-heading)', margin: '0.2rem 0' }}>
            {cells.fn.count.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            {cells.fn.pctTotal}% total ({cells.fn.pctClass}% miss)
          </div>
        </div>

        {/* Row 2: Actual Retained */}
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-emerald)', textAlign: 'right', paddingRight: '4px' }}>
          {isFr ? 'Réel Actif' : 'Actual Active'}
        </div>

        {/* FP Cell */}
        <div
          onClick={() => setSelectedCell('fp')}
          style={{
            background: cells.fp.bg,
            border: `1.5px solid ${selectedCell === 'fp' ? 'var(--accent-amber)' : cells.fp.border}`,
            boxShadow: selectedCell === 'fp' ? '0 0 14px rgba(245, 158, 11, 0.35)' : 'none',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 0.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minWidth: 0
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent-amber)', textTransform: 'uppercase' }}>
            False Pos (FP)
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-heading)', margin: '0.2rem 0' }}>
            {cells.fp.count.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            {cells.fp.pctTotal}% total ({cells.fp.pctClass}% FPR)
          </div>
        </div>

        {/* TN Cell */}
        <div
          onClick={() => setSelectedCell('tn')}
          style={{
            background: cells.tn.bg,
            border: `1.5px solid ${selectedCell === 'tn' ? 'var(--accent-emerald)' : cells.tn.border}`,
            boxShadow: selectedCell === 'tn' ? '0 0 14px rgba(16, 185, 129, 0.35)' : 'none',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 0.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minWidth: 0
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent-emerald)', textTransform: 'uppercase' }}>
            True Neg (TN)
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-heading)', margin: '0.2rem 0' }}>
            {cells.tn.count.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            {cells.tn.pctTotal}% total ({cells.tn.pctClass}% spec)
          </div>
        </div>
      </div>

      {/* Selected Cell Drilldown Explanation */}
      <div style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', background: 'var(--bg-surface)', border: `1px solid ${activeCell.border}`, borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', flexWrap: 'wrap', gap: '0.35rem' }}>
          <strong style={{ color: activeCell.color, fontSize: '0.85rem' }}>
            {t(activeCell.labelKey, lang) || activeCell.fallbackLabel} ({activeCell.count.toLocaleString()} profils)
          </strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {activeCell.pctTotal}% du test set
          </span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
          {isFr ? activeCell.descFr : activeCell.descEn}
        </p>
      </div>

      {/* Bottom Summary Diagnostic Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem' }}>
        <div style={{ textAlign: 'center', padding: '0.4rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Rappel (Sensitivity)</span>
          <strong style={{ fontSize: '1rem', color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>85.0%</strong>
        </div>
        <div style={{ textAlign: 'center', padding: '0.4rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Spécificité (TNR)</span>
          <strong style={{ fontSize: '1rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>55.6%</strong>
        </div>
        <div style={{ textAlign: 'center', padding: '0.4rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Exactitude (Acc)</span>
          <strong style={{ fontSize: '1rem', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>70.2%</strong>
        </div>
      </div>
    </div>
  );
}

/**
 * Subcomponent 4: FeatureImportanceChart (Pure React SVG)
 */
function FeatureImportanceChart({ lang, t }) {
  const [topCount, setTopCount] = useState(10); // 10 | 15
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const isFr = lang === 'fr';

  let filtered = TOP_FEATURE_IMPORTANCES;
  if (selectedCategory !== 'all') {
    filtered = filtered.filter((item) => item.category === selectedCategory);
  }
  const items = filtered.slice(0, topCount);

  // SVG Geometry Dimensions
  const svgWidth = 620;
  const rowHeight = 32;
  const padLeft = 190;
  const padRight = 65;
  const padTop = 15;
  const padBottom = 20;

  const svgHeight = padTop + padBottom + items.length * rowHeight;
  const chartW = svgWidth - padLeft - padRight;
  const maxVal = 0.35; // 35% max scale for visual contrast

  const getCategoryColor = (category) => {
    switch (category) {
      case 'economy':
        return 'var(--accent-orange)';
      case 'behavior':
        return 'var(--accent-cyan)';
      case 'ranked':
        return 'var(--accent-purple)';
      case 'combat':
        return 'var(--accent-rose)';
      default:
        return 'var(--accent-orange)';
    }
  };

  return (
    <div className="card" style={{ marginTop: '2.5rem', minWidth: 0, boxSizing: 'border-box' }}>
      {/* Header and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>
            <span className="badge-dot"></span>
            <span>{isFr ? 'EXPLICABILITÉ DES ARBRES DE DÉCISION' : 'DECISION TREE EXPLAINABILITY'}</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)' }}>
            {t('mlBenchmark.featureImportance.title', lang)}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {t('mlBenchmark.featureImportance.takeaway', lang)}
          </p>
        </div>

        {/* Toggle Top 10 / 15 */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'var(--bg-surface)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => setTopCount(10)}
              style={{
                background: topCount === 10 ? 'var(--accent-orange)' : 'transparent',
                color: topCount === 10 ? '#ffffff' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Top 10
            </button>
            <button
              type="button"
              onClick={() => setTopCount(15)}
              style={{
                background: topCount === 15 ? 'var(--accent-orange)' : 'transparent',
                color: topCount === 15 ? '#ffffff' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Top 15
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {FEATURE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              background: selectedCategory === cat.id ? 'var(--bg-card-hover)' : 'var(--bg-surface)',
              border: `1px solid ${selectedCategory === cat.id ? 'var(--accent-orange)' : 'var(--border-subtle)'}`,
              color: selectedCategory === cat.id ? '#ffffff' : 'var(--text-secondary)',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isFr ? cat.fr : cat.en}
          </button>
        ))}
      </div>

      {/* Pure React SVG Horizontal Bars */}
      <div style={{ width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          width="100%"
          height="auto"
          preserveAspectRatio="xMidYMid meet"
          style={{ display: 'block', width: '100%', maxWidth: '100%' }}
        >
          <defs>
            <linearGradient id="bar-gradient-orange" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ff7a00" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Scale Guidelines */}
          {[0, 0.1, 0.2, 0.3].map((val, idx) => {
            const x = padLeft + (val / maxVal) * chartW;
            return (
              <g key={idx}>
                <line
                  x1={x}
                  y1={padTop}
                  x2={x}
                  y2={svgHeight - padBottom}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="3 3"
                />
                <text
                  x={x}
                  y={svgHeight - 4}
                  fill="var(--text-muted)"
                  fontSize="9.5"
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                >
                  {(val * 100).toFixed(0)}%
                </text>
              </g>
            );
          })}

          {/* Horizontal Rows */}
          {items.map((item, idx) => {
            const y = padTop + idx * rowHeight;
            const barW = Math.max(4, (item.importance / maxVal) * chartW);
            const isHovered = hoveredIdx === idx;
            const catColor = getCategoryColor(item.category);
            const translatedName = translateFeature(item.feature, lang);

            return (
              <g
                key={item.feature}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Row Hover Background */}
                <rect
                  x={padLeft}
                  y={y}
                  width={chartW}
                  height={rowHeight - 6}
                  fill={isHovered ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.01)'}
                  rx="3"
                />

                {/* Feature Name Label on the Left */}
                <text
                  x={padLeft - 12}
                  y={y + 16}
                  fill={isHovered ? '#ffffff' : 'var(--text-secondary)'}
                  fontSize="11"
                  fontWeight={idx < 3 ? 700 : 500}
                  textAnchor="end"
                >
                  {translatedName}
                </text>

                {/* Track background */}
                <rect
                  x={padLeft}
                  y={y + 5}
                  width={chartW}
                  height="16"
                  fill="rgba(255, 255, 255, 0.03)"
                  rx="4"
                />

                {/* Bar */}
                <rect
                  x={padLeft}
                  y={y + 5}
                  width={barW}
                  height="16"
                  fill={item.category === 'economy' ? 'url(#bar-gradient-orange)' : catColor}
                  opacity={isHovered ? 1 : 0.85}
                  rx="4"
                  style={{
                    transition: 'width 0.4s ease, opacity 0.2s ease',
                    filter: isHovered ? 'drop-shadow(0 0 8px rgba(255, 122, 0, 0.5))' : 'none'
                  }}
                />

                {/* Percentage Value on the Right */}
                <text
                  x={padLeft + barW + 8}
                  y={y + 17}
                  fill="#ffffff"
                  fontSize="10.5"
                  fontWeight="700"
                  fontFamily="var(--font-mono)"
                >
                  {(item.importance * 100).toFixed(1)}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Explanatory Takeaway Footnote */}
      <div style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <strong style={{ color: 'var(--accent-orange)' }}>💡 {isFr ? 'Interprétation Comportementale :' : 'Behavioral Insight:'}</strong>{' '}
        {isFr
          ? "L'XPM moyen (31.5%) et la durée par partie de session (12.6%) absorbent à eux deux 44.1% du pouvoir de prédiction. Une chute d'XPM indique le décrochage mécanique et la résignation en partie, tandis que la pratique en groupe (party_play_pct: 9.6%) agit comme le principal amortisseur protecteur contre le churn."
          : "Average XPM (31.5%) and session duration per game (12.6%) together account for 44.1% of predictive split power. Drops in XPM reflect mechanical collapse and resignation, whereas party play (9.6%) functions as the primary social buffer against churn."}
      </div>
    </div>
  );
}

/**
 * Master MlBenchmarkSection Component
 */
export default function MlBenchmarkSection({ lang = 'fr', t }) {
  const [threshold, setThreshold] = useState(0.36);

  return (
    <section id="benchmark" className="section section-alt" aria-labelledby="benchmark-title">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge badge-orange header-badge-margin">
            {lang === 'fr' ? 'BENCHMARK SCIENTIFIQUE' : 'SCIENTIFIC BENCHMARK'}
          </div>
          <h2 id="benchmark-title">{t('mlBenchmark.sectionTitle', lang)}</h2>
          <p>{t('mlBenchmark.sectionSubtitle', lang)}</p>
        </div>

        {/* 1. Model Comparison Table */}
        <ModelComparisonTable lang={lang} t={t} />

        {/* 2. Interactive Curves & Confusion Matrix */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
          gap: '1.75rem',
          alignItems: 'stretch'
        }}>
          {/* Left Column: Interactive SVG ROC & PR Curves */}
          <InteractiveCurves
            lang={lang}
            t={t}
            threshold={threshold}
            onThresholdChange={setThreshold}
          />

          {/* Right Column: Interactive Confusion Matrix Heatmap */}
          <ConfusionMatrixHeatmap
            lang={lang}
            t={t}
            threshold={threshold}
          />
        </div>

        {/* 3. Dynamic Feature Importance Bar Chart */}
        <FeatureImportanceChart lang={lang} t={t} />
      </div>
    </section>
  );
}

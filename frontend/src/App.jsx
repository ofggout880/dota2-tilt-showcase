import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  getTranslation, 
  translateBinLabel, 
  translatePlayerCount, 
  translateFeatureKey, 
  translateRankTier 
} from './translations';
import AlgorithmReview from './components/AlgorithmReview';

// --- Composants de graphiques SVG Interactifs (Premium) ---

function ImbalanceBarChart({ data, lang = 'fr' }) {
  if (!data || data.length === 0) return <div className="spinner"></div>;
  
  const width = 500;
  const height = 240;
  const paddingLeft = 50;
  const paddingBottom = 40;
  const paddingTop = 20;
  const paddingRight = 20;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  const maxVal = 0.80; // 80% max pour l'échelle
  
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="imbalance-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="rgba(6, 182, 212, 0.1)" />
          <stop offset="100%" stopColor="rgba(6, 182, 212, 0.7)" />
        </linearGradient>
      </defs>
      
      {/* Grid Lines & Y Labels */}
      {[0, 0.20, 0.40, 0.60, 0.80].map((val, idx) => {
        const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;
        return (
          <g key={idx}>
            <line 
              x1={paddingLeft} 
              y1={y} 
              x2={width - paddingRight} 
              y2={y} 
              stroke="rgba(255, 255, 255, 0.05)" 
              strokeDasharray="4 4"
            />
            <text 
              x={paddingLeft - 10} 
              y={y + 4} 
              fill="var(--color-text-secondary)" 
              fontSize="10" 
              textAnchor="end"
            >
              {(val * 100).toFixed(0)}%
            </text>
          </g>
        );
      })}
      
      {/* Bars */}
      {data.map((item, idx) => {
        const barWidth = 65;
        const spacing = chartWidth / data.length;
        const x = paddingLeft + idx * spacing + (spacing - barWidth) / 2;
        const barHeight = (item.churn_rate / maxVal) * chartHeight;
        const y = paddingTop + chartHeight - barHeight;
        
        return (
          <g key={idx} className="chart-bar-group">
            {/* Bar */}
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="url(#imbalance-grad)"
              stroke="var(--accent-cyan)"
              strokeWidth="1.5"
              rx="6"
              className="interactive-bar"
              style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
            />
            {/* Value label on top of bar */}
            <text
              x={x + barWidth / 2}
              y={y - 8}
              fill="white"
              fontSize="11"
              fontWeight="800"
              textAnchor="middle"
            >
              {(item.churn_rate * 100).toFixed(1)}%
            </text>
            {/* X Axis Label */}
            <text
              x={x + barWidth / 2}
              y={height - paddingBottom + 18}
              fill="var(--color-text-primary)"
              fontSize="10.5"
              fontWeight="500"
              textAnchor="middle"
            >
              {translateBinLabel(item.bin, lang).split(" (")[0]}
            </text>
            <text
              x={x + barWidth / 2}
              y={height - paddingBottom + 30}
              fill="rgba(255,255,255,0.3)"
              fontSize="9"
              textAnchor="middle"
            >
              {translatePlayerCount(item.player_count, lang)}
            </text>
          </g>
        );
      })}
      
      {/* Base Line */}
      <line 
        x1={paddingLeft} 
        y1={paddingTop + chartHeight} 
        x2={width - paddingRight} 
        y2={paddingTop + chartHeight} 
        stroke="rgba(255,255,255,0.15)"
      />
    </svg>
  );
}

function StreakBarChart({ data, lang = 'fr' }) {
  if (!data || data.length === 0) return <div className="spinner"></div>;
  
  const width = 500;
  const height = 240;
  const paddingLeft = 50;
  const paddingBottom = 40;
  const paddingTop = 20;
  const paddingRight = 20;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  const maxVal = 0.80; // 80% max pour l'échelle
  
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="streak-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="rgba(244, 63, 94, 0.1)" />
          <stop offset="100%" stopColor="rgba(244, 63, 94, 0.7)" />
        </linearGradient>
      </defs>
      
      {/* Grid Lines & Y Labels */}
      {[0, 0.20, 0.40, 0.60, 0.80].map((val, idx) => {
        const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;
        return (
          <g key={idx}>
            <line 
              x1={paddingLeft} 
              y1={y} 
              x2={width - paddingRight} 
              y2={y} 
              stroke="rgba(255, 255, 255, 0.05)" 
              strokeDasharray="4 4"
            />
            <text 
              x={paddingLeft - 10} 
              y={y + 4} 
              fill="var(--color-text-secondary)" 
              fontSize="10" 
              textAnchor="end"
            >
              {(val * 100).toFixed(0)}%
            </text>
          </g>
        );
      })}
      
      {/* Bars */}
      {data.map((item, idx) => {
        const barWidth = 65;
        const spacing = chartWidth / data.length;
        const x = paddingLeft + idx * spacing + (spacing - barWidth) / 2;
        const barHeight = (item.churn_rate / maxVal) * chartHeight;
        const y = paddingTop + chartHeight - barHeight;
        
        return (
          <g key={idx} className="chart-bar-group">
            {/* Bar */}
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="url(#streak-grad)"
              stroke="var(--accent-rose)"
              strokeWidth="1.5"
              rx="6"
              className="interactive-bar"
              style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
            />
            {/* Value label on top of bar */}
            <text
              x={x + barWidth / 2}
              y={y - 8}
              fill="white"
              fontSize="11"
              fontWeight="800"
              textAnchor="middle"
            >
              {(item.churn_rate * 100).toFixed(1)}%
            </text>
            {/* X Axis Label */}
            <text
              x={x + barWidth / 2}
              y={height - paddingBottom + 18}
              fill="var(--color-text-primary)"
              fontSize="9.5"
              fontWeight="500"
              textAnchor="middle"
            >
              {translateBinLabel(item.bin, lang).split(" (")[0]}
            </text>
            <text
              x={x + barWidth / 2}
              y={height - paddingBottom + 30}
              fill="rgba(255,255,255,0.3)"
              fontSize="9"
              textAnchor="middle"
            >
              {translatePlayerCount(item.player_count, lang)}
            </text>
          </g>
        );
      })}
      
      {/* Base Line */}
      <line 
        x1={paddingLeft} 
        y1={paddingTop + chartHeight} 
        x2={width - paddingRight} 
        y2={paddingTop + chartHeight} 
        stroke="rgba(255,255,255,0.15)"
      />
    </svg>
  );
}

function CorrelationHorizontalChart({ correlations, lang = 'fr' }) {
  if (!correlations) return <div className="spinner"></div>;
  
  const width = 600;
  const height = 350;
  const paddingLeft = 190;
  const paddingRight = 40;
  const paddingTop = 20;
  const paddingBottom = 20;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  const sortedCorrs = Object.entries(correlations)
    .map(([feature, val]) => ({ feature, val }))
    .sort((a, b) => Math.abs(b.val) - Math.abs(a.val))
    .slice(0, 10);
    
  const maxVal = 0.40; // échelle max de corrélation
  const centerX = paddingLeft + chartWidth / 2;
  const rowHeight = chartHeight / sortedCorrs.length;
  
  const featureTranslations = {
    win_rate: "Taux de Victoires (Obs)",
    avg_kills: "Kills Moyens",
    avg_deaths: "Morts Moyennes",
    avg_assists: "Assists Moyennes",
    avg_kda: "KDA Moyen",
    avg_duration: "Durée Matchs Moy.",
    hero_diversity: "Diversité Héros",
    current_streak_at_cutoff: "Série Fin Session",
    avg_session_games: "Moyenne Parties / Session",
    avg_session_duration: "Durée Session Moy.",
    avg_session_gap_days: "Écart Sessions Moy.",
    avg_rank_imbalance: "Déséquilibre MMR Lobby",
    rank_tier: "Niveau du Rang (MMR)",
    games_analyzed: "Matchs Observés",
    abandon_rate: "Taux d'Abandons (Ragequit)",
    party_play_pct: "Parties en Groupe (%)",
    ranked_play_pct: "Parties Classées (%)",
    win_rate_trend: "Tendance Taux de Victoire",
    kda_trend: "Tendance KDA",
    gpm_trend: "Tendance Or/Min (GPM)",
    xpm_trend: "Tendance XP/Min (XPM)",
    deaths_trend: "Tendance Décès",
    kills_trend: "Tendance Kills",
    assists_trend: "Tendance Assists"
  };
  
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      {/* Center Line */}
      <line 
        x1={centerX} 
        y1={paddingTop} 
        x2={centerX} 
        y2={height - paddingBottom} 
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="1.5"
      />
      
      {/* Scale indicators */}
      {[-0.40, -0.20, 0, 0.20, 0.40].map((val, idx) => {
        const x = centerX + (val / maxVal) * (chartWidth / 2);
        return (
          <g key={idx}>
            {val !== 0 && (
              <line 
                x1={x} 
                y1={paddingTop} 
                x2={x} 
                y2={height - paddingBottom} 
                stroke="rgba(255, 255, 255, 0.04)" 
                strokeDasharray="2 2"
              />
            )}
            <text 
              x={x} 
              y={height - paddingBottom + 14} 
              fill="rgba(255,255,255,0.4)" 
              fontSize="9" 
              textAnchor="middle"
            >
              {val > 0 ? `+${val}` : val}
            </text>
          </g>
        );
      })}
      
      {/* Rows */}
      {sortedCorrs.map((item, idx) => {
        const y = paddingTop + idx * rowHeight + (rowHeight - 16) / 2;
        const barWidth = Math.abs(item.val / maxVal) * (chartWidth / 2);
        const x = item.val >= 0 ? centerX : centerX - barWidth;
        const barColor = item.val >= 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)';
        
        return (
          <g key={idx}>
            {/* Label */}
            <text
              x={paddingLeft - 12}
              y={y + 12}
              fill="var(--color-text-secondary)"
              fontSize="11"
              fontWeight="500"
              textAnchor="end"
            >
              {translateFeatureKey(item.feature, lang)}
            </text>
            
            {/* Row background bar */}
            <rect 
              x={paddingLeft} 
              y={y} 
              width={chartWidth} 
              height="16" 
              fill="rgba(255,255,255,0.01)"
              rx="3"
            />
            
            {/* Correlation bar */}
            <rect
              x={x}
              y={y}
              width={barWidth}
              height="16"
              fill={barColor}
              opacity="0.8"
              rx="3"
              className="interactive-bar"
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            />
            
            {/* Value overlay */}
            <text
              x={item.val >= 0 ? x + barWidth + 8 : x - 8}
              y={y + 12}
              fill="white"
              fontSize="10"
              fontWeight="700"
              textAnchor={item.val >= 0 ? "start" : "end"}
            >
              {(item.val >= 0 ? "+" : "") + item.val.toFixed(3)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ThresholdCurveChart({ curve, bestThreshold, lang = 'fr' }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  
  if (!curve || curve.length === 0) return <div className="spinner"></div>;
  
  const width = 600;
  const height = 260;
  const paddingLeft = 50;
  const paddingBottom = 45;
  const paddingTop = 20;
  const paddingRight = 30;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  const getX = (th) => paddingLeft + ((th - 0.02) / (0.98 - 0.02)) * chartWidth;
  const getY = (val) => paddingTop + chartHeight - val * chartHeight;
  
  let precPoints = [];
  let recPoints = [];
  let f1Points = [];
  
  curve.forEach((item) => {
    precPoints.push(`${getX(item.threshold)},${getY(item.precision)}`);
    recPoints.push(`${getX(item.threshold)},${getY(item.recall)}`);
    f1Points.push(`${getX(item.threshold)},${getY(item.f1_score)}`);
  });
  
  const precPath = `M ${precPoints.join(" L ")}`;
  const recPath = `M ${recPoints.join(" L ")}`;
  const f1Path = `M ${f1Points.join(" L ")}`;
  
  const bestIdx = curve.findIndex(item => Math.abs(item.threshold - bestThreshold) < 0.015);
  const activeIdx = hoveredIdx !== null ? hoveredIdx : (bestIdx !== -1 ? bestIdx : null);
  const activeItem = activeIdx !== null ? curve[activeIdx] : null;
  
  return (
    <div style={{ position: 'relative' }}>
      <svg 
        width="100%" 
        height={height} 
        viewBox={`0 0 ${width} ${height}`} 
        style={{ overflow: 'visible' }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clientX = e.clientX - rect.left;
          const pct = (clientX - (paddingLeft / width) * rect.width) / ((chartWidth / width) * rect.width);
          const rawTh = 0.02 + pct * (0.98 - 0.02);
          
          let closestIdx = 0;
          let minDiff = 999;
          curve.forEach((item, idx) => {
            const diff = Math.abs(item.threshold - rawTh);
            if (diff < minDiff) {
              minDiff = diff;
              closestIdx = idx;
            }
          });
          setHoveredIdx(closestIdx);
        }}
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {/* Y Axis grid lines */}
        {[0, 0.25, 0.50, 0.75, 1.0].map((val, idx) => {
          const y = getY(val);
          return (
            <g key={idx}>
              <line 
                x1={paddingLeft} 
                y1={y} 
                x2={width - paddingRight} 
                y2={y} 
                stroke="rgba(255, 255, 255, 0.05)"
              />
              <text 
                x={paddingLeft - 10} 
                y={y + 4} 
                fill="var(--color-text-secondary)" 
                fontSize="10" 
                textAnchor="end"
              >
                {(val * 100).toFixed(0)}%
              </text>
            </g>
          );
        })}
        
        {/* X Axis labels */}
        {[0.1, 0.3, 0.5, 0.7, 0.9].map((val, idx) => {
          const x = getX(val);
          return (
            <text 
              key={idx}
              x={x} 
              y={height - paddingBottom + 18} 
              fill="var(--color-text-secondary)" 
              fontSize="10" 
              textAnchor="middle"
            >
              {val.toFixed(1)}
            </text>
          );
        })}
        
        {/* X Axis title */}
        <text
          x={paddingLeft + chartWidth / 2}
          y={height - 10}
          fill="rgba(255,255,255,0.4)"
          fontSize="10"
          textAnchor="middle"
        >
          Seuil de Décision (Probability Cutoff)
        </text>
        
        {/* Precision line (Rose) */}
        <path 
          d={precPath} 
          fill="none" 
          stroke="var(--accent-rose)" 
          strokeWidth="2" 
        />
        
        {/* Recall line (Cyan) */}
        <path 
          d={recPath} 
          fill="none" 
          stroke="var(--accent-cyan)" 
          strokeWidth="2" 
        />
        
        {/* F1 Score line (Purple) */}
        <path 
          d={f1Path} 
          fill="none" 
          stroke="var(--accent-purple)" 
          strokeWidth="3" 
        />
        
        {/* Optimal / Active Vertical line */}
        {activeItem && (
          <g>
            <line
              x1={getX(activeItem.threshold)}
              y1={paddingTop}
              x2={getX(activeItem.threshold)}
              y2={height - paddingBottom}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Intersection dots */}
            <circle cx={getX(activeItem.threshold)} cy={getY(activeItem.precision)} r="4" fill="var(--accent-rose)" />
            <circle cx={getX(activeItem.threshold)} cy={getY(activeItem.recall)} r="4" fill="var(--accent-cyan)" />
            <circle cx={getX(activeItem.threshold)} cy={getY(activeItem.f1_score)} r="4" fill="var(--accent-purple)" />
          </g>
        )}
      </svg>
      
      {/* Tooltip Overlay */}
      {activeItem && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '30px',
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '12px 14px',
          borderRadius: '8px',
          backdropFilter: 'blur(8px)',
          fontSize: '0.8rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          minWidth: '160px',
          pointerEvents: 'none'
        }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px', fontWeight: 'bold', color: 'white' }}>
            {lang === 'en' ? 'Threshold' : 'Seuil'} : {activeItem.threshold.toFixed(2)}
            {Math.abs(activeItem.threshold - bestThreshold) < 0.015 && (
              <span style={{ marginLeft: '6px', fontSize: '0.7rem', background: 'var(--accent-purple)', padding: '2px 4px', borderRadius: '4px' }}>Tuned</span>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--accent-purple)' }}>F1-Score:</span>
            <strong>{(activeItem.f1_score * 100).toFixed(1)}%</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--accent-rose)' }}>{lang === 'en' ? 'Precision:' : 'Précision:'}</span>
            <strong>{(activeItem.precision * 100).toFixed(1)}%</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--accent-cyan)' }}>{lang === 'en' ? 'Recall:' : 'Rappel:'}</span>
            <strong>{(activeItem.recall * 100).toFixed(1)}%</strong>
          </div>
        </div>
      )}
    </div>
  );
}

function ModelMetricsChart({ metrics, lang = 'fr' }) {
  if (!metrics) return <div className="spinner"></div>;
  
  const width = 500;
  const height = 180;
  const paddingLeft = 110;
  const paddingRight = 45;
  const paddingTop = 5;
  const paddingBottom = 5;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  const list = lang === 'en' ? [
    { name: "Overall Accuracy", value: metrics.accuracy, color: "rgba(255,255,255,0.7)", desc: "Rate of correct predictions" },
    { name: "F1 Score", value: metrics.f1_score, color: "var(--accent-purple)", desc: "Precision / Recall balance" },
    { name: "Precision", value: metrics.precision, color: "var(--accent-rose)", desc: "Churn alert reliability" },
    { name: "Recall", value: metrics.recall, color: "var(--accent-cyan)", desc: "Churner detection rate" },
    { name: "ROC-AUC Score", value: metrics.auc_score, color: "var(--accent-emerald)", desc: "Overall discriminative power" }
  ] : [
    { name: "Précision Globale", value: metrics.accuracy, color: "rgba(255,255,255,0.7)", desc: "Taux de prédictions correctes" },
    { name: "Score F1", value: metrics.f1_score, color: "var(--accent-purple)", desc: "Harmonie Précision / Rappel" },
    { name: "Précision", value: metrics.precision, color: "var(--accent-rose)", desc: "Confiance de l'alerte Churn" },
    { name: "Rappel", value: metrics.recall, color: "var(--accent-cyan)", desc: "Taux de détection des churners" },
    { name: "ROC-AUC Score", value: metrics.auc_score, color: "var(--accent-emerald)", desc: "Pouvoir discriminatoire global" }
  ];
  
  const rowHeight = chartHeight / list.length;
  
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      {list.map((item, idx) => {
        const y = paddingTop + idx * rowHeight + (rowHeight - 14) / 2;
        const barWidth = item.value * chartWidth;
        
        return (
          <g key={idx}>
            {/* Label */}
            <text
              x={paddingLeft - 10}
              y={y + 11}
              fill="var(--color-text-secondary)"
              fontSize="10.5"
              fontWeight="600"
              textAnchor="end"
            >
              {item.name}
            </text>
            
            {/* Track background */}
            <rect 
              x={paddingLeft} 
              y={y} 
              width={chartWidth} 
              height="14" 
              fill="rgba(255,255,255,0.01)" 
              stroke="rgba(255,255,255,0.03)"
              rx="3"
            />
            
            {/* Bar */}
            <rect
              x={paddingLeft}
              y={y}
              width={barWidth}
              height="14"
              fill={item.color}
              opacity="0.85"
              rx="3"
            />
            
            {/* Percentage text */}
            <text
              x={paddingLeft + barWidth + 8}
              y={y + 11}
              fill="white"
              fontSize="9.5"
              fontWeight="bold"
            >
              {(item.value * 100).toFixed(1)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function SessionGamesBarChart({ data, lang = 'fr' }) {
  if (!data || data.length === 0) return <div className="spinner"></div>;
  
  const width = 500;
  const height = 240;
  const paddingLeft = 50;
  const paddingBottom = 40;
  const paddingTop = 20;
  const paddingRight = 20;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  const maxVal = 0.80; // 80% max pour l'échelle
  
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="session-games-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="rgba(168, 85, 247, 0.1)" />
          <stop offset="100%" stopColor="rgba(168, 85, 247, 0.7)" />
        </linearGradient>
      </defs>
      
      {/* Grid Lines & Y Labels */}
      {[0, 0.20, 0.40, 0.60, 0.80].map((val, idx) => {
        const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;
        return (
          <g key={idx}>
            <line 
              x1={paddingLeft} 
              y1={y} 
              x2={width - paddingRight} 
              y2={y} 
              stroke="rgba(255, 255, 255, 0.05)" 
              strokeDasharray="4 4"
            />
            <text 
              x={paddingLeft - 10} 
              y={y + 4} 
              fill="var(--color-text-secondary)" 
              fontSize="10" 
              textAnchor="end"
            >
              {(val * 100).toFixed(0)}%
            </text>
          </g>
        );
      })}
      
      {/* Bars */}
      {data.map((item, idx) => {
        const barWidth = 55;
        const spacing = chartWidth / data.length;
        const x = paddingLeft + idx * spacing + (spacing - barWidth) / 2;
        const barHeight = (item.churn_rate / maxVal) * chartHeight;
        const y = paddingTop + chartHeight - barHeight;
        
        return (
          <g key={idx} className="chart-bar-group">
            {/* Bar */}
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="url(#session-games-grad)"
              stroke="var(--accent-purple)"
              strokeWidth="1.5"
              rx="6"
              className="interactive-bar"
              style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
            />
            {/* Value label on top of bar */}
            <text
              x={x + barWidth / 2}
              y={y - 8}
              fill="white"
              fontSize="11"
              fontWeight="800"
              textAnchor="middle"
            >
              {(item.churn_rate * 100).toFixed(1)}%
            </text>
            {/* X Axis Label */}
            <text
              x={x + barWidth / 2}
              y={height - paddingBottom + 18}
              fill="var(--color-text-primary)"
              fontSize="9"
              fontWeight="500"
              textAnchor="middle"
            >
              {translateBinLabel(item.bin, lang)}
            </text>
            <text
              x={x + barWidth / 2}
              y={height - paddingBottom + 30}
              fill="rgba(255,255,255,0.3)"
              fontSize="8.5"
              textAnchor="middle"
            >
              {translatePlayerCount(item.player_count, lang)}
            </text>
          </g>
        );
      })}
      
      {/* Base Line */}
      <line 
        x1={paddingLeft} 
        y1={paddingTop + chartHeight} 
        x2={width - paddingRight} 
        y2={paddingTop + chartHeight} 
        stroke="rgba(255,255,255,0.15)"
      />
    </svg>
  );
}

// --- Mock de Live Matchmaking ---
const simulateLiveMatch = (matchId, lang = 'fr') => {
  const ranksFr = ["Héraut", "Gardien", "Croisé", "Archonte", "Légende", "Ancien", "Divin", "Immortel"];
  const ranksEn = ["Herald", "Guardian", "Crusader", "Archon", "Legend", "Ancient", "Divine", "Immortal"];
  const ranks = lang === 'en' ? ranksEn : ranksFr;
  const baseRankIndex = Math.floor(Math.random() * (ranks.length - 2)) + 1; 

  const generatePlayer = (isRadiant, slot) => {
    let rankIdx = baseRankIndex + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0);
    rankIdx = Math.max(0, Math.min(ranks.length - 1, rankIdx));
    
    let churnRisk = Math.random() * 100;
    
    const isTilted = Math.random() > 0.8;
    if (isTilted) churnRisk = 75 + Math.random() * 20;
    
    if (Math.random() > 0.9) churnRisk = Math.random() * 10;
    
    const names = ["ShadowSniper", "MidOrFeed", "SupaCarry", "PudgeHooker", "SupportMain", "xX_Slayer_Xx", "GamerPro2000", "NoobMaster", "DendiFace", "Miracle_Fan", "ToxicPlayer", "SilentAssassin", "RageQuitter", "Pos5Slave", "WardingBot"];
    
    return {
      id: Math.floor(Math.random() * 999999999),
      name: names[Math.floor(Math.random() * names.length)] + (Math.floor(Math.random() * 99)),
      rank: ranks[rankIdx],
      churnRisk: churnRisk,
      isTilted: isTilted,
      isRadiant: isRadiant
    };
  };

  const players = [];
  for(let i=0; i<5; i++) players.push(generatePlayer(true, i));
  for(let i=0; i<5; i++) players.push(generatePlayer(false, i));
  return players;
};

// --- Composant Carte Joueur (Live Matchmaking) ---
function PlayerCard({ player, lang = 'fr' }) {
  const isHighRisk = player.churnRisk > 75;
  const isMediumRisk = player.churnRisk > 40 && player.churnRisk <= 75;
  
  let riskColor = 'var(--accent-emerald)'; // Vert
  let riskGlow = 'rgba(16, 185, 129, 0.2)';
  if (isMediumRisk) {
    riskColor = '#f59e0b'; // Orange
    riskGlow = 'rgba(245, 158, 11, 0.2)';
  } else if (isHighRisk) {
    riskColor = 'var(--accent-rose)'; // Rouge
    riskGlow = 'rgba(244, 63, 94, 0.4)';
  }

  return (
    <div className={`player-live-card ${isHighRisk ? 'high-risk-card' : ''}`}>
      <div className="player-info-row">
        <div className="player-avatar-placeholder">
          <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${player.name}`} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
        </div>
        <div className="player-details">
          <div className="player-name">{player.name}</div>
          <div className="player-rank">{player.rank}</div>
        </div>
        {player.isTilted && (
          <div className="tilt-badge" title={lang === 'en' ? "Defeat streak / Recent abandons" : "Série de défaites / Abandons récents"}>
            {lang === 'en' ? "🔥 Tilted" : "🔥 Tilté"}
          </div>
        )}
      </div>
      
      <div className="churn-risk-section">
        <div className="risk-header">
          <span className="risk-label">{lang === 'en' ? "Churn Risk (if defeat)" : "Risque de Churn (si défaite)"}</span>
          <span className="risk-value" style={{ color: riskColor, fontWeight: 'bold' }}>{player.churnRisk.toFixed(1)}%</span>
        </div>
        <div className="risk-bar-bg">
          <div 
            className="risk-bar-fill" 
            style={{ 
              width: `${player.churnRisk}%`, 
              backgroundColor: riskColor,
              boxShadow: `0 0 10px ${riskGlow}`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('dota_lang') || 'fr';
  });
  const t = getTranslation(lang);

  const [backendStatus, setBackendStatus] = useState({
    status: 'checking',
    api_key_configured: false,
    opendota_api_connection: 'checking',
    total_heroes: 0
  });
  
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  
  const [accountIdInput, setAccountIdInput] = useState('');
  const [searchingPlayer, setSearchingPlayer] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [searchError, setSearchError] = useState(null);
  
  const [heroes, setHeroes] = useState({});
  const [activeTab, setActiveTab] = useState('analyses'); // 'analyses', 'visualizations', 'ml_predictions', 'history', 'live_matchmaking'
  const [visData, setVisData] = useState(null);
  const [loadingVis, setLoadingVis] = useState(false);

  // États Live Matchmaking
  const [liveMatchId, setLiveMatchId] = useState('');
  const [liveMatchPlayers, setLiveMatchPlayers] = useState(null);
  const [isSimulatingLive, setIsSimulatingLive] = useState(false);

  const handleSimulateLiveMatch = () => {
    if (!liveMatchId) return;
    setIsSimulatingLive(true);
    setLiveMatchPlayers(null);
    setTimeout(() => {
      setLiveMatchPlayers(simulateLiveMatch(liveMatchId, lang));
      setIsSimulatingLive(false);
    }, 1500);
  };

  // États pour la collecte de données
  const [collectionStatus, setCollectionStatus] = useState({
    status: 'idle',
    matches_completed: 0,
    matches_total: 0,
    players_completed: 0,
    players_total: 0,
    current_message: 'Aucune collecte démarrée.',
    log_messages: [],
    dataset_exists: false,
    dataset_size: 0,
    total_api_calls: 0,
    estimated_cost_usd: 0.0
  });
  const [datasetPreview, setDatasetPreview] = useState(null);
  const [startingCollection, setStartingCollection] = useState(false);
  const [appConfig, setAppConfig] = useState({ free_tier: true, auto_collect: true });
  
  // Historique local des exports
  const [exportHistory, setExportHistory] = useState(() => {
    const defaultHistory = [
      {
        date: "20 Sep 2026 15:20",
        profiles_collected: 16981,
        matches_analyzed: 5000,
        mode: "Plan Premium",
        status: "completed",
        timestamp: 1790080000000
      },
      {
        date: "20 Sep 2026 10:45",
        profiles_collected: 21024,
        matches_analyzed: 4500,
        mode: "Plan Premium",
        status: "completed",
        timestamp: 1790060000000
      },
      {
        date: "19 Sep 2026 18:30",
        profiles_collected: 3450,
        matches_analyzed: 1500,
        mode: "Plan Gratuit",
        status: "completed",
        timestamp: 1790000000000
      },
      {
        date: "18 Sep 2026 14:15",
        profiles_collected: 1200,
        matches_analyzed: 1500,
        mode: "Plan Gratuit",
        status: "completed",
        timestamp: 1789000000000
      }
    ];

    try {
      const saved = localStorage.getItem('dota2_v4_export_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          // Fusionner l'historique local avec notre base par défaut sans doublons
          const all = [...parsed, ...defaultHistory];
          const unique = all.filter((v, i, a) => a.findIndex(t => (t.timestamp === v.timestamp)) === i);
          return unique.sort((a, b) => b.timestamp - a.timestamp);
        }
      }
      return defaultHistory;
    } catch {
      return defaultHistory;
    }
  });

  // États pour le Machine Learning (Churn)
  const [mlStatus, setMlStatus] = useState({
    trained: false,
    metrics: null,
    loading: false,
    error: null
  });
  const [trainingInProgress, setTrainingInProgress] = useState(false);

  // Simulateur de prédiction
  const [simAccountId, setSimAccountId] = useState('');
  const [predictingSim, setPredictingSim] = useState(false);
  const [simResult, setSimResult] = useState(null);
  const [simError, setSimError] = useState(null);

  const API_BASE_URL = 'http://localhost:8001';

  // Charger le statut du backend, les tâches et le statut de collecte
  const fetchStatusAndTasks = async () => {
    try {
      const statusRes = await fetch(`${API_BASE_URL}/api/status`);
      const statusData = await statusRes.json();
      setBackendStatus(statusData);
    } catch (err) {
      setBackendStatus({
        status: 'offline',
        api_key_configured: false,
        opendota_api_connection: 'failed',
        error: 'Backend inaccessible'
      });
    }

    try {
      setLoadingTasks(true);
      const tasksRes = await fetch(`${API_BASE_URL}/api/tasks`);
      const tasksData = await tasksRes.json();
      if (tasksData.tasks) {
        setTasks(tasksData.tasks);
      }
    } catch (err) {
      console.error('Erreur chargement tâches:', err);
    } finally {
      setLoadingTasks(false);
    }

    await fetchCollectionStatus();
    await fetchMlMetrics();
  };

  const fetchCollectionStatus = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/collection/status`);
      const data = await res.json();
      setCollectionStatus(data);
      
      if (data.dataset_exists && (!datasetPreview || data.status === 'completed')) {
        fetchDatasetPreview();
      }
    } catch (err) {
      console.error('Erreur statut collecte:', err);
    }
  };

  const fetchDatasetPreview = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/dataset/preview`);
      const data = await res.json();
      if (data.exists) {
        setDatasetPreview(data);
      }
    } catch (err) {
      console.error('Erreur aperçu dataset:', err);
    }
  };

  const fetchVisualizations = async () => {
    setLoadingVis(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ml/visualizations`);
      if (res.ok) {
        const data = await res.json();
        setVisData(data);
      }
    } catch (err) {
      console.error('Erreur chargement visualisations:', err);
    } finally {
      setLoadingVis(false);
    }
  };

  // Charger les métriques ML
  const fetchMlMetrics = async () => {
    setMlStatus(prev => ({ ...prev, loading: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/ml/metrics`);
      const data = await res.json();
      setMlStatus({
        trained: data.trained,
        metrics: data.metrics,
        loading: false,
        error: null
      });
    } catch (err) {
      setMlStatus(prev => ({
        ...prev,
        loading: false,
        error: 'Impossible de charger les métriques du modèle.'
      }));
    }
  };

  // Entraîner le modèle ML
  const handleTrainModel = async () => {
    setTrainingInProgress(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ml/train`, {
        method: 'POST'
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Erreur lors de l'entraînement.");
      }
      const data = await res.json();
      setMlStatus({
        trained: true,
        metrics: data.metrics,
        loading: false,
        error: null
      });
      // Rafraîchir les tâches pour mettre à jour task.md et les visualisations
      const tasksRes = await fetch(`${API_BASE_URL}/api/tasks`);
      const tasksData = await tasksRes.json();
      if (tasksData.tasks) setTasks(tasksData.tasks);
      fetchVisualizations();
    } catch (err) {
      console.error(err);
      alert(`Erreur d'entraînement: ${err.message}`);
    } finally {
      setTrainingInProgress(false);
    }
  };

  // Démarrer la collecte de données
  const handleStartCollection = async () => {
    setStartingCollection(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/collection/start`, {
        method: 'POST',
      });
      await fetchCollectionStatus();
      const tasksRes = await fetch(`${API_BASE_URL}/api/tasks`);
      const tasksData = await tasksRes.json();
      if (tasksData.tasks) setTasks(tasksData.tasks);
    } catch (err) {
      console.error('Erreur lancement collecte:', err);
    } finally {
      setStartingCollection(false);
    }
  };

  // Lancer la prédiction du simulateur
  const handleSimPredict = async (e) => {
    e.preventDefault();
    if (!simAccountId.trim()) return;
    setPredictingSim(true);
    setSimError(null);
    setSimResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/predict/${simAccountId.trim()}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Erreur lors de la prédiction.");
      }
      const data = await res.json();
      setSimResult(data);
    } catch (err) {
      setSimError(err.message);
    } finally {
      setPredictingSim(false);
    }
  };

  // Charger la liste des héros
  const fetchHeroes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/heroes`);
      const data = await res.json();
      const heroMap = {};
      data.forEach(hero => {
        heroMap[hero.id] = hero;
      });
      setHeroes(heroMap);
    } catch (err) {
      console.error('Erreur chargement héros:', err);
    }
  };
  
  const fetchAppConfig = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/config`);
      const data = await res.json();
      setAppConfig(data);
    } catch (err) {
      console.error('Erreur chargement config:', err);
    }
  };

  useEffect(() => {
    fetchStatusAndTasks();
    fetchHeroes();
    fetchVisualizations();
    fetchAppConfig();
  }, []);

  // Polling du statut de collecte
  useEffect(() => {
    let intervalId = null;
    if (collectionStatus.status === 'in_progress') {
      intervalId = setInterval(() => {
        fetchCollectionStatus();
        fetch(`${API_BASE_URL}/api/tasks`)
          .then(res => res.json())
          .then(data => { if (data.tasks) setTasks(data.tasks); });
      }, 3000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [collectionStatus.status]);

  // Enregistrer automatiquement les collectes terminées dans l'historique local
  useEffect(() => {
    if (collectionStatus.status === 'completed' && collectionStatus.last_run_timestamp) {
      const timestamp = collectionStatus.last_run_timestamp;
      
      // Vérifier si cette collecte est déjà enregistrée
      const exists = exportHistory.some(item => item.timestamp === timestamp);
      
      if (!exists) {
        const newExport = {
          timestamp: timestamp,
          date: new Date(timestamp * 1000).toLocaleString('fr-FR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          }),
          profiles_collected: collectionStatus.players_completed || 600,
          matches_analyzed: collectionStatus.matches_completed || 200,
          mode: appConfig.free_tier ? 'Plan Gratuit' : 'Premium',
          status: 'completed'
        };
        
        const updatedHistory = [newExport, ...exportHistory].slice(0, 50); // Garder les 50 derniers
        setExportHistory(updatedHistory);
        localStorage.setItem('dota2_v4_export_history', JSON.stringify(updatedHistory));
      }
    }
  }, [collectionStatus.status, collectionStatus.last_run_timestamp]);

  useEffect(() => {
    const logBox = document.getElementById('log-box');
    if (logBox) {
      logBox.scrollTop = logBox.scrollHeight;
    }
  }, [collectionStatus.log_messages]);

  // Recherche d'un joueur
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!accountIdInput.trim()) return;

    setSearchingPlayer(true);
    setSearchError(null);
    setPlayerData(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/player/${accountIdInput.trim()}`);
      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: Profil privé ou introuvable`);
      }
      const data = await res.json();
      setPlayerData(data);
    } catch (err) {
      setSearchError(err.message || 'Impossible de charger les données du joueur.');
    } finally {
      setSearchingPlayer(false);
    }
  };

  const loadExamplePlayer = (id) => {
    setAccountIdInput(id);
  };

  useEffect(() => {
    if (accountIdInput) {
      handleSearch();
    }
  }, [accountIdInput]);

  const getHeroImageUrl = (heroId) => {
    const hero = heroes[heroId];
    if (!hero || !hero.name) return 'https://via.placeholder.com/44x25?text=?';
    const shortName = hero.name.replace('npc_dota_hero_', '');
    return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${shortName}.png`;
  };

  const getHeroName = (heroId) => {
    return heroes[heroId]?.localized_name || `Héros #${heroId}`;
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (startTime) => {
    const diff = Math.floor(Date.now() / 1000) - startTime;
    const days = Math.floor(diff / 86400);
    if (days === 0) return lang === 'en' ? 'Today' : 'Aujourd\'hui';
    if (days === 1) return lang === 'en' ? 'Yesterday' : 'Hier';
    return lang === 'en' ? `${days} days ago` : `Il y a ${days} jours`;
  };

  const getRankName = (rankTier) => {
    return translateRankTier(rankTier, lang);
  };

  const translateFeature = (feature) => {
    return translateFeatureKey(feature, lang);
  };

  const getRiskColor = (prob) => {
    if (prob >= 0.50) return '#ef4444'; // Rouge
    if (prob >= 0.25) return '#06b6d4'; // Cyan
    return '#10b981'; // Vert Émeraude
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">
          {t.header.title} <span>{t.header.subtitle}</span>
        </h1>
        <div className="status-indicator">
          {/* Language Switcher */}
          <div className="lang-switcher">
            <button 
              className={`lang-btn ${lang === 'fr' ? 'active' : ''}`}
              onClick={() => { setLang('fr'); localStorage.setItem('dota_lang', 'fr'); }}
              title="Passer en Français"
            >
              🇫🇷 FR
            </button>
            <button 
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => { setLang('en'); localStorage.setItem('dota_lang', 'en'); }}
              title="Switch to English"
            >
              🇬🇧 EN
            </button>
          </div>

          <div className="status-pill">
            <span>{t.header.localServer}:</span>
            <span className={`status-dot ${backendStatus.status === 'healthy' ? 'active' : 'inactive'}`}></span>
            <strong>{backendStatus.status === 'healthy' ? t.header.online : t.header.offline}</strong>
          </div>
          <div className="status-pill">
            <span>{t.header.openDotaApi}:</span>
            <span className={`status-dot ${backendStatus.opendota_api_connection === 'success' ? 'active' : 'inactive'}`}></span>
            <strong>{backendStatus.opendota_api_connection === 'success' ? t.header.connected : t.header.error}</strong>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      {/* Main Full Width Layout */}
      <div className="full-width-container">
        <div className="glass-card" style={{ minHeight: '600px' }}>
          
          {/* Onglets */}
          <div className="tabs-header">
            <button
              className={`tab-btn ${activeTab === 'analyses' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('analyses');
                fetchVisualizations();
              }}
            >
              {t.tabs.analyses}
            </button>
            <button
              className={`tab-btn ${activeTab === 'algorithm_review' ? 'active' : ''}`}
              style={{ border: '1px solid var(--accent-cyan)', color: activeTab === 'algorithm_review' ? 'white' : 'var(--accent-cyan)' }}
              onClick={() => {
                setActiveTab('algorithm_review');
                fetchMlMetrics();
              }}
            >
              {t.tabs.algorithm_review}
            </button>
            <button
              className={`tab-btn ${activeTab === 'visualizations' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('visualizations');
                fetchCollectionStatus();
              }}
            >
              {t.tabs.visualizations}
            </button>
            <button
              className={`tab-btn ${activeTab === 'ml_predictions' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('ml_predictions');
                fetchMlMetrics();
                fetchVisualizations();
              }}
            >
              {t.tabs.ml_predictions}
            </button>
            <button
              className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('history');
                fetchMlMetrics();
              }}
            >
              {t.tabs.history}
            </button>
            <button
              className={`tab-btn ${activeTab === 'lesson' ? 'active' : ''}`}
              style={{ border: '1px solid var(--accent-emerald)', color: activeTab === 'lesson' ? 'white' : 'var(--accent-emerald)' }}
              onClick={() => {
                setActiveTab('lesson');
              }}
            >
              {t.tabs.lesson}
            </button>
            <button
              className={`tab-btn ${activeTab === 'live_matchmaking' ? 'active' : ''}`}
              style={{ background: activeTab === 'live_matchmaking' ? 'linear-gradient(45deg, #f43f5e, #e11d48)' : '', border: activeTab === 'live_matchmaking' ? 'none' : '' }}
              onClick={() => {
                setActiveTab('live_matchmaking');
              }}
            >
              {t.tabs.live_matchmaking}
            </button>
          </div>

          {/* Contenu - Analyses & Hypothèses */}
          {activeTab === 'analyses' && (
            <div className="collection-panel">
              <div>
                <h2 className="section-title">{t.analyses.title}</h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {t.analyses.subtitle}
                </p>
              </div>

              {loadingVis ? (
                <div className="spinner-container" style={{ minHeight: '300px' }}>
                  <div className="spinner"></div>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{lang === 'en' ? 'Computing dataset statistics and correlations...' : 'Calcul des corrélations et statistiques du dataset...'}</p>
                </div>
              ) : visData ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  
                  {/* Row 1: Charts side-by-side (3 Columns) */}
                  <div className="charts-grid-three-cols">
                    <div className="glass-card chart-card" style={{ background: 'rgba(0,0,0,0.1)', padding: '20px' }}>
                      <h3 style={{ fontSize: '0.95rem', marginBottom: '8px', color: 'white', fontWeight: 600 }}>
                        {t.analyses.chartXpmTitle}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                        {t.analyses.chartXpmSubtitle}
                      </p>
                      <ImbalanceBarChart data={visData.imbalance_stats} lang={lang} />
                    </div>

                    <div className="glass-card chart-card" style={{ background: 'rgba(0,0,0,0.1)', padding: '20px' }}>
                      <h3 style={{ fontSize: '0.95rem', marginBottom: '8px', color: 'white', fontWeight: 600 }}>
                        {t.analyses.chartTiltTitle}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                        {t.analyses.chartTiltSubtitle}
                      </p>
                      <StreakBarChart data={visData.streak_stats} lang={lang} />
                    </div>

                    <div className="glass-card chart-card" style={{ background: 'rgba(0,0,0,0.1)', padding: '20px' }}>
                      <h3 style={{ fontSize: '0.95rem', marginBottom: '8px', color: 'white', fontWeight: 600 }}>
                        {t.analyses.chartSessionTitle}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                        {t.analyses.chartSessionSubtitle}
                      </p>
                      <SessionGamesBarChart data={visData.session_stats} lang={lang} />
                    </div>
                  </div>

                  {/* Row 2: Relevance Analysis Card */}
                  <div className="glass-card chart-card" style={{ background: 'rgba(0,0,0,0.1)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h3 style={{ fontSize: '1rem', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {t.analyses.relevanceTitle}
                    </h3>
                    <div style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
                      <p style={{ marginBottom: '10px' }}>
                        {t.analyses.relevanceIntro}
                      </p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }} className="charts-grid-two-cols">
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '6px', fontSize: '0.9rem' }}>{t.analyses.relevanceWhyTitle}</h4>
                          <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <li>
                              <strong>{t.analyses.relevanceWhy1Bold}</strong> {t.analyses.relevanceWhy1Text}
                            </li>
                            <li>
                              <strong>{t.analyses.relevanceWhy2Bold}</strong> {t.analyses.relevanceWhy2Text}
                            </li>
                          </ul>
                        </div>
                        
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <h4 style={{ color: 'var(--accent-rose)', marginBottom: '6px', fontSize: '0.9rem' }}>{t.analyses.relevanceLimitsTitle}</h4>
                          <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <li>
                              <strong>{t.analyses.relevanceLimit1Bold}</strong> {t.analyses.relevanceLimit1Text}
                            </li>
                            <li>
                              <strong>{t.analyses.relevanceLimit2Bold}</strong> {t.analyses.relevanceLimit2Text}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Correlation Horizontal Chart */}
                  <div className="glass-card chart-card" style={{ background: 'rgba(0,0,0,0.1)', padding: '20px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '8px', color: 'white', fontWeight: 600 }}>
                      {t.analyses.correlationsTitle}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                      {t.analyses.correlationsSubtitle}
                    </p>
                    <CorrelationHorizontalChart correlations={visData.correlations} lang={lang} />
                  </div>

                  {/* Row 3: Synthèse V6 (XGBoost) */}
                  <div className="glass-card chart-card" style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <h3 style={{ fontSize: '1rem', color: 'var(--accent-emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        {t.analyses.v6Title}
                      </h3>
                      <button
                        onClick={() => {
                          setActiveTab('algorithm_review');
                          fetchMlMetrics();
                        }}
                        style={{
                          background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(16,185,129,0.15) 100%)',
                          border: '1px solid var(--accent-cyan)',
                          color: 'var(--accent-cyan)',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {t.analyses.v6CtaButton}
                      </button>
                    </div>
                    <div style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
                      <p style={{ marginBottom: '10px' }}>
                        {t.analyses.v6Intro}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.82rem' }}>
                        <span style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 10px', borderRadius: '6px', color: 'white' }}>
                          <strong>{t.analyses.v6Point1Bold}</strong> {t.analyses.v6Point1Text}
                        </span>
                        <span style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '4px 10px', borderRadius: '6px', color: 'white' }}>
                          <strong>{t.analyses.v6Point2Bold}</strong> {t.analyses.v6Point2Text}
                        </span>
                        <span style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '4px 10px', borderRadius: '6px', color: 'white' }}>
                          <strong>{t.analyses.v6Point3Bold}</strong> {t.analyses.v6Point3Text}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="empty-state" style={{ padding: '40px' }}>
                  <div className="empty-icon">📊</div>
                  <div className="empty-title">{t.analyses.emptyTitle}</div>
                  <div className="empty-desc" style={{ maxWidth: '500px', marginBottom: '24px' }}>
                    {t.analyses.emptyDesc}
                  </div>
                  <button 
                    onClick={() => setActiveTab('visualizations')} 
                    className="btn"
                  >
                    {lang === 'en' ? '🚀 Go to Data Collection' : '🚀 Aller à la collecte de données'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Contenu - Revue de l'Algorithme (Audit & Évaluation) */}
          {activeTab === 'algorithm_review' && (
            <AlgorithmReview
              lang={lang}
              t={t}
              mlStatus={mlStatus}
            />
          )}

            {/* Contenu - Visualisation & Données (Dataset) */}
            {activeTab === 'visualizations' && (() => {
              const fallbackPlayers = collectionStatus.players_completed || 
                ((collectionStatus.status === 'completed' || collectionStatus.status === 'idle') ? collectionStatus.dataset_size : 0);
              const computedCalls = collectionStatus.total_api_calls || 
                (25 + (collectionStatus.matches_completed || 0) + (fallbackPlayers || 0) * 2);
              const computedCost = collectionStatus.estimated_cost_usd !== undefined ? collectionStatus.estimated_cost_usd : 0;
              const isPaidPlan = !appConfig.free_tier;
              
              // Formater la date du dernier run automatique
              const formatLastRun = (timestamp) => {
                if (!timestamp) return 'Aucune collecte effectuée.';
                const date = new Date(timestamp * 1000);
                return date.toLocaleString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                });
              };
              
              // Estimer le temps restant avant le prochain run (24h après le dernier)
              const getNextRunEstimate = (timestamp) => {
                if (!timestamp) return 'Immédiat (au démarrage du planificateur)';
                const nextRunTime = (timestamp + 86400) * 1000;
                const now = Date.now();
                if (now >= nextRunTime) return 'Planifié (en attente du cycle)';
                const diffMs = nextRunTime - now;
                const diffHours = Math.floor(diffMs / 3600000);
                const diffMinutes = Math.floor((diffMs % 3600000) / 60000);
                return `dans environ ${diffHours}h ${diffMinutes}min`;
              };
              
              return (
                <div className="collection-panel">
                  <h2 className="section-title">{t.dataBudget.title}</h2>
                  
                  {computedCalls > 25 && (
                    <div className="api-cost-summary" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                      <div className="api-cost-column">
                        <span style={{ fontSize: '1.4rem' }}>⚡</span>
                        <div className="api-cost-details">
                          <span className="api-cost-label">{isPaidPlan ? t.dataBudget.apiCallsPaid : t.dataBudget.apiCallsFree}</span>
                          <span className="api-cost-value">{computedCalls} {t.dataBudget.requests}</span>
                        </div>
                      </div>
                      <div className="api-cost-column">
                        <span style={{ fontSize: '1.4rem' }}>💰</span>
                        <div className="api-cost-details">
                          <span className="api-cost-label">{t.dataBudget.cumulatedCost}</span>
                          <span className="api-cost-value">{isPaidPlan ? "2.00$" : t.dataBudget.freeCost}</span>
                        </div>
                      </div>
                      <div className="api-cost-column">
                        <span style={{ fontSize: '1.4rem' }}>🎁</span>
                        <div className="api-cost-details">
                          <span className="api-cost-label">{t.dataBudget.sessionCost}</span>
                          <span className="api-cost-value emerald">{isPaidPlan ? `${(computedCost - 2.00).toFixed(2)}$` : "0.00$"}</span>
                        </div>
                      </div>
                      <div className="api-cost-column">
                        <span style={{ fontSize: '1.4rem' }}>🛡️</span>
                        <div className="api-cost-details">
                          <span className="api-cost-label">{t.dataBudget.dailyQuota}</span>
                          <span className="api-cost-value cyan">{isPaidPlan ? t.dataBudget.paidPerDay : t.dataBudget.freePerDay}</span>
                        </div>
                      </div>
                    </div>
                  )}
                
                {collectionStatus.status === 'idle' && (
                  <div className="empty-state" style={{ padding: '30px' }}>
                    <div className="empty-icon">📊</div>
                    <div className="empty-title">
                      {appConfig.free_tier ? t.dataBudget.freePlan : t.dataBudget.premiumPlan}
                    </div>
                    <div className="empty-desc" style={{ maxWidth: '600px', marginBottom: '24px' }}>
                      {t.dataBudget.idleDesc}
                      <br /><br />
                      <strong>{t.dataBudget.rulesTitle}</strong>
                      <ol style={{ textAlign: 'left', margin: '15px auto', maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <li>{t.dataBudget.rule1} {appConfig.free_tier ? t.dataBudget.rule1Free : t.dataBudget.rule1Paid}.</li>
                        <li>{t.dataBudget.rule2}</li>
                        <li>{t.dataBudget.rule3}</li>
                      </ol>
                      
                      {appConfig.auto_collect && (
                        <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px 20px', borderRadius: '8px', marginTop: '20px', textAlign: 'left' }}>
                          <span style={{ color: 'var(--accent-emerald)', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                            {t.dataBudget.autoSchedActive}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block' }}>
                            • {t.dataBudget.lastRun} <strong>{formatLastRun(collectionStatus.last_run_timestamp)}</strong>
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block' }}>
                            • {t.dataBudget.nextRun} <strong>{getNextRunEstimate(collectionStatus.last_run_timestamp)}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={handleStartCollection} 
                      className="btn" 
                      disabled={startingCollection}
                    >
                      {startingCollection ? t.dataBudget.starting : `🚀 ${t.dataBudget.startBtn} (${appConfig.free_tier ? (lang === 'en' ? 'Free' : 'Gratuit') : 'Premium'})`}
                    </button>
                    {collectionStatus.dataset_exists && (
                      <p style={{ marginTop: '14px', fontSize: '0.85rem', color: 'var(--accent-emerald)' }}>
                        ✓ {t.dataBudget.datasetContains} <strong>{collectionStatus.dataset_size} {lang === 'en' ? 'players' : 'joueurs'}</strong> {lang === 'en' ? 'stored locally.' : 'stockés localement.'}
                      </p>
                    )}
                  </div>
                )}

                {collectionStatus.status === 'in_progress' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="collection-header-summary">
                      <div>
                        <strong>{t.dataBudget.statusLabel} </strong> 
                        <span style={{ color: 'var(--accent-cyan)' }}>
                          {appConfig.free_tier ? t.dataBudget.collectingFree : t.dataBudget.collectingPaid}
                        </span>
                      </div>
                      <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                    </div>
                    
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
{appConfig.free_tier ? t.dataBudget.speedFree : t.dataBudget.speedPaid}
                    </p>

                    {/* Progress Matchs */}
                    <div className="progress-section">
                      <div className="progress-label">
                        <span>{t.dataBudget.step1Title}</span>
                        <span>{collectionStatus.matches_completed} / {collectionStatus.matches_total} {t.dataBudget.matchesLabel}</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${collectionStatus.matches_total > 0 ? (collectionStatus.matches_completed / collectionStatus.matches_total) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Progress Joueurs */}
                    <div className="progress-section">
                      <div className="progress-label">
                        <span>{t.dataBudget.step2Title}</span>
                        <span>{collectionStatus.players_completed} / {collectionStatus.players_total} {t.dataBudget.playersLabel}</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: `${collectionStatus.players_total > 0 ? (collectionStatus.players_completed / collectionStatus.players_total) * 100 : 0}%`,
                            background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-emerald))'
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Logs en direct */}
                    <div className="progress-section">
                      <div className="progress-label"><span>Console de logs en direct</span></div>
                      <div className="log-box" id="log-box">
                        {collectionStatus.log_messages && collectionStatus.log_messages.map((log, idx) => (
                          <div 
                            key={idx} 
                            className={`log-line ${idx === collectionStatus.log_messages.length - 1 ? 'latest' : ''}`}
                          >
                            &gt; {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {collectionStatus.status === 'completed' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="collection-header-summary" style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                      <div style={{ color: 'var(--accent-emerald)' }}>
                        <strong>✓ Collecte de Churn terminée avec succès !</strong>
                      </div>
                      <button 
                        onClick={handleStartCollection} 
                        className="btn btn-secondary" 
                        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      >
                        Recréer le Dataset
                      </button>
                    </div>

                    <div className="collection-stats-group">
                      <div className="stat-item">
                        <div className="stat-val">{collectionStatus.dataset_size}</div>
                        <div className="stat-lbl">Joueurs uniques enregistrés</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-val">100</div>
                        <div className="stat-lbl">Matchs max analysés par joueur</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-val">CSV</div>
                        <div className="stat-lbl">Format de stockage local</div>
                      </div>
                    </div>

                    {appConfig.auto_collect && (
                      <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px 20px', borderRadius: '8px', marginTop: '10px' }}>
                        <span style={{ color: 'var(--accent-emerald)', fontWeight: 'bold', display: 'block', marginBottom: '4px', fontSize: '0.9rem' }}>
                          🛡️ Planification automatique active
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block' }}>
                          • Dernière collecte réussie : <strong>{formatLastRun(collectionStatus.last_run_timestamp)}</strong>
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block' }}>
                          • Prochaine collecte automatique : <strong>{getNextRunEstimate(collectionStatus.last_run_timestamp)}</strong>
                        </span>
                      </div>
                    )}

                    <div style={{ marginTop: '10px' }}>
                      <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>{t.dataBudget.datasetPreviewTitle}</h3>
                      {datasetPreview && datasetPreview.exists ? (
                        <div className="preview-table-container">
                          <table className="preview-table">
                            <thead>
                              <tr>
                                <th>{t.dataBudget.thName}</th>
                                <th>{t.dataBudget.thRank}</th>
                                <th>{t.dataBudget.thWinrate}</th>
                                <th>{t.dataBudget.thStreakCutoff}</th>
                                <th>{t.dataBudget.thAvgSession}</th>
                                <th>{t.dataBudget.thAvgGap}</th>
                                <th>{t.dataBudget.thImbalance}</th>
                                <th>{t.dataBudget.thChurn}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {datasetPreview.data.map((row, idx) => (
                                <tr key={idx}>
                                  <td style={{ color: 'white', fontWeight: 600 }}>{row.personaname}</td>
                                  <td>{row.rank_tier} ({getRankName(row.rank_tier)})</td>
                                  <td>{(row.win_rate * 100).toFixed(1)}%</td>
                                  <td style={{ color: row.current_streak_at_cutoff < 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                                    {row.current_streak_at_cutoff < 0 ? `L ${Math.abs(row.current_streak_at_cutoff)}` : `W ${row.current_streak_at_cutoff}`}
                                  </td>
                                  <td>{row.avg_session_duration ? Math.round(row.avg_session_duration) : '0'} min</td>
                                  <td>{row.avg_session_gap_days ? row.avg_session_gap_days.toFixed(1) : '0'} {lang === 'en' ? 'd' : 'j'}</td>
                                  <td>{row.avg_rank_imbalance ? Math.round(row.avg_rank_imbalance) : '0'} pts</td>
                                  <td>
                                    <span style={{ 
                                      color: row.is_churn === 1 ? 'var(--accent-rose)' : 'var(--accent-emerald)', 
                                      fontWeight: 'bold',
                                      background: row.is_churn === 1 ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                      padding: '2px 6px',
                                      borderRadius: '4px'
                                    }}>
                                      {row.is_churn === 1 ? t.dataBudget.churnBadge : t.dataBudget.activeBadge}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="spinner-container">
                          <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {collectionStatus.status === 'failed' && (
                  <div className="empty-state" style={{ padding: '30px', borderColor: 'var(--accent-rose)' }}>
                    <div className="empty-icon" style={{ color: 'var(--accent-rose)' }}>⚠️</div>
                    <div className="empty-title" style={{ color: 'var(--accent-rose)' }}>{t.dataBudget.collectionFailed}</div>
                    <div className="empty-desc" style={{ maxWidth: '500px', marginBottom: '20px' }}>
                      {collectionStatus.current_message}
                    </div>
                    <button onClick={handleStartCollection} className="btn">{t.dataBudget.retryBtn}</button>
                  </div>
                )}

                {/* Tableau Historique des Exports */}
                <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {t.dataBudget.exportHistoryTitle}
                    </h3>
                    {exportHistory.length > 0 && (
                      <button 
                        onClick={() => {
                          if (window.confirm(t.dataBudget.confirmClearHistory)) {
                            setExportHistory([]);
                            localStorage.removeItem('dota2_v4_export_history');
                          }
                        }}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                      >
                        {t.dataBudget.clearHistoryBtn}
                      </button>
                    )}
                  </div>
                  
                  {exportHistory.length === 0 ? (
                    <div className="empty-state" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        {t.dataBudget.noExports}
                      </span>
                    </div>
                  ) : (
                    <div className="preview-table-container" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                      <table className="preview-table" style={{ fontSize: '0.85rem' }}>
                        <thead>
                          <tr>
                            <th>{t.dataBudget.thDateTime}</th>
                            <th>{t.dataBudget.thCollectedProfiles}</th>
                            <th>{t.dataBudget.thMatchesPerProfile}</th>
                            <th>{t.dataBudget.thApiPlan}</th>
                            <th>{t.dataBudget.thStatus}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exportHistory.map((item, idx) => (
                            <tr key={idx}>
                              <td style={{ color: 'white', fontWeight: 600 }}>{item.date}</td>
                              <td style={{ color: 'var(--accent-cyan)' }}>+{item.profiles_collected} {t.dataBudget.playersLabel}</td>
                              <td>{item.matches_analyzed} {t.dataBudget.matchesLabel}</td>
                              <td>{item.mode === "Plan Premium" ? (lang === "en" ? "Premium Plan" : "Plan Premium") : (lang === "en" ? "Free Plan" : "Plan Gratuit")}</td>
                              <td>
                                <span style={{ 
                                  color: item.status === 'completed' ? 'var(--accent-emerald)' : 'var(--accent-rose)', 
                                  fontWeight: 'bold',
                                  background: item.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem'
                                }}>
                                  {item.status === 'completed' ? t.dataBudget.statusSuccess : t.dataBudget.statusFailed}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                </div>
              );
            })()}

            {/* Contenu - Machine Learning / Churn */}
            {activeTab === 'ml_predictions' && (
              <div className="collection-panel">
                <h2 className="section-title">{t.mlModel.title}</h2>
                
                {!mlStatus.trained && !trainingInProgress && (
                  <div className="empty-state" style={{ padding: '40px' }}>
                    <div className="empty-icon">🧠</div>
                    <div className="empty-title">{t.mlModel.notTrainedTitle}</div>
                    <div className="empty-desc" style={{ maxWidth: '500px', marginBottom: '24px' }}>
{collectionStatus.dataset_exists ? t.mlModel.notTrainedDescExists.replace('{count}', collectionStatus.dataset_size) : t.mlModel.notTrainedDescMissing}
                    </div>
                    <button 
                      onClick={handleTrainModel} 
                      className="btn" 
                      disabled={!collectionStatus.dataset_exists}
                    >
                      {t.mlModel.trainBtn}
                    </button>
                  </div>
                )}

                {trainingInProgress && (
                  <div className="spinner-container" style={{ minHeight: '300px' }}>
                    <div className="spinner"></div>
                    <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{t.mlModel.trainingInProgress}</p>
                  </div>
                )}

                {mlStatus.trained && mlStatus.metrics && !trainingInProgress && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    <div className="collection-header-summary" style={{ background: 'rgba(139, 92, 246, 0.05)', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
                      <div>
                        <strong>{t.mlModel.activeModel} </strong> 
                        <span style={{ color: 'var(--accent-purple)' }}>
                          {mlStatus.metrics.best_model_name === 'boosting' 
                            ? (mlStatus.metrics.uses_xgboost_library ? 'XGBoost Classifier' : 'Gradient Boosting Classifier')
                            : mlStatus.metrics.best_model_name === 'random_forest' 
                              ? 'Random Forest Classifier' 
                              : (lang === 'en' ? 'Logistic Regression' : 'Régression Logistique')} ({t.mlModel.readyBadge})
                        </span>
                      </div>
                      <button 
                        onClick={handleTrainModel} 
                        className="btn btn-secondary" 
                        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      >
                        {t.mlModel.retrainBenchmark}
                      </button>
                    </div>

                    {/* Stats d'évaluation Classification */}
                    <div className="collection-stats-group">
                      <div className="stat-item">
                        <div className="stat-val">{(mlStatus.metrics.f1_score * 100).toFixed(1)}%</div>
                        <div className="stat-lbl">{t.mlModel.f1Score}</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-val">{(mlStatus.metrics.precision * 100).toFixed(1)}%</div>
                        <div className="stat-lbl">{t.mlModel.precision}</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-val">{(mlStatus.metrics.recall * 100).toFixed(1)}%</div>
                        <div className="stat-lbl">{t.mlModel.recall}</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-val">{(mlStatus.metrics.auc_score * 100).toFixed(1)}%</div>
                        <div className="stat-lbl">{t.mlModel.rocAuc}</div>
                      </div>
                    </div>

                    {/* Row 1: SVG Evaluation Charts */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.9fr', gap: '24px' }} className="charts-grid-ml-eval">
                      <div className="glass-card font-medium" style={{ background: 'rgba(0,0,0,0.1)', padding: '20px' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '8px', color: 'white', fontWeight: 600 }}>
                          {t.mlModel.evalMetricsTitle}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                          Performance du classifieur {mlStatus.metrics.best_model_name === 'boosting' ? 'Gradient Boosting' : mlStatus.metrics.best_model_name === 'random_forest' ? 'Random Forest' : 'Régression Logistique'} sur l'ensemble de test.
                        </p>
                        <ModelMetricsChart metrics={mlStatus.metrics} lang={lang} />
                      </div>

                      <div className="glass-card" style={{ background: 'rgba(0,0,0,0.1)', padding: '20px' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '8px', color: 'white', fontWeight: 600 }}>
                          {t.mlModel.thresholdCurveTitle}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                          {t.mlModel.thresholdCurveDesc} <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>{visData?.best_threshold || '0.57'}</span>.
                        </p>
                        <ThresholdCurveChart curve={visData?.threshold_curve || []} bestThreshold={visData?.best_threshold || 0.57} lang={lang} />
                      </div>
                    </div>

                    {/* Les benchmarks comparatifs et l'évolution de nos travaux ont été déplacés dans l'onglet Historique */}

                    {/* Row 2: Feature Importance and Simulator */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.9fr', gap: '24px' }} className="charts-grid-ml-sim">
                      
                      {/* Importance des features */}
                      <div className="glass-card" style={{ background: 'rgba(0,0,0,0.1)', padding: '20px' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', color: 'white', fontWeight: 600 }}>
                          {t.mlModel.keyIndicatorsTitle}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {mlStatus.metrics.feature_importances.slice(0, 6).map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                <span>{translateFeature(item.feature)}</span>
                                <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>{(item.importance * 100).toFixed(1)}%</span>
                              </div>
                              <div className="progress-bar-bg" style={{ height: '6px' }}>
                                <div 
                                  className="progress-bar" 
                                  style={{ 
                                    width: `${item.importance * 100}%`,
                                    background: 'var(--accent-purple)'
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Simulateur Churn */}
                      <div className="glass-card" style={{ background: 'rgba(0,0,0,0.1)', padding: '20px' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', color: 'white', fontWeight: 600 }}>
                          {t.mlModel.simulatorTitle}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                          {t.mlModel.simulatorDesc}
                        </p>
                        <form onSubmit={handleSimPredict} className="search-form" style={{ marginBottom: '16px' }}>
                          <input
                            type="text"
                            className="search-input"
                            placeholder={t.mlModel.simulatorPlaceholder}
                            value={simAccountId}
                            onChange={(e) => setSimAccountId(e.target.value)}
                            style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                          />
                          <button type="submit" className="btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }} disabled={predictingSim}>
                            {predictingSim ? t.mlModel.simulatorCalculating : t.mlModel.simulatorAnalyzeBtn}
                          </button>
                        </form>

                        {simError && (
                          <div style={{ color: 'var(--accent-rose)', fontSize: '0.85rem' }}>
                            ⚠️ {simError}
                          </div>
                        )}

                        {simResult && (
                          <div style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <strong>{simResult.personaname}</strong>
                              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>ID: {simResult.account_id}</span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
                              <div 
                                style={{ 
                                  fontSize: '2rem', 
                                  fontWeight: '800'
                                }}
                                className={
                                  simResult.churn_probability >= 0.50 
                                    ? 'glow-text-red' 
                                    : simResult.churn_probability >= 0.25 
                                      ? 'glow-text-cyan' 
                                      : 'glow-text-green'
                                }
                              >
                                {(simResult.churn_probability * 100).toFixed(0)}%
                              </div>
                              <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{t.mlModel.churnRiskLabel}</div>
                                <div 
                                  className={
                                    simResult.churn_probability >= 0.50 
                                      ? 'glow-text-red' 
                                      : simResult.churn_probability >= 0.25 
                                        ? 'glow-text-cyan' 
                                        : 'glow-text-green'
                                  }
                                  style={{ fontSize: '0.9rem', fontWeight: 'bold' }}
                                >
                                  {simResult.risk_level}
                                </div>
                              </div>
                            </div>

                            <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px dashed var(--border-color)', paddingTop: '8px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{t.mlModel.recentWinRate}</span>
                                <strong style={{ color: 'white' }}>{(simResult.features.win_rate * 100).toFixed(1)}%</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{t.mlModel.currentStreak}</span>
                                <strong className={simResult.features.current_streak < 0 ? 'glow-text-red' : 'glow-text-green'}>
                                  {simResult.features.current_streak < 0 ? `L${Math.abs(simResult.features.current_streak)} (${t.mlModel.losses})` : `W${simResult.features.current_streak} (${t.mlModel.wins})`}
                                </strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{t.mlModel.avgSessionDuration}</span>
                                <strong style={{ color: 'white' }}>{Math.round(simResult.features.avg_session_duration)} min</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{t.mlModel.matchmakingImbalance}</span>
                                <strong style={{ color: 'white' }}>{Math.round(simResult.features.avg_rank_imbalance)} pts</strong>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                    
                  </div>
                )}
              </div>
            )}

            {/* Contenu - Historique des Modèles */}
            {activeTab === 'history' && (
              <div className="academic-report-container">
                <div className="report-section-card">
                  <h3 className="report-section-title">
                    <span>{lang === 'en' ? 'History' : 'Historique'}</span> {t.history.title.replace('⏳ ', '')}
                  </h3>
                  <p className="report-para">
                    {t.history.subtitle}
                  </p>

                  <h4 className="report-subtitle">{t.history.benchmarksTitle}</h4>
                  {mlStatus.metrics?.comparison ? (
                    <>
                      <div className="preview-table-container" style={{ margin: '20px 0' }}>
                        <table className="preview-table">
                          <thead>
                            <tr>
                              <th>{t.history.thModel}</th>
                              <th>{lang === 'en' ? 'Optimal Threshold' : 'Seuil Optimal'}</th>
                              <th>{t.history.thAccuracy}</th>
                              <th>{t.history.thRocAuc}</th>
                              <th>{t.history.thF1Score}</th>
                              <th>{t.history.thPrecision}</th>
                              <th>{t.history.thRecall}</th>
                              <th>{t.history.thStatus}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(mlStatus.metrics.comparison).map(([key, data]) => {
                              const isBest = key === mlStatus.metrics.best_model_name;
                              const nameMap = {
                                random_forest: "Random Forest Classifier",
                                boosting: mlStatus.metrics.uses_xgboost_library ? "XGBoost Classifier" : "Gradient Boosting (HistGB)",
                                logistic_regression: "Régression Logistique (V2.0)"
                              };
                              return (
                                <tr key={key} style={{ background: isBest ? 'rgba(16, 185, 129, 0.05)' : 'none' }}>
                                  <td style={{ fontWeight: 'bold', color: isBest ? 'var(--accent-emerald)' : 'white' }}>
                                    {nameMap[key] || key} {isBest && "🏆"}
                                  </td>
                                  <td>{data.best_threshold.toFixed(2)}</td>
                                  <td>{(data.accuracy * 100).toFixed(1)}%</td>
                                  <td className={isBest ? "glow-text-green" : "glow-text-cyan"}>{(data.auc_score * 100).toFixed(1)}%</td>
                                  <td className={isBest ? "glow-text-green" : ""}>{(data.f1_score * 100).toFixed(1)}%</td>
                                  <td>{(data.precision * 100).toFixed(1)}%</td>
                                  <td className={isBest ? "glow-text-green" : ""}>{(data.recall * 100).toFixed(1)}%</td>
                                  <td>
                                    <span className={isBest ? "badge-glow-green" : "badge-glow-cyan"} style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px' }}>
                                      {isBest ? t.history.activeBest : t.history.alternative}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Avantages & Inconvénients */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', margin: '20px 0 30px 0' }} className="charts-grid-three-cols">
                        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                          <h4 style={{ fontSize: '0.9rem', color: 'white', marginBottom: '8px', fontWeight: 600 }}>🌲 Random Forest</h4>
                          <ul style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <li><strong style={{ color: 'var(--accent-emerald)' }}>+</strong> Très robuste face au bruit des données.</li>
                            <li><strong style={{ color: 'var(--accent-emerald)' }}>+</strong> Risque de surapprentissage quasi nul.</li>
                            <li><strong style={{ color: 'var(--accent-rose)' }}>-</strong> Moins fin pour ajuster les probabilités individuelles.</li>
                          </ul>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                          <h4 style={{ fontSize: '0.9rem', color: 'white', marginBottom: '8px', fontWeight: 600 }}>⚡ Boosting (HistGB / sklearn)</h4>
                          <ul style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <li><strong style={{ color: 'var(--accent-emerald)' }}>+</strong> Performance optimale sur les signaux complexes.</li>
                            <li><strong style={{ color: 'var(--accent-emerald)' }}>+</strong> Correction séquentielle des erreurs.</li>
                            <li><strong style={{ color: 'var(--accent-rose)' }}>-</strong> Sensible aux variations de bruit si mal régularisé.</li>
                          </ul>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                          <h4 style={{ fontSize: '0.9rem', color: 'white', marginBottom: '8px', fontWeight: 600 }}>📈 Régression Logistique</h4>
                          <ul style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <li><strong style={{ color: 'var(--accent-emerald)' }}>+</strong> Interprétation linéaire directe (coefficients).</li>
                            <li><strong style={{ color: 'var(--accent-emerald)' }}>+</strong> Taux de rappel élevé après équilibrage (SMOTE).</li>
                            <li><strong style={{ color: 'var(--accent-rose)' }}>-</strong> Incapable de modéliser des effets de seuil (ex: streaks).</li>
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="spinner-container">
                      <div className="spinner"></div>
                      <p>Chargement de l'historique des modèles...</p>
                    </div>
                  )}

                  <h4 className="report-subtitle" style={{ marginTop: '30px' }}>{t.history.timelineTitle}</h4>
                  <p className="report-para">
                    {t.history.timelineDesc}
                  </p>
                  
                  <div className="preview-table-container" style={{ margin: '15px 0 25px 0' }}>
                    <table className="preview-table">
                      <thead>
                        <tr>
                          <th>{t.history.thVersion}</th>
                          <th>{t.history.thMainModel}</th>
                          <th>{t.history.thDatasetSize}</th>
                          <th>{t.history.thFeatureCount}</th>
                          <th>{t.history.thSpecifics}</th>
                          <th>{t.history.thAuc}</th>
                          <th>{t.history.thStatus}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ opacity: 0.5 }}>
                          <td>V1.0</td>
                          <td>Random Forest</td>
                          <td>9 943</td>
                          <td>15 ({lang === 'en' ? 'noisy' : 'parasitées'})</td>
                          <td>{lang === 'en' ? 'Raw data, massive class imbalance (94/6)' : 'Données brutes, déséquilibre de classe massif (94/6)'}</td>
                          <td>70.7%</td>
                          <td><span className="badge-glow-cyan" style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px' }}>{t.history.statusArchived}</span></td>
                        </tr>
                        <tr style={{ opacity: 0.7 }}>
                          <td>V2.0</td>
                          <td>Logistic Regression</td>
                          <td>9 943</td>
                          <td>29</td>
                          <td>{lang === 'en' ? 'Cleaning, SMOTE balancing, OOF validation' : 'Nettoyage, Équilibrage SMOTE, Validation OOF'}</td>
                          <td>71.6%</td>
                          <td><span className="badge-glow-cyan" style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px' }}>{t.history.statusArchived}</span></td>
                        </tr>
                        <tr style={{ opacity: 0.85 }}>
                          <td>V3.0</td>
                          <td>Logistic Regression</td>
                          <td>500 (Test)</td>
                          <td>34</td>
                          <td>{lang === 'en' ? 'Added psychology (Tilt Index, Night Owl)' : 'Ajout psychologie du joueur (Tilt Index, Night Owl)'}</td>
                          <td>70.3%</td>
                          <td><span className="badge-glow-cyan" style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px' }}>{t.history.statusArchived}</span></td>
                        </tr>
                        <tr style={{ opacity: 0.9 }}>
                          <td>V4.0 (Alpha)</td>
                          <td>Data Collection</td>
                          <td>3 132</td>
                          <td>39</td>
                          <td>{lang === 'en' ? 'Real-Time pipeline validation (Match T) + Extraction Date' : 'Validation du pipeline Temps-Réel (Match T) + Extraction Date'}</td>
                          <td>-</td>
                          <td><span className="badge-glow-cyan" style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px' }}>{t.history.statusExported}</span></td>
                        </tr>
                        <tr>
                          <td>V5.0 ({lang === 'en' ? 'Tautology Bias' : 'Biais Tautologique'})</td>
                          <td>XGBoost (HGB)</td>
                          <td>16 981</td>
                          <td>44</td>
                          <td>{lang === 'en' ? 'Label Tautology discovered (Gap > 14 days)' : 'Découverte du Biais de Définition (Gap > 14 jours)'}</td>
                          <td>86.7%</td>
                          <td><span className="badge-glow-cyan" style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px' }}>{t.history.statusArchived}</span></td>
                        </tr>
                        <tr style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
                          <td className="glow-text-green" style={{ fontWeight: 600 }}>V6.0 ({lang === 'en' ? 'Pure Behavior' : 'Pur Comportement'})</td>
                          <td className="glow-text-green" style={{ fontWeight: 600 }}>XGBoost (SMOTE)</td>
                          <td className="glow-text-green"><strong>16 981</strong></td>
                          <td className="glow-text-green"><strong>41</strong></td>
                          <td className="glow-text-green"><strong>{lang === 'en' ? 'Zero Temporal Leakage + Behavioral Learning' : 'Zéro Leak Temporel + Apprentissage Comportemental'}</strong></td>
                          <td className="glow-text-green" style={{ fontWeight: 600 }}><strong>79.3%</strong></td>
                          <td><span className="badge-glow-green" style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}>{t.history.statusDeployed}</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h4 className="report-subtitle" style={{ marginTop: '30px' }}>{t.history.rdTitle}</h4>
                  
                  <div style={{ background: 'rgba(16, 185, 129, 0.02)', border: '1px solid rgba(16, 185, 129, 0.1)', padding: '24px', borderRadius: '12px', marginTop: '15px' }}>
                    
                    <h5 style={{ color: 'white', fontSize: '0.95rem', marginBottom: '12px', fontWeight: 600 }}>{t.history.v1Title}</h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                      {t.history.v1Text}
                    </p>

                    <h5 style={{ color: 'white', fontSize: '0.95rem', marginBottom: '12px', fontWeight: 600 }}>{t.history.v2Title}</h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                      {t.history.v2Text}
                    </p>

                    <h5 style={{ color: 'white', fontSize: '0.95rem', marginBottom: '12px', fontWeight: 600 }}>{t.history.v3Title}</h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                      {t.history.v3Text}
                    </p>

                    <h5 style={{ color: 'white', fontSize: '0.95rem', marginBottom: '12px', fontWeight: 600 }}>{t.history.v4Title}</h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                      {t.history.v4Text}
                    </p>
                    
                    <h5 style={{ color: 'white', fontSize: '0.95rem', marginBottom: '12px', fontWeight: 600 }}>{t.history.v5Title}</h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                      {t.history.v5Text}
                    </p>

                    <h5 style={{ color: 'var(--accent-emerald)', fontSize: '0.95rem', marginBottom: '12px', fontWeight: 600 }}>{t.history.v6Title}</h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                      {t.history.v6Text}
                    </p>

                  </div>

                </div>
              </div>
            )}

            {/* Contenu - Live Matchmaking */}
            {activeTab === 'live_matchmaking' && (
              <div className="live-match-container">
                <div className="live-hero">
                  <h2 style={{ fontSize: '2.2rem', marginBottom: '12px', color: 'white', fontWeight: 800 }}>
                    {t.liveMatch.titlePrefix} <span style={{ color: 'var(--accent-rose)' }}>{t.liveMatch.titleHighlight}</span> {t.liveMatch.titleSuffix}
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: '35px', maxWidth: '600px', margin: '0 auto 35px auto', lineHeight: '1.6' }}>
                    {t.liveMatch.subtitle}
                  </p>
                  
                  <div className="search-bar-container">
                    <div className="search-input-wrapper">
                      <span className="search-icon">🔍</span>
                      <input 
                        type="text" 
                        className="match-search-input" 
                        placeholder={lang === 'en' ? "Paste Match ID (e.g. 7283649102)..." : "Coller l'ID du match (ex: 7283649102)..."}
                        value={liveMatchId}
                        onChange={(e) => setLiveMatchId(e.target.value)}
                      />
                    </div>
                    <button 
                      className="btn-glow-rose"
                      onClick={handleSimulateLiveMatch}
                      disabled={isSimulatingLive || !liveMatchId}
                    >
                      {isSimulatingLive ? t.liveMatch.analyzing : (lang === 'en' ? 'Simulate (Mock V4)' : 'Simuler (Mock V4)')}
                    </button>
                  </div>
                </div>

                {isSimulatingLive && (
                  <div className="spinner-container" style={{ minHeight: '300px' }}>
                    <div className="spinner spinner-rose"></div>
                    <p style={{ color: 'var(--accent-rose)', marginTop: '20px', fontWeight: 600 }}>{t.liveMatch.connectingApi}</p>
                  </div>
                )}

                {!isSimulatingLive && liveMatchPlayers && (
                  <div className="live-match-results fade-in-up">
                    <div className="match-teams-grid">
                      
                      {/* RADIANT */}
                      <div className="team-column radiant-team">
                        <div className="team-header radiant-header">
                          <h3 className="team-title">{t.liveMatch.radiantTeam}</h3>
                        </div>
                        <div className="players-list">
                          {liveMatchPlayers.filter(p => p.isRadiant).map((player, idx) => (
                            <PlayerCard key={`rad-${idx}`} player={player} lang={lang} />
                          ))}
                        </div>
                      </div>

                      <div className="vs-divider">
                        <span className="vs-badge">{t.liveMatch.vsBadge}</span>
                      </div>

                      {/* DIRE */}
                      <div className="team-column dire-team">
                        <div className="team-header dire-header">
                          <h3 className="team-title">{t.liveMatch.direTeam}</h3>
                        </div>
                        <div className="players-list">
                          {liveMatchPlayers.filter(p => !p.isRadiant).map((player, idx) => (
                            <PlayerCard key={`dire-${idx}`} player={player} lang={lang} />
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'lesson' && (
              <div className="tab-pane active fade-in">
                <div className="report-header">
                  <h3 className="report-title">{t.lesson.title}</h3>
                  <p className="report-subtitle">{t.lesson.subtitle}</p>
                </div>
                
                <div className="report-card" style={{ padding: '30px', marginTop: '20px' }}>
                  <h4 style={{ color: 'var(--accent-emerald)', fontSize: '1.2rem', marginBottom: '15px' }}>{t.lesson.trap1Title}</h4>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
                    {t.lesson.trap1Intro}
                  </p>
                  
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '12px', marginBottom: '25px', borderLeft: '4px solid #ef4444' }}>
                    <h5 style={{ color: 'white', marginBottom: '10px' }}>{t.lesson.mechanismTitle}</h5>
                    <ol style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8', paddingLeft: '20px' }}>
                      <li>{t.lesson.point1}</li>
                      <li>{t.lesson.point2}</li>
                    </ol>
                  </div>
                  
                  <h4 style={{ color: 'var(--accent-emerald)', fontSize: '1.2rem', marginBottom: '15px' }}>{t.lesson.trap2Title}</h4>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
                    {t.lesson.trap2Intro}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                      <h5 style={{ color: '#ef4444', textAlign: 'center', marginBottom: '10px' }}>{t.lesson.cardChurnerTitle}</h5>
                      <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                        {t.lesson.cardChurnerRatio}<br/>
                        <em>{t.lesson.cardChurnerNote}</em>
                      </p>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <h5 style={{ color: '#10b981', textAlign: 'center', marginBottom: '10px' }}>{t.lesson.cardActiveTitle}</h5>
                      <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                        {t.lesson.cardActiveRatio}<br/>
                        <em>{t.lesson.cardActiveNote}</em>
                      </p>
                    </div>
                  </div>
                  
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', fontStyle: 'italic', borderLeft: '2px solid var(--accent-emerald)', paddingLeft: '15px' }}>
                    <strong>{t.lesson.conclusionQuoteBold}</strong> {t.lesson.conclusionQuoteText}
                  </p>
                  
                  <h4 style={{ color: 'white', fontSize: '1.1rem', marginTop: '30px', marginBottom: '15px' }}>{t.lesson.solutionTitle}</h4>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                    {t.lesson.solutionText}
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
  );
}

export default App;

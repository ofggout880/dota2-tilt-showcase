import React from 'react';
import GlossaryTerm from './GlossaryTerm';
import { useDictionary } from '../context/DictionaryContext';

/**
 * HeroSection Component
 * Modernized Editorial & Asymmetric Sculpted Shape Design System
 * 
 * Features:
 * - High-contrast editorial display typography (Syne look-alike)
 * - Dual-line headline with bold/light weight contrast and free-floating side paragraph
 * - Dual-box signature studio action buttons (arrow ↗ + sparkle ✳)
 * - Signature Asymmetric Sculpted Shape Container with Telemetry Interface & Ember Fluted Slats
 * - Floating Rotating Circular Stamp Badge (16,981 Matches • 85% Recall)
 * - Minimalist Monochrome Technology Ribbon (Valve, OpenDota, FastAPI, XGBoost, SMOTE)
 * - 3 Free-floating unboxed editorial pillars (01, 02, 03)
 */
export default function HeroSection({ lang, t }) {
  const { openDictionary } = useDictionary();

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isFr = lang === 'fr';

  return (
    <section id="hero" className="section hero-section" aria-labelledby="hero-title">
      <div className="container">
        
        {/* Top Floating Editorial Eyebrow */}
        <div className="hero-eyebrow-row">
          <div className="editorial-badge">
            <span className="badge-sparkle">✦</span>
            <span>{t('hero.badge', lang)}</span>
          </div>
          <span className="hero-eyebrow-sub">ACADEMIC & INDUSTRY SHOWCASE • 2026</span>
        </div>

        {/* Master Headline & Free-Floating Summary Row */}
        <div className="hero-editorial-row">
          <div className="hero-title-column">
            <h1 id="hero-title" className="hero-display-title">
              {isFr ? (
                <>
                  <span className="title-light">Anticiper le</span> <span className="title-bold"><GlossaryTerm termId="tilt_index">Tilt</GlossaryTerm> & le <GlossaryTerm termId="churn">Churn</GlossaryTerm></span><br />
                  <span className="title-light">de Dota 2 par</span> <span className="title-bold title-glow">Télémétrie</span>
                </>
              ) : (
                <>
                  <span className="title-light">Predicting</span> <span className="title-bold"><GlossaryTerm termId="tilt_index">Tilt</GlossaryTerm> & <GlossaryTerm termId="churn">Churn</GlossaryTerm></span><br />
                  <span className="title-light">in Dota 2 via</span> <span className="title-bold title-glow">Telemetry</span>
                </>
              )}
            </h1>
          </div>

          <div className="hero-desc-column">
            <p className="hero-floating-summary">
              {t('hero.subtitle', lang)}
            </p>
            <div className="hero-tag-pills" role="list">
              <span className="tag-pill" role="listitem">N = 16 981 Joueurs</span>
              <span className="tag-pill" role="listitem">Rappel Churn 85.0%</span>
              <span className="tag-pill" role="listitem">Zéro Fuite Temporelle</span>
            </div>
          </div>
        </div>

        {/* Signature Dual-Box Action Button Row */}
        <div className="hero-actions-bar">
          <a
            href="#simulator"
            className="hero-studio-cta"
            onClick={(e) => handleScrollTo(e, '#simulator')}
          >
            <span className="cta-icon-sq" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </span>
            <span className="cta-icon-star" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.2L21.6 12l-7.2 2.4L12 21.6l-2.4-7.2L2.4 12l7.2-2.4L12 2z" />
              </svg>
            </span>
            <span className="cta-labels">
              <span className="cta-main-text">{t('hero.ctaSimulator', lang)}</span>
              <span className="cta-sub-text">{isFr ? 'Simulateur Temps Réel' : 'Live Inference Sandbox'}</span>
            </span>
          </a>

          <a
            href="#benchmark"
            className="hero-minimal-cta"
            onClick={(e) => handleScrollTo(e, '#benchmark')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span>{t('hero.ctaBenchmark', lang) || (isFr ? 'Benchmark ML & Modèles' : 'ML Benchmark & Models')}</span>
          </a>
        </div>

        {/* SIGNATURE ASYMMETRIC SCULPTED SHAPE CONTAINER */}
        <div className="sculpted-showcase-frame" aria-label="Showcase Telemetry Visualizer">
          
          {/* Left Dark Glass Screen / Device Simulation */}
          <div className="sculpted-canvas-side">
            <div className="mockup-header-bar">
              <div className="mockup-dots" aria-hidden="true">
                <span className="m-dot m-dot-red"></span>
                <span className="m-dot m-dot-amber"></span>
                <span className="m-dot m-dot-green"></span>
              </div>
              <div className="mockup-status-title">
                <span className="pulse-indicator"></span>
                <span>telemetry_stream // match_T_prediction // cutoff_horizon_14d</span>
              </div>
              <span className="mockup-version-tag">XGBoost v6 • SMOTE</span>
            </div>

            {/* Inner Interactive Visual Graphic */}
            <div className="mockup-visual-body">
              <div className="mockup-grid-backdrop" aria-hidden="true"></div>
              
              {/* Telemetry Stream SVG Wave */}
              <div className="telemetry-chart-wrapper">
                <svg className="telemetry-svg-stream" viewBox="0 0 820 220" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="streamGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff7a00" stopOpacity="0.38" />
                      <stop offset="55%" stopColor="#ff7a00" stopOpacity="0.07" />
                      <stop offset="100%" stopColor="#ff7a00" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="42%" stopColor="#ff7a00" />
                      <stop offset="68%" stopColor="#ef4444" />
                      <stop offset="85%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#ff7a00" />
                    </linearGradient>
                  </defs>
                  
                  {/* Telemetry Guide Grid Lines */}
                  <line x1="0" y1="52" x2="820" y2="52" stroke="rgba(239, 68, 68, 0.16)" strokeDasharray="4 4" />
                  <line x1="0" y1="100" x2="820" y2="100" stroke="rgba(255, 122, 0, 0.14)" strokeDasharray="3 3" />
                  <line x1="0" y1="145" x2="820" y2="145" stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="2 2" />

                  {/* Filled Area */}
                  <path
                    d="M 0,138 C 70,132 140,146 210,138 C 280,130 350,150 420,144 C 460,140 490,162 520,140 C 538,124 550,52 560,52 C 572,52 590,120 620,155 C 660,195 730,165 820,168 L 820,220 L 0,220 Z"
                    fill="url(#streamGlow)"
                  />

                  {/* Glowing Telemetry Curve Line */}
                  <path
                    d="M 0,138 C 70,132 140,146 210,138 C 280,130 350,150 420,144 C 460,140 490,162 520,140 C 538,124 550,52 560,52 C 572,52 590,120 620,155 C 660,195 730,165 820,168"
                    fill="none"
                    stroke="url(#lineGlow)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Level Guide Badges (Rendered in foreground with crisp contrast & background pill) */}
                  <g transform="translate(10, 34)">
                    <rect x="0" y="0" width="168" height="18" rx="4" fill="rgba(12, 14, 18, 0.9)" stroke="rgba(239, 68, 68, 0.35)" strokeWidth="0.8" />
                    <text x="84" y="9" fill="#f87171" fontSize="8.5" fontWeight="600" letterSpacing="0.05em" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-mono)">
                      {isFr ? 'ZONE CRITIQUE // TILT > 4.0' : 'CRITICAL ZONE // TILT > 4.0'}
                    </text>
                  </g>

                  <g transform="translate(10, 82)">
                    <rect x="0" y="0" width={isFr ? 118 : 140} height="18" rx="4" fill="rgba(12, 14, 18, 0.9)" stroke="rgba(245, 158, 11, 0.35)" strokeWidth="0.8" />
                    <text x={isFr ? 59 : 70} y="9" fill="#fbbf24" fontSize="8.5" fontWeight="600" letterSpacing="0.05em" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-mono)">
                      {isFr ? 'SEUIL VIGILANCE' : 'WARNING THRESHOLD'}
                    </text>
                  </g>

                  {/* Baseline Nominale Badge: positioned cleanly below line 145 free from curve overlap */}
                  <g transform="translate(10, 152)">
                    <rect x="0" y="0" width="134" height="18" rx="4" fill="rgba(12, 14, 18, 0.92)" stroke="rgba(148, 163, 184, 0.35)" strokeWidth="0.8" />
                    <text x="67" y="9" fill="#cbd5e1" fontSize="8.5" fontWeight="600" letterSpacing="0.05em" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-mono)">
                      {isFr ? 'BASELINE NOMINALE' : 'NOMINAL BASELINE'}
                    </text>
                  </g>

                  {/* Optimal Prediction Cutoff Line */}
                  <line x1="560" y1="58" x2="560" y2="195" stroke="rgba(255, 122, 0, 0.45)" strokeDasharray="4 4" strokeWidth="1.5" />
                  <g
                    transform="translate(566, 168)"
                    style={{ cursor: 'pointer' }}
                    onClick={() => openDictionary('threshold')}
                    role="button"
                    tabIndex={0}
                    aria-label={isFr ? 'Voir la définition du Seuil θ* dans le dictionnaire' : 'View Threshold θ* definition in glossary'}
                  >
                    <rect x="0" y="0" width={isFr ? 144 : 162} height="24" rx="5" fill="rgba(14, 16, 21, 0.96)" stroke="rgba(255, 122, 0, 0.65)" strokeWidth="1.2" />
                    <text x={isFr ? 72 : 81} y="12" fill="#ff7a00" fontSize="9" fontWeight="700" letterSpacing="0.04em" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-mono)">
                      {isFr ? 'SEUIL θ* = 0.36 ✦' : 'THRESHOLD θ* = 0.36 ✦'}
                    </text>
                  </g>

                  {/* Critical Rupture Node (Tilt Spike Peak at x=560, y=52) */}
                  <g
                    transform="translate(560, 52)"
                    style={{ cursor: 'pointer' }}
                    onClick={() => openDictionary('tilt_index')}
                    role="button"
                    tabIndex={0}
                    aria-label={isFr ? "Voir la définition de l'Indice de Tilt dans le dictionnaire" : "View Tilt Index definition in glossary"}
                  >
                    <circle cx="0" cy="0" r="14" fill="rgba(239, 68, 68, 0.2)" className="animate-ping" />
                    <circle cx="0" cy="0" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                    <line x1="0" y1="-6" x2="0" y2="-18" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="2 2" />
                    <rect x="-82" y="-44" width="164" height="26" rx="6" fill="rgba(14, 16, 21, 0.96)" stroke="#ef4444" strokeWidth="1.2" />
                    <text x="0" y="-31" fill="#ef4444" fontSize="9.5" fontWeight="700" letterSpacing="0.05em" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-mono)">
                      TILT : 4.8 / CRIT ✦
                    </text>
                  </g>

                  {/* Match Timeline Indicators */}
                  <text x="70" y="212" fill="rgba(148, 163, 184, 0.65)" fontSize="8.5" fontFamily="var(--font-mono)">M - 8</text>
                  <text x="220" y="212" fill="rgba(148, 163, 184, 0.65)" fontSize="8.5" fontFamily="var(--font-mono)">M - 6</text>
                  <text x="380" y="212" fill="rgba(148, 163, 184, 0.65)" fontSize="8.5" fontFamily="var(--font-mono)">{isFr ? 'M - 4 (FATIGUE)' : 'M - 4 (FATIGUE)'}</text>
                  <text x="560" y="212" fill="rgba(239, 68, 68, 0.95)" fontSize="8.5" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="middle">
                    {isFr ? 'MATCH T (RUPTURE)' : 'MATCH T (BREAKING POINT)'}
                  </text>
                  <text x="740" y="212" fill="rgba(255, 122, 0, 0.75)" fontSize="8.5" fontFamily="var(--font-mono)">+14J HORIZON</text>
                </svg>
              </div>

              {/* Floating Real-Time Metric Pods */}
              <div className="telemetry-hud-overlay">
                <div
                  className="hud-metric-chip"
                  role="button"
                  tabIndex={0}
                  onClick={() => openDictionary('loss_streak')}
                  style={{ cursor: 'pointer' }}
                  title={isFr ? "Voir la définition dans le dictionnaire" : "View definition in glossary"}
                >
                  <span className="hud-label">{isFr ? 'SÉRIE DÉFAITES ✦' : 'LOSS STREAK ✦'}</span>
                  <span className="hud-value glow-rose">-5 Games</span>
                </div>
                <div
                  className="hud-metric-chip"
                  role="button"
                  tabIndex={0}
                  onClick={() => openDictionary('night_owl')}
                  style={{ cursor: 'pointer' }}
                  title={isFr ? "Voir la définition dans le dictionnaire" : "View definition in glossary"}
                >
                  <span className="hud-label">{isFr ? 'SESSIONS NUIT ✦' : 'NIGHT SESSIONS ✦'}</span>
                  <span className="hud-value glow-orange">48.2%</span>
                </div>
                <div
                  className="hud-metric-chip"
                  role="button"
                  tabIndex={0}
                  onClick={() => openDictionary('party_size')}
                  style={{ cursor: 'pointer' }}
                  title={isFr ? "Voir la définition dans le dictionnaire" : "View definition in glossary"}
                >
                  <span className="hud-label">{isFr ? 'BOUCLIER GROUPE ✦' : 'PARTY SHIELD ✦'}</span>
                  <span className="hud-value text-emerald">{isFr ? '12% (Isolé)' : '12% (Solo)'}</span>
                </div>
                <div
                  className="hud-metric-chip"
                  role="button"
                  tabIndex={0}
                  onClick={() => openDictionary('churn')}
                  style={{ cursor: 'pointer' }}
                  title={isFr ? "Voir la définition dans le dictionnaire" : "View definition in glossary"}
                >
                  <span className="hud-label">{isFr ? 'PROBA CHURN ✦' : 'CHURN PROBABILITY ✦'}</span>
                  <span className="hud-value glow-rose">86.5%</span>
                </div>
              </div>
            </div>

            {/* Bottom Floating Bar */}
            <div className="mockup-footer-bar">
              <span className="footer-lead-text">
                {isFr ? 'Télémétrie Match T — Horizon prédictif 14 jours' : 'Match T Telemetry — 14-day rolling predictive horizon'} —
              </span>
              <a href="#simulator" className="footer-inline-link" onClick={(e) => handleScrollTo(e, '#simulator')}>
                <span>{isFr ? 'Lancer une simulation' : 'Launch custom simulation'}</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Right Vibrant Fluted Slats Backdrop */}
          <div className="sculpted-slats-side">
            <div className="ember-slat-texture" aria-hidden="true">
              <div className="slat-bar"></div>
              <div className="slat-bar"></div>
              <div className="slat-bar"></div>
              <div className="slat-bar"></div>
              <div className="slat-bar"></div>
              <div className="slat-bar"></div>
              <div className="slat-bar"></div>
              <div className="slat-bar"></div>
            </div>

            {/* Glowing Accent Ambient Bloom */}
            <div className="slat-ambient-glow" aria-hidden="true"></div>

            {/* Floating Circular Rotating Stamp Badge */}
            <div
              className="rotating-stamp-badge"
              onClick={(e) => handleScrollTo(e, '#simulator')}
              title={isFr ? 'Cliquer pour tester le simulateur' : 'Click to test simulator'}
              role="button"
              tabIndex={0}
            >
              <svg className="stamp-svg" viewBox="0 0 140 140" aria-hidden="true">
                <defs>
                  <path id="stampCirclePath" d="M 70, 70 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0" fill="none" />
                </defs>
                <text>
                  <textPath href="#stampCirclePath" className="stamp-rotating-text">
                    {isFr ? '• SIMULATEUR ML • TEST DIRECT • DOTA 2 ' : '• ML SIMULATOR • LIVE TEST • DOTA 2 '}
                  </textPath>
                </text>
              </svg>

              <div className="stamp-core-circle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="8 5 19 12 8 19 8 5" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Monochrome Partner & Tech Ribbon */}
        <div className="tech-strip-container" aria-label="Technology & Data Stack">
          <div className="tech-strip-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <span>{isFr ? 'VALVE TÉLÉMÉTRIE' : 'VALVE TELEMETRY'}</span>
          </div>
          <div className="tech-strip-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <span>OPENDOTA API</span>
          </div>
          <div className="tech-strip-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span>FASTAPI ENGINE</span>
          </div>
          <div className="tech-strip-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span>XGBOOST ML V6</span>
          </div>
          <div
            className="tech-strip-item"
            role="button"
            tabIndex={0}
            onClick={() => openDictionary('smote')}
            style={{ cursor: 'pointer' }}
            title="Voir la définition de SMOTE"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <span>SMOTE IN-FOLD ✦</span>
          </div>
          <div
            className="tech-strip-item"
            role="button"
            tabIndex={0}
            onClick={() => openDictionary('treeshap')}
            style={{ cursor: 'pointer' }}
            title="Voir la définition de TreeSHAP"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span>TREESHAP EXPLAINABILITY ✦</span>
          </div>
        </div>

        {/* 3 Free-Floating Unboxed Editorial Pillars */}
        <div className="hero-editorial-pillars" role="region" aria-label="Research Pillars">
          <div className="editorial-pillar">
            <div className="pillar-num-accent">01</div>
            <div className="pillar-content-stack">
              <h3 className="pillar-editorial-title">
                {t('hero.pillars.churn.title', lang) || (isFr ? 'Enjeu Économique du Churn 14 Jours' : '14-Day Churn Economics')}
              </h3>
              <p className="pillar-editorial-body">
                {t('hero.pillars.churn.desc', lang) || (isFr
                  ? "Dans un jeu service compétitif, 14 jours d'inactivité continue constituent le seuil critique d'abandon définitif. Identifier ce décrochage à l'avance préserve la LTV (Lifetime Value) et la santé de l'écosystème classé sans introduire de fuites temporelles de calendrier."
                  : "In competitive live-service games, 14 consecutive days of inactivity mark the definitive point of departure. Identifying disengagement early preserves long-term player LTV and ecosystem vitality without calendar-based data leakage.")}
              </p>
            </div>
          </div>

          <div className="editorial-pillar">
            <div className="pillar-num-accent">02</div>
            <div className="pillar-content-stack">
              <h3 className="pillar-editorial-title">
                {t('hero.pillars.tilt.title', lang) || (isFr ? 'Psychologie du Tilt & Spirales de Défaite' : 'Tilt Dynamics & Loss Spirals')}
              </h3>
              <p className="pillar-editorial-body">
                {t('hero.pillars.tilt.desc', lang) || (isFr
                  ? "Le churn dans les MOBAs n'est pas aléatoire : il résulte de l'accumulation de micro-traumatismes compétitifs (défaites écrasantes en moins de 25 min, séries de 3+ défaites, fatigue nocturne). Notre modèle capture cette vulnérabilité psychologique."
                  : "MOBA churn is rarely random: it stems from compounded competitive friction (one-sided stomps under 25 min, 3+ loss streaks, nocturnal fatigue). Our pipeline operationalizes this psychological vulnerability into actionable signals.")}
              </p>
            </div>
          </div>

          <div className="editorial-pillar">
            <div className="pillar-num-accent">03</div>
            <div className="pillar-content-stack">
              <h3 className="pillar-editorial-title">
                {t('hero.pillars.intervention.title', lang) || (isFr ? 'Matchmaking Préventif & Éthique' : 'Proactive & Ethical Matchmaking')}
              </h3>
              <p className="pillar-editorial-body">
                {t('hero.pillars.intervention.desc', lang) || (isFr
                  ? "Plutôt que de manipuler artificiellement les victoires (rejet formel de l'EOMM prédateur), l'intervention consiste à atténuer la fatigue : suggérer un cooldown, éviter d'apparier plusieurs joueurs en tilt aigu ensemble, et préserver l'équité sportive 50/50."
                  : "Rather than rigging match outcomes (strictly rejecting predatory EOMM traps), proactive intervention stabilizes matchmaking: pairing tilted players with high-composure teammates, recommending cooldowns, while preserving strict 50/50 competitive integrity.")}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

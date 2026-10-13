import React from 'react';

/**
 * HeroSection Component
 * Milestone M2 Storytelling Component
 * 
 * Features:
 * - High-impact headline & subtitle localized in FR and EN
 * - Clear framing of 14-day churn economics in competitive MOBAs
 * - Psychology of tilt spirals & frustration dynamics
 * - Proactive matchmaking intervention concept (fairness-preserving, anti-EOMM)
 * - Primary CTA linking to #simulator and secondary CTA linking to #benchmark
 * - 3 Value proposition pillar cards detailing the study's core findings
 * - Interactive highlights row (dataset volume, recall, zero temporal leakage)
 */
export default function HeroSection({ lang, t }) {
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
        <div className="hero-content">
          {/* Top Badge */}
          <div className="badge badge-orange hero-badge">
            <span className="badge-dot" aria-hidden="true"></span>
            <span>{t('hero.badge', lang)}</span>
          </div>

          {/* Main Title & Glow Highlight */}
          <h1 id="hero-title" className="hero-title">
            {t('hero.titleMain', lang)}{' '}
            <span className="glow-orange">{t('hero.titleHighlight', lang)}</span>
          </h1>

          {/* Subtitle / Executive Summary */}
          <p className="hero-subtitle">
            {t('hero.subtitle', lang)}
          </p>

          {/* Primary & Secondary Call to Actions */}
          <div className="hero-actions">
            <a
              href="#simulator"
              className="btn-primary"
              onClick={(e) => handleScrollTo(e, '#simulator')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
              </svg>
              {t('hero.ctaSimulator', lang)}
            </a>
            <a
              href="#benchmark"
              className="btn-secondary"
              onClick={(e) => handleScrollTo(e, '#benchmark')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              {t('hero.ctaBenchmark', lang) || (isFr ? 'Benchmark ML & Modèles' : 'ML Benchmark & Models')}
            </a>
          </div>

          {/* Key Metric Highlights Row */}
          <div className="hero-highlights-row" role="list">
            <div className="highlight-pill" role="listitem">
              <span className="highlight-dot" aria-hidden="true"></span>
              <span>{t('hero.highlights.dataset', lang)}</span>
            </div>
            <div className="highlight-pill" role="listitem">
              <span className="highlight-dot" aria-hidden="true"></span>
              <span>{t('hero.highlights.recall', lang)}</span>
            </div>
            <div className="highlight-pill" role="listitem">
              <span className="highlight-dot" aria-hidden="true"></span>
              <span>{t('hero.highlights.leakage', lang)}</span>
            </div>
          </div>

          {/* Core Value Proposition Pillars (Storytelling Deep-Dive) */}
          <div className="hero-pillars-grid">
            {/* Pillar 1: Economic Stakes of 14-Day Churn */}
            <div className="hero-pillar-card">
              <div className="pillar-icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="pillar-title">
                {t('hero.pillars.churn.title', lang) || (isFr ? 'Enjeu Économique du Churn 14 Jours' : '14-Day Churn Economics')}
              </h3>
              <p className="pillar-desc">
                {t('hero.pillars.churn.desc', lang) || (isFr
                  ? "Dans un jeu service compétitif, 14 jours d'inactivité continue constituent le seuil critique d'abandon définitif. Identifier ce décrochage à l'avance préserve la LTV (Lifetime Value) et la santé de l'écosystème classé sans introduire de fuites temporelles de calendrier."
                  : "In competitive live-service games, 14 consecutive days of inactivity mark the definitive point of departure. Identifying disengagement early preserves long-term player LTV and ecosystem vitality without calendar-based data leakage.")}
              </p>
            </div>

            {/* Pillar 2: Frustration & Tilt Dynamics */}
            <div className="hero-pillar-card">
              <div className="pillar-icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
              </div>
              <h3 className="pillar-title">
                {t('hero.pillars.tilt.title', lang) || (isFr ? 'Psychologie du Tilt & Spirales de Défaite' : 'Tilt Dynamics & Loss Spirals')}
              </h3>
              <p className="pillar-desc">
                {t('hero.pillars.tilt.desc', lang) || (isFr
                  ? "Le churn dans les MOBAs n'est pas aléatoire : il résulte de l'accumulation de micro-traumatismes compétitifs (défaites écrasantes en moins de 25 min, séries de 3+ défaites, fatigue nocturne). Notre modèle capture cette vulnérabilité psychologique."
                  : "MOBA churn is rarely random: it stems from compounded competitive friction (one-sided stomps under 25 min, 3+ loss streaks, nocturnal fatigue). Our pipeline operationalizes this psychological vulnerability into actionable signals.")}
              </p>
            </div>

            {/* Pillar 3: Proactive Matchmaking Intervention */}
            <div className="hero-pillar-card">
              <div className="pillar-icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m4.93 4.93 4.24 4.24" />
                  <path d="m14.83 9.17 4.24-4.24" />
                  <path d="m14.83 14.83 4.24 4.24" />
                  <path d="m9.17 14.83-4.24 4.24" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
              <h3 className="pillar-title">
                {t('hero.pillars.intervention.title', lang) || (isFr ? 'Matchmaking Préventif & Éthique' : 'Proactive & Ethical Matchmaking')}
              </h3>
              <p className="pillar-desc">
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

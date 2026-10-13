import React from 'react';

/**
 * Footer Component
 * Strict Anonymization & Open Source Compliance:
 * - Zero personal machine paths or local system directories
 * - Zero developer personal identifiers (names, emails)
 * - Explicit Valve trademark & OpenDota telemetry disclaimer
 * - Competitive ethics statement (anti-EOMM guarantee)
 * - Tech stack badges
 */
export default function Footer({ lang, t }) {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        {/* Top Info Grid */}
        <div className="footer-grid">
          {/* Col 1: Project Identity */}
          <div className="footer-col footer-col-primary">
            <div className="footer-brand">
              <div className="brand-logo-icon footer-logo" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
              </div>
              <h3 className="footer-title">{t('footer.projectTitle', lang)}</h3>
            </div>
            <p className="footer-description">
              {t('footer.projectTagline', lang)}
            </p>
            <div className="footer-stack-badges">
              <span className="badge-tech">React 19</span>
              <span className="badge-tech">Vite 8</span>
              <span className="badge-tech">FastAPI</span>
              <span className="badge-tech">XGBoost</span>
              <span className="badge-tech">SMOTE</span>
              <span className="badge-tech">Pure CSS</span>
            </div>
          </div>

          {/* Col 2: Ethics & Fairness Standard */}
          <div className="footer-col">
            <h4 className="footer-col-title">
              {lang === 'fr' ? 'Engagement Éthique' : 'Competitive Ethics'}
            </h4>
            <p className="footer-text-muted">
              {t('footer.disclaimers.ethics', lang)}
            </p>
          </div>

          {/* Col 3: Legal Disclaimers & Data Source */}
          <div className="footer-col">
            <h4 className="footer-col-title">
              {lang === 'fr' ? 'Mentions & Télémétrie' : 'Legal & Telemetry'}
            </h4>
            <p className="footer-text-muted">
              {t('footer.disclaimers.valve', lang)}
            </p>
            <p className="footer-text-muted" style={{ marginTop: '0.5rem' }}>
              {t('footer.disclaimers.opendota', lang)}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-notice">
            {t('footer.disclaimers.anonymization', lang)}
          </div>
          <div className="footer-bottom-meta">
            <span className="footer-author-badge">{t('footer.license', lang)}</span>
            <div className="footer-social-links">
              <a
                href="https://www.linkedin.com/in/matthieu-gout"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="LinkedIn - Matthieu Gout"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/ofggout880"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="GitHub - ofggout880"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

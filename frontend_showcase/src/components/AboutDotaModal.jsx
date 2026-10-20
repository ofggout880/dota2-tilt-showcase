import React, { useEffect, useRef } from 'react';
import { useDictionary } from '../context/DictionaryContext';

/**
 * AboutDotaModal Component
 * Interactive modal explaining Dota 2 context, tilt/churn mechanics,
 * and target audiences (LiveOps, Matchmaking, Recruiters & ML Engineers).
 */
export default function AboutDotaModal({ lang = 'fr', t }) {
  const { isAboutOpen, closeAboutModal, openDictionary } = useDictionary();
  const modalRef = useRef(null);
  const isFr = lang === 'fr';

  // Handle ESC key & scroll locking
  useEffect(() => {
    if (!isAboutOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeAboutModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus on modal
    const focusTimer = setTimeout(() => {
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      clearTimeout(focusTimer);
    };
  }, [isAboutOpen, closeAboutModal]);

  if (!isAboutOpen) return null;

  const handleOpenDict = () => {
    closeAboutModal();
    openDictionary('dota2');
  };

  const handleGoSimulator = () => {
    closeAboutModal();
    const el = document.querySelector('#simulator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="about-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAboutModal();
      }}
      role="presentation"
    >
      <div
        className="about-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-title"
        ref={modalRef}
        tabIndex={-1}
      >
        {/* Header Bar */}
        <div className="about-modal-header">
          <div className="about-modal-title-group">
            <div className="about-modal-badge">
              <span className="badge-sparkle">✦</span>
              <span>{t('aboutModal.badge', lang)}</span>
            </div>
            <h2 id="about-modal-title" className="about-modal-title">
              {t('aboutModal.title', lang)}
            </h2>
            <p className="about-modal-subtitle">
              {t('aboutModal.subtitle', lang)}
            </p>
          </div>
          <button
            type="button"
            className="about-modal-close-btn"
            onClick={closeAboutModal}
            aria-label={t('aboutModal.closeAria', lang)}
          >
            ✕
          </button>
        </div>

        {/* 3 Structured Explanatory Pillars */}
        <div className="about-pillars-grid">
          {/* Pillar 1: What is Dota 2 */}
          <article className="about-pillar-card">
            <div className="pillar-card-header">
              <span className="pillar-icon" aria-hidden="true">🎮</span>
              <div>
                <span className="pillar-category-tag">{t('aboutModal.card1Badge', lang)}</span>
                <h3 className="pillar-card-title">{t('aboutModal.card1Title', lang)}</h3>
              </div>
            </div>
            <div className="pillar-card-body">
              <p>{t('aboutModal.card1P1', lang)}</p>
              <p>{t('aboutModal.card1P2', lang)}</p>
            </div>
            <div className="pillar-card-highlight">
              <strong>{isFr ? 'En un mot :' : 'In short:'}</strong>{' '}
              {isFr
                ? 'Une intensité émotionnelle rare où une seule erreur peut anéantir 45 minutes d’efforts collectifs.'
                : 'A rare emotional intensity where a single blunder can erase 45 minutes of collective effort.'}
            </div>
          </article>

          {/* Pillar 2: Tilt & Churn Mechanics */}
          <article className="about-pillar-card">
            <div className="pillar-card-header">
              <span className="pillar-icon" aria-hidden="true">⚡</span>
              <div>
                <span className="pillar-category-tag">{t('aboutModal.card2Badge', lang)}</span>
                <h3 className="pillar-card-title">{t('aboutModal.card2Title', lang)}</h3>
              </div>
            </div>
            <div className="pillar-card-body">
              <p>{t('aboutModal.card2P1', lang)}</p>
              <p>{t('aboutModal.card2P2', lang)}</p>
            </div>
            <div className="pillar-card-highlight highlight-amber">
              <strong>{isFr ? 'Découverte clé :' : 'Key discovery:'}</strong>{' '}
              {isFr
                ? 'Le churn n’arrive pas par hasard : il est précédé par une dégradation progressive mesurable par télémétrie.'
                : 'Player churn never happens at random: it is preceded by progressive degradation captured via telemetry.'}
            </div>
          </article>

          {/* Pillar 3: Who is this for & Value */}
          <article className="about-pillar-card pillar-card-accent">
            <div className="pillar-card-header">
              <span className="pillar-icon" aria-hidden="true">🎯</span>
              <div>
                <span className="pillar-category-tag">{t('aboutModal.card3Badge', lang)}</span>
                <h3 className="pillar-card-title">{t('aboutModal.card3Title', lang)}</h3>
              </div>
            </div>
            <div className="pillar-card-body pillar-audiences-list">
              <div className="audience-item">
                <span className="audience-bullet">01</span>
                <div>
                  <strong>{t('aboutModal.card3Audience1Title', lang)}</strong>
                  <p>{t('aboutModal.card3Audience1Desc', lang)}</p>
                </div>
              </div>

              <div className="audience-item">
                <span className="audience-bullet">02</span>
                <div>
                  <strong>{t('aboutModal.card3Audience2Title', lang)}</strong>
                  <p>{t('aboutModal.card3Audience2Desc', lang)}</p>
                </div>
              </div>

              <div className="audience-item">
                <span className="audience-bullet">03</span>
                <div>
                  <strong>{t('aboutModal.card3Audience3Title', lang)}</strong>
                  <p>{t('aboutModal.card3Audience3Desc', lang)}</p>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Modal Action Bar */}
        <div className="about-modal-footer">
          <div className="about-modal-actions-left">
            <button
              type="button"
              className="about-action-btn about-btn-lexicon"
              onClick={handleOpenDict}
            >
              📖 {t('aboutModal.actionLexicon', lang)}
            </button>
            <button
              type="button"
              className="about-action-btn about-btn-simulator"
              onClick={handleGoSimulator}
            >
              ⚡ {t('aboutModal.actionSimulator', lang)}
            </button>
          </div>
          <button
            type="button"
            className="about-action-btn about-btn-close"
            onClick={closeAboutModal}
          >
            {t('aboutModal.actionClose', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

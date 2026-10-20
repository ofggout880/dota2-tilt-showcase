import React, { useEffect, useRef } from 'react';
import { useDictionary } from '../context/DictionaryContext';

/**
 * AboutDotaModal Component
 * Editorial article explaining Dota 2 context, tilt/churn mechanics,
 * and project purpose in continuous prose matching the showcase editorial typography.
 */
export default function AboutDotaModal({ lang = 'fr', t }) {
  const { isAboutOpen, closeAboutModal, openDictionary } = useDictionary();
  const modalRef = useRef(null);

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
        className="about-modal-dialog editorial-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-title"
        ref={modalRef}
        tabIndex={-1}
      >
        {/* Header Bar */}
        <div className="editorial-modal-header">
          <div className="editorial-modal-header-left">
            <span className="editorial-modal-eyebrow">
              {t('aboutModal.eyebrow', lang)}
            </span>
            <h2 id="about-modal-title" className="editorial-modal-title">
              <span className="title-light">{t('aboutModal.titleLight', lang)} </span>
              <span className="title-bold">{t('aboutModal.titleBold', lang)}</span>
            </h2>
          </div>
          <button
            type="button"
            className="editorial-modal-close"
            onClick={closeAboutModal}
            aria-label={t('aboutModal.closeAria', lang)}
          >
            ✕
          </button>
        </div>

        {/* Continuous Editorial Essay Body */}
        <div className="editorial-modal-body">
          <p className="editorial-modal-lead">
            {t('aboutModal.lead', lang)}
          </p>

          <div className="editorial-modal-tags" role="list">
            <span className="editorial-tag-pill" role="listitem">{t('aboutModal.tag1', lang)}</span>
            <span className="editorial-tag-pill" role="listitem">{t('aboutModal.tag2', lang)}</span>
            <span className="editorial-tag-pill" role="listitem">{t('aboutModal.tag3', lang)}</span>
            <span className="editorial-tag-pill" role="listitem">{t('aboutModal.tag4', lang)}</span>
          </div>

          <div className="editorial-modal-prose">
            <p>{t('aboutModal.p1', lang)}</p>
            <p>{t('aboutModal.p2', lang)}</p>
            <p>{t('aboutModal.p3', lang)}</p>
          </div>

          <blockquote className="editorial-modal-quote">
            <p>{t('aboutModal.quote', lang)}</p>
          </blockquote>
        </div>

        {/* Clean Editorial Footer Actions */}
        <div className="editorial-modal-footer">
          <div className="editorial-modal-actions-left">
            <button
              type="button"
              className="editorial-link-btn"
              onClick={handleOpenDict}
            >
              {t('aboutModal.actionLexicon', lang)}
            </button>
            <button
              type="button"
              className="editorial-link-btn"
              onClick={handleGoSimulator}
            >
              {t('aboutModal.actionSimulator', lang)}
            </button>
          </div>
          <button
            type="button"
            className="editorial-close-btn-text"
            onClick={closeAboutModal}
          >
            {t('aboutModal.actionClose', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

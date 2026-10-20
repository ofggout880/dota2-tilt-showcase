import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useDictionary } from '../context/DictionaryContext';
import { DICTIONARY_TERMS, DICTIONARY_CATEGORIES } from '../data/dictionaryData';

/**
 * Slide-over Dictionary Drawer Component
 * Opens on the right side of the screen with smooth slide transition,
 * real-time search, category filters, and auto-scroll highlighting.
 */
export default function DictionaryDrawer({ lang = 'fr', t }) {
  const { isOpen, activeTermId, closeDictionary, openDictionary, openAboutModal } = useDictionary();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [highlightedId, setHighlightedId] = useState(null);

  const drawerRef = useRef(null);
  const searchInputRef = useRef(null);
  const termsListRef = useRef(null);

  const isFr = lang === 'fr';

  // Handle activeTermId changes and auto-scroll
  useEffect(() => {
    if (isOpen && activeTermId) {
      setHighlightedId(activeTermId);
      // Ensure category includes this term
      const matchedTerm = DICTIONARY_TERMS.find((item) => item.id === activeTermId);
      if (matchedTerm && selectedCategory !== 'all' && selectedCategory !== matchedTerm.category) {
        setSelectedCategory('all');
      }

      // Smooth scroll to card after drawer animation begins
      const timer = setTimeout(() => {
        const el = document.getElementById(`dict-card-${activeTermId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);

      // Remove intense highlight pulse after 2.5s
      const pulseTimer = setTimeout(() => {
        setHighlightedId(null);
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearTimeout(pulseTimer);
      };
    }
  }, [isOpen, activeTermId]);

  // Focus search input when drawer opens with no preselected term
  useEffect(() => {
    if (isOpen && !activeTermId) {
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, activeTermId]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeDictionary();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeDictionary]);

  // Filtered terms based on category & search query
  const filteredTerms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return DICTIONARY_TERMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (!query) return true;
      const termName = isFr ? item.termFr.toLowerCase() : item.termEn.toLowerCase();
      const def = isFr ? item.shortDefFr.toLowerCase() : item.shortDefEn.toLowerCase();
      const takeaway = isFr ? item.takeawayFr.toLowerCase() : item.takeawayEn.toLowerCase();
      const matchesAliases = item.aliases.some((a) => a.toLowerCase().includes(query));

      return (
        termName.includes(query) ||
        def.includes(query) ||
        takeaway.includes(query) ||
        matchesAliases
      );
    });
  }, [searchQuery, selectedCategory, isFr]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: DICTIONARY_TERMS.length, gaming: 0, psychology: 0, ml: 0 };
    DICTIONARY_TERMS.forEach((t) => {
      if (counts[t.category] !== undefined) {
        counts[t.category] += 1;
      }
    });
    return counts;
  }, []);

  const getCategoryBadgeLabel = (cat) => {
    switch (cat) {
      case 'gaming':
        return t('dictionary.badgeGaming', lang);
      case 'psychology':
        return t('dictionary.badgePsychology', lang);
      case 'ml':
        return t('dictionary.badgeMl', lang);
      default:
        return cat;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="dictionary-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dictionary-drawer-title"
    >
      {/* Backdrop */}
      <div
        className="dictionary-backdrop"
        onClick={closeDictionary}
        aria-hidden="true"
      />

      {/* Slide-over Panel */}
      <aside className="dictionary-drawer" ref={drawerRef}>
        {/* Header */}
        <div className="dictionary-header">
          <div className="dictionary-title-area">
            <div className="dictionary-header-badge">
              <span className="dictionary-badge-icon" aria-hidden="true">📖</span>
              <span className="dictionary-badge-text">Lexique ML & Gaming</span>
            </div>
            <h2 id="dictionary-drawer-title" className="dictionary-title">
              {t('dictionary.title', lang)}
            </h2>
            <p className="dictionary-subtitle">
              {t('dictionary.subtitle', lang)}
            </p>
          </div>

          <button
            type="button"
            className="dictionary-close-btn"
            onClick={closeDictionary}
            aria-label={t('dictionary.close', lang)}
            title={t('dictionary.close', lang)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Discovery Banner for Newcomers */}
        <div className="dictionary-about-banner">
          <div className="dict-about-banner-left">
            <span className="dict-about-banner-icon" aria-hidden="true">🎮</span>
            <div>
              <strong className="dict-about-banner-title">{t('aboutModal.triggerDrawer', lang)}</strong>
              <p className="dict-about-banner-sub">{t('aboutModal.triggerDrawerSub', lang)}</p>
            </div>
          </div>
          <button
            type="button"
            className="dict-about-banner-btn"
            onClick={() => {
              closeDictionary();
              openAboutModal();
            }}
          >
            {t('aboutModal.triggerDrawerBtn', lang)}
          </button>
        </div>

        {/* Search Bar */}
        <div className="dictionary-search-container">
          <div className="dictionary-search-input-wrapper">
            <svg className="dictionary-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              className="dictionary-search-input"
              placeholder={t('dictionary.searchPlaceholder', lang)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={t('dictionary.searchPlaceholder', lang)}
            />
            {searchQuery && (
              <button
                type="button"
                className="dictionary-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Effacer la recherche"
              >
                ×
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="dictionary-category-tabs" role="tablist">
            {DICTIONARY_CATEGORIES.map((cat) => {
              const label = isFr ? cat.labelFr : cat.labelEn;
              const count = categoryCounts[cat.id] || 0;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`dictionary-cat-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span className="cat-pill-label">{label}</span>
                  <span className="cat-pill-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Terms Stream / List */}
        <div className="dictionary-body" ref={termsListRef}>
          {filteredTerms.length === 0 ? (
            <div className="dictionary-empty-state">
              <div className="dictionary-empty-icon">🔍</div>
              <p className="dictionary-empty-text">
                {t('dictionary.noResults', lang)}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  {isFr ? 'Réinitialiser les filtres' : 'Reset filters'}
                </button>
              )}
            </div>
          ) : (
            <div className="dictionary-terms-grid">
              {filteredTerms.map((item) => {
                const termTitle = isFr ? item.termFr : item.termEn;
                const defText = isFr ? item.shortDefFr : item.shortDefEn;
                const takeawayText = isFr ? item.takeawayFr : item.takeawayEn;
                const isTarget = item.id === highlightedId || item.id === activeTermId;

                return (
                  <article
                    key={item.id}
                    id={`dict-card-${item.id}`}
                    className={`dictionary-card ${item.badgeClass} ${isTarget ? 'highlighted-term' : ''}`}
                  >
                    <div className="dict-card-top">
                      <h3 className="dict-card-title">{termTitle}</h3>
                      <span className={`dict-category-badge ${item.badgeClass}`}>
                        {getCategoryBadgeLabel(item.category)}
                      </span>
                    </div>

                    <p className="dict-card-definition">{defText}</p>

                    {takeawayText && (
                      <div className="dict-card-takeaway">
                        <span className="dict-takeaway-label">
                          <span className="takeaway-sparkle">✦</span>{' '}
                          {t('dictionary.keyTakeaway', lang)} :
                        </span>{' '}
                        <span className="dict-takeaway-content">{takeawayText}</span>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="dictionary-drawer-footer">
          <span className="dictionary-footer-count">
            {t('dictionary.termCount', lang, { count: filteredTerms.length })}
          </span>
          <span className="dictionary-footer-tip">
            {isFr ? 'Tapez Échap pour fermer' : 'Press Esc to close'}
          </span>
        </div>
      </aside>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { checkBackendHealth, getBackendStatusDetails } from '../services/api';
import { useDictionary } from '../context/DictionaryContext';

/**
 * Navbar Component (Refined Clean & Professional Design)
 * 
 * Features:
 * - Direct naked logo mark matching user SVG specification (no box/capsule)
 * - Free-floating typographic section links on dark canvas (no pill containers)
 * - Backend demo status & Interactive Dictionary cleanly relocated to sleek burger drawer
 * - Minimalist language toggle (FR / EN)
 * - Minimal 3-line hamburger menu button matching reference design
 */
export default function Navbar({
  lang,
  setLang,
  t,
  backendStatus = 'checking',
  onRefreshBackend
}) {
  const [burgerOpen, setBurgerOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusInfo, setStatusInfo] = useState(() => getBackendStatusDetails());
  const [copiedCmd, setCopiedCmd] = useState(false);

  const { openDictionary } = useDictionary();
  const burgerDrawerRef = useRef(null);

  const toggleLanguage = () => {
    const nextLang = lang === 'fr' ? 'en' : 'fr';
    setLang(nextLang);
  };

  const navItems = [
    { href: '#hero', label: t('nav.links.hero', lang) },
    { href: '#kpis', label: t('nav.links.kpis', lang) },
    { href: '#psychology', label: t('nav.links.psychology', lang) },
    { href: '#benchmark', label: t('nav.links.benchmark', lang) },
    { href: '#simulator', label: t('nav.links.simulator', lang) },
    { href: '#architecture', label: t('nav.links.architecture', lang) }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setBurgerOpen(false);
    if (href) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Sync details whenever backendStatus changes
  useEffect(() => {
    setStatusInfo(getBackendStatusDetails());
  }, [backendStatus]);

  // Close burger drawer on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && burgerOpen) {
        setBurgerOpen(false);
      }
    }
    if (burgerOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [burgerOpen]);

  // Handle re-checking backend connection
  const handleRefreshConnection = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      if (typeof onRefreshBackend === 'function') {
        await onRefreshBackend();
      } else {
        await checkBackendHealth(true);
      }
    } finally {
      setStatusInfo(getBackendStatusDetails());
      setIsRefreshing(false);
    }
  };

  // Handle copying quickstart command with fallback & error silencing
  const handleCopyCmd = (cmd) => {
    if (!cmd) return;
    const copyPromise = (async () => {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(cmd);
          return true;
        } catch {
          // Fall through to execCommand fallback
        }
      }
      try {
        const textArea = document.createElement('textarea');
        textArea.value = cmd;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        textArea.style.opacity = '0';
        textArea.setAttribute('readonly', '');
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return Boolean(success);
      } catch {
        return false;
      }
    })();

    copyPromise.then((ok) => {
      if (ok) {
        setCopiedCmd(true);
        setTimeout(() => setCopiedCmd(false), 2000);
      }
    }).catch(() => {});
  };

  const isOnline = backendStatus === 'online';
  const isChecking = backendStatus === 'checking';
  const quickstartCommand = t('backendStatus.popover.quickstartCmd', lang);

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Left Side: Logo + Nav Links directly next to it */}
        <div className="navbar-left">
          <a
            href="#hero"
            className="brand-link"
            onClick={(e) => handleNavClick(e, '#hero')}
            title="Dota 2 ML Showcase"
            aria-label="Accueil Showcase Dota 2 ML"
          >
            <div className="brand-logo-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
              </svg>
            </div>
          </a>

          {/* Desktop Navigation Links (Unboxed, Pure Typography) */}
          <nav className="navbar-links" aria-label="Main Navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="nav-link"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Side: Sleek Language Switcher + Minimalist Burger Button */}
        <div className="navbar-actions">
          {/* Minimalist Lang Toggle */}
          <button
            type="button"
            className="lang-toggle-minimal"
            onClick={toggleLanguage}
            aria-label={t('nav.langToggle.ariaLabel', lang)}
            title={lang === 'fr' ? 'Switch to English' : 'Passer en Français'}
          >
            <span className={lang === 'fr' ? 'lang-text-active' : 'lang-text-inactive'}>FR</span>
            <span className="lang-text-sep">/</span>
            <span className={lang === 'en' ? 'lang-text-active' : 'lang-text-inactive'}>EN</span>
          </button>

          {/* 3-Line Minimal Hamburger Menu Button */}
          <button
            type="button"
            className="burger-menu-btn"
            onClick={() => setBurgerOpen(!burgerOpen)}
            aria-expanded={burgerOpen}
            aria-label={burgerOpen ? t('nav.menu.close', lang) : t('nav.menu.open', lang)}
            title={burgerOpen ? t('nav.menu.close', lang) : t('nav.menu.open', lang)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              {burgerOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Slide-over Burger Menu Drawer */}
      {burgerOpen && (
        <div className="burger-overlay">
          <div
            className="burger-backdrop"
            onClick={() => setBurgerOpen(false)}
            aria-hidden="true"
          />

          <aside className="burger-drawer" ref={burgerDrawerRef} role="dialog" aria-modal="true" aria-label="Menu principal">
            {/* Header */}
            <div className="burger-drawer-header">
              <div className="burger-brand-row">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="burger-flame-icon">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                </svg>
                <span className="burger-drawer-title">{lang === 'fr' ? 'Menu & Outils' : 'Menu & Tools'}</span>
              </div>
              <button
                type="button"
                className="burger-drawer-close"
                onClick={() => setBurgerOpen(false)}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <div className="burger-drawer-body">
              {/* 1. Interactive Dictionary Card */}
              <div className="burger-section">
                <span className="burger-section-label">
                  {lang === 'fr' ? 'Lexique & Définitions' : 'Glossary & Definitions'}
                </span>
                <button
                  type="button"
                  className="burger-card-btn burger-dict-card nav-link-dictionary"
                  onClick={() => {
                    setBurgerOpen(false);
                    openDictionary();
                  }}
                >
                  <div className="burger-card-header">
                    <span className="burger-card-icon" aria-hidden="true">📖</span>
                    <div className="burger-card-titles">
                      <span className="burger-card-title">{t('dictionary.title', lang)}</span>
                      <span className="burger-card-sub">
                        {lang === 'fr' ? '21 termes e-sport & ML définis' : '21 e-sport & ML terms defined'}
                      </span>
                    </div>
                  </div>
                  <span className="burger-card-arrow">
                    {lang === 'fr' ? 'Consulter le lexique →' : 'Open glossary →'}
                  </span>
                </button>
              </div>

              {/* 2. Interactive ML Demo & Backend Status */}
              <div className="burger-section">
                <span className="burger-section-label">
                  {lang === 'fr' ? 'Moteur Prédictif ML' : 'ML Prediction Engine'}
                </span>
                <div className="burger-status-card">
                  <div className="burger-status-top">
                    <div className="burger-status-indicator">
                      <span className={`status-dot ${isOnline ? 'status-dot-green' : isChecking ? 'status-dot-checking' : 'status-dot-amber'}`} />
                      <span className="burger-status-name">
                        {isOnline
                          ? t('nav.status.online', lang)
                          : isChecking
                          ? t('nav.status.checking', lang)
                          : t('nav.status.offline', lang)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={`btn-status-refresh-mini ${isRefreshing ? 'is-loading' : ''}`}
                      onClick={handleRefreshConnection}
                      disabled={isRefreshing}
                      title={t('backendStatus.popover.refreshButton', lang)}
                      aria-label="Rafraîchir la connexion"
                    >
                      <svg className={`refresh-icon ${isRefreshing ? 'animate-spin' : ''}`} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M23 4v6h-6M1 20v-6h6" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                      </svg>
                    </button>
                  </div>

                  <p className="burger-status-desc">
                    {isOnline
                      ? t('backendStatus.popover.onlineDesc', lang)
                      : t('backendStatus.popover.offlineDesc', lang)}
                  </p>

                  <div className="burger-status-meta">
                    <div className="burger-meta-item">
                      <span className="burger-meta-k">{t('backendStatus.popover.portLabel', lang)}</span>
                      <span className="burger-meta-v">{isOnline ? (statusInfo.port || '8000') : 'Démo locale'}</span>
                    </div>
                    <div className="burger-meta-item">
                      <span className="burger-meta-k">Modèle</span>
                      <span className="burger-meta-v">XGBoost V6 (N=16k)</span>
                    </div>
                  </div>

                  {!isOnline && (
                    <div className="burger-quickstart-box" onClick={() => handleCopyCmd(quickstartCommand)} title="Cliquer pour copier">
                      <code>{quickstartCommand}</code>
                      <span className="burger-quickstart-tag">{copiedCmd ? '✓ Copié' : 'Copier'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Section Navigation Links (for tablet/mobile & quick jump) */}
              <div className="burger-section burger-nav-section">
                <span className="burger-section-label">
                  {lang === 'fr' ? 'Sections du Mémoire' : 'Study Sections'}
                </span>
                <nav className="burger-nav-list" aria-label="Mobile Navigation">
                  {navItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="burger-nav-link"
                    >
                      <span>{item.label}</span>
                      <span className="burger-nav-arrow" aria-hidden="true">↗</span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Footer */}
            <div className="burger-drawer-footer">
              <div className="burger-social-row">
                <a
                  href="https://www.linkedin.com/in/matthieu-gout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="burger-social-link"
                  aria-label={t('nav.linkedin.label', lang)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://github.com/ofggout880"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="burger-social-link"
                  aria-label={t('nav.github.label', lang)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
              <button
                type="button"
                className="burger-lang-btn"
                onClick={toggleLanguage}
              >
                {lang === 'fr' ? '🇬🇧 Switch to English' : '🇫🇷 Passer en Français'}
              </button>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}

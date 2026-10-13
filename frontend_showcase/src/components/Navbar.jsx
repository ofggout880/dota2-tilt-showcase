import React, { useState, useEffect, useRef } from 'react';
import { checkBackendHealth, getBackendStatusDetails } from '../services/api';

/**
 * Navbar Component
 * 
 * Features:
 * - Brand logo & stylized flame mark
 * - "V6 XGBoost" model pill badge
 * - Anchor navigation links with smooth scrolling
 * - Glowing Backend Status Indicator Pill (Online Green / Offline Demo Amber)
 * - Clickable popover detailing connection, port detection, and a live "Re-check" button
 * - Language Toggle Pill [ 🇫🇷 FR | 🇬🇧 EN ]
 * - Anonymized GitHub link
 * - Fully responsive mobile drawer and compact <480px dot status mode
 */
export default function Navbar({
  lang,
  setLang,
  t,
  backendStatus = 'checking',
  onRefreshBackend
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusInfo, setStatusInfo] = useState(() => getBackendStatusDetails());
  const [copiedCmd, setCopiedCmd] = useState(false);

  const statusRef = useRef(null);

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
    setMobileMenuOpen(false);
    setPopoverOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Sync details whenever backendStatus changes
  useEffect(() => {
    setStatusInfo(getBackendStatusDetails());
  }, [backendStatus]);

  // Click-outside and Escape key listener to close popover
  useEffect(() => {
    function handleDocumentClick(e) {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setPopoverOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setPopoverOpen(false);
      }
    }
    if (popoverOpen) {
      document.addEventListener('mousedown', handleDocumentClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [popoverOpen]);

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
        {/* Brand Area */}
        <div className="navbar-brand">
          <a href="#hero" className="brand-link" onClick={(e) => handleNavClick(e, '#hero')}>
            {/* Ember Icon */}
            <div className="brand-logo-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-title">{t('nav.brandTitle', lang)}</span>
              <span className="brand-subtitle">{t('nav.brandSubtitle', lang)}</span>
            </div>
          </a>
          <span className="pill-badge pill-badge-ember">
            {t('nav.brandBadge', lang)}
          </span>
        </div>

        {/* Desktop Navigation Links */}
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

        {/* Right Controls: Backend Status + Language Switcher + GitHub */}
        <div className="navbar-actions">
          {/* Interactive Backend Status Indicator & Popover Wrapper */}
          <div className="status-badge-wrapper" ref={statusRef}>
            <button
              type="button"
              className={`status-badge status-badge-button ${
                isOnline ? 'status-online' : isChecking ? 'status-checking' : 'status-offline'
              }`}
              onClick={() => setPopoverOpen(!popoverOpen)}
              aria-expanded={popoverOpen}
              aria-haspopup="dialog"
              aria-label={isOnline ? t('backendStatus.online', lang) : t('backendStatus.offline', lang)}
              title={isOnline ? t('backendStatus.onlineSubtitle', lang) : t('backendStatus.offlineSubtitle', lang)}
            >
              <span className={`status-dot ${isOnline ? 'status-dot-green' : isChecking ? 'status-dot-checking' : 'status-dot-amber'}`} aria-hidden="true"></span>
              <span className="status-label">
                {isOnline
                  ? t('nav.status.online', lang)
                  : isChecking
                  ? t('nav.status.checking', lang)
                  : t('nav.status.offline', lang)}
              </span>
              <svg className={`status-chevron ${popoverOpen ? 'status-chevron-up' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Clickable Popover Details Card */}
            {popoverOpen && (
              <div className="status-popover" role="dialog" aria-modal="false">
                <div className="status-popover-header">
                  <div className="status-popover-title-row">
                    <span className={`status-dot ${isOnline ? 'status-dot-green' : 'status-dot-amber'}`}></span>
                    <h4>{t('backendStatus.popover.title', lang)}</h4>
                  </div>
                  <button
                    type="button"
                    className="status-popover-close"
                    onClick={() => setPopoverOpen(false)}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <div className={`status-popover-banner ${isOnline ? 'banner-online' : 'banner-offline'}`}>
                  <strong>
                    {isOnline
                      ? t('backendStatus.popover.onlineTitle', lang)
                      : t('backendStatus.popover.offlineTitle', lang)}
                  </strong>
                  <p>
                    {isOnline
                      ? t('backendStatus.popover.onlineDesc', lang)
                      : t('backendStatus.popover.offlineDesc', lang)}
                  </p>
                </div>

                <div className="status-popover-grid">
                  <div className="status-grid-item">
                    <span className="status-grid-label">{t('backendStatus.popover.portLabel', lang)}</span>
                    <span className="status-grid-value">
                      {isOnline
                        ? (statusInfo.port || t('backendStatus.popover.proxyPort', lang))
                        : t('backendStatus.popover.fallbackMode', lang)}
                    </span>
                  </div>
                  <div className="status-grid-item">
                    <span className="status-grid-label">{t('backendStatus.popover.endpointLabel', lang)}</span>
                    <span className="status-grid-value">
                      {statusInfo.activeBase ? `${statusInfo.activeBase}/api` : '/api (Proxy)'}
                    </span>
                  </div>
                </div>

                {!isOnline && (
                  <div className="status-popover-quickstart">
                    <span className="quickstart-title">{t('backendStatus.popover.quickstartTitle', lang)}</span>
                    <div className="quickstart-cmd-box" onClick={() => handleCopyCmd(quickstartCommand)} title="Click to copy">
                      <code>{quickstartCommand}</code>
                      <span className="quickstart-copy-tag">{copiedCmd ? '✓ Copié' : 'Copier'}</span>
                    </div>
                  </div>
                )}

                <div className="status-popover-footer">
                  <button
                    type="button"
                    className={`btn-status-refresh ${isRefreshing ? 'is-loading' : ''}`}
                    onClick={handleRefreshConnection}
                    disabled={isRefreshing}
                  >
                    <svg className={`refresh-icon ${isRefreshing ? 'animate-spin' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M23 4v6h-6M1 20v-6h6" />
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                    <span>
                      {isRefreshing
                        ? t('backendStatus.popover.refreshingButton', lang)
                        : t('backendStatus.popover.refreshButton', lang)}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Language Toggle Button */}
          <button
            type="button"
            className="lang-toggle-button"
            onClick={toggleLanguage}
            aria-label={t('nav.langToggle.ariaLabel', lang)}
            title={lang === 'fr' ? 'Switch to English' : 'Passer en Français'}
          >
            <span className={`lang-pill ${lang === 'fr' ? 'lang-pill-active' : ''}`}>
              🇫🇷 FR
            </span>
            <span className="lang-divider">|</span>
            <span className={`lang-pill ${lang === 'en' ? 'lang-pill-active' : ''}`}>
              🇬🇧 EN
            </span>
          </button>

          {/* LinkedIn Profile Link Icon */}
          <a
            href="https://www.linkedin.com/in/matthieu-gout"
            target="_blank"
            rel="noopener noreferrer"
            className="linkedin-icon-button"
            aria-label={t('nav.linkedin.label', lang)}
            title={t('nav.linkedin.label', lang)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>

          {/* GitHub Profile Link Icon */}
          <a
            href="https://github.com/ofggout880"
            target="_blank"
            rel="noopener noreferrer"
            className="github-icon-button"
            aria-label={t('nav.github.label', lang)}
            title={t('nav.github.label', lang)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? t('nav.menu.close', lang) : t('nav.menu.open', lang)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav-links">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="mobile-nav-link"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mobile-drawer-footer">
            <div className="mobile-status-row">
              <span className={`status-dot ${isOnline ? 'status-dot-green' : 'status-dot-amber'}`}></span>
              <span>
                {isOnline ? t('nav.status.online', lang) : t('nav.status.offline', lang)}
              </span>
              <button
                type="button"
                className="btn-status-refresh-mini"
                onClick={handleRefreshConnection}
                disabled={isRefreshing}
                aria-label="Refresh connection"
              >
                <svg className={`refresh-icon ${isRefreshing ? 'animate-spin' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M23 4v6h-6M1 20v-6h6" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
              </button>
            </div>
            <div className="mobile-social-row">
              <a
                href="https://www.linkedin.com/in/matthieu-gout"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-social-link"
                aria-label="LinkedIn - Matthieu Gout"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/ofggout880"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-social-link"
                aria-label="GitHub - ofggout880"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </a>
            </div>
            <button
              type="button"
              className="lang-toggle-button-mobile"
              onClick={toggleLanguage}
            >
              {lang === 'fr' ? '🇬🇧 Switch to English' : '🇫🇷 Passer en Français'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

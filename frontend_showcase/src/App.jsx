import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import KpiBar from './components/KpiBar';
import PsychologySection from './components/PsychologySection';
import MlBenchmarkSection from './components/MlBenchmarkSection';
import SimulatorSection from './components/SimulatorSection';
import ArchitectureSection from './components/ArchitectureSection';
import DictionaryDrawer from './components/DictionaryDrawer';
import WelcomeDictionaryToast from './components/WelcomeDictionaryToast';
import { DictionaryProvider } from './context/DictionaryContext';
import { t } from './translations';
import { checkBackendHealth, getMlMetrics, getMlVisualizations } from './services/api';
import { MOCK_METRICS, MOCK_VISUALIZATIONS } from './data/mockData';

/**
 * Root Error Boundary Component
 * Catches render errors and provides localized recovery interface
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Showcase Error Boundary intercepted error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const isFr = this.props.lang === 'fr';
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-card">
            <h2>{isFr ? 'Une erreur est survenue' : 'An error occurred'}</h2>
            <p>
              {isFr
                ? "Une anomalie d'affichage s'est produite. Veuillez actualiser la page."
                : 'A rendering exception occurred. Please refresh the page.'}
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => window.location.reload()}
            >
              {isFr ? 'Recharger la page' : 'Reload Page'}
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Root Application Component
 * Manages:
 * - Persistent language state ('fr' / 'en') saved to localStorage
 * - Backend health status polling ('online' | 'offline' | 'checking')
 * - Full-height responsive layout shell with dark ember cards
 */
export default function App() {
  // 1. Language State with LocalStorage Persistence
  const [lang, setLang] = useState(() => {
    try {
      const savedLang = localStorage.getItem('dota2_showcase_lang');
      if (savedLang === 'fr' || savedLang === 'en') return savedLang;
      if (typeof navigator !== 'undefined' && navigator.language?.startsWith('en')) {
        return 'en';
      }
    } catch {
      // LocalStorage access may fail in restricted sandboxes
    }
    return 'fr';
  });

  // Sync language state to localStorage
  const handleSetLang = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('dota2_showcase_lang', newLang);
      document.documentElement.lang = newLang;
    } catch {
      // Ignore storage errors
    }
  };

  // Sync HTML lang attribute on mount and change
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  // 2. Backend Health & ML State Management
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking' | 'online' | 'offline'
  const [mlMetrics, setMlMetrics] = useState(MOCK_METRICS);
  const [mlVisualizations, setMlVisualizations] = useState(MOCK_VISUALIZATIONS);

  const refreshBackend = async () => {
    try {
      const isHealthy = await checkBackendHealth(true);
      setBackendStatus(isHealthy ? 'online' : 'offline');
      if (isHealthy) {
        const [metricsData, visData] = await Promise.all([
          getMlMetrics(),
          getMlVisualizations()
        ]);
        if (metricsData) setMlMetrics(metricsData);
        if (visData) setMlVisualizations(visData);
      }
      return isHealthy;
    } catch {
      setBackendStatus('offline');
      return false;
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function verifyBackend() {
      try {
        const isHealthy = await checkBackendHealth();
        if (isMounted) {
          setBackendStatus(isHealthy ? 'online' : 'offline');
        }
        if (isHealthy) {
          const [metricsData, visData] = await Promise.all([
            getMlMetrics(),
            getMlVisualizations()
          ]);
          if (isMounted) {
            if (metricsData) setMlMetrics(metricsData);
            if (visData) setMlVisualizations(visData);
          }
        }
      } catch {
        if (isMounted) {
          setBackendStatus('offline');
        }
      }
    }
    verifyBackend();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ErrorBoundary lang={lang}>
      <DictionaryProvider>
        <div className="app-shell">
          {/* Sticky Header Shell */}
          <Navbar
            lang={lang}
            setLang={handleSetLang}
            t={t}
            backendStatus={backendStatus}
            onRefreshBackend={refreshBackend}
          />

          {/* Main Content Area */}
          <main id="main-content" className="app-main">
            {/* Milestone M2 Integrated Components */}
            <HeroSection lang={lang} t={t} />

            <KpiBar lang={lang} t={t} metricsData={mlMetrics} />

            <PsychologySection lang={lang} t={t} />

            <MlBenchmarkSection
              lang={lang}
              t={t}
              metricsData={mlMetrics}
              visData={mlVisualizations}
            />

            {/* Section 5: Interactive Simulator & 4 Archetypes */}
            <SimulatorSection lang={lang} t={t} backendStatus={backendStatus} />

            {/* Section 6: Pipeline Architecture & Reproducibility */}
            <ArchitectureSection lang={lang} t={t} />
          </main>

          {/* Global Slide-over Dictionary Drawer */}
          <DictionaryDrawer lang={lang} t={t} />

          {/* Welcome Interactive Dictionary Toast */}
          <WelcomeDictionaryToast lang={lang} t={t} />

          {/* Footer Shell */}
          <Footer lang={lang} t={t} />
        </div>
      </DictionaryProvider>
    </ErrorBoundary>
  );
}

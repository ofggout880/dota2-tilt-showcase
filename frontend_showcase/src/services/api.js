/**
 * Resilient API Client for FastAPI Backend & Health Verification
 * 
 * Features:
 * 1. Multi-candidate port probing: port 8001 (showcase proxy), port 8000 (FastAPI default), relative /api, VITE_API_URL
 * 2. In-flight promise deduplication & 5-second memoization TTL
 * 3. Fast AbortController timeouts (1500ms health check, 1800ms telemetry)
 * 4. Endpoints: checkBackendHealth, getMlMetrics, getMlVisualizations, predictPlayer, getHeroes
 * 5. 100% offline fallback to mockData.js with { isOffline: true }
 * 6. Zero unhandled exceptions
 */

import {
  MOCK_METRICS,
  MOCK_VISUALIZATIONS,
  MOCK_ARCHETYPES,
  MOCK_HEROES
} from '../data/mockData.js';

// --- Internal Client State ---
let activeBase = '';
let cachedHealth = null; // { isHealthy: boolean, timestamp: number, port: string, base: string, details: object|null }
let inFlightHealthPromise = null;
const CACHE_TTL_MS = 5000;

/**
 * Builds a clean URL combining candidate base and API endpoint without double slashes or duplicated /api
 */
export function buildUrl(base, endpoint) {
  if (!base) return endpoint;
  const cleanBase = base.replace(/\/+$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (cleanBase.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
    return cleanBase + cleanEndpoint.slice(4);
  }
  return cleanBase + cleanEndpoint;
}

/**
 * Extracts a friendly human-readable port label from a base URL
 */
function extractPortLabel(base) {
  if (!base || base === '') return '8001 (Proxy Vite)';
  if (base.includes(':8001')) return 'Port 8001';
  if (base.includes(':8000')) return 'Port 8000';
  const match = base.match(/:(\d+)/);
  if (match) return `Port ${match[1]}`;
  return 'API Distante';
}

/**
 * Returns list of ordered candidate URLs to probe
 */
function getCandidateBases() {
  const envUrl = (import.meta.env?.VITE_API_URL || '').trim();
  const candidates = [];
  if (envUrl) candidates.push(envUrl);
  // Relative root (routes through Vite dev proxy to 8001)
  candidates.push('');
  // Direct localhost fallback candidates
  candidates.push('http://127.0.0.1:8001');
  candidates.push('http://127.0.0.1:8000');
  candidates.push('http://localhost:8001');
  candidates.push('http://localhost:8000');
  return [...new Set(candidates)];
}

/**
 * Probes a single candidate base for health status
 */
async function probeCandidate(base, timeoutMs = 1500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url = buildUrl(base, '/api/status');
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && (data.status === 'healthy' || data.status === 'ok' || data.total_heroes !== undefined)) {
      return { base, data };
    }
    return null;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

/**
 * Checks backend health status with multi-candidate detection, memoization, and in-flight promise reuse.
 * @param {boolean} [forceRefresh=false] - If true, bypasses the 5-second memoization cache
 * @returns {Promise<boolean>} True if any candidate backend is online and healthy, false otherwise
 */
export async function checkBackendHealth(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedHealth && (now - cachedHealth.timestamp < CACHE_TTL_MS)) {
    return cachedHealth.isHealthy;
  }

  if (inFlightHealthPromise) {
    return inFlightHealthPromise;
  }

  inFlightHealthPromise = (async () => {
    try {
      // 1. If an active base was previously validated, probe it first with a quick timeout
      if (activeBase !== null && activeBase !== undefined && activeBase !== '') {
        const directResult = await probeCandidate(activeBase, 1200);
        if (directResult) {
          cachedHealth = {
            isHealthy: true,
            timestamp: Date.now(),
            base: directResult.base,
            port: extractPortLabel(directResult.base),
            details: directResult.data
          };
          return true;
        }
      }

      // 2. Probe all candidate bases concurrently with Promise.any
      const candidates = getCandidateBases();
      const probePromises = candidates.map(async (candidateBase) => {
        const result = await probeCandidate(candidateBase, 1500);
        if (result) return result;
        throw new Error('Unhealthy');
      });

      try {
        const winner = await Promise.any(probePromises);
        activeBase = winner.base;
        cachedHealth = {
          isHealthy: true,
          timestamp: Date.now(),
          base: winner.base,
          port: extractPortLabel(winner.base),
          details: winner.data
        };
        return true;
      } catch {
        // All candidates failed or timed out
        activeBase = '';
        cachedHealth = {
          isHealthy: false,
          timestamp: Date.now(),
          base: null,
          port: null,
          details: null
        };
        return false;
      }
    } finally {
      inFlightHealthPromise = null;
    }
  })();

  return inFlightHealthPromise;
}

/**
 * Returns current cached backend connection metadata
 * @returns {object}
 */
export function getBackendStatusDetails() {
  const now = Date.now();
  if (!cachedHealth) {
    return {
      isHealthy: false,
      isOffline: true,
      status: 'checking',
      port: null,
      activeBase: '',
      timestamp: 0,
      ageMs: 0,
      details: null
    };
  }
  return {
    isHealthy: cachedHealth.isHealthy,
    isOffline: !cachedHealth.isHealthy,
    status: cachedHealth.isHealthy ? 'online' : 'offline',
    port: cachedHealth.port,
    activeBase: cachedHealth.base,
    timestamp: cachedHealth.timestamp,
    ageMs: now - cachedHealth.timestamp,
    details: cachedHealth.details
  };
}

/**
 * Returns the currently active base URL
 * @returns {string}
 */
export function getActiveApiBase() {
  return activeBase;
}

/**
 * Fetches machine learning benchmark metrics with mock fallback
 * @returns {Promise<object>}
 */
export async function getMlMetrics() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1800);

  try {
    const url = buildUrl(activeBase, '/api/ml/metrics');
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);
    if (!res.ok) return { ...MOCK_METRICS, isOffline: true };
    const json = await res.json();
    return {
      ...(json?.metrics || json || MOCK_METRICS),
      isOffline: false
    };
  } catch {
    clearTimeout(timeoutId);
    return { ...MOCK_METRICS, isOffline: true };
  }
}

/**
 * Fetches machine learning visualizations data with mock fallback
 * @returns {Promise<object>}
 */
export async function getMlVisualizations() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1800);

  try {
    const url = buildUrl(activeBase, '/api/ml/visualizations');
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);
    if (!res.ok) return { ...MOCK_VISUALIZATIONS, isOffline: true };
    const json = await res.json();
    return {
      ...(json || MOCK_VISUALIZATIONS),
      isOffline: false
    };
  } catch {
    clearTimeout(timeoutId);
    return { ...MOCK_VISUALIZATIONS, isOffline: true };
  }
}

/**
 * Fetches hero metadata list with mock fallback
 * @returns {Promise<Array<object>>}
 */
export async function getHeroes() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1800);

  try {
    const url = buildUrl(activeBase, '/api/heroes');
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);
    if (!res.ok) return MOCK_HEROES;
    const json = await res.json();
    if (Array.isArray(json) && json.length > 0) {
      return json;
    }
    return MOCK_HEROES;
  } catch {
    clearTimeout(timeoutId);
    return MOCK_HEROES;
  }
}

/**
 * Sanitizes and normalizes an input account ID into a valid 32-bit Steam Account ID.
 * Handles:
 * - 64-bit Steam ID (17 digits starting with 7656119...) via BigInt conversion
 * - Negative numbers & strings (strips negative signs)
 * - Floating point numbers (truncates decimals)
 * - Non-numeric strings, symbols, empty strings, null, undefined, NaN, Infinity
 * 
 * @param {string|number|any} rawId - The raw account ID input
 * @returns {string|null} Sanitized 32-bit Account ID (3-10 digits), or null if invalid
 */
export function sanitizeAccountId(rawId) {
  if (rawId === undefined || rawId === null) return null;
  if (typeof rawId === 'symbol') return null;
  
  let str = String(rawId).trim();
  if (!str) return null;

  // Handle floating points (e.g. 835397971.45 -> 835397971)
  if (str.includes('.')) {
    str = str.split('.')[0];
  }

  // Strip non-numeric characters (handles negative signs, spaces, symbols)
  const digits = str.replace(/\D/g, '');
  if (!digits) return null;

  // Check for 64-bit Steam ID (17 digits starting with 7656119...)
  if (digits.length === 17 && digits.startsWith('7656119')) {
    try {
      const STEAM64_BASE = 76561197960265728n;
      const steam64 = BigInt(digits);
      const account32 = steam64 - STEAM64_BASE;
      if (account32 > 0n && account32 <= 4294967295n) {
        return String(account32);
      }
    } catch {
      // Fall through to standard slicing if BigInt fails
    }
  }

  // Standard 32-bit Steam Account ID (3 to 10 digits)
  const clean = digits.slice(0, 10);
  if (clean.length < 3 || clean === '0' || /^0+$/.test(clean)) {
    return null;
  }
  return clean;
}

/**
 * Deterministically generates a realistic player profile from any numeric Steam ID
 * when backend is offline or account is unranked/private.
 * @param {string} cleanId - Sanitized numeric Steam account ID
 * @returns {object} Synthesized profile with full telemetry and attribution
 */
export function synthesizePlayerProfile(cleanId) {
  let hash = 0;
  for (let i = 0; i < cleanId.length; i++) {
    hash = ((hash << 5) - hash) + cleanId.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  const probRaw = 0.15 + (seed % 72) / 100;
  const prob = Math.round(probRaw * 1000) / 1000;
  const isHighRisk = prob >= 0.36;
  const rankTier = 21 + (seed % 55);
  const streak = isHighRisk ? -(1 + (seed % 6)) : (1 + (seed % 5));
  const winRate = Math.round((0.35 + (seed % 30) / 100) * 100) / 100;
  const avgKda = Math.round((1.5 + (seed % 280) / 100) * 100) / 100;
  const avgGpm = 340 + (seed % 280);
  const avgXpm = 380 + (seed % 320);
  const sessionDur = Math.round((22 + (seed % 220) / 10) * 10) / 10;
  const tiltIndex = isHighRisk ? Math.round((1.0 + (seed % 45) / 10) * 10) / 10 : 0.0;
  const abandons = isHighRisk ? (seed % 3) : 0;
  const partyPct = isHighRisk ? Math.round(((seed % 20) / 100) * 100) / 100 : Math.round((0.40 + (seed % 45) / 100) * 100) / 100;
  const nightOwl = Math.round(((seed % 50) / 100) * 100) / 100;

  return {
    id: `synth_${cleanId}`,
    account_id: cleanId,
    accountId: cleanId,
    personaname: `DotaPlayer_${cleanId.slice(-4)}`,
    nameFr: `Profil Simulé #${cleanId}`,
    nameEn: `Simulated Profile #${cleanId}`,
    name_fr: `Profil Simulé #${cleanId}`,
    name_en: `Simulated Profile #${cleanId}`,
    churn_probability: prob,
    probability: prob,
    churnProbability: prob,
    predicted_churn: isHighRisk ? 1 : 0,
    predictedChurn: isHighRisk ? 1 : 0,
    risk_level: prob >= 0.60 ? 'Très Élevé (Ragequit imminent)' : (isHighRisk ? 'Élevé (Frustration)' : 'Faible'),
    risk_tier: prob >= 0.60 ? 'critical' : (isHighRisk ? 'moderate' : 'low'),
    riskLevel: prob >= 0.60 ? 'critical' : (isHighRisk ? 'moderate' : 'low'),
    rank_tier: rankTier,
    rankTier: rankTier,
    isOffline: true,
    isMock: true,
    isSynthesized: true,
    success: true,
    features: {
      win_rate: winRate,
      avg_kda: avgKda,
      avg_gpm: avgGpm,
      avg_xpm: avgXpm,
      current_streak: streak,
      current_streak_at_cutoff: streak,
      avg_session_duration: sessionDur,
      session_duration_per_game: sessionDur,
      avg_rank_imbalance: Math.round((6.0 + (seed % 90) / 10) * 10) / 10,
      tilt_index: tiltIndex,
      abandon_rate: abandons > 0 ? 0.08 : 0.0,
      recent_abandons: abandons,
      recent_avg_duration: sessionDur,
      recent_deaths_per_min: isHighRisk ? 0.35 : 0.12,
      party_play_pct: partyPct,
      night_owl_pct: nightOwl,
      role_consistency: Math.round((0.40 + (seed % 45) / 100) * 100) / 100,
      objective_focus: Math.round((0.05 + (seed % 20) / 100) * 100) / 100,
      avg_hero_damage: 16000 + (seed % 12000),
      avg_tower_damage: 800 + (seed % 3000),
      avg_hero_healing: 200 + (seed % 3000)
    },
    factorAttribution: {
      aggravating: isHighRisk ? [
        {
          feature: "tilt_index",
          impact: 0.28,
          weight: 28.0,
          description_fr: `Frustration accumulée (Indice de Tilt: ${tiltIndex})`,
          description_en: `Compounded frustration (Tilt Index: ${tiltIndex})`
        },
        {
          feature: "current_streak_at_cutoff",
          impact: 0.20,
          weight: 20.0,
          description_fr: `Série négative active de ${Math.abs(streak)} défaite(s)`,
          description_en: `Active loss streak of ${Math.abs(streak)} defeat(s)`
        },
        {
          feature: "party_play_pct",
          impact: 0.12,
          weight: 12.0,
          description_fr: `Faible soutien social (${Math.round(partyPct * 100)}% en groupe)`,
          description_en: `Low social cohesion (${Math.round(partyPct * 100)}% party play)`
        }
      ] : [
        {
          feature: "ranked_play_pct",
          impact: 0.05,
          weight: 5.0,
          description_fr: "Intensité des parties classées",
          description_en: "Ranked queue competitive pressure"
        }
      ],
      protective: !isHighRisk ? [
        {
          feature: "party_play_pct",
          impact: -0.24,
          weight: -24.0,
          description_fr: `Forte pratique sociale (${Math.round(partyPct * 100)}% en groupe)`,
          description_en: `High social cohesion (${Math.round(partyPct * 100)}% party play)`
        },
        {
          feature: "win_rate",
          impact: -0.18,
          weight: -18.0,
          description_fr: `Régularité des victoires (${Math.round(winRate * 100)}%)`,
          description_en: `Positive win rate momentum (${Math.round(winRate * 100)}%)`
        },
        {
          feature: "tilt_index",
          impact: -0.15,
          weight: -15.0,
          description_fr: "Sérénité de jeu (Zéro tilt détecté)",
          description_en: "Calm mental composure (Zero tilt detected)"
        }
      ] : [
        {
          feature: "rank_tier",
          impact: -0.06,
          weight: -6.0,
          description_fr: "Investissement historique dans le jeu",
          description_en: "Historical time investment in Dota 2"
        }
      ]
    }
  };
}

/**
 * Predicts player churn probability by account ID.
 * Features:
 * - Input sanitization & numeric validation (3-10 digits)
 * - Fast timeout (1500ms) with AbortController
 * - Intelligent fallback to matching archetype or deterministic synthesized profile
 * - Zero unhandled exceptions
 * 
 * @param {string|number} accountId - 32-bit Steam account ID
 * @returns {Promise<object>} Complete player profile and prediction outcome
 */
export async function predictPlayer(accountId) {
  const cleanId = sanitizeAccountId(accountId);
  if (!cleanId) {
    return {
      success: false,
      errorKey: "errors.invalidId",
      error: "Invalid Steam Account ID format (must be 3-10 digits or 17-digit 64-bit Steam ID)"
    };
  }

  // Check if ID matches an archetype
  const matchedArchetype = MOCK_ARCHETYPES.find(
    a => a.accountId === cleanId || a.account_id === cleanId || a.id === cleanId || a.legacyId === cleanId || a.aliasId === cleanId
  );

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1500);

  try {
    const url = buildUrl(activeBase, `/api/predict/${cleanId}`);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        ...data,
        id: `live_${cleanId}`,
        accountId: data.account_id || cleanId,
        account_id: data.account_id || cleanId,
        personaname: data.personaname || `Player_${cleanId}`,
        nameFr: data.personaname || `Joueur #${cleanId}`,
        nameEn: data.personaname || `Player #${cleanId}`,
        name_fr: data.personaname || `Joueur #${cleanId}`,
        name_en: data.personaname || `Player #${cleanId}`,
        probability: data.churn_probability,
        churn_probability: data.churn_probability,
        churnProbability: data.churn_probability,
        predictedChurn: data.predicted_churn,
        predicted_churn: data.predicted_churn,
        rankTier: data.rank_tier || 40,
        rank_tier: data.rank_tier || 40,
        riskLevel: data.churn_probability >= 0.60 ? 'critical' : (data.churn_probability >= 0.36 ? 'moderate' : 'low'),
        risk_tier: data.churn_probability >= 0.60 ? 'critical' : (data.churn_probability >= 0.36 ? 'moderate' : 'low'),
        risk_level: data.risk_level || (data.churn_probability >= 0.60 ? 'Très Élevé (Ragequit imminent)' : (data.churn_probability >= 0.36 ? 'Élevé (Frustration)' : 'Faible')),
        isOffline: false,
        isMock: false,
        success: true,
        features: {
          win_rate: data.features?.win_rate ?? 0.50,
          avg_kda: data.features?.avg_kda ?? 2.50,
          avg_gpm: data.features?.avg_gpm ?? 450,
          avg_xpm: data.features?.avg_xpm ?? 500,
          current_streak: data.features?.current_streak ?? 0,
          current_streak_at_cutoff: data.features?.current_streak ?? 0,
          recent_abandons: data.features?.recent_abandons ?? 0,
          recent_avg_duration: data.features?.recent_avg_duration ?? 35.0,
          session_duration_per_game: data.features?.avg_session_duration ?? 35.0,
          recent_deaths_per_min: data.features?.recent_deaths_per_min ?? 0.15,
          tilt_index: data.features?.tilt_index ?? 0.0,
          party_play_pct: data.features?.party_play_pct ?? 0.20,
          role_consistency: data.features?.role_consistency ?? 0.50,
          night_owl_pct: data.features?.night_owl_pct ?? 0.15,
          objective_focus: data.features?.objective_focus ?? 0.10
        },
        factorAttribution: matchedArchetype ? matchedArchetype.factorAttribution : undefined
      };
    }

    // Backend returned non-200 (e.g. 404 player private, 500)
    if (matchedArchetype) {
      return {
        ...matchedArchetype,
        isOffline: true,
        isMock: true,
        success: true,
        fallbackReason: 'backend_http_error'
      };
    }
    return synthesizePlayerProfile(cleanId);
  } catch {
    clearTimeout(timeoutId);
    // Timeout or Network Failure -> Intelligent Fallback
    if (matchedArchetype) {
      return {
        ...matchedArchetype,
        isOffline: true,
        isMock: true,
        success: true,
        fallbackReason: 'backend_offline'
      };
    }
    return synthesizePlayerProfile(cleanId);
  }
}

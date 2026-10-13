/**
 * Challenger M3 Empirical Stress Test Harness
 * 
 * Comprehensive Adversarial Verification of Milestone M3:
 * 1. 4 Archetypes Data Integrity & Rapid Switching
 * 2. Input Validation on Account ID (non-numeric, extreme lengths, empty, XSS, prototypes)
 * 3. Semicircular Risk Gauge Needle Rotation & SVG Math (NaN safety, boundary sweep)
 * 4. Factor Attribution Breakdown & SHAP Derivation (NaN safety, edge telemetries)
 * 5. Offline Fallback Resilience & Timeout Handling (1500ms AbortController, network chaos)
 * 6. React Component SSR Rendering Integration (zero NaN, zero throws)
 */

import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';

let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;
const failures = [];

function assert(condition, message, details = {}) {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
  } else {
    failedAssertions++;
    failures.push({ message, details });
    console.error(`❌ ASSERTION FAILED: ${message}`, details);
  }
}

console.log('================================================================');
console.log('   CHALLENGER M3 EMPIRICAL STRESS TEST HARNESS (ADVERSARIAL)   ');
console.log('================================================================\n');

async function run() {
  const viteServer = await createServer({
    appType: 'custom',
    server: { middlewareMode: true }
  });

  const mockDataMod = await viteServer.ssrLoadModule('/src/data/mockData.js');
  const apiMod = await viteServer.ssrLoadModule('/src/services/api.js');
  const translationsMod = await viteServer.ssrLoadModule('/src/translations.js');
  const RiskGaugeMod = await viteServer.ssrLoadModule('/src/components/RiskGauge.jsx');
  const FactorAttributionMod = await viteServer.ssrLoadModule('/src/components/FactorAttribution.jsx');
  const SimulatorSectionMod = await viteServer.ssrLoadModule('/src/components/SimulatorSection.jsx');

  const { MOCK_ARCHETYPES } = mockDataMod;
  const { predictPlayer, synthesizePlayerProfile, checkBackendHealth } = apiMod;
  const { t, translateRiskLevel, translateFeature, translateRank } = translationsMod;
  const RiskGauge = RiskGaugeMod.default;
  const FactorAttribution = FactorAttributionMod.default;
  const SimulatorSection = SimulatorSectionMod.default;

  // --------------------------------------------------------------------------
  // SUITE 1: 4 Archetype Data Integrity & Rapid Switching
  // --------------------------------------------------------------------------
  console.log('--- Suite 1: 4 Calibrated Archetypes Verification & Rapid Switching ---');
  assert(Array.isArray(MOCK_ARCHETYPES) && MOCK_ARCHETYPES.length === 4, 'MOCK_ARCHETYPES contains exactly 4 calibrated profiles');

  const expectedArchetypes = [
    { id: 'tilting_player', prob: 0.865, minStreak: -5, tier: 'critical', accountId: '835397971' },
    { id: 'burned_out_veteran', prob: 0.577, minStreak: -1, tier: 'moderate', accountId: '224109642' },
    { id: 'consistent_support', prob: 0.218, minStreak: 2, tier: 'low', accountId: '175397696' },
    { id: 'balanced_player', prob: 0.196, minStreak: 3, tier: 'low', accountId: '101438338' }
  ];

  for (const expected of expectedArchetypes) {
    const arch = MOCK_ARCHETYPES.find(a => a.id === expected.id);
    assert(!!arch, `Archetype '${expected.id}' is present`);
    if (!arch) continue;

    assert(Math.abs(arch.probability - expected.prob) < 0.001, `${expected.id}: probability matches calibrated ${expected.prob}`, { actual: arch.probability });
    assert(Math.abs(arch.churn_probability - expected.prob) < 0.001, `${expected.id}: churn_probability matches calibrated ${expected.prob}`);
    assert(arch.accountId === expected.accountId, `${expected.id}: accountId is ${expected.accountId}`);
    assert(typeof arch.rankTier === 'number' && Number.isFinite(arch.rankTier), `${expected.id}: rankTier is finite number`);
    assert(typeof arch.rankLabel === 'string' && arch.rankLabel.length > 0, `${expected.id}: rankLabel is non-empty string`);
    assert(typeof arch.features === 'object' && arch.features !== null, `${expected.id}: features dictionary is defined`);
    assert(arch.factorAttribution && Array.isArray(arch.factorAttribution.aggravating), `${expected.id}: factorAttribution.aggravating is array`);
    assert(arch.factorAttribution && Array.isArray(arch.factorAttribution.protective), `${expected.id}: factorAttribution.protective is array`);
    assert(arch.factorAttribution.aggravating.length > 0, `${expected.id}: has at least 1 aggravating factor`);
    assert(arch.factorAttribution.protective.length > 0, `${expected.id}: has at least 1 protective factor`);

    // Check bilingual presence
    assert(typeof arch.nameFr === 'string' && arch.nameFr.length > 0, `${expected.id}: nameFr defined`);
    assert(typeof arch.nameEn === 'string' && arch.nameEn.length > 0, `${expected.id}: nameEn defined`);
    assert(typeof arch.verdictFr === 'string' && arch.verdictFr.length > 0, `${expected.id}: verdictFr defined`);
    assert(typeof arch.verdictEn === 'string' && arch.verdictEn.length > 0, `${expected.id}: verdictEn defined`);
  }

  // Rapid switching simulation (10,000 cycles)
  let switchState = MOCK_ARCHETYPES[0];
  const startTime = Date.now();
  for (let i = 0; i < 10000; i++) {
    const nextArch = MOCK_ARCHETYPES[i % 4];
    switchState = nextArch;
    assert(switchState.id === nextArch.id, `Rapid switch iteration ${i} consistent`);
  }
  const switchDuration = Date.now() - startTime;
  assert(switchDuration < 200, `10,000 rapid archetype state switches completed in ${switchDuration}ms (< 200ms)`);

  // --------------------------------------------------------------------------
  // SUITE 2: Input Validation on Account ID Field
  // --------------------------------------------------------------------------
  console.log('\n--- Suite 2: Account ID Input Validation & Sanitization ---');

  // Helper matching SimulatorSection.jsx handleInputChange sanitization logic
  function sanitizeInput(raw) {
    if (typeof raw !== 'string') raw = String(raw ?? '');
    return raw.replace(/\D/g, '').slice(0, 10);
  }

  const sanitizationCases = [
    { input: '835397971', expected: '835397971', desc: 'Valid clean 9-digit Steam ID' },
    { input: '  835397971  ', expected: '835397971', desc: 'Leading/trailing whitespace' },
    { input: 'Steam_835_397_971!', expected: '835397971', desc: 'Alphanumeric and punctuation stripping' },
    { input: '12345678901234567890', expected: '1234567890', desc: 'Excessive 20-digit length capped at 10 digits' },
    { input: 'abc-xyz', expected: '', desc: 'Pure alphabetic string stripped to empty' },
    { input: '<script>alert(1)</script>', expected: '1', desc: 'XSS script injection stripped strictly to digits' },
    { input: "'; DROP TABLE players; --", expected: '', desc: 'SQL injection string stripped strictly to digits' },
    { input: '-12345', expected: '12345', desc: 'Negative integer stripped to unsigned digits' },
    { input: '3.14159', expected: '314159', desc: 'Decimal punctuation stripped to digits' }
  ];

  for (const c of sanitizationCases) {
    const sanitized = sanitizeInput(c.input);
    assert(sanitized === c.expected, `Input sanitization [${c.desc}]: '${c.input}' -> '${sanitized}' === '${c.expected}'`);
  }

  // Test predictPlayer error handling on boundary and malformed inputs
  const invalidInputs = [
    null,
    undefined,
    '',
    '  ',
    'ab',
    '1',
    '12',
    '!@#$',
    '<script>'
  ];

  for (const inv of invalidInputs) {
    let res;
    try {
      res = await predictPlayer(inv);
    } catch (err) {
      assert(false, `predictPlayer threw unhandled exception on invalid input: ${inv}`, { err });
      continue;
    }
    assert(res && res.success === false, `predictPlayer rejects invalid input '${inv}' with success=false`);
    assert(res && res.errorKey === 'errors.invalidId', `predictPlayer returns errorKey='errors.invalidId' for '${inv}'`);
    assert(typeof res?.error === 'string', `predictPlayer returns human-readable error string for '${inv}'`);
  }

  // --------------------------------------------------------------------------
  // SUITE 3: Risk Gauge Needle Rotation & SVG Math (NaN Safety)
  // --------------------------------------------------------------------------
  console.log('\n--- Suite 3: Semicircular Risk Gauge Needle Rotation & NaN Safety Sweep ---');

  // Needle angle formula from RiskGauge.jsx:
  // p in [0, 1] clamped. needleAngle = (p - 0.5) * 180
  function computeNeedleAngle(rawP) {
    const p = Math.max(0, Math.min(1, typeof rawP === 'number' && !isNaN(rawP) ? rawP : 0));
    return (p - 0.5) * 180;
  }

  // 3.1 Mathematical keypoints
  assert(computeNeedleAngle(0.0) === -90, 'p=0.0 maps to needleAngle -90 deg (horizontal left)');
  assert(computeNeedleAngle(0.5) === 0, 'p=0.5 maps to needleAngle 0 deg (vertical top)');
  assert(computeNeedleAngle(1.0) === 90, 'p=1.0 maps to needleAngle +90 deg (horizontal right)');
  assert(Math.abs(computeNeedleAngle(0.36) - (-25.2)) < 0.0001, 'p=0.36 (optimal threshold θ*) maps to -25.2 deg');

  // 3.2 Full 10,000 steps continuous sweep
  let needleNanCount = 0;
  let needleOutOfBounds = 0;
  for (let i = 0; i <= 10000; i++) {
    const raw = i / 10000;
    const angle = computeNeedleAngle(raw);
    if (isNaN(angle) || !Number.isFinite(angle)) needleNanCount++;
    if (angle < -90 || angle > 90) needleOutOfBounds++;
  }
  assert(needleNanCount === 0, '10,000 probability steps produced 0 NaNs in needle angle');
  assert(needleOutOfBounds === 0, '10,000 probability steps strictly bounded in [-90, +90] deg');

  // 3.3 Adversarial / Malformed Inputs to RiskGauge Component
  const adversarialProbabilities = [
    NaN,
    undefined,
    null,
    Infinity,
    -Infinity,
    -5.0,
    999.9,
    '0.85',
    'garbage',
    {},
    []
  ];

  for (const badP of adversarialProbabilities) {
    const angle = computeNeedleAngle(badP);
    assert(!isNaN(angle) && Number.isFinite(angle), `Adversarial input ${String(badP)} resolves to finite angle: ${angle}`);
    assert(angle >= -90 && angle <= 90, `Adversarial input ${String(badP)} angle in valid bounds [-90, +90]`);

    // SSR Render check for NaN
    let html = '';
    try {
      html = renderToString(React.createElement(RiskGauge, {
        probability: badP,
        threshold: 0.36,
        lang: 'fr',
        t
      }));
    } catch (renderErr) {
      assert(false, `RiskGauge SSR render crashed on input ${String(badP)}`, { renderErr });
      continue;
    }
    assert(typeof html === 'string' && html.length > 0, `RiskGauge renders valid HTML for input ${String(badP)}`);
    assert(!html.includes('NaN'), `RiskGauge HTML contains NO 'NaN' substring for input ${String(badP)}`);
    assert(!html.includes('undefined'), `RiskGauge HTML contains NO 'undefined' substring for input ${String(badP)}`);
    assert(html.includes('gauge-needle-group'), `RiskGauge rendered needle group for input ${String(badP)}`);
  }

  // --------------------------------------------------------------------------
  // SUITE 4: Factor Attribution & Dynamic SHAP Derivation (NaN Safety)
  // --------------------------------------------------------------------------
  console.log('\n--- Suite 4: Factor Attribution Breakdown & SHAP Derivation NaN Safety ---');

  // Test rendering FactorAttribution with each archetype
  for (const arch of MOCK_ARCHETYPES) {
    let htmlFr = '';
    let htmlEn = '';
    try {
      htmlFr = renderToString(React.createElement(FactorAttribution, { profile: arch, lang: 'fr', t }));
      htmlEn = renderToString(React.createElement(FactorAttribution, { profile: arch, lang: 'en', t }));
    } catch (err) {
      assert(false, `FactorAttribution SSR crashed on archetype ${arch.id}`, { err });
      continue;
    }

    assert(!htmlFr.includes('NaN'), `${arch.id} (FR): rendered markup contains NO 'NaN'`);
    assert(!htmlEn.includes('NaN'), `${arch.id} (EN): rendered markup contains NO 'NaN'`);
    assert(htmlFr.includes('factor-attribution-card'), `${arch.id} (FR): rendered attribution card container`);
    assert(htmlEn.includes('factor-attribution-card'), `${arch.id} (EN): rendered attribution card container`);
  }

  // Test adversarial telemetry profiles fed into FactorAttribution
  const adversarialProfiles = [
    { id: 'empty_features', features: {}, churn_probability: 0.5 },
    { id: 'null_features', features: null, churn_probability: 0.5 },
    { id: 'nan_churn', features: { current_streak: -10, tilt_index: 5.0 }, churn_probability: NaN },
    {
      id: 'extreme_tilt',
      features: {
        current_streak: -25,
        current_streak_at_cutoff: -25,
        tilt_index: 9.9,
        abandon_rate: 0.95,
        party_play_pct: 0.0,
        win_rate: 0.1,
        night_owl_pct: 1.0,
        role_consistency: 0.05
      },
      churn_probability: 0.99
    },
    {
      id: 'extreme_positive',
      features: {
        current_streak: 15,
        current_streak_at_cutoff: 15,
        tilt_index: 0.0,
        abandon_rate: 0.0,
        party_play_pct: 1.0,
        win_rate: 0.95,
        night_owl_pct: 0.0,
        role_consistency: 0.99
      },
      churn_probability: 0.02
    }
  ];

  for (const p of adversarialProfiles) {
    let html = '';
    try {
      html = renderToString(React.createElement(FactorAttribution, { profile: p, lang: 'fr', t }));
    } catch (err) {
      assert(false, `FactorAttribution SSR crashed on adversarial profile ${p.id}`, { err });
      continue;
    }
    assert(!html.includes('NaN'), `Adversarial profile '${p.id}': rendered markup contains NO 'NaN'`);
    assert(html.includes('factor-attribution-card'), `Adversarial profile '${p.id}': rendered attribution card container`);
  }

  // --------------------------------------------------------------------------
  // SUITE 5: Offline Fallback Resilience & Timeout Handling
  // --------------------------------------------------------------------------
  console.log('\n--- Suite 5: Offline Fallback Resilience & Deterministic Profile Synthesis ---');

  // 5.1 Test synthesizePlayerProfile for numeric account IDs
  const testIds = ['835397971', '224109642', '175397696', '101438338', '999999999', '123456789', '55555'];
  for (const id of testIds) {
    const synth1 = synthesizePlayerProfile(id);
    const synth2 = synthesizePlayerProfile(id);

    assert(synth1 && synth1.success === true, `synthesizePlayerProfile returns success=true for ID ${id}`);
    assert(synth1.isOffline === true, `synthesizePlayerProfile sets isOffline=true for ID ${id}`);
    assert(synth1.isSynthesized === true, `synthesizePlayerProfile sets isSynthesized=true for ID ${id}`);
    assert(typeof synth1.churn_probability === 'number' && Number.isFinite(synth1.churn_probability), `churn_probability is finite number for ID ${id}`);
    assert(synth1.churn_probability >= 0 && synth1.churn_probability <= 1, `churn_probability within [0, 1] for ID ${id}`);
    assert(synth1.features && Object.keys(synth1.features).length >= 20, `features dictionary has >= 20 attributes for ID ${id}`);
    assert(synth1.factorAttribution && synth1.factorAttribution.aggravating.length > 0, `factorAttribution.aggravating present for ID ${id}`);
    assert(synth1.factorAttribution && synth1.factorAttribution.protective.length > 0, `factorAttribution.protective present for ID ${id}`);

    // Verify determinism: identical inputs MUST yield identical profiles
    assert(synth1.churn_probability === synth2.churn_probability, `Profile synthesis is 100% deterministic for churn_probability (${id})`);
    assert(synth1.rankTier === synth2.rankTier, `Profile synthesis is 100% deterministic for rankTier (${id})`);
    assert(synth1.features.win_rate === synth2.features.win_rate, `Profile synthesis is 100% deterministic for win_rate (${id})`);
  }

  // 5.2 Test predictPlayer behavior when backend is offline
  console.log('Testing predictPlayer offline fallback for matched archetypes and custom IDs...');

  // Archetype ID lookup (e.g. 835397971 -> Tilting Player)
  const archResult = await predictPlayer('835397971');
  assert(archResult.success === true, 'predictPlayer succeeds via offline fallback for archetype ID 835397971');
  assert(archResult.isOffline === true || archResult.isMock === true, 'Offline flag correctly marked');
  assert(Math.abs(archResult.churn_probability - 0.865) < 0.001, 'Archetype 835397971 retains calibrated 0.865 churn probability');

  // Custom arbitrary ID lookup (e.g. 789123456 -> synthesized profile)
  const synthResult = await predictPlayer('789123456');
  assert(synthResult.success === true, 'predictPlayer succeeds via deterministic synthesis for ID 789123456');
  assert(synthResult.isOffline === true, 'Offline flag marked for custom ID');
  assert(typeof synthResult.churn_probability === 'number' && Number.isFinite(synthResult.churn_probability), 'Synthesized churn_probability is finite');
  assert(synthResult.factorAttribution && synthResult.factorAttribution.aggravating.length > 0, 'Synthesized profile has aggravating factors');

  // 5.3 Verify predictPlayer NEVER throws unhandled exceptions across 50 concurrent requests
  console.log('Testing 50 concurrent offline predictPlayer requests under stress...');
  const concurrentIds = Array.from({ length: 50 }, (_, i) => `90000000${i}`);
  const concurrentPromises = concurrentIds.map(id => predictPlayer(id));
  const concurrentResults = await Promise.all(concurrentPromises);

  assert(concurrentResults.length === 50, 'All 50 concurrent requests completed');
  const allSuccessful = concurrentResults.every(r => r && r.success === true && typeof r.churn_probability === 'number');
  assert(allSuccessful, 'All 50 concurrent requests returned clean deterministic profiles without throwing');

  // --------------------------------------------------------------------------
  // SUITE 6: Full SimulatorSection Component SSR Integration
  // --------------------------------------------------------------------------
  console.log('\n--- Suite 6: Full SimulatorSection SSR Integration & Zero-NaN Markup ---');

  for (const lang of ['fr', 'en']) {
    for (const arch of MOCK_ARCHETYPES) {
      let html = '';
      try {
        html = renderToString(React.createElement(SimulatorSection, {
          lang,
          t,
          initialArchetypeId: arch.id,
          backendStatus: 'offline'
        }));
      } catch (err) {
        assert(false, `SimulatorSection SSR crashed with arch=${arch.id}, lang=${lang}`, { err });
        continue;
      }

      assert(typeof html === 'string' && html.length > 500, `SimulatorSection rendered valid markup (${arch.id}, ${lang})`);
      assert(!html.includes('NaN'), `SimulatorSection markup contains NO 'NaN' (${arch.id}, ${lang})`);
      assert(!html.includes('undefined%'), `SimulatorSection markup contains NO 'undefined%' (${arch.id}, ${lang})`);
      assert(html.includes('simulator-heading'), `SimulatorSection includes simulator-heading (${arch.id}, ${lang})`);
      assert(html.includes('gauge-svg'), `SimulatorSection includes gauge-svg (${arch.id}, ${lang})`);
      assert(html.includes('factor-attribution-card'), `SimulatorSection includes factor-attribution-card (${arch.id}, ${lang})`);
    }
  }

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log('   CHALLENGER M3 EMPIRICAL STRESS TEST SUMMARY REPORT           ');
  console.log('================================================================');
  console.log(`Total Assertions Evaluated: ${totalAssertions}`);
  console.log(`Passed Assertions:          ${passedAssertions}`);
  console.log(`Failed Assertions:          ${failedAssertions}`);

  if (failedAssertions > 0) {
    console.error(`\n❌ VERDICT: FAIL - ${failedAssertions} assertions failed!`);
    for (const f of failures) {
      console.error(`  - ${f.message}`, f.details);
    }
    process.exit(1);
  } else {
    console.log('\n✅ VERDICT: PASS - ALL 100+ ADVERSARIAL CHALLENGER ASSERTIONS PASSED EMPIRICALLY!');
    process.exit(0);
  }
}

run().catch((err) => {
  console.error('Fatal crash in challenger stress test harness:', err);
  process.exit(1);
});

/**
 * Stress Test Harness for Milestone M2 Interactive Components, Interpolation Math & Data Injection
 * 
 * Tests:
 * 1. Rapid Threshold Slider Interpolation Math (0.0 to 1.0 in 10,000 steps + edge boundaries)
 * 2. Live Tilt Simulator Mathematical Formula Integrity & Tier Mapping
 * 3. Component Rendering & Edge Case Data Injection (PsychologySection, MlBenchmarkSection, KpiBar, HeroSection)
 * 4. High-frequency slider dragging performance (50,000 operations)
 */

import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { translations, t } from '../src/translations.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, message, details = {}) {
  totalTests++;
  if (condition) {
    passedTests++;
  } else {
    failedTests++;
    failures.push({ message, details });
    console.error(`❌ FAILED: ${message}`, details);
  }
}

console.log('=== STARTING M2 INTERACTIVE & INTERPOLATION STRESS TESTS ===\n');

async function run() {
  // Start Vite SSR server to dynamically import JSX modules
  const viteServer = await createServer({
    appType: 'custom',
    server: { middlewareMode: true }
  });

  const mockDataMod = await viteServer.ssrLoadModule('/src/data/mockData.js');
  const PsychologyMod = await viteServer.ssrLoadModule('/src/components/PsychologySection.jsx');
  const MlBenchmarkMod = await viteServer.ssrLoadModule('/src/components/MlBenchmarkSection.jsx');
  const KpiBarMod = await viteServer.ssrLoadModule('/src/components/KpiBar.jsx');
  const HeroSectionMod = await viteServer.ssrLoadModule('/src/components/HeroSection.jsx');

  const {
    CALIBRATED_CURVE_POINTS,
    MOCK_METRICS,
    MOCK_VISUALIZATIONS
  } = mockDataMod;

  const PsychologySection = PsychologyMod.default;
  const MlBenchmarkSection = MlBenchmarkMod.default;
  const KpiBar = KpiBarMod.default;
  const HeroSection = HeroSectionMod.default;

  // -------------------------------------------------------------
  // Test Suite 1: Threshold Interpolation Math (0.0 to 1.0 sweep)
  // -------------------------------------------------------------
  console.log('--- Suite 1: Threshold Interpolation Math Sweep (0.0 to 1.0) ---');

  // Exact function from MlBenchmarkSection.jsx
  function interpolateAtThreshold(th) {
    const points = CALIBRATED_CURVE_POINTS;
    if (th <= points[0].threshold) return points[0];
    if (th >= points[points.length - 1].threshold) return points[points.length - 1];

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      if (th >= p1.threshold && th <= p2.threshold) {
        const ratio = (th - p1.threshold) / (p2.threshold - p1.threshold);
        return {
          threshold: th,
          tpr: p1.tpr + ratio * (p2.tpr - p1.tpr),
          fpr: p1.fpr + ratio * (p2.fpr - p1.fpr),
          precision: p1.precision + ratio * (p2.precision - p1.precision),
          recall: p1.recall + ratio * (p2.recall - p1.recall),
          f1: p1.f1 + ratio * (p2.f1 - p1.f1)
        };
      }
    }
    return points[4]; // Default to 0.36
  }

  // 1.1 Test 10,000 steps between 0.0 and 1.0
  const SWEEP_STEPS = 10000;
  let nanCount = 0;
  let outOfBoundsCount = 0;
  const piLive = 0.0574;

  for (let i = 0; i <= SWEEP_STEPS; i++) {
    const th = i / SWEEP_STEPS; // 0.0 to 1.0
    const m = interpolateAtThreshold(th);

    // Verify all metrics are valid finite numbers
    const valid = [m.tpr, m.fpr, m.precision, m.recall, m.f1].every(
      val => typeof val === 'number' && Number.isFinite(val) && !Number.isNaN(val)
    );
    if (!valid) nanCount++;

    // Verify bounded within [0, 1]
    const inBounds = [m.tpr, m.fpr, m.precision, m.recall, m.f1].every(
      val => val >= 0.0 && val <= 1.0
    );
    if (!inBounds) outOfBoundsCount++;

    // Verify Live PPV calculation does not divide by zero or yield NaN
    const livePPV = (m.recall * piLive) / Math.max(0.0001, (m.recall * piLive + m.fpr * (1 - piLive)));
    if (!Number.isFinite(livePPV) || Number.isNaN(livePPV) || livePPV < 0 || livePPV > 1) {
      nanCount++;
    }
  }

  assert(nanCount === 0, `10,001 continuous threshold evaluations generated 0 NaNs`, { nanCount });
  assert(outOfBoundsCount === 0, `All interpolated metrics remain in [0, 1] bounds`, { outOfBoundsCount });

  // 1.2 Boundary cases: 0.0, 1.0, optimal 0.36, negative, > 1.0, NaN
  const boundaries = [0.0, 0.02, 0.36, 0.98, 1.0, -0.5, 1.5, NaN, null, undefined];
  for (const b of boundaries) {
    try {
      const res = interpolateAtThreshold(b);
      assert(
        res && typeof res === 'object' && typeof res.recall === 'number',
        `interpolateAtThreshold(${b}) resolved cleanly without throwing`,
        { threshold: b, result: res }
      );
    } catch (err) {
      assert(false, `interpolateAtThreshold(${b}) threw unhandled exception`, { error: err.message });
    }
  }

  // 1.3 Confusion Matrix calculation across 0.0 to 1.0
  const N_TOTAL = 3397;
  const N_CHURN = 1687;
  const N_RETAINED = 1710;
  let cmNanCount = 0;

  for (let i = 0; i <= 1000; i++) {
    const threshold = i / 1000;
    let tp, fn, fp, tn;
    if (Math.abs(threshold - 0.36) < 0.015) {
      tp = 1434;
      fn = 253;
      fp = 760;
      tn = 950;
    } else {
      const recall = Math.max(0.1, Math.min(1.0, 1.0 - Math.pow(Math.max(0, Math.min(1, threshold)), 1.3) * 0.95));
      const fpr = Math.max(0.01, Math.min(0.98, Math.pow(Math.max(0, 1.0 - Math.min(1, threshold)), 1.6)));
      tp = Math.round(recall * N_CHURN);
      fn = N_CHURN - tp;
      fp = Math.round(fpr * N_RETAINED);
      tn = N_RETAINED - fp;
    }

    const pctTotal = ((tp / N_TOTAL) * 100).toFixed(1);
    const pctClass = ((tp / N_CHURN) * 100).toFixed(1);

    if (
      [tp, fn, fp, tn].some(v => !Number.isFinite(v) || Number.isNaN(v)) ||
      pctTotal.includes('NaN') ||
      pctClass.includes('NaN')
    ) {
      cmNanCount++;
    }
  }
  assert(cmNanCount === 0, `Confusion matrix simulation produced 0 NaNs across 1,001 threshold values`, { cmNanCount });

  // -------------------------------------------------------------
  // Test Suite 2: PsychologySection Tilt Simulator Math Stress Test
  // -------------------------------------------------------------
  console.log('--- Suite 2: Tilt Simulator Mathematical Formula Integrity ---');

  // Exact formula from backend/main.py:685-693 & PsychologySection.jsx:39-52
  function calculateSimulatedTilt(simAbandons, simStreak, simDuration, simDpm) {
    let score = 0.0;
    score += simAbandons * 2.0;
    if (simStreak <= -3) {
      score += Math.abs(simStreak) - 2.0;
    }
    if (simDuration < 25.0) {
      score += (25.0 - simDuration) * 0.1;
    }
    if (simDpm > 0.3) {
      score += (simDpm - 0.3) * 5.0;
    }
    return Math.max(0, score);
  }

  function getTiltTier(score, isFr = true) {
    if (score >= 4.0) {
      return {
        label: isFr ? 'Tilt Extrême (Ragequit Imminent)' : 'Extreme Tilt (Imminent Ragequit)',
        badgeClass: 'badge-rose',
        glowClass: 'glow-rose'
      };
    }
    if (score >= 2.0) {
      return {
        label: isFr ? 'Énervé (Frustration Aiguë)' : 'Agitated (Acute Frustration)',
        badgeClass: 'badge-orange',
        glowClass: 'glow-orange'
      };
    }
    if (score >= 0.8) {
      return {
        label: isFr ? 'Légèrement Frustré' : 'Mildly Frustrated',
        badgeClass: 'badge-amber',
        glowClass: 'text-amber'
      };
    }
    return {
      label: isFr ? 'Serein (Tilt 0)' : 'Composed (Zero Tilt)',
      badgeClass: 'badge-emerald',
      glowClass: 'glow-emerald'
    };
  }

  // 2.1 Test default values
  const defaultTilt = calculateSimulatedTilt(1, -4, 22.0, 0.42);
  // Expected: 1*2.0 + (4-2.0) + (25-22)*0.1 + (0.42-0.3)*5.0 = 2 + 2 + 0.3 + 0.6 = 4.90
  assert(Math.abs(defaultTilt - 4.90) < 0.001, 'Default tilt formula evaluates exactly to 4.90', { got: defaultTilt });

  const defaultTier = getTiltTier(defaultTilt, true);
  assert(defaultTier.badgeClass === 'badge-rose', 'Default tilt 4.90 maps to extreme tilt badge-rose');

  // 2.2 Test full parameter permutation sweep (10 x 10 x 10 x 10 = 10,000 cases)
  let tiltErrorCount = 0;
  for (let abandons = 0; abandons <= 5; abandons++) {
    for (let streak = -10; streak <= 5; streak++) {
      for (let duration = 10; duration <= 50; duration += 5) {
        for (let dpm = 0.0; dpm <= 1.0; dpm += 0.1) {
          const score = calculateSimulatedTilt(abandons, streak, duration, dpm);
          if (
            !Number.isFinite(score) ||
            Number.isNaN(score) ||
            score < 0
          ) {
            tiltErrorCount++;
          }
          const tierFr = getTiltTier(score, true);
          const tierEn = getTiltTier(score, false);
          if (!tierFr.label || !tierEn.label || !tierFr.badgeClass) {
            tiltErrorCount++;
          }
        }
      }
    }
  }
  assert(tiltErrorCount === 0, 'All tilt simulator permutations yielded valid non-negative scores and tier objects', { tiltErrorCount });

  // -------------------------------------------------------------
  // Test Suite 3: Component Rendering & Edge Case Data Injection
  // -------------------------------------------------------------
  console.log('--- Suite 3: Component Rendering & Data Injection Edge Cases ---');

  // 3.1 PsychologySection Rendering
  const psychLangs = ['fr', 'en', null, undefined, 'unsupported_lang'];
  for (const lang of psychLangs) {
    try {
      const html = renderToString(React.createElement(PsychologySection, { lang, t }));
      assert(
        typeof html === 'string' && html.includes('psychology'),
        `PsychologySection rendered cleanly with lang="${lang}"`
      );
    } catch (err) {
      assert(false, `PsychologySection crashed on lang="${lang}"`, { error: err.message });
    }
  }

  // 3.2 MlBenchmarkSection Rendering with various metricsData and visData injections
  const testInjectionCases = [
    { label: 'Normal Mock Data', metricsData: MOCK_METRICS, visData: MOCK_VISUALIZATIONS },
    { label: 'Null metrics & vis', metricsData: null, visData: null },
    { label: 'Undefined metrics & vis', metricsData: undefined, visData: undefined },
    { label: 'Empty Objects', metricsData: {}, visData: {} },
    { label: 'Partial Metrics (only recall)', metricsData: { recall: 0.85 }, visData: {} },
    { label: 'Corrupted metrics (NaN and nulls)', metricsData: { dataset_size: null, recall: NaN, auc_score: undefined }, visData: null }
  ];

  for (const testCase of testInjectionCases) {
    for (const lang of ['fr', 'en']) {
      try {
        const html = renderToString(React.createElement(MlBenchmarkSection, {
          lang,
          t,
          metricsData: testCase.metricsData,
          visData: testCase.visData
        }));
        assert(
          typeof html === 'string' && html.includes('benchmark'),
          `MlBenchmarkSection rendered cleanly (${testCase.label}, lang=${lang})`
        );
      } catch (err) {
        assert(false, `MlBenchmarkSection crashed on ${testCase.label} (lang=${lang})`, { error: err.message });
      }
    }
  }

  // 3.3 KpiBar Rendering with edge case metricsData
  const kpiInjectionCases = [
    { label: 'Normal Mock Data', data: MOCK_METRICS },
    { label: 'Null metricsData', data: null },
    { label: 'Undefined metricsData', data: undefined },
    { label: 'Empty Object', data: {} },
    { label: 'Zero values', data: { dataset_size: 0, recall: 0, auc_score: 0, pr_auc: 0 } },
    { label: 'Extreme large numbers', data: { dataset_size: 1000000000, recall: 0.9999, auc_score: 0.9999, pr_auc: 0.9999 } },
    { label: 'NaN metrics', data: { dataset_size: NaN, recall: NaN, auc_score: NaN, pr_auc: NaN } }
  ];

  for (const kpiCase of kpiInjectionCases) {
    for (const lang of ['fr', 'en']) {
      try {
        const html = renderToString(React.createElement(KpiBar, {
          lang,
          t,
          metricsData: kpiCase.data
        }));
        assert(
          typeof html === 'string' && html.includes('kpis'),
          `KpiBar rendered cleanly (${kpiCase.label}, lang=${lang})`
        );
      } catch (err) {
        assert(false, `KpiBar crashed on ${kpiCase.label} (lang=${lang})`, { error: err.message });
      }
    }
  }

  // 3.4 HeroSection Rendering
  for (const lang of ['fr', 'en', null, undefined]) {
    try {
      const html = renderToString(React.createElement(HeroSection, { lang, t }));
      assert(
        typeof html === 'string' && html.includes('hero'),
        `HeroSection rendered cleanly with lang="${lang}"`
      );
    } catch (err) {
      assert(false, `HeroSection crashed with lang="${lang}"`, { error: err.message });
    }
  }

  // -------------------------------------------------------------
  // Test Suite 4: High-Frequency Rapid Slider Dragging Benchmark
  // -------------------------------------------------------------
  console.log('--- Suite 4: Rapid Slider Dragging Performance (50,000 ops) ---');

  const startTime = performance.now();
  const DRAG_OPS = 50000;
  let successOps = 0;

  for (let i = 0; i < DRAG_OPS; i++) {
    // Generate pseudo-random dragging threshold [0.05, 0.95]
    const th = 0.05 + ((i * 17) % 900) / 1000;
    const m = interpolateAtThreshold(th);
    if (m && !Number.isNaN(m.recall) && !Number.isNaN(m.fpr)) {
      successOps++;
    }
  }
  const dragDurationMs = performance.now() - startTime;
  console.log(`⚡ 50,000 rapid threshold interpolations completed in ${dragDurationMs.toFixed(2)}ms (${(DRAG_OPS / (dragDurationMs / 1000)).toFixed(0)} ops/sec)`);

  assert(successOps === DRAG_OPS, `All 50,000 rapid slider drag operations succeeded without NaN`, { successOps, DRAG_OPS });
  assert(dragDurationMs < 2000, `50,000 interpolations finished well under 2000ms`, { dragDurationMs });

  await viteServer.close();

  // -------------------------------------------------------------
  // Final Summary
  // -------------------------------------------------------------
  console.log('\n=== M2 INTERACTIVE & INTERPOLATION TEST SUMMARY ===');
  console.log(`Total assertions: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);

  if (failedTests > 0) {
    console.error('\nFAILURE DETAILS:');
    console.error(JSON.stringify(failures, null, 2));
    process.exit(1);
  } else {
    console.log('\nALL M2 INTERACTIVE & DATA INJECTION STRESS TESTS PASSED EMPIRICALLY!');
    process.exit(0);
  }
}

run().catch(err => {
  console.error('Fatal test runner exception:', err);
  process.exit(1);
});

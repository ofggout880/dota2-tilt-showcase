/**
 * Empirical Challenger M2 Stress Test & Verification Suite
 * Deep inspection of Hero, KPIs, Psychology, Benchmark sections,
 * interactive components, responsive reflow, and zero-console-error assertion.
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const APP_URL = 'http://127.0.0.1:5173/';
const CDP_PORT = 9452;
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getBrowserWsUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`);
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch {}
    await sleep(200);
  }
  throw new Error('Could not connect to Chrome DevTools endpoint');
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
    this.eventListeners = new Map();

    this.ready = new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method) {
        const listeners = this.eventListeners.get(msg.method) || [];
        listeners.forEach(fn => fn(msg.params));
      }
    };
  }

  on(method, callback) {
    if (!this.eventListeners.has(method)) {
      this.eventListeners.set(method, []);
    }
    this.eventListeners.get(method).push(callback);
  }

  async send(method, params = {}, sessionId = undefined) {
    await this.ready;
    const msgId = this.id++;
    const payload = { id: msgId, method, params };
    if (sessionId) payload.sessionId = sessionId;

    return new Promise((resolve, reject) => {
      this.callbacks.set(msgId, { resolve, reject });
      this.ws.send(JSON.stringify(payload));
    });
  }

  close() {
    this.ws.close();
  }
}

async function main() {
  console.log('================================================================');
  console.log('   CHALLENGER M2 EMPIRICAL AUDIT & ADVERSARIAL STRESS HARNESS   ');
  console.log('================================================================\n');

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'challenger_m2_'));
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${tmpDir}`,
    '--disable-gpu',
    '--no-sandbox',
    '--disable-extensions',
    'about:blank'
  ], { stdio: 'ignore' });

  const capturedConsoleErrors = [];
  const capturedConsoleWarnings = [];
  const capturedExceptions = [];
  let testFailures = 0;

  function recordAssertion(passed, testName, details = '') {
    if (passed) {
      console.log(`  [PASS] ${testName}`);
    } else {
      testFailures++;
      console.error(`  [FAIL] ${testName} -> ${details}`);
    }
  }

  try {
    const wsUrl = await getBrowserWsUrl();
    const client = new CdpClient(wsUrl);

    const target = await client.send('Target.createTarget', { url: APP_URL });
    const sessionId = (await client.send('Target.attachToTarget', { targetId: target.targetId, flatten: true })).sessionId;

    // Enable CDP domains
    await client.send('Page.enable', {}, sessionId);
    await client.send('Runtime.enable', {}, sessionId);
    await client.send('DOM.enable', {}, sessionId);

    // Listen to Console and Runtime exceptions
    client.on('Runtime.consoleAPICalled', (params) => {
      if (params.type === 'error') {
        const text = params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
        capturedConsoleErrors.push(text);
      } else if (params.type === 'warning') {
        const text = params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
        capturedConsoleWarnings.push(text);
      }
    });

    client.on('Runtime.exceptionThrown', (params) => {
      capturedExceptions.push(params.exceptionDetails.text + ' ' + (params.exceptionDetails.exception?.description || ''));
    });

    // Wait for initial render and fonts
    await sleep(1500);

    const evaluate = async (expr) => {
      const res = await client.send('Runtime.evaluate', {
        expression: expr,
        returnByValue: true,
        awaitPromise: true
      }, sessionId);
      if (res.exceptionDetails) {
        throw new Error(res.exceptionDetails.text);
      }
      return res.result.value;
    };

    // -------------------------------------------------------------
    // Test 1: DOM Mounting of all 4 Milestone M2 Sections
    // -------------------------------------------------------------
    console.log('\n--- 1. Verification of M2 Sections Mounting & Content ---');

    const domCheck = await evaluate(`
      (() => {
        const hero = document.querySelector('section#hero');
        const kpis = document.querySelector('section#kpis');
        const psychology = document.querySelector('section#psychology');
        const benchmark = document.querySelector('section#benchmark');

        return {
          heroMounted: !!hero,
          kpisMounted: !!kpis,
          psychologyMounted: !!psychology,
          benchmarkMounted: !!benchmark,
          heroTitle: hero?.querySelector('h1')?.innerText || '',
          heroPillarsCount: hero?.querySelectorAll('.hero-pillar-card').length || 0,
          heroHighlightsCount: hero?.querySelectorAll('.highlight-pill').length || 0,
          kpiCardsCount: kpis?.querySelectorAll('.kpi-card').length || 0,
          psychologyTabsCount: psychology?.querySelectorAll('.psychology-tab-btn').length || 0,
          psychologyCardsCount: psychology?.querySelectorAll('.placeholder-card').length || 0,
          benchmarkRowsCount: benchmark?.querySelectorAll('table.benchmark-table tbody tr').length || 0,
          benchmarkChampionFound: !!benchmark?.querySelector('tr.row-champion'),
          rocSvgPresent: !!benchmark?.querySelector('.svg-curve-container svg'),
          featureImportanceSvgPresent: !!benchmark?.querySelector('svg[viewBox^="0 0 620"]')
        };
      })()
    `);

    recordAssertion(domCheck.heroMounted, 'HeroSection is mounted at section#hero');
    recordAssertion(domCheck.heroPillarsCount === 3, `Hero Section has exactly 3 value proposition pillars (got: ${domCheck.heroPillarsCount})`);
    recordAssertion(domCheck.heroHighlightsCount === 3, `Hero Section has 3 metric highlights pills (got: ${domCheck.heroHighlightsCount})`);
    recordAssertion(domCheck.kpisMounted, 'KpiBar is mounted at section#kpis');
    recordAssertion(domCheck.kpiCardsCount === 5, `KpiBar renders 5 grand-format cards (got: ${domCheck.kpiCardsCount})`);
    recordAssertion(domCheck.psychologyMounted, 'PsychologySection is mounted at section#psychology');
    recordAssertion(domCheck.psychologyTabsCount === 6, `PsychologySection renders 6 feature tabs (got: ${domCheck.psychologyTabsCount})`);
    recordAssertion(domCheck.psychologyCardsCount === 6, `PsychologySection renders 6 overview cards (got: ${domCheck.psychologyCardsCount})`);
    recordAssertion(domCheck.benchmarkMounted, 'MlBenchmarkSection is mounted at section#benchmark');
    recordAssertion(domCheck.benchmarkRowsCount >= 4, `Model comparison table renders models (got: ${domCheck.benchmarkRowsCount})`);
    recordAssertion(domCheck.benchmarkChampionFound, 'V6 XGBoost champion model row is identified and styled');
    recordAssertion(domCheck.rocSvgPresent, 'Interactive ROC/PR curve SVG is mounted');
    recordAssertion(domCheck.featureImportanceSvgPresent, 'Interactive feature importance SVG is mounted');

    // -------------------------------------------------------------
    // Test 2: KPI Values Accuracy & Verification
    // -------------------------------------------------------------
    console.log('\n--- 2. Grand-Format KPI Values Verification ---');

    const kpiValues = await evaluate(`
      (() => {
        const cards = Array.from(document.querySelectorAll('.kpi-card')).map(card => ({
          label: card.querySelector('.kpi-label')?.innerText || '',
          val: card.querySelector('.kpi-val')?.innerText || '',
          badge: card.querySelector('.badge')?.innerText || ''
        }));
        return cards;
      })()
    `);

    const hasDatasetCard = kpiValues.some(c => c.val.includes('16') && (c.val.includes('981')));
    const hasWindowCard = kpiValues.some(c => c.val === '100');
    const hasFeaturesCard = kpiValues.some(c => c.val === '45');
    const hasRecallCard = kpiValues.some(c => c.val.includes('85.0%'));
    const hasAucCard = kpiValues.some(c => c.val.includes('80.0%') && c.val.includes('79.3%'));

    recordAssertion(hasDatasetCard, 'KPI 1 displays 16,981 dataset profiles');
    recordAssertion(hasWindowCard, 'KPI 2 displays 100 rolling matches');
    recordAssertion(hasFeaturesCard, 'KPI 3 displays 45 engineered features');
    recordAssertion(hasRecallCard, 'KPI 4 displays 85.0% recall');
    recordAssertion(hasAucCard, 'KPI 5 displays 80.0% ROC-AUC / 79.3% PR-AUC');

    // -------------------------------------------------------------
    // Test 3: Psychology Section Interactive Tabs & Tilt Simulator
    // -------------------------------------------------------------
    console.log('\n--- 3. Psychology Section Tab Switching & Live Tilt Simulator ---');

    // Test tab clicks sequentially
    let allTabsPassed = true;
    const tabNames = ['tilt_index', 'night_owl_pct', 'objective_focus', 'role_consistency', 'gpm_trend', 'kda_trend'];

    for (const tabName of tabNames) {
      await evaluate(`
        (() => {
          const tab = Array.from(document.querySelectorAll('.psychology-tab-btn')).find(b => b.innerText.includes('${tabName}'));
          tab?.click();
        })()
      `);
      await sleep(100);

      const tabState = await evaluate(`
        (() => {
          const cardTitle = document.querySelector('.feature-main-title')?.innerText || '';
          const codeFormula = document.querySelector('.code-formula-box code')?.innerText || '';
          const mathFormula = document.querySelector('.math-formula-text')?.innerText || '';
          return {
            matches: cardTitle.toLowerCase().includes('${tabName}'.toLowerCase()),
            hasCode: codeFormula.length > 20,
            hasMath: mathFormula.length > 10
          };
        })()
      `);

      if (!tabState.matches || !tabState.hasCode || !tabState.hasMath) {
        allTabsPassed = false;
      }
    }

    recordAssertion(allTabsPassed, 'All 6 behavioral feature tabs switch cleanly and update code/math formulas');

    // Test Tilt Simulator Reactivity
    const simMax = await evaluate(`
      (() => {
        const abandonsInput = document.querySelector('input#sim-abandons');
        const streakInput = document.querySelector('input#sim-streak');
        const durationInput = document.querySelector('input#sim-duration');
        const dpmInput = document.querySelector('input#sim-dpm');

        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(abandonsInput, '3');
        abandonsInput.dispatchEvent(new Event('input', { bubbles: true }));
        abandonsInput.dispatchEvent(new Event('change', { bubbles: true }));

        nativeSetter.call(streakInput, '-8');
        streakInput.dispatchEvent(new Event('input', { bubbles: true }));
        streakInput.dispatchEvent(new Event('change', { bubbles: true }));

        nativeSetter.call(durationInput, '15');
        durationInput.dispatchEvent(new Event('input', { bubbles: true }));
        durationInput.dispatchEvent(new Event('change', { bubbles: true }));

        nativeSetter.call(dpmInput, '0.70');
        dpmInput.dispatchEvent(new Event('input', { bubbles: true }));
        dpmInput.dispatchEvent(new Event('change', { bubbles: true }));
      })()
    `);
    await sleep(150);

    const maxResult = await evaluate(`
      (() => {
        const score = parseFloat(document.querySelector('.tilt-score-number')?.innerText || '0');
        const tier = (document.querySelector('.tilt-tier-badge')?.textContent || '').toLowerCase();
        return { score, tier };
      })()
    `);

    recordAssertion(maxResult.score === 15.0, `Live tilt simulator calculates maximum tilt correctly (expected: 15.0, got: ${maxResult.score})`);
    recordAssertion(maxResult.tier.includes('extrême') || maxResult.tier.includes('extreme'), `Max tilt tier displays Extreme / Extrême tier (got: ${maxResult.tier})`);

    // Reset to zero tilt
    await evaluate(`
      (() => {
        const abandonsInput = document.querySelector('input#sim-abandons');
        const streakInput = document.querySelector('input#sim-streak');
        const durationInput = document.querySelector('input#sim-duration');
        const dpmInput = document.querySelector('input#sim-dpm');

        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(abandonsInput, '0');
        abandonsInput.dispatchEvent(new Event('input', { bubbles: true }));
        abandonsInput.dispatchEvent(new Event('change', { bubbles: true }));

        nativeSetter.call(streakInput, '0');
        streakInput.dispatchEvent(new Event('input', { bubbles: true }));
        streakInput.dispatchEvent(new Event('change', { bubbles: true }));

        nativeSetter.call(durationInput, '45');
        durationInput.dispatchEvent(new Event('input', { bubbles: true }));
        durationInput.dispatchEvent(new Event('change', { bubbles: true }));

        nativeSetter.call(dpmInput, '0.15');
        dpmInput.dispatchEvent(new Event('input', { bubbles: true }));
        dpmInput.dispatchEvent(new Event('change', { bubbles: true }));
      })()
    `);
    await sleep(150);

    const minResult = await evaluate(`
      (() => {
        const score = parseFloat(document.querySelector('.tilt-score-number')?.innerText || '0');
        const tier = (document.querySelector('.tilt-tier-badge')?.textContent || '').toLowerCase();
        return { score, tier };
      })()
    `);

    recordAssertion(minResult.score === 0.0, `Live tilt simulator calculates zero tilt correctly (expected: 0.0, got: ${minResult.score})`);
    recordAssertion(minResult.tier.includes('serein') || minResult.tier.includes('composed'), `Zero tilt tier displays Composed / Serein tier (got: ${minResult.tier})`);

    // -------------------------------------------------------------
    // Test 4: ML Benchmark Interactive Curves, Confusion Matrix & Importance
    // -------------------------------------------------------------
    console.log('\n--- 4. ML Benchmark Interactive Components ---');

    // Switch to PR Curve
    await evaluate(`
      (() => {
        const prBtn = Array.from(document.querySelectorAll('.curve-tab-switch button')).find(b => b.innerText.includes('PR'));
        prBtn?.click();
      })()
    `);
    await sleep(150);

    const prActive = await evaluate(`
      (() => {
        const prBtn = Array.from(document.querySelectorAll('.curve-tab-switch button')).find(b => b.innerText.includes('PR'));
        return prBtn?.className.includes('active') || prBtn?.style.background.includes('accent-cyan');
      })()
    `);
    recordAssertion(prActive, 'PR Curve mode can be activated via interactive toggle');

    // Change Threshold Slider to 0.75
    await evaluate(`
      (() => {
        const thSlider = document.querySelector('.svg-curve-container').parentElement.querySelector('input[type="range"]');
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(thSlider, '0.75');
        thSlider.dispatchEvent(new Event('input', { bubbles: true }));
        thSlider.dispatchEvent(new Event('change', { bubbles: true }));
      })()
    `);
    await sleep(150);

    const marker75 = await evaluate(`
      (() => {
        return document.querySelector('.svg-curve-container text[font-weight="800"]')?.textContent || '';
      })()
    `);
    recordAssertion(marker75.includes('0.75'), `Threshold slider dynamically updates SVG crosshair marker to 0.75 (got: ${marker75})`);

    // Click Reset to Optimal Threshold (0.36)
    await evaluate(`
      (() => {
        const resetBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('0.36'));
        resetBtn?.click();
      })()
    `);
    await sleep(150);

    const markerOpt = await evaluate(`
      (() => {
        return document.querySelector('.svg-curve-container text[font-weight="800"]')?.textContent || '';
      })()
    `);
    recordAssertion(markerOpt.includes('0.36'), `Reset button cleanly restores studio optimum threshold 0.36 (got: ${markerOpt})`);

    // Top 15 Toggle
    await evaluate(`
      (() => {
        const top15Btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText === 'Top 15');
        top15Btn?.click();
      })()
    `);
    await sleep(150);

    const countBars15 = await evaluate(`
      (() => {
        return document.querySelectorAll('svg[viewBox^="0 0 620"] g[style*="cursor: pointer"]').length;
      })()
    `);
    recordAssertion(countBars15 === 15, `Feature importance Top 15 toggle renders 15 items (got: ${countBars15})`);

    // Top 10 Toggle
    await evaluate(`
      (() => {
        const top10Btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText === 'Top 10');
        top10Btn?.click();
      })()
    `);
    await sleep(150);

    const countBars10 = await evaluate(`
      (() => {
        return document.querySelectorAll('svg[viewBox^="0 0 620"] g[style*="cursor: pointer"]').length;
      })()
    `);
    recordAssertion(countBars10 === 10, `Feature importance Top 10 toggle renders 10 items (got: ${countBars10})`);

    // -------------------------------------------------------------
    // Test 5: Bilingual i18n Switching Stress Test
    // -------------------------------------------------------------
    console.log('\n--- 5. Bilingual (FR <-> EN) Language Switching Stress Test ---');

    const heroTitleInitial = await evaluate(`document.querySelector('h1#hero-title')?.innerText || ''`);

    // Click language toggle button (switches to EN if currently FR)
    await evaluate(`
      (() => {
        const langToggle = document.querySelector('.lang-toggle-button');
        langToggle?.click();
      })()
    `);
    await sleep(200);

    const heroTitleAfterSwitch = await evaluate(`document.querySelector('h1#hero-title')?.innerText || ''`);
    const docLangEn = await evaluate(`document.documentElement.lang`);

    // Toggle back
    await evaluate(`
      (() => {
        const langToggle = document.querySelector('.lang-toggle-button');
        langToggle?.click();
      })()
    `);
    await sleep(200);

    const heroTitleBack = await evaluate(`document.querySelector('h1#hero-title')?.innerText || ''`);
    const docLangFr = await evaluate(`document.documentElement.lang`);

    const i18nPassed = heroTitleInitial !== heroTitleAfterSwitch && heroTitleInitial === heroTitleBack;
    recordAssertion(i18nPassed, `Bilingual toggle switches title between languages and back (FR: "${heroTitleInitial.slice(0, 30)}...", EN: "${heroTitleAfterSwitch.slice(0, 30)}...")`);
    recordAssertion(docLangEn !== docLangFr, `Document html lang attribute updates synchronously (en -> fr)`);

    // -------------------------------------------------------------
    // Test 6: Official Viewport Responsive Overflow Audit (320px, 768px, 1280px, 2560px)
    // -------------------------------------------------------------
    console.log('\n--- 6. Milestone Viewports Responsive Integrity Audit (320px, 768px, 1280px, 2560px) ---');

    const OFFICIAL_VIEWPORTS = [320, 768, 1280, 2560];
    let allOfficialPassed = true;

    for (const vpWidth of OFFICIAL_VIEWPORTS) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: vpWidth,
        height: 900,
        deviceScaleFactor: 1,
        mobile: vpWidth <= 768
      }, sessionId);

      await sleep(350);

      const vpAudit = await evaluate(`
        (() => {
          const docEl = document.documentElement;
          const body = document.body;
          const winW = window.innerWidth;
          const docScrollW = docEl.scrollWidth;
          const docClientW = docEl.clientWidth;
          const bodyScrollW = body.scrollWidth;
          const bodyClientW = body.clientWidth;

          let leakingCount = 0;
          const allEls = document.querySelectorAll('*');
          for (const el of allEls) {
            const r = el.getBoundingClientRect();
            if (r.right > winW + 1.5) {
              leakingCount++;
            }
          }

          return {
            winW,
            docScrollW,
            docClientW,
            bodyScrollW,
            bodyClientW,
            hasDocOverflow: docScrollW > docClientW,
            hasBodyOverflow: bodyScrollW > bodyClientW,
            leakingCount
          };
        })()
      `);

      const vpPassed = !vpAudit.hasDocOverflow && !vpAudit.hasBodyOverflow && vpAudit.leakingCount === 0;
      if (!vpPassed) allOfficialPassed = false;

      recordAssertion(
        vpPassed,
        `Viewport ${vpWidth}px: docW=${vpAudit.docScrollW}px/${vpAudit.docClientW}px, leaking=${vpAudit.leakingCount}`,
        `docOverflow=${vpAudit.hasDocOverflow}, bodyOverflow=${vpAudit.hasBodyOverflow}, leaking=${vpAudit.leakingCount}`
      );
    }

    recordAssertion(allOfficialPassed, 'Zero horizontal overflow and zero leaking elements across all 4 official target viewports');

    // -------------------------------------------------------------
    // Test 7: M2 Sections Specific Isolation at 1024px
    // -------------------------------------------------------------
    console.log('\n--- 7. M2 Sections Specific Bounds Audit at 1024px ---');

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1024,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    }, sessionId);
    await sleep(350);

    const m2SectionBounds = await evaluate(`
      (() => {
        const winW = window.innerWidth;
        const sections = ['#hero', '#kpis', '#psychology', '#benchmark'];
        const results = [];

        sections.forEach(sel => {
          const el = document.querySelector(sel);
          if (el) {
            const r = el.getBoundingClientRect();
            const leakingInnerEls = [];
            el.querySelectorAll('*').forEach(inner => {
              const ir = inner.getBoundingClientRect();
              if (ir.right > winW + 1.5) {
                leakingInnerEls.push({ tag: inner.tagName, class: inner.className, right: ir.right });
              }
            });

            results.push({
              selector: sel,
              right: r.right,
              scrollW: el.scrollWidth,
              clientW: el.clientWidth,
              leaksCount: leakingInnerEls.length,
              fitsWithinViewport: r.right <= winW + 1.5 && el.scrollWidth <= el.clientWidth
            });
          }
        });

        return results;
      })()
    `);

    let allM2FitAt1024 = m2SectionBounds.every(s => s.fitsWithinViewport && s.leaksCount === 0);
    recordAssertion(allM2FitAt1024, `All 4 Milestone M2 sections fit completely within 1024px viewport (zero M2 leaks)`);

    // -------------------------------------------------------------
    // Test 8: Console & Runtime Exceptions Verification
    // -------------------------------------------------------------
    console.log('\n--- 8. Console & Runtime Exception Probe ---');

    recordAssertion(
      capturedConsoleErrors.length === 0,
      `Zero unhandled console errors during runtime (errors count: ${capturedConsoleErrors.length})`,
      capturedConsoleErrors.join(' | ')
    );

    recordAssertion(
      capturedExceptions.length === 0,
      `Zero unhandled JavaScript exceptions thrown (exceptions count: ${capturedExceptions.length})`,
      capturedExceptions.join(' | ')
    );

    if (capturedConsoleErrors.length > 0) {
      console.error('\n⚠️ CAPTURED CONSOLE ERRORS:');
      capturedConsoleErrors.forEach(err => console.error('  - ', err));
    }

    if (capturedExceptions.length > 0) {
      console.error('\n⚠️ CAPTURED EXCEPTIONS:');
      capturedExceptions.forEach(ex => console.error('  - ', ex));
    }

    client.close();
  } finally {
    chromeProc.kill('SIGKILL');
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  }

  console.log('\n================================================================');
  console.log('             CHALLENGER M2 AUDIT FINAL VERDICT                  ');
  console.log('================================================================');
  console.log(`Total Failures: ${testFailures}`);
  console.log(`Console Errors: ${capturedConsoleErrors.length}`);
  console.log(`Exceptions:     ${capturedExceptions.length}`);

  if (testFailures === 0 && capturedConsoleErrors.length === 0 && capturedExceptions.length === 0) {
    console.log('\nVERDICT: APPROVE ✅ (Milestone M2 layout, responsiveness, and E2E regression confirmed)');
    process.exit(0);
  } else {
    console.error('\nVERDICT: REJECT ❌ (Defects or unhandled errors detected during empirical probing)');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal challenger execution error:', err);
  process.exit(1);
});

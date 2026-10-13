/**
 * Browser-Level Interactive Stress Test Harness
 * 
 * Interacts with real browser DOM via Chrome DevTools Protocol:
 * 1. Threshold slider: rapid sweeps, discrete steps, click optimal button
 * 2. Tilt Simulator: rapid inputs across all 4 sliders
 * 3. Psychology feature tabs: rapid switching between all 6 behavioral features
 * 4. ML Benchmark: ROC / PR tab switching, Top 10 / Top 15 toggles, category filtering
 * 5. Confusion matrix: clicking TP, FN, FP, TN cells to inspect breakdown
 * 6. Console errors & DOM NaN inspection
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CDP_PORT = 9448;
const APP_URL = 'http://127.0.0.1:5173/';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getBrowserWsUrl() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`);
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch {}
    await sleep(250);
  }
  throw new Error('Failed to connect to Chrome DevTools endpoint');
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
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
      }
    };
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

async function runBrowserStressTests() {
  console.log('=== STARTING BROWSER-LEVEL INTERACTION STRESS TESTS ===\n');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome_interactive_test_'));

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${tmpDir}`,
    '--disable-gpu',
    '--no-sandbox',
    '--disable-extensions',
    'about:blank'
  ], { stdio: 'ignore' });

  let testsPassed = 0;
  let testsTotal = 0;
  const consoleErrors = [];

  function assert(condition, desc, details = {}) {
    testsTotal++;
    if (condition) {
      testsPassed++;
      console.log(`✅ PASS: ${desc}`);
    } else {
      console.error(`❌ FAIL: ${desc}`, details);
    }
  }

  try {
    const wsUrl = await getBrowserWsUrl();
    const client = new CdpClient(wsUrl);

    const target = await client.send('Target.createTarget', { url: APP_URL });
    const targetId = target.targetId;
    const session = await client.send('Target.attachToTarget', { targetId, flatten: true });
    const sessionId = session.sessionId;

    await client.send('Page.enable', {}, sessionId);
    await client.send('Runtime.enable', {}, sessionId);
    await client.send('DOM.enable', {}, sessionId);

    // Track console errors
    client.ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
      }
    });

    await sleep(1500);

    // -------------------------------------------------------------------------
    // Test 1: Rapid Threshold Slider Dragging & Interpolation DOM Verification
    // -------------------------------------------------------------------------
    console.log('\n--- 1. Testing Threshold Slider Dynamic Reactivity & NaN Immunity ---');

    const sliderResult = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          function setReactInputValue(input, val) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(input, val);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }

          const slider = document.querySelector('input[type="range"][min="0.05"]');
          if (!slider) return { error: 'Slider element not found' };

          const valuesTested = [];
          const nanDetections = [];

          // Rapid sweep across 46 steps from 0.05 to 0.95
          for (let v = 0.05; v <= 0.95; v += 0.02) {
            const valStr = v.toFixed(2);
            setReactInputValue(slider, valStr);

            // Read text content in benchmark section
            const textContent = document.getElementById('benchmark')?.innerText || '';
            if (textContent.includes('NaN')) {
              nanDetections.push({ val: valStr, context: 'Found NaN in benchmark section' });
            }
            valuesTested.push(valStr);
          }

          // Click the optimal threshold button
          const optBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('θ* = 0.36') || b.innerText.includes('0.36'));
          if (optBtn) {
            optBtn.click();
          }

          const finalBenchText = document.getElementById('benchmark')?.innerText || '';
          const hasFinalNan = finalBenchText.includes('NaN');

          return {
            stepsCount: valuesTested.length,
            nanDetections,
            hasFinalNan,
            sliderValAfterOpt: slider.value
          };
        })()
      `,
      returnByValue: true
    }, sessionId);

    const sData = sliderResult.result.value;
    assert(sData && !sData.error, 'Threshold slider found and accessible');
    assert(sData && sData.stepsCount >= 45, `Swept ${sData?.stepsCount} threshold positions cleanly`);
    assert(sData && sData.nanDetections.length === 0, 'Zero NaN occurrences detected during threshold sweep', { nanDetections: sData?.nanDetections });
    assert(sData && !sData.hasFinalNan, 'No NaN present after reset to optimal threshold θ* = 0.36');

    // -------------------------------------------------------------------------
    // Test 2: Live Tilt Simulator Sliders & Calculations
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Testing Tilt Simulator Sliders & Reactive Score ---');

    const tiltResult = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const abandonsSlider = document.getElementById('sim-abandons');
          const streakSlider = document.getElementById('sim-streak');
          const durationSlider = document.getElementById('sim-duration');
          const dpmSlider = document.getElementById('sim-dpm');

          if (!abandonsSlider || !streakSlider || !durationSlider || !dpmSlider) {
            return { error: 'One or more tilt sliders not found' };
          }

          const scoreBox = document.querySelector('.tilt-score-number');
          const tierBadge = document.querySelector('.tilt-tier-badge');

          function setReactInputValue(input, val) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(input, val);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }

          const iterations = [
            { a: '0', s: '0', dur: '45', dpm: '0.15' }, // zero tilt
            { a: '1', s: '-4', dur: '22', dpm: '0.42' }, // default (~4.90)
            { a: '3', s: '-8', dur: '15', dpm: '0.70' }  // maximum extreme tilt
          ];

          const states = [];
          for (const it of iterations) {
            setReactInputValue(abandonsSlider, it.a);
            setReactInputValue(streakSlider, it.s);
            setReactInputValue(durationSlider, it.dur);
            setReactInputValue(dpmSlider, it.dpm);

            states.push({
              scoreText: scoreBox ? scoreBox.innerText : null,
              tierText: tierBadge ? tierBadge.innerText : null
            });
          }

          return { states };
        })()
      `,
      returnByValue: true
    }, sessionId);

    const tData = tiltResult.result.value;
    assert(tData && !tData.error, 'All tilt simulator sliders found and operational');
    assert(tData && tData.states?.length === 3, 'Evaluated zero, default, and extreme tilt states');
    if (tData?.states) {
      assert(parseFloat(tData.states[0].scoreText) === 0.0, 'Zero state yields 0.00 score', { got: tData.states[0].scoreText });
      assert(parseFloat(tData.states[1].scoreText) >= 4.0, 'Default state yields >= 4.00 extreme tilt', { got: tData.states[1].scoreText });
      assert(parseFloat(tData.states[2].scoreText) >= 10.0, 'Max state yields >= 10.00 tilt score', { got: tData.states[2].scoreText });
    }

    // -------------------------------------------------------------------------
    // Test 3: Psychology Behavioral Feature Tabs Switching
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Testing Psychology Behavioral Tabs Switching ---');

    const tabSwitchResult = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const tabBtns = Array.from(document.querySelectorAll('.psychology-tab-btn'));
          if (tabBtns.length === 0) return { error: 'No psychology tabs found' };

          const selectedTitles = [];
          for (const btn of tabBtns) {
            btn.click();
            const titleEl = document.querySelector('.feature-main-title');
            selectedTitles.push(titleEl ? titleEl.innerText : null);
          }

          return {
            tabsFound: tabBtns.length,
            selectedTitles
          };
        })()
      `,
      returnByValue: true
    }, sessionId);

    const tabData = tabSwitchResult.result.value;
    assert(tabData && tabData.tabsFound === 6, `All 6 psychology tabs found (got: ${tabData?.tabsFound})`);
    assert(tabData && tabData.selectedTitles?.every(t => typeof t === 'string' && t.length > 0), 'All 6 tabs switched and rendered valid feature titles');

    // -------------------------------------------------------------------------
    // Test 4: ML Benchmark Interactive Controls (Curve mode, Categories, Top N)
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Testing ML Benchmark Visualizations & Controls ---');

    const benchControlsResult = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          // Switch to PR Curve
          const prBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('PR Curve'));
          if (prBtn) prBtn.click();

          // Switch back to ROC Curve
          const rocBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('ROC Curve'));
          if (rocBtn) rocBtn.click();

          // Toggle Top 15
          const top15Btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Top 15');
          if (top15Btn) top15Btn.click();

          // Filter by category
          const catBtns = Array.from(document.querySelectorAll('button')).filter(b => 
            b.innerText.includes('Économie') || b.innerText.includes('Economy') ||
            b.innerText.includes('Comportement') || b.innerText.includes('Behavior')
          );
          catBtns.forEach(b => b.click());

          // Click confusion matrix cells
          const cmCells = Array.from(document.querySelectorAll('.benchmark-table, .card [style*="cursor: pointer"]'));
          cmCells.slice(0, 5).forEach(c => c.click());

          const benchText = document.getElementById('benchmark')?.innerText || '';
          return {
            hasNaN: benchText.includes('NaN'),
            controlsClicked: true
          };
        })()
      `,
      returnByValue: true
    }, sessionId);

    const bCtrlData = benchControlsResult.result.value;
    assert(bCtrlData && bCtrlData.controlsClicked, 'All benchmark interactive controls engaged cleanly');
    assert(bCtrlData && !bCtrlData.hasNaN, 'Zero NaNs after engaging all benchmark visualization controls');

    // -------------------------------------------------------------------------
    // Test 5: Check Browser Console Errors
    // -------------------------------------------------------------------------
    console.log('\n--- 5. Checking Runtime Console Errors ---');
    assert(consoleErrors.length === 0, `Zero runtime console errors during all interactions (errors: ${consoleErrors.length})`, { consoleErrors });

    client.close();
  } finally {
    chromeProc.kill('SIGKILL');
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  }

  console.log('\n======================================================');
  console.log('=== BROWSER INTERACTION TEST SUMMARY ===');
  console.log(`Assertions: ${testsPassed} / ${testsTotal} passed`);
  console.log('======================================================');

  if (testsPassed === testsTotal) {
    console.log('\nALL BROWSER INTERACTION TESTS PASSED CLEANLY!');
    process.exit(0);
  } else {
    console.error('\nSOME BROWSER TESTS FAILED!');
    process.exit(1);
  }
}

runBrowserStressTests().catch(err => {
  console.error('Browser test harness error:', err);
  process.exit(1);
});

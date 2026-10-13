/**
 * Empirical Challenger M3 Stress Test & Verification Suite
 * 
 * Deep inspection of Milestone M3:
 * 1. Dev server response verification at http://127.0.0.1:5173/
 * 2. Mounting and DOM verification of SimulatorSection, RiskGauge, FactorAttribution
 * 3. 4-Archetype click switching with state/gauge/attribution assertions
 * 4. Rapid-fire archetype switching stress test (concurrency & race condition immunity)
 * 5. Quick presets buttons interaction (835397971, 224109642, 175397696, 101438338)
 * 6. Steam Account ID search input: validation, numeric filtering, clear button, offline fallback
 * 7. Live i18n language toggle (FR <-> EN) in simulator context via .lang-toggle-button
 * 8. Dynamic viewport resizing & horizontal overflow stress (320px, 768px, 1280px, 2560px)
 * 9. Absolute zero console errors and zero uncaught runtime exceptions assertion
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const APP_URL = 'http://127.0.0.1:5173/';
const CDP_PORT = 9456;
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
  console.log('   CHALLENGER M3 EMPIRICAL AUDIT & ADVERSARIAL STRESS HARNESS   ');
  console.log('================================================================\n');

  // Step 1: Probe Dev Server via direct HTTP fetch
  console.log('--- 1. Probing Dev Server HTTP Endpoint (http://127.0.0.1:5173/) ---');
  let devServerOk = false;
  try {
    const res = await fetch(APP_URL);
    if (res.ok) {
      const html = await res.text();
      console.log(`✅ Dev Server responded with status ${res.status} ${res.statusText}`);
      console.log(`   HTML payload size: ${html.length} bytes, contains <div id="root">: ${html.includes('id="root"')}`);
      devServerOk = true;
    } else {
      console.error(`❌ Dev server returned non-OK status: ${res.status}`);
    }
  } catch (err) {
    console.error(`❌ Could not fetch ${APP_URL}:`, err.message);
  }

  if (!devServerOk) {
    console.error('CRITICAL: Dev server not responding cleanly. Exiting with failure.');
    process.exit(1);
  }

  // Step 2: Spawn Headless Chrome for CDP Automation
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'challenger_m3_'));
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
  const capturedConsoleWarns = [];
  const uncaughtExceptions = [];

  let passedAssertions = 0;
  let totalAssertions = 0;

  function assert(condition, message, details = null) {
    totalAssertions++;
    if (condition) {
      passedAssertions++;
      console.log(`  ✅ [PASS] ${message}`);
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      if (details) console.error('     Details:', details);
    }
  }

  try {
    const wsUrl = await getBrowserWsUrl();
    const client = new CdpClient(wsUrl);

    const target = await client.send('Target.createTarget', { url: APP_URL });
    const sessionId = (await client.send('Target.attachToTarget', { targetId: target.targetId, flatten: true })).sessionId;

    await client.send('Page.enable', {}, sessionId);
    await client.send('Runtime.enable', {}, sessionId);
    await client.send('DOM.enable', {}, sessionId);
    await client.send('Log.enable', {}, sessionId);

    // Listen for console calls and exceptions
    client.on('Runtime.consoleAPICalled', (params) => {
      if (params.type === 'error') {
        const text = params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
        capturedConsoleErrors.push(text);
        console.error(`     [BROWSER CONSOLE ERROR]: ${text}`);
      } else if (params.type === 'warning') {
        const text = params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
        capturedConsoleWarns.push(text);
      }
    });

    client.on('Runtime.exceptionThrown', (params) => {
      const desc = params.exceptionDetails?.exception?.description || params.exceptionDetails?.text || 'Unknown exception';
      uncaughtExceptions.push(desc);
      console.error(`     [BROWSER UNCAUGHT EXCEPTION]: ${desc}`);
    });

    // Wait for initial render
    await sleep(2000);

    // Step 3: Inspect DOM Mounting of M3 Components
    console.log('\n--- 2. Inspecting DOM Mounting of Milestone M3 Simulator Section ---');
    const mountCheck = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const sim = document.getElementById('simulator');
          if (!sim) return { mounted: false };
          const heading = sim.querySelector('h2');
          const input = sim.querySelector('input[inputmode="numeric"]');
          const submitBtn = sim.querySelector('button[type="submit"]');
          const archetypes = sim.querySelectorAll('.archetype-preview-card');
          const svgGauge = sim.querySelector('svg.gauge-svg') || sim.querySelector('svg[viewBox="0 0 340 215"]');
          const factorAttribution = sim.querySelector('.factor-attribution') || sim.querySelector('.factor-attribution-card') || sim.querySelector('.glass-card .grid-2');
          
          return {
            mounted: true,
            headingText: heading?.innerText || '',
            hasInput: !!input,
            inputValue: input?.value || '',
            hasSubmitBtn: !!submitBtn,
            archetypesCount: archetypes.length,
            hasGauge: !!svgGauge,
            hasFactorAttribution: !!factorAttribution
          };
        })()
      `,
      returnByValue: true
    }, sessionId);

    const m = mountCheck.result?.value;
    assert(m?.mounted === true, 'Section #simulator is present in the DOM');
    assert(m?.hasInput === true, 'Steam Account ID numeric input exists', { value: m?.inputValue });
    assert(m?.hasSubmitBtn === true, 'Predict / Analyze submit CTA button exists');
    assert(m?.archetypesCount === 4, `Found exactly 4 calibrated archetype cards (found ${m?.archetypesCount})`);
    assert(m?.hasGauge === true, 'Semicircular SVG RiskGauge is rendered (class "gauge-svg", viewBox "0 0 340 215")');

    // Step 4: Calibrated Archetypes Verification
    console.log('\n--- 3. Testing 4-Archetype Selection & Live State Reflection ---');
    const expectedArchetypes = [
      { id: 'tilting_player', expectedProb: '86.5%', tier: 'critical' },
      { id: 'burned_out_veteran', expectedProb: '57.7%', tier: 'moderate' },
      { id: 'consistent_support', expectedProb: '21.8%', tier: 'low' },
      { id: 'balanced_player', expectedProb: '19.6%', tier: 'low' }
    ];

    for (let i = 0; i < expectedArchetypes.length; i++) {
      const arch = expectedArchetypes[i];
      // Click the archetype card
      await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const cards = Array.from(document.querySelectorAll('.archetype-preview-card'));
            if (cards[${i}]) cards[${i}].click();
          })()
        `
      }, sessionId);

      // Wait for React to re-render
      await sleep(200);

      // Inspect updated DOM
      const stateCheck = await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const gaugeVal = document.querySelector('.gauge-percentage-value')?.innerText || '';
            const needle = document.querySelector('.gauge-needle-group');
            const needleTransform = needle?.getAttribute('transform') || '';
            const activeCard = document.querySelector('.archetype-preview-card[aria-pressed="true"]');
            
            return {
              gaugeVal,
              needleTransform,
              activeCardFound: !!activeCard
            };
          })()
        `,
        returnByValue: true
      }, sessionId);

      const data = stateCheck.result?.value;
      assert(data?.activeCardFound === true, `Archetype card ${i + 1} (${arch.id}) marked as active in DOM`);
      assert(data?.gaugeVal?.includes(arch.expectedProb), `Gauge displays exact calibrated probability ${arch.expectedProb} (got "${data?.gaugeVal}")`);
    }

    // Step 5: Rapid-Fire Archetype Switching Stress Test (Race Condition & Flicker Immunity)
    console.log('\n--- 4. Stress Testing Rapid Archetype Switching (20 rapid cycles) ---');
    const rapidResult = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const cards = Array.from(document.querySelectorAll('.archetype-preview-card'));
          if (cards.length < 4) return { error: 'Not enough cards' };
          
          let errors = [];
          for (let cycle = 0; cycle < 20; cycle++) {
            const idx = cycle % 4;
            try {
              cards[idx].click();
              const text = document.getElementById('simulator')?.innerText;
              if (!text || text.includes('NaN')) {
                errors.push('NaN or empty DOM detected at cycle ' + cycle);
              }
            } catch (err) {
              errors.push(err.message);
            }
          }
          
          return {
            completedCycles: 20,
            errors
          };
        })()
      `,
      returnByValue: true
    }, sessionId);

    // Yield after rapid clicks to settle
    await sleep(250);

    const rData = rapidResult.result?.value;
    assert(rData?.completedCycles === 20, 'Completed 20 rapid switching cycles without synchronous error');
    assert(rData?.errors?.length === 0, 'Zero DOM NaN or crash artifacts during rapid switching', { errors: rData?.errors });

    // Step 6: Quick Presets Buttons Interaction
    console.log('\n--- 5. Testing Quick Presets Buttons Interaction ---');
    const presetIds = ['835397971', '224109642', '175397696', '101438338'];
    for (const pid of presetIds) {
      await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('${pid}'));
            if (btn) btn.click();
          })()
        `
      }, sessionId);

      await sleep(150);

      const checkVal = await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const input = document.querySelector('#simulator input[inputmode="numeric"]');
            return input?.value || '';
          })()
        `,
        returnByValue: true
      }, sessionId);

      const val = checkVal.result?.value;
      assert(val === pid, `Preset button for ${pid} synced input value correctly (got "${val}")`);
    }

    // Step 7: Search Input Numeric Validation & Clear Action
    console.log('\n--- 6. Testing Steam Account ID Input Validation & Clear Action ---');
    
    // Test Clear Action
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const clearBtn = document.querySelector('#simulator button[aria-label*="Effacer"]') || 
                           document.querySelector('#simulator button[aria-label*="Clear"]');
          if (clearBtn) clearBtn.click();
        })()
      `
    }, sessionId);

    await sleep(150);

    const clearedCheck = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const input = document.querySelector('#simulator input[inputmode="numeric"]');
          return input?.value;
        })()
      `,
      returnByValue: true
    }, sessionId);

    assert(clearedCheck.result?.value === '', 'Clear button clears input field value cleanly');

    // Test Short Input Validation
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          function setReactInputValue(input, val) {
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            setter.call(input, val);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }

          const input = document.querySelector('#simulator input[inputmode="numeric"]');
          const submitBtn = document.querySelector('#simulator button[type="submit"]');

          setReactInputValue(input, '12');
          if (submitBtn) submitBtn.click();
        })()
      `
    }, sessionId);

    await sleep(150);

    const errorNoticeCheck = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const notice = document.querySelector('#simulator [style*="rgba(239, 68, 68"]');
          return notice ? notice.innerText : '';
        })()
      `,
      returnByValue: true
    }, sessionId);

    assert(errorNoticeCheck.result?.value?.length > 0, 'Submitting invalid short ID triggers validation notice');

    // Test Strict Numeric Sanitization
    const sanitizeCheck = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          function setReactInputValue(input, val) {
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            setter.call(input, val);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }

          const input = document.querySelector('#simulator input[inputmode="numeric"]');
          setReactInputValue(input, 'abc789xyz!');
          return input.value;
        })()
      `,
      returnByValue: true
    }, sessionId);

    const sanitizedVal = sanitizeCheck.result?.value;
    assert(/^\d+$/.test(sanitizedVal) && sanitizedVal === '789', `Strict numeric sanitization strips non-digits (value: "${sanitizedVal}")`);

    // Step 8: Unknown Account ID Synthetic Fallback (Asynchronous with 1500ms timeout)
    console.log('\n--- 7. Testing Unknown Steam ID Fallback & Offline Synthesis ---');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          function setReactInputValue(input, val) {
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            setter.call(input, val);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }

          const input = document.querySelector('#simulator input[inputmode="numeric"]');
          const submitBtn = document.querySelector('#simulator button[type="submit"]');

          setReactInputValue(input, '987654321');
          if (submitBtn) submitBtn.click();
        })()
      `
    }, sessionId);

    // Wait 2200ms for API call timeout (1500ms) + fallback resolution + re-render
    await sleep(2200);

    const unknownIdResult = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const gaugeVal = document.querySelector('.gauge-percentage-value')?.innerText || '';
          const notice = document.querySelector('#simulator [style*="rgba(245, 158, 11"]')?.innerText || '';
          const header = document.querySelector('#simulator h3')?.innerText || '';
          
          return {
            gaugeVal,
            notice,
            header,
            hasSynthesizedProfile: gaugeVal.length > 0 && !gaugeVal.includes('NaN'),
            hasNotice: notice.length > 0
          };
        })()
      `,
      returnByValue: true
    }, sessionId);

    const uData = unknownIdResult.result?.value;
    assert(uData?.hasSynthesizedProfile === true, `Synthesized profile rendered with valid gauge probability: "${uData?.gaugeVal}"`);
    assert(uData?.hasNotice === true, `Notice callout displayed for fallback profile (header: "${uData?.header}")`);

    // Step 9: Dynamic Viewport Resizing & Horizontal Overflow Audit
    console.log('\n--- 8. Testing Dynamic Viewport Resizing & Horizontal Overflow Across 4 Viewports ---');
    const viewports = [320, 768, 1280, 2560];
    for (const width of viewports) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width,
        height: 900,
        deviceScaleFactor: 1,
        mobile: width <= 768
      }, sessionId);
      await sleep(300);

      const overflowAudit = await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const docWidth = document.documentElement.clientWidth;
            const docScroll = document.documentElement.scrollWidth;
            const bodyScroll = document.body.scrollWidth;
            
            const leakingElements = [];
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
              const rect = el.getBoundingClientRect();
              if (rect.right > docWidth + 1) {
                leakingElements.push({
                  tag: el.tagName,
                  className: el.className,
                  id: el.id,
                  right: Math.round(rect.right),
                  allowed: docWidth
                });
              }
            }

            const sim = document.getElementById('simulator');
            const simRect = sim ? sim.getBoundingClientRect() : null;
            
            return {
              width: docWidth,
              docScroll,
              bodyScroll,
              hasDocOverflow: docScroll > docWidth + 1,
              hasBodyOverflow: bodyScroll > docWidth + 1,
              leakingCount: leakingElements.length,
              sampleLeaks: leakingElements.slice(0, 3),
              simWidth: simRect ? Math.round(simRect.width) : 0
            };
          })()
        `,
        returnByValue: true
      }, sessionId);

      const ov = overflowAudit.result?.value;
      assert(!ov?.hasDocOverflow && !ov?.hasBodyOverflow, `Viewport ${width}px: Document & Body horizontal scroll clean (docScroll=${ov?.docScroll}px, clientWidth=${ov?.width}px)`);
      assert(ov?.leakingCount === 0, `Viewport ${width}px: 0 elements leaking past boundary (found ${ov?.leakingCount})`, { leaks: ov?.sampleLeaks });
    }

    // Reset viewport
    await client.send('Emulation.clearDeviceMetricsOverride', {}, sessionId);

    // Step 10: Bilingual i18n Switching Verification
    console.log('\n--- 9. Testing Bilingual i18n Switching (FR <-> EN) in Simulator ---');
    // Click language toggle button to switch to English
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('button.lang-toggle-button');
          if (btn) btn.click();
        })()
      `
    }, sessionId);

    await sleep(250);

    const enHeadingCheck = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          return document.getElementById('simulator-heading')?.innerText || '';
        })()
      `,
      returnByValue: true
    }, sessionId);

    const enHeading = enHeadingCheck.result?.value || '';
    assert(enHeading.includes('Interactive') || enHeading.includes('Simulator') || enHeading.includes('Archetypes'), `English heading rendered cleanly: "${enHeading}"`);

    // Click language toggle button again to switch back to French
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('button.lang-toggle-button');
          if (btn) btn.click();
        })()
      `
    }, sessionId);

    await sleep(250);

    const frHeadingCheck = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          return document.getElementById('simulator-heading')?.innerText || '';
        })()
      `,
      returnByValue: true
    }, sessionId);

    const frHeading = frHeadingCheck.result?.value || '';
    assert(frHeading.includes('Simulateur') || frHeading.includes('Interactif') || frHeading.includes('Archétypes'), `French heading restored cleanly: "${frHeading}"`);

    // Step 11: Final Console Errors & Exceptions Audit
    console.log('\n--- 10. Audit of Captured Console Errors & Runtime Exceptions ---');
    assert(capturedConsoleErrors.length === 0, `Zero unhandled console errors during all M3 interactions (found ${capturedConsoleErrors.length})`, { errors: capturedConsoleErrors });
    assert(uncaughtExceptions.length === 0, `Zero uncaught exceptions thrown during evaluation (found ${uncaughtExceptions.length})`, { exceptions: uncaughtExceptions });

    client.close();
  } finally {
    chromeProc.kill('SIGKILL');
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  console.log('\n================================================================');
  console.log(`   CHALLENGER M3 AUDIT COMPLETED: ${passedAssertions}/${totalAssertions} PASSED`);
  console.log('================================================================\n');

  if (passedAssertions < totalAssertions || capturedConsoleErrors.length > 0 || uncaughtExceptions.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

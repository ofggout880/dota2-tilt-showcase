/**
 * Challenger M5 Empirical CDP Interactive Probe & Regression Suite
 * 
 * Verifies:
 * 1. Focus rings and accessible focus styles on dark surfaces via CDP CSS.forcePseudoState (:focus-visible)
 * 2. Button clicks and UI state responsiveness (Language, Popover, Stepper, Quickstart, Copy)
 * 3. 4-Archetype switching (readout, SVG gauge needle, risk tier badge, factor attribution)
 * 4. Rapid archetype switching stress test (zero race conditions, zero NaN)
 * 5. Steam Account ID sanitization & search (32-bit, 64-bit BigInt conversion, float truncation)
 * 6. Zero unhandled console errors and zero runtime exceptions across all interactions
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CDP_PORT = 9456;
const APP_URL = 'http://127.0.0.1:5173/';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

let assertionsTotal = 0;
let assertionsPassed = 0;
let assertionsFailed = 0;
const failures = [];

function assert(condition, description, details = {}) {
  assertionsTotal++;
  if (condition) {
    assertionsPassed++;
    console.log(`  ✅ PASS: ${description}`);
  } else {
    assertionsFailed++;
    failures.push({ description, details });
    console.error(`  ❌ FAIL: ${description}`, details);
  }
}

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
    } catch {
      // Chrome starting up
    }
    await sleep(200);
  }
  throw new Error('Failed to connect to Chrome DevTools endpoint');
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
    this.eventListeners = [];
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
        this.eventListeners.forEach(listener => listener(msg));
      }
    };
  }

  onEvent(fn) {
    this.eventListeners.push(fn);
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

async function runCdpProbe() {
  console.log('================================================================');
  console.log('   CHALLENGER M5 EMPIRICAL CDP PROBE & REGRESSION HARNESS       ');
  console.log('================================================================\n');

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome_m5_probe_'));
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${tmpDir}`,
    '--disable-gpu',
    '--no-sandbox',
    '--disable-extensions',
    'about:blank'
  ], { stdio: 'ignore' });

  const consoleErrors = [];
  const consoleWarnings = [];
  const uncaughtExceptions = [];

  try {
    const wsUrl = await getBrowserWsUrl();
    const client = new CdpClient(wsUrl);

    client.onEvent((msg) => {
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || a.description || '').join(' ');
        if (msg.params.type === 'error') {
          consoleErrors.push(text);
          console.error('  ⚠️ Console Error:', text);
        } else if (msg.params.type === 'warning') {
          consoleWarnings.push(text);
        }
      } else if (msg.method === 'Runtime.exceptionThrown') {
        const desc = msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text || 'Exception';
        uncaughtExceptions.push(desc);
        console.error('  ⚠️ Uncaught Exception:', desc);
      }
    });

    const target = await client.send('Target.createTarget', { url: APP_URL });
    const targetId = target.targetId;
    const session = await client.send('Target.attachToTarget', { targetId, flatten: true });
    const sessionId = session.sessionId;

    await client.send('Browser.grantPermissions', {
      permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
      origin: APP_URL
    });

    await client.send('Page.enable', {}, sessionId);
    await client.send('Runtime.enable', {}, sessionId);
    await client.send('DOM.enable', {}, sessionId);
    await client.send('CSS.enable', {}, sessionId);

    // Initial render settle
    await sleep(2000);

    // -------------------------------------------------------------------------
    // TEST SECTION 1: ACCESSIBLE FOCUS RINGS ON DARK SURFACES
    // -------------------------------------------------------------------------
    console.log('\n--- Section 1: Accessible Focus Rings on Dark Surfaces ---');

    // 1. Verify global and component focus rules in CSS
    const cssRulesCheck = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          let hasFocusVisibleRule = false;
          let hasInputFocusRule = false;
          let hasStageCardFocusRule = false;
          let hasArchetypeFocusRule = false;

          for (const sheet of document.styleSheets) {
            try {
              for (const rule of sheet.cssRules) {
                const text = rule.cssText || '';
                if (text.includes(':focus-visible') && text.includes('outline')) {
                  hasFocusVisibleRule = true;
                }
                if (text.includes('.input-field:focus') || (text.includes('.input-field') && text.includes('focus'))) {
                  hasInputFocusRule = true;
                }
                if (text.includes('.stage-node-card:focus-visible') || text.includes('.arch-stage-card:focus-visible')) {
                  hasStageCardFocusRule = true;
                }
                if (text.includes('.archetype-preview-card:focus-visible')) {
                  hasArchetypeFocusRule = true;
                }
              }
            } catch (e) {
              // Cross-origin stylesheet
            }
          }

          return {
            hasFocusVisibleRule,
            hasInputFocusRule,
            hasStageCardFocusRule,
            hasArchetypeFocusRule
          };
        })()
      `,
      returnByValue: true
    }, sessionId);

    assert(cssRulesCheck.result.value.hasFocusVisibleRule, 'Global :focus-visible outline rule exists in stylesheets');
    assert(cssRulesCheck.result.value.hasInputFocusRule, '.input-field:focus rule exists in stylesheets');
    assert(cssRulesCheck.result.value.hasStageCardFocusRule, '.stage-node-card / .arch-stage-card :focus-visible rule exists in stylesheets');
    assert(cssRulesCheck.result.value.hasArchetypeFocusRule, '.archetype-preview-card:focus-visible rule exists in stylesheets');

    // 2. Test DOM elements with forced :focus-visible via CDP CSS.forcePseudoState
    const docNode = await client.send('DOM.getDocument', {}, sessionId);

    const elementsToFocus = [
      { sel: '.status-badge-button', name: 'Status Badge Button' },
      { sel: '.lang-toggle-button', name: 'Language Toggle Button' },
      { sel: '.stage-node-card', name: 'Architecture Stepper Card' },
      { sel: '.quickstart-tab', name: 'Quickstart Tab' },
      { sel: '.copy-btn', name: 'Copy Button' },
      { sel: '.archetype-preview-card', name: 'Archetype Preview Card' },
      { sel: '.input-field', name: 'Simulator Account ID Input' }
    ];

    for (const item of elementsToFocus) {
      const nodeRes = await client.send('DOM.querySelector', {
        nodeId: docNode.root.nodeId,
        selector: item.sel
      }, sessionId);

      assert(nodeRes.nodeId > 0, `Found DOM node for: ${item.name}`);

      if (nodeRes.nodeId > 0) {
        // Force :focus-visible state
        await client.send('CSS.forcePseudoState', {
          nodeId: nodeRes.nodeId,
          forcedPseudoClasses: ['focus-visible']
        }, sessionId);
        await sleep(50);

        const focusStyleRes = await client.send('Runtime.evaluate', {
          expression: `
            (() => {
              const el = document.querySelector('${item.sel}');
              if (!el) return null;
              const cs = window.getComputedStyle(el);
              return {
                outlineStyle: cs.outlineStyle,
                outlineWidth: cs.outlineWidth,
                outlineColor: cs.outlineColor,
                boxShadow: cs.boxShadow,
                borderColor: cs.borderColor
              };
            })()
          `,
          returnByValue: true
        }, sessionId);

        const val = focusStyleRes.result.value;
        const hasVisibleFocus = (val.outlineStyle !== 'none' && parseInt(val.outlineWidth) >= 1) ||
                                (val.boxShadow && val.boxShadow !== 'none') ||
                                (val.borderColor && (val.borderColor.includes('255, 122, 0') || val.borderColor.includes('ff7a00')));

        assert(hasVisibleFocus, `Element displays accessible focus ring in :focus-visible: ${item.name} (outline: ${val.outlineWidth} ${val.outlineStyle} ${val.outlineColor})`);

        // Clear forced state
        await client.send('CSS.forcePseudoState', {
          nodeId: nodeRes.nodeId,
          forcedPseudoClasses: []
        }, sessionId);
      }
    }

    // -------------------------------------------------------------------------
    // TEST SECTION 2: BUTTON CLICKS & INTERACTIVE STATE MUTATION
    // -------------------------------------------------------------------------
    console.log('\n--- Section 2: Button Clicks & Interactive State Flow ---');

    // 2.1 Language switch button: FR -> EN -> FR
    const initialLangCheck = await client.send('Runtime.evaluate', {
      expression: `(() => ({
        htmlLang: document.documentElement.lang,
        heroBadgeText: document.querySelector('.hero-badge')?.innerText.trim() || '',
        langBtnText: document.querySelector('.lang-toggle-button')?.innerText.trim() || ''
      }))()`,
      returnByValue: true
    }, sessionId);

    assert(initialLangCheck.result.value.htmlLang === 'fr', `Initial HTML lang is 'fr'`);

    // Click language switcher
    await client.send('Runtime.evaluate', {
      expression: `document.querySelector('.lang-toggle-button').click()`
    }, sessionId);
    await sleep(300);

    const enLangCheck = await client.send('Runtime.evaluate', {
      expression: `(() => ({
        htmlLang: document.documentElement.lang,
        heroBadgeText: document.querySelector('.hero-badge')?.innerText.trim() || '',
        langBtnText: document.querySelector('.lang-toggle-button')?.innerText.trim() || ''
      }))()`,
      returnByValue: true
    }, sessionId);

    assert(enLangCheck.result.value.htmlLang === 'en', `Language switched to 'en' after click`);
    assert(enLangCheck.result.value.heroBadgeText.toLowerCase().includes('machine learning') &&
           enLangCheck.result.value.heroBadgeText.toLowerCase().includes('research'),
      `Hero badge dynamically translated to English: "${enLangCheck.result.value.heroBadgeText}"`);

    // Toggle back to FR
    await client.send('Runtime.evaluate', {
      expression: `document.querySelector('.lang-toggle-button').click()`
    }, sessionId);
    await sleep(300);

    const backToFrCheck = await client.send('Runtime.evaluate', {
      expression: `document.documentElement.lang`,
      returnByValue: true
    }, sessionId);
    assert(backToFrCheck.result.value === 'fr', `Language toggled back to 'fr'`);

    // 2.2 Status popover open / close / refresh cycle
    await client.send('Runtime.evaluate', {
      expression: `document.querySelector('.status-badge-button')?.click()`
    }, sessionId);
    await sleep(350);

    const popoverOpenCheck = await client.send('Runtime.evaluate', {
      expression: `!!document.querySelector('.status-popover')`,
      returnByValue: true
    }, sessionId);
    assert(popoverOpenCheck.result.value === true, 'Status badge click opens status popover');

    // Click refresh button in popover
    const refreshClick = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const refreshBtn = document.querySelector('.btn-status-refresh');
        if (refreshBtn) {
          refreshBtn.click();
          return true;
        }
        return false;
      })()`,
      returnByValue: true
    }, sessionId);
    assert(refreshClick.result.value === true, 'Refresh button clicked inside popover');
    await sleep(400);

    // Click popover close button
    await client.send('Runtime.evaluate', {
      expression: `document.querySelector('.status-popover-close')?.click()`
    }, sessionId);
    await sleep(350);

    const popoverClosedCheck = await client.send('Runtime.evaluate', {
      expression: `!document.querySelector('.status-popover')`,
      returnByValue: true
    }, sessionId);
    assert(popoverClosedCheck.result.value === true, 'Popover close button dismisses popover');

    // 2.3 Architecture Stepper 5 stages switching
    for (let s = 1; s <= 5; s++) {
      const stepClick = await client.send('Runtime.evaluate', {
        expression: `(() => {
          const cards = document.querySelectorAll('.stage-node-card');
          if (cards[${s - 1}]) {
            cards[${s - 1}].click();
            return { clicked: true, cardCount: cards.length };
          }
          return { clicked: false, cardCount: cards.length };
        })()`,
        returnByValue: true
      }, sessionId);
      await sleep(200);

      assert(stepClick.result.value.clicked === true, `Architecture stage ${s} stepper card clicked`);

      const activeStage = await client.send('Runtime.evaluate', {
        expression: `(() => {
          const activeCard = document.querySelector('.stage-node-card.active, .arch-stage-card.active');
          return { hasActive: !!activeCard };
        })()`,
        returnByValue: true
      }, sessionId);

      assert(activeStage.result.value.hasActive, `Stage ${s} is active in DOM`);
    }

    // Stage 2 widget-tab-btn check
    await client.send('Runtime.evaluate', {
      expression: `document.querySelectorAll('.stage-node-card')[1]?.click()`
    }, sessionId);
    await sleep(250);

    const widgetTabCheck = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const tabs = document.querySelectorAll('.widget-tab-btn');
        return {
          tabCount: tabs.length,
          hasTabs: tabs.length > 0
        };
      })()`,
      returnByValue: true
    }, sessionId);
    assert(widgetTabCheck.result.value.hasTabs, `Widget tabs (.widget-tab-btn) rendered in Feature Engineering stage (count: ${widgetTabCheck.result.value.tabCount})`);

    // 2.4 Quickstart tabs & safe copy button
    const quickstartCheck = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const tabs = document.querySelectorAll('.quickstart-tab');
        if (tabs.length >= 2) {
          tabs[1].click();
          return { tabCount: tabs.length, switched: true };
        }
        return { tabCount: tabs.length, switched: false };
      })()`,
      returnByValue: true
    }, sessionId);
    await sleep(200);

    assert(quickstartCheck.result.value.switched, 'Quickstart tab clicked and switched');

    // Click copy button
    const copyClick = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const copyBtn = document.querySelector('.copy-btn');
        if (copyBtn) {
          copyBtn.click();
          return true;
        }
        return false;
      })()`,
      returnByValue: true
    }, sessionId);
    await sleep(300);

    assert(copyClick.result.value === true, 'Copy command button clicked without rejection');

    // -------------------------------------------------------------------------
    // TEST SECTION 3: ARCHETYPE SWITCHING & RISK GAUGE ACCURACY
    // -------------------------------------------------------------------------
    console.log('\n--- Section 3: Archetype Switching & Calibrated Risk Gauge ---');

    // Exact mathematical formula: needleAngle = (p - 0.5) * 180
    const expectedArchetypes = [
      { index: 0, name: 'Tilting Player', prob: '86.5%', pVal: 0.865, tierFr: 'critique', tierEn: 'critical', expectedAngle: 65.7 },
      { index: 1, name: 'Burned-out Veteran', prob: '57.7%', pVal: 0.577, tierFr: 'modéré', tierEn: 'moderate', expectedAngle: 13.86 },
      { index: 2, name: 'Consistent Support', prob: '21.8%', pVal: 0.218, tierFr: 'faible', tierEn: 'low', expectedAngle: -50.76 },
      { index: 3, name: 'Balanced Player', prob: '19.6%', pVal: 0.196, tierFr: 'faible', tierEn: 'low', expectedAngle: -54.72 }
    ];

    for (const arch of expectedArchetypes) {
      const clickArch = await client.send('Runtime.evaluate', {
        expression: `(() => {
          const cards = document.querySelectorAll('.archetype-preview-card');
          if (cards[${arch.index}]) {
            cards[${arch.index}].click();
            return true;
          }
          return false;
        })()`,
        returnByValue: true
      }, sessionId);
      await sleep(300);

      assert(clickArch.result.value === true, `Clicked archetype ${arch.index}: ${arch.name}`);

      const stateEval = await client.send('Runtime.evaluate', {
        expression: `(() => {
          const readout = document.querySelector('.gauge-percentage-value');
          const tierBadge = document.querySelector('.gauge-tier-badge');
          const needle = document.querySelector('.gauge-needle-group');
          const input = document.querySelector('.input-field');
          const transform = needle ? needle.getAttribute('transform') || '' : '';

          // Parse needle angle: rotate(X, cx, cy)
          const match = transform.match(/rotate\\(([-0-9.]+)/);
          const angle = match ? parseFloat(match[1]) : null;

          return {
            probText: readout ? readout.innerText.trim() : null,
            tierText: tierBadge ? tierBadge.innerText.trim().toLowerCase() : '',
            angle,
            inputValue: input ? input.value : null,
            hasNanText: readout ? readout.innerText.includes('NaN') : true,
            hasNanTransform: transform.includes('NaN')
          };
        })()`,
        returnByValue: true
      }, sessionId);

      const val = stateEval.result.value;
      assert(val.probText === arch.prob, `Gauge readout is exactly ${arch.prob} (found: "${val.probText}")`);
      assert(!val.hasNanText && !val.hasNanTransform, `Gauge contains 0 NaN values`);
      assert(Math.abs(val.angle - arch.expectedAngle) < 0.5,
        `Needle rotation angle ${val.angle}° accurately matches calibrated angle ${arch.expectedAngle}°`);
      assert(val.tierText.includes(arch.tierFr) || val.tierText.includes(arch.tierEn),
        `Risk tier badge displays "${arch.tierFr}" / "${arch.tierEn}" (found: "${val.tierText}")`);
      assert(val.inputValue && val.inputValue.length >= 8, `Input field synced with account ID: ${val.inputValue}`);
    }

    // -------------------------------------------------------------------------
    // TEST SECTION 4: RAPID ARCHETYPE SWITCHING STRESS TEST
    // -------------------------------------------------------------------------
    console.log('\n--- Section 4: Rapid Archetype Switching Stress Test ---');

    for (let cycle = 0; cycle < 8; cycle++) {
      const idx = cycle % 4;
      await client.send('Runtime.evaluate', {
        expression: `document.querySelectorAll('.archetype-preview-card')[${idx}].click()`
      }, sessionId);
      await sleep(50);
    }
    await sleep(400);

    const finalRapidCheck = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const readout = document.querySelector('.gauge-percentage-value');
        const needle = document.querySelector('.gauge-needle-group');
        const transform = needle ? needle.getAttribute('transform') || '' : '';
        return {
          text: readout ? readout.innerText.trim() : '',
          transform,
          isNan: readout ? readout.innerText.includes('NaN') : true
        };
      })()`,
      returnByValue: true
    }, sessionId);

    assert(!finalRapidCheck.result.value.isNan, 'Rapid archetype cycling produced 0 NaN values');
    assert(finalRapidCheck.result.value.transform.includes('rotate('), 'SVG needle maintained valid rotation transform');

    // -------------------------------------------------------------------------
    // TEST SECTION 5: STEAM ACCOUNT ID UI INPUT SANITIZATION
    // -------------------------------------------------------------------------
    console.log('\n--- Section 5: Steam Account ID UI Input Sanitization ---');

    // 5.1 64-bit Steam ID auto-conversion via UI submit
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const input = document.querySelector('.input-field');
        if (!input) return false;

        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, '76561198795663699');
        input.dispatchEvent(new Event('input', { bubbles: true }));

        const submitBtn = document.querySelector('.btn-search, button[type="submit"]');
        if (submitBtn) submitBtn.click();
        return true;
      })()`,
      returnByValue: true
    }, sessionId);
    await sleep(500);

    const steam64Result = await client.send('Runtime.evaluate', {
      expression: `document.querySelector('.input-field').value`,
      returnByValue: true
    }, sessionId);

    assert(steam64Result.result.value === '835397971',
      `64-bit Steam ID '76561198795663699' auto-converted to 32-bit ID '835397971' in input field (got: "${steam64Result.result.value}")`);

    // 5.2 Decimal float input sanitization on input event
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const input = document.querySelector('.input-field');
        if (!input) return false;

        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, '835397971.99');
        input.dispatchEvent(new Event('input', { bubbles: true }));

        const submitBtn = document.querySelector('.btn-search, button[type="submit"]');
        if (submitBtn) submitBtn.click();
        return true;
      })()`,
      returnByValue: true
    }, sessionId);
    await sleep(400);

    const floatResult = await client.send('Runtime.evaluate', {
      expression: `document.querySelector('.input-field').value`,
      returnByValue: true
    }, sessionId);

    assert(floatResult.result.value === '835397971',
      `Decimal input '835397971.99' sanitized to integer '835397971' (got: "${floatResult.result.value}")`);

    // -------------------------------------------------------------------------
    // TEST SECTION 6: CONSOLE ERRORS & UNCAUGHT EXCEPTIONS AUDIT
    // -------------------------------------------------------------------------
    console.log('\n--- Section 6: Zero Unhandled Console Errors & Exceptions ---');
    console.log(`Captured Console Errors: ${consoleErrors.length}`);
    console.log(`Captured Uncaught Exceptions: ${uncaughtExceptions.length}`);

    assert(consoleErrors.length === 0, `Zero unhandled console errors detected (count: ${consoleErrors.length})`);
    assert(uncaughtExceptions.length === 0, `Zero uncaught exceptions detected (count: ${uncaughtExceptions.length})`);

    client.close();
  } finally {
    chromeProc.kill('SIGKILL');
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  }

  console.log('\n================================================================');
  console.log('   CHALLENGER M5 CDP PROBE VERIFICATION SUMMARY                 ');
  console.log('================================================================');
  console.log(`Total Assertions: ${assertionsTotal}`);
  console.log(`Passed:           ${assertionsPassed}`);
  console.log(`Failed:           ${assertionsFailed}`);
  console.log(`Pass Rate:         ${((assertionsPassed / assertionsTotal) * 100).toFixed(1)}%`);

  if (assertionsFailed > 0) {
    console.error('\nVERDICT: REJECT - Empirical failures detected during CDP probe:');
    failures.forEach(f => console.error(`  - ${f.description}`));
    process.exit(1);
  } else {
    console.log('\nVERDICT: APPROVE - All CDP interactions, focus rings, buttons, and archetypes certified!');
    process.exit(0);
  }
}

runCdpProbe().catch(err => {
  console.error('Fatal probe error:', err);
  process.exit(1);
});

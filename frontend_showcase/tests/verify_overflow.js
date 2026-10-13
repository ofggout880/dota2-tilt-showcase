/**
 * Responsive Rendering & Horizontal Overflow Empirical Test Harness
 * 
 * Target widths: 320px, 768px, 1280px, 2560px
 * Checks:
 * - document.documentElement.scrollWidth <= document.documentElement.clientWidth
 * - document.body.scrollWidth <= document.body.clientWidth
 * - Container-level overflow check (scrollWidth > clientWidth)
 * - Detection of specific elements leaking past viewport boundaries
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const TARGET_WIDTHS = [320, 768, 1280, 2560];
const CDP_PORT = 9447;
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
    } catch {
      // Chrome starting up
    }
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

async function runOverflowTest() {
  console.log('=== STARTING RESPONSIVE OVERFLOW & CONTAINER WIDTH TESTS ===\n');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome_overflow_test_'));

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${tmpDir}`,
    '--disable-gpu',
    '--no-sandbox',
    '--disable-extensions',
    'about:blank'
  ], { stdio: 'ignore' });

  let results = [];
  let hasFailure = false;

  try {
    const wsUrl = await getBrowserWsUrl();
    const client = new CdpClient(wsUrl);

    // Create a new target page
    const target = await client.send('Target.createTarget', { url: APP_URL });
    const targetId = target.targetId;

    const session = await client.send('Target.attachToTarget', { targetId, flatten: true });
    const sessionId = session.sessionId;

    await client.send('Page.enable', {}, sessionId);
    await client.send('Runtime.enable', {}, sessionId);
    await client.send('DOM.enable', {}, sessionId);

    // Wait 1.5s for initial render and fonts
    await sleep(1500);

    for (const width of TARGET_WIDTHS) {
      console.log(`\n======================================================`);
      console.log(`--- Testing Viewport Width: ${width}px ---`);
      console.log(`======================================================`);

      // Set device metrics
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: width,
        height: 900,
        deviceScaleFactor: 1,
        mobile: width <= 768
      }, sessionId);

      await sleep(500);

      // Evaluate container overflow and leaking elements
      const evalScript = `
        (() => {
          const docEl = document.documentElement;
          const body = document.body;
          const winWidth = window.innerWidth;
          const docScrollW = docEl.scrollWidth;
          const docClientW = docEl.clientWidth;
          const bodyScrollW = body.scrollWidth;
          const bodyClientW = body.clientWidth;

          // Check named containers
          const containerSelectors = [
            'header.navbar-container',
            'div.navbar-inner',
            'div.navbar-actions',
            'div.navbar-brand',
            'div.container',
            'div.hero-content',
            'div.hero-highlights-row',
            'div.grid-kpi',
            'div.grid-3',
            'div.grid-4',
            'div.footer-inner',
            'div.footer-grid',
            'div.footer-bottom'
          ];

          const containerAudit = [];
          containerSelectors.forEach(sel => {
            const els = document.querySelectorAll(sel);
            els.forEach(el => {
              const overflow = el.scrollWidth > el.clientWidth;
              containerAudit.push({
                selector: sel,
                scrollWidth: el.scrollWidth,
                clientWidth: el.clientWidth,
                rectWidth: Math.round(el.getBoundingClientRect().width),
                rectRight: Math.round(el.getBoundingClientRect().right),
                hasInternalOverflow: overflow,
                exceedsViewport: el.getBoundingClientRect().right > winWidth + 1
              });
            });
          });

          // Check all DOM elements leaking past viewport
          const leakingElements = [];
          const allEls = document.querySelectorAll('*');
          allEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > winWidth + 1.5) {
              leakingElements.push({
                tag: el.tagName.toLowerCase(),
                id: el.id || null,
                className: el.className || null,
                rectRight: Math.round(rect.right),
                rectWidth: Math.round(rect.width),
                excessPx: Math.round(rect.right - winWidth)
              });
            }
          });

          const overflowingContainers = containerAudit.filter(c => c.hasInternalOverflow || c.exceedsViewport);

          return {
            winWidth,
            docScrollW,
            docClientW,
            bodyScrollW,
            bodyClientW,
            hasDocOverflow: docScrollW > docClientW,
            hasBodyOverflow: bodyScrollW > bodyClientW,
            containerAudit,
            overflowingContainers,
            leakingElementsCount: leakingElements.length,
            leakingElements: leakingElements.slice(0, 10)
          };
        })()
      `;

      const evalRes = await client.send('Runtime.evaluate', {
        expression: evalScript,
        returnByValue: true
      }, sessionId);

      const data = evalRes.result.value;
      const passed = !data.hasDocOverflow && !data.hasBodyOverflow && data.leakingElementsCount === 0 && data.overflowingContainers.length === 0;
      results.push({ width, passed, data });

      console.log(`Document: scrollWidth=${data.docScrollW}px, clientWidth=${data.docClientW}px (Doc Overflow: ${data.hasDocOverflow ? '⚠️ YES' : '✅ NO'})`);
      console.log(`Body:     scrollWidth=${data.bodyScrollW}px, clientWidth=${data.bodyClientW}px (Body Overflow: ${data.hasBodyOverflow ? '⚠️ YES' : '✅ NO'})`);
      console.log(`Containers audited: ${data.containerAudit.length} | Overflowing containers: ${data.overflowingContainers.length}`);
      console.log(`Leaking elements past right edge: ${data.leakingElementsCount}`);

      if (data.overflowingContainers.length > 0) {
        hasFailure = true;
        console.error(`\n⚠️ OVERFLOWING / EXCEEDING CONTAINERS AT ${width}px:`);
        data.overflowingContainers.forEach(c => {
          console.error(`  - ${c.selector}: scrollW=${c.scrollWidth}px, clientW=${c.clientWidth}px, right=${c.rectRight}px (viewport: ${data.winWidth}px)`);
        });
      }

      if (data.leakingElementsCount > 0) {
        hasFailure = true;
        console.error(`\n⚠️ LEAKING ELEMENTS AT ${width}px:`);
        data.leakingElements.forEach((el, idx) => {
          console.error(`  [${idx + 1}] <${el.tag} class="${el.className}"> width=${el.rectWidth}px, right=${el.rectRight}px (+${el.excessPx}px past viewport)`);
        });
      }

      if (passed) {
        console.log(`\n✅ ${width}px viewport PASSED cleanly.`);
      }
    }

    client.close();
  } finally {
    chromeProc.kill('SIGKILL');
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  }

  console.log('\n======================================================');
  console.log('=== OVERFLOW & CONTAINER AUDIT FINAL SUMMARY ===');
  console.log('======================================================');
  results.forEach(r => {
    console.log(`- ${r.width}px: ${r.passed ? '✅ PASSED' : '❌ FAILED'}`);
  });

  if (hasFailure) {
    console.error('\nVERDICT: FAIL - Rendering anomalies & horizontal overflow detected.');
    process.exit(1);
  } else {
    console.log('\nVERDICT: PASS - Zero overflow across all target widths.');
    process.exit(0);
  }
}

runOverflowTest().catch(err => {
  console.error('Test harness exception:', err);
  process.exit(1);
});

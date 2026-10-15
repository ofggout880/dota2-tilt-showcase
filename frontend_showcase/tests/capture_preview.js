import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CDP_PORT = 9448;
const APP_URL = 'http://127.0.0.1:5173/';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUTPUT_DIR = '/Users/matthieugout/.gemini/antigravity/brain/b07fcd35-cdb2-4bd0-ace0-b2c97667ba00';

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
  throw new Error('Failed to connect to Chrome');
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

  send(method, params = {}, sessionId = undefined) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      const payload = { id, method, params };
      if (sessionId) payload.sessionId = sessionId;
      this.ws.send(JSON.stringify(payload));
    });
  }

  close() {
    this.ws.close();
  }
}

async function capture() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-preview-'));
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${tmpDir}`,
    '--no-first-run',
    '--disable-gpu',
    '--window-size=1400,1200'
  ]);

  try {
    const wsUrl = await getBrowserWsUrl();
    const client = new CdpClient(wsUrl);
    await client.ready;

    const { targetId } = await client.send('Target.createTarget', { url: APP_URL });
    const { sessionId } = await client.send('Target.attachToTarget', {
      targetId,
      flatten: true
    });

    await client.send('Page.enable', {}, sessionId);
    await sleep(2000);

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1400,
      height: 1200,
      deviceScaleFactor: 2,
      mobile: false
    }, sessionId);

    await sleep(1000);

    const { data: heroScreenshot } = await client.send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 1400, height: 1100, scale: 1 }
    }, sessionId);

    fs.writeFileSync(path.join(OUTPUT_DIR, 'current_hero_preview.png'), Buffer.from(heroScreenshot, 'base64'));
    console.log('Saved current_hero_preview.png');

    const getRectScript = `(() => {
      const hero = document.querySelector('.sculpted-showcase-frame');
      const kpis = document.getElementById('kpis');
      const heroRect = hero ? hero.getBoundingClientRect() : null;
      const kpiRect = kpis ? kpis.getBoundingClientRect() : null;
      return {
        hero: heroRect ? { x: heroRect.x, y: heroRect.y + window.scrollY, width: heroRect.width, height: heroRect.height } : null,
        kpi: kpiRect ? { x: kpiRect.x, y: kpiRect.y + window.scrollY, width: kpiRect.width, height: kpiRect.height } : null
      };
    })()`;

    const rects = (await client.send('Runtime.evaluate', { expression: getRectScript, returnByValue: true }, sessionId)).result.value;
    console.log('Element coordinates:', rects);

    if (rects.hero) {
      const { data: heroFrameShot } = await client.send('Page.captureScreenshot', {
        format: 'png',
        clip: { x: Math.max(0, rects.hero.x - 20), y: Math.max(0, rects.hero.y - 20), width: rects.hero.width + 40, height: rects.hero.height + 40, scale: 1 }
      }, sessionId);
      fs.writeFileSync(path.join(OUTPUT_DIR, 'current_hero_frame.png'), Buffer.from(heroFrameShot, 'base64'));
      console.log('Saved current_hero_frame.png');
    }

    const secScript = `(() => {
      const getPos = (id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y + window.scrollY, width: r.width, height: r.height };
      };
      return {
        pipeline: getPos('architecture') || getPos('pipeline'),
        psychology: getPos('psychology'),
        benchmark: getPos('benchmark'),
        simulator: getPos('simulator')
      };
    })()`;

    const secPos = (await client.send('Runtime.evaluate', { expression: secScript, returnByValue: true }, sessionId)).result.value;

    for (const [key, pos] of Object.entries(secPos)) {
      if (pos) {
        const { data: shot } = await client.send('Page.captureScreenshot', {
          format: 'png',
          captureBeyondViewport: true,
          clip: {
            x: 0,
            y: Math.max(0, pos.y - 20),
            width: 1400,
            height: Math.min(850, pos.height + 40),
            scale: 1
          }
        }, sessionId);
        fs.writeFileSync(path.join(OUTPUT_DIR, `current_${key}_preview.png`), Buffer.from(shot, 'base64'));
        console.log(`Saved current_${key}_preview.png`);
      }
    }

    client.close();
  } finally {
    chromeProc.kill('SIGKILL');
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  }
}

capture().catch(console.error);

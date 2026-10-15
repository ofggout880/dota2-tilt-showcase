import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CDP_PORT = 9456;
const APP_URL = 'http://127.0.0.1:5173/';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACTS_DIR = '/Users/matthieugout/.gemini/antigravity/brain/b07fcd35-cdb2-4bd0-ace0-b2c97667ba00';

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

async function main() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-burger-preview-'));
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${tmpDir}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,900',
    'about:blank'
  ], { stdio: 'ignore' });

  try {
    const wsUrl = await getBrowserWsUrl();
    const client = new CdpClient(wsUrl);

    const target = await client.send('Target.createTarget', { url: APP_URL });
    const session = await client.send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const sessionId = session.sessionId;

    await client.send('Page.enable', {}, sessionId);
    await client.send('DOM.enable', {}, sessionId);
    await client.send('Runtime.enable', {}, sessionId);

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    }, sessionId);

    await sleep(2000);

    // 1. Screenshot of clean unboxed Navbar
    const navShot = await client.send('Page.captureScreenshot', { format: 'png' }, sessionId);
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'navbar_clean_preview.png'), Buffer.from(navShot.data, 'base64'));
    console.log('Saved navbar_clean_preview.png');

    // 2. Click the 3-line hamburger menu button
    await client.send('Runtime.evaluate', {
      expression: `
        const btn = document.querySelector('.burger-menu-btn');
        if (btn) btn.click();
      `
    }, sessionId);
    await sleep(600);

    // Screenshot of open Burger Drawer
    const burgerShot = await client.send('Page.captureScreenshot', { format: 'png' }, sessionId);
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'burger_drawer_preview.png'), Buffer.from(burgerShot.data, 'base64'));
    console.log('Saved burger_drawer_preview.png');

    // 3. Click "Consulter le lexique" inside the burger drawer
    await client.send('Runtime.evaluate', {
      expression: `
        const dictBtn = document.querySelector('.burger-dict-card');
        if (dictBtn) dictBtn.click();
      `
    }, sessionId);
    await sleep(600);

    // Screenshot of transitioned Dictionary Drawer
    const dictShot = await client.send('Page.captureScreenshot', { format: 'png' }, sessionId);
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'dictionary_drawer_preview.png'), Buffer.from(dictShot.data, 'base64'));
    console.log('Saved dictionary_drawer_preview.png');

    client.close();
  } finally {
    chromeProcess.kill();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});

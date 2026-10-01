import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
const page = pages.find((item) => item.type === 'page' && item.url.includes('127.0.0.1:5173'));
if (!page) throw new Error('MRS page was not found in the Chrome debugging session.');

const socket = new WebSocket(page.webSocketDebuggerUrl);
const pending = new Map();
let requestId = 0;

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
};

await new Promise((resolve, reject) => {
  socket.onopen = resolve;
  socket.onerror = reject;
});

const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++requestId;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

const wait = (milliseconds = 300) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const evaluate = async (expression) => {
  const response = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
  return response.result.value;
};

const clickButton = async (label) => {
  const result = await evaluate(`(() => {
    const target = [...document.querySelectorAll('button')].find((button) =>
      button.textContent.replace(/\\s+/g, ' ').trim().includes(${JSON.stringify(label)}) ||
      button.title.includes(${JSON.stringify(label)})
    );
    if (!target) return false;
    target.click();
    return true;
  })()`);
  await wait();
  return result;
};

const capture = async (name) => {
  const result = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
  });
  const target = path.join(os.tmpdir(), `mrs-${name}.png`);
  fs.writeFileSync(target, Buffer.from(result.data, 'base64'));
  return target;
};

const inspect = () => evaluate(`(() => {
  const root = document.documentElement;
  const body = document.body;
  const visible = (element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
  };
  const whiteSurfaces = [...document.querySelectorAll('*')].filter((element) => {
    if (!visible(element)) return false;
    const color = getComputedStyle(element).backgroundColor;
    return color === 'rgb(255, 255, 255)' || color === 'rgba(255, 255, 255, 1)';
  }).length;
  return {
    theme: root.classList.contains('light') ? 'light' : 'dark',
    title: document.querySelector('main h1, main h2')?.textContent?.trim() || '',
    bodyBackground: getComputedStyle(body).backgroundColor,
    pageBackground: getComputedStyle(document.querySelector('#root > div')).backgroundColor,
    whiteSurfaces,
    horizontalOverflow: root.scrollWidth - root.clientWidth,
    buttons: [...document.querySelectorAll('header button')].filter(visible).map((button) => ({
      text: button.textContent.replace(/\\s+/g, ' ').trim(),
      title: button.title,
    })),
  };
})()`);

const report = [];
const record = async (name) => {
  report.push({ name, ...(await inspect()), screenshot: await capture(name) });
};

await evaluate("localStorage.setItem('mrs-theme', 'dark'); location.reload()");
await wait(700);
await record('general-dark-fixed');
await clickButton('Switch to Light Mode');
await record('general-light-fixed');
await clickButton('General User');
await clickButton('System Super Admin');
await record('superadmin-light-fixed');
await clickButton('Audit');
await record('audit-light-fixed');
await clickButton('Switch to Dark Mode');
await record('audit-dark-fixed');
await clickButton('Open navigation menu');
await record('sidebar-dark-fixed');
await clickButton('Users Directory');
await record('users-dark-fixed');

const searchOpened = await evaluate(`(() => {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
  return true;
})()`);
await wait();
report.push({ name: 'search-shortcut', searchOpened, dialogVisible: await evaluate("Boolean(document.querySelector('[placeholder^=\\\"Search tickets\\\"]'))") });
await evaluate("window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))");
await wait();
report.push({ name: 'search-escape', dialogVisible: await evaluate("Boolean(document.querySelector('[placeholder^=\\\"Search tickets\\\"]'))") });

await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await clickButton('System Super Admin');
await clickButton('General User');
await clickButton('Switch to Light Mode');
await record('general-mobile-light-fixed');
await clickButton('Open navigation menu');
await record('sidebar-mobile-light-fixed');

await send('Emulation.clearDeviceMetricsOverride');
await clickButton('Sign Out');
await record('login-light-fixed');
await clickButton('Switch to Dark Mode');
await record('login-dark-fixed');
await clickButton('Sign In with University');

console.log(JSON.stringify(report, null, 2));
socket.close();

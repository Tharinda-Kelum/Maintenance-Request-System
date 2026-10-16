import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import http from 'node:http';

// A real backend, MongoDB database, and Vite proxy are used. Live portal data is never modified.
const backend = path.resolve(process.env.BACKEND_DIR || '../backend');
const requireBackend = createRequire(path.join(backend, 'package.json'));
const databaseName = `maintenance_browser_${Date.now()}_${randomBytes(3).toString('hex')}`;
const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'maintenance-browser-'));
const reservation = http.createServer();
reservation.listen(0, '127.0.0.1');
await new Promise((resolve) => reservation.once('listening', resolve));
const frontendPort = reservation.address().port;
const frontendUrl = `http://127.0.0.1:${frontendPort}`;
await new Promise((resolve) => reservation.close(resolve));
process.env.MONGODB_URI = `${process.env.TEST_MONGODB_BASE || 'mongodb://127.0.0.1:27017'}/${databaseName}`;
process.env.JWT_SECRET = randomBytes(48).toString('hex');
process.env.SEED_PASSWORD = 'Browser@1234';
process.env.UPLOAD_DIR = path.join(temporaryDirectory, 'uploads');
process.env.FRONTEND_ORIGIN = frontendUrl;
const mongoose = requireBackend('mongoose');
const app = requireBackend('./src/app');
const { seed } = requireBackend('./src/seed');
const pause = (milliseconds = 120) => new Promise((resolve) => setTimeout(resolve, milliseconds));
let server;
let vite;
let socket;
let secondarySocket;
let secondaryTarget;
let secondaryContext;
let browserSocket;
let browserCommandId = 0;
const browserSend = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++browserCommandId;
  browserSocket.onmessage = ({ data }) => { const message = JSON.parse(data); if (message.id !== id) return; if (message.error) reject(new Error(message.error.message)); else resolve(message.result); };
  browserSocket.send(JSON.stringify({ id, method, params }));
});
const errors = [];
const pending = new Map();
let nextId = 0;
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++nextId; pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
};
const waitFor = async (expression, message, timeout = 12000) => {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await evaluate(expression)) return;
    await pause(80);
  }
  throw new Error(`Timed out: ${message}. Page: ${(await evaluate('document.body.innerText')).slice(0, 1400)}`);
};
const check = (text) => waitFor(`document.body.innerText.includes(${JSON.stringify(text)})`, text);
const click = async (label, selector = 'button') => {
  const expression = `(() => { const button = [...document.querySelectorAll(${JSON.stringify(selector)})].find((item) => item.getClientRects().length && !item.disabled && (item.textContent.replace(/\\s+/g,' ').trim() === ${JSON.stringify(label)} || item.getAttribute('aria-label') === ${JSON.stringify(label)} || item.title === ${JSON.stringify(label)})); if (!button) return false; button.click(); return true; })()`;
  await waitFor(expression, `click ${label}`); await pause();
};
const fill = async (selector, value) => {
  await waitFor(`Boolean(document.querySelector(${JSON.stringify(selector)}))`, selector);
  await evaluate(`(() => { const input = document.querySelector(${JSON.stringify(selector)}); const prototype = input.tagName === 'SELECT' ? HTMLSelectElement.prototype : input.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(prototype,'value').set.call(input,${JSON.stringify(value)}); input.dispatchEvent(new Event(input.tagName === 'SELECT' ? 'change' : 'input',{bubbles:true})); })()`); await pause();
};
const chooseFirst = async (selector) => {
  const value = await evaluate(`([...document.querySelector(${JSON.stringify(selector)}).options].find((option) => option.value && !option.disabled))?.value`);
  assert(value, `Option available: ${selector}`); await fill(selector, value);
};
const snapshot = async (name) => {
  await pause(200);
  const overflow = await evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth');
  if (overflow > 1) console.log(await evaluate('JSON.stringify([...document.querySelectorAll("*")].filter((e)=>e.getBoundingClientRect().right>document.documentElement.clientWidth+1).map((e)=>({tag:e.tagName,class:e.className,text:e.textContent.slice(0,60)})).slice(0,12))'));
  assert(overflow <= 1, `${name}: no horizontal page overflow (${overflow}px)`);
  const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const file = path.join(temporaryDirectory, `${name}.png`);
  fs.writeFileSync(file, Buffer.from(screenshot.data, 'base64'));
  console.log(`PASS ${name}: ${file}`);
};
const login = async (username, password = 'Browser@1234') => {
  await fill('input[autocomplete="username"]', username);
  await fill('input[autocomplete="current-password"]', password);
  await click('Sign In to Maintenance System');
  await waitFor('Boolean(document.querySelector("main h1")) && !document.body.innerText.includes("Loading your maintenance workspace")', `${username} workspace loaded`);
};
const logout = async () => { await click('Open navigation menu'); await click('Sign out'); await waitFor('Boolean(document.querySelector("input[autocomplete=username]"))', 'signed out'); };
const openMenuPage = async (label) => { await click('Open navigation menu'); await click(label, '.sidebar-links button'); await pause(); };
const mobile = () => send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
const desktop = () => send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });

try {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  await seed();
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const apiTarget = `http://127.0.0.1:${server.address().port}`;
  const directLogin = await fetch(`${apiTarget}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: frontendUrl }, body: JSON.stringify({ username: 'user', password: 'Browser@1234' }) });
  assert.equal(directLogin.status, 200, `Test backend accepts the test frontend origin: ${await directLogin.text()}`);
  vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(frontendPort), '--strictPort'], { cwd: process.cwd(), env: { ...process.env, API_PROXY_TARGET: apiTarget, VITE_API_URL: '/api' }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  let viteOutput = '';
  vite.stdout.on('data', (chunk) => { viteOutput += chunk; }); vite.stderr.on('data', (chunk) => { viteOutput += chunk; });
  const deadline = Date.now() + 15000;
  let ready = false;
  while (Date.now() < deadline) { try { const response = await fetch(`${frontendUrl}/api/health`); if ((await response.json()).database === 'connected') { ready = true; break; } } catch {} await pause(150); }
  assert(ready, `Test Vite proxy is ready: ${viteOutput}`);
  const proxyLogin = await fetch(`${frontendUrl}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: frontendUrl }, body: JSON.stringify({ username: 'user', password: 'Browser@1234' }) });
  assert.equal(proxyLogin.status, 200, `Vite proxies to ${apiTarget}: ${await proxyLogin.text()} ${viteOutput}`);
  const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
  const page = pages.find((item) => item.type === 'page' && /127\.0\.0\.1:517[34]/.test(item.url));
  assert(page, 'Open the local app in Chrome with remote debugging on port 9222.');
  socket = new WebSocket(page.webSocketDebuggerUrl);
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
    if (!pending.has(message.id)) return;
    const handlers = pending.get(message.id); pending.delete(message.id);
    if (message.error) handlers.reject(new Error(message.error.message)); else handlers.resolve(message.result);
  };
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  await send('Page.enable'); await send('Runtime.discardConsoleEntries'); await send('Runtime.enable'); await desktop();
  await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: temporaryDirectory });
  await send('Page.navigate', { url: frontendUrl }); await pause(500);
  await evaluate("localStorage.setItem('mrs-theme','light'); fetch('/api/auth/logout',{method:'POST',credentials:'include'}).then(()=>location.reload())"); await pause(600);
  await login('user'); await check('Something needs fixing?'); await snapshot('connected-staff-desktop');
  await click('New request', 'nav button');
  await fill('#issue-title', 'Browser check: damaged seminar-room light'); await fill('#issue-category', 'Electrical'); await fill('#issue-description', 'The seminar-room light is damaged and needs inspection.');
  await evaluate(`(() => { const transfer = new DataTransfer(); transfer.items.add(new File([Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j0z0AAAAASUVORK5CYII='),c=>c.charCodeAt(0))],'evidence.png',{type:'image/png'})); const input=document.querySelector('input[type=file]'); input.files=transfer.files; input.dispatchEvent(new Event('change',{bubbles:true})); })()`); await check('evidence.png');
  await click('Continue'); await fill('#location-notes', 'Near the west window'); await click('Continue'); await click('Send request'); await check('We have received your request');
  const requestId = await evaluate('document.querySelector(".confirmation-reference strong").textContent');
  await click('Track my request'); await check('Awaiting HOD approval'); await check('Near the west window');
  await click('Preview'); await waitFor('document.querySelector("[role=dialog] img")?.naturalWidth>0', 'protected image preview'); await click('Close attachment preview');
  await fill('textarea[aria-label="Message to the maintenance team"]', 'Please check the west-side light.'); await click('Send message'); await check('Please check the west-side light.');
  await mobile(); await snapshot('connected-request-mobile'); await desktop();
  await logout(); await login('deptadmin'); await check('Department requests'); await click('Review request'); await chooseFirst('#workflow-action select'); await fill('#workflow-action textarea', 'Department approval recorded.'); await click('Approve request'); await waitFor('!document.querySelector("#workflow-action")', 'HOD review saved'); await snapshot('connected-hod-desktop');
  await logout(); await login('dean'); await check('Faculty approvals'); await click('Review request'); await click('Approve request'); await waitFor('!document.querySelector("#workflow-action")', 'Dean review saved');
  await mobile(); await snapshot('connected-dean-mobile'); await desktop();
  await logout(); await login('head'); await check('Maintenance coordination'); await click('Choose supervisor'); await chooseFirst('#workflow-action select'); await click('Choose supervisor', '[role=dialog] button'); await waitFor('!document.querySelector("#workflow-action")', 'supervisor selected');
  await logout(); await login('supervisor'); await check('My supervised requests'); await click('Assign technician'); await chooseFirst('#workflow-action select'); await click('Assign technician', '[role=dialog] button'); await waitFor('!document.querySelector("#workflow-action")', 'technician assigned');
  await logout(); await login('technician'); await check('My tasks'); await openMenuPage('Parts requests'); await click('Request parts'); await chooseFirst('#request-parts select');
  const itemValue = await evaluate('([...document.querySelectorAll("#request-parts select")[1].options].find(option=>/— (\\d+) available/.test(option.textContent)&&Number(option.textContent.match(/— (\\d+) available/)[1])>0))?.value');
  assert(itemValue, 'Available stock item'); await fill('#request-parts label:nth-child(2) select', itemValue); await click('Send parts request'); await check('Pending');
  await click('My tasks', 'nav button'); await click('Inspect & report'); await fill('#inspection-findings', 'Faulty lamp holder. Replace and test the circuit.'); await fill('#inspection-materials', 'One replacement holder and isolation arrangements.'); await fill('#inspection-hours', '1.5');
  await click('Add material'); await chooseFirst('.material-row select'); await fill('.material-row input', '2');
  const firstMaterial = await evaluate('document.querySelector(".material-row select").value');
  await click('Add material'); await chooseFirst('.material-row:nth-of-type(2) select'); await fill('.material-row:nth-of-type(2) input', '3');
  assert(await evaluate(`document.querySelectorAll('.material-row select')[1].querySelector('option[value="${firstMaterial}"]').disabled`), 'Duplicate material selection is disabled');
  await mobile(); await snapshot('connected-inspection-mobile'); await click('Send inspection report'); await check('Inspection report sent');
  assert(!(await evaluate('document.body.innerText')).includes('Complete request'), 'Technician does not close the request');
  await desktop(); await logout(); await login('storekeeper'); await click('Parts to issue', 'nav button'); await click('Approve & Issue'); await check('Issued'); await snapshot('connected-stores-desktop');
  await logout(); await login('supervisor'); await click('Send materials to technician');
  assert.equal(await evaluate('document.querySelectorAll(".material-row").length'), 2, 'Supervisor receives both inspection materials');
  assert.equal(await evaluate('document.querySelector(".material-row input").value'), '2');
  assert.equal(await evaluate('Boolean(document.querySelector("#workflow-action textarea"))'), false, 'Supervisor material handoff does not require people or arrangement notes');
  // Change the shared cookie from another real tab without announcing it: the mutation guard must reject the stale account.
  secondaryTarget = (await send('Target.createTarget', { url: frontendUrl })).targetId;
  await pause(700);
  const targets = await (await fetch('http://127.0.0.1:9222/json')).json();
  secondarySocket = new WebSocket(targets.find((target) => target.id === secondaryTarget).webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { secondarySocket.onopen = resolve; secondarySocket.onerror = reject; });
  let secondaryId = 0;
  const secondaryEvaluate = (expression) => new Promise((resolve, reject) => {
    const id = ++secondaryId;
    secondarySocket.onmessage = ({ data }) => { const message = JSON.parse(data); if (message.id !== id) return; if (message.error || message.result.exceptionDetails) reject(new Error(JSON.stringify(message))); else resolve(message.result.result.value); };
    secondarySocket.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression, awaitPromise: true, returnByValue: true } }));
  });
  assert.equal(await secondaryEvaluate(`fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'technician',password:'Browser@1234'})}).then(r=>r.status)`), 200);
  await click('Send materials to technician', '[role=dialog] button'); await check('My tasks');
  assert.equal(await evaluate('Boolean(document.querySelector("#workflow-action"))'), false, 'Stale supervisor form is removed after account mismatch');
  assert.equal(await secondaryEvaluate(`fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'supervisor',password:'Browser@1234'})}).then(r=>{localStorage.setItem('mrs:account-change',String(Date.now()));return r.status})`), 200);
  await check('My supervised requests');
  await send('Target.closeTarget', { targetId: secondaryTarget }); secondaryTarget = null; secondarySocket.close(); secondarySocket = null;
  console.log('PASS real multi-tab cookie changes: stale actions blocked, active account synchronized, old form removed');
  // Keep the technician's waiting screen open in a separate browser profile while the supervisor sends materials.
  const browserVersion = await (await fetch('http://127.0.0.1:9222/json/version')).json();
  browserSocket = new WebSocket(browserVersion.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { browserSocket.onopen = resolve; browserSocket.onerror = reject; });
  secondaryContext = (await browserSend('Target.createBrowserContext')).browserContextId;
  secondaryTarget = (await browserSend('Target.createTarget', { url: frontendUrl, browserContextId: secondaryContext })).targetId;
  await pause(700);
  const isolatedTargets = await (await fetch('http://127.0.0.1:9222/json')).json();
  secondarySocket = new WebSocket(isolatedTargets.find((target) => target.id === secondaryTarget).webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { secondarySocket.onopen = resolve; secondarySocket.onerror = reject; });
  const secondaryWait = async (expression) => {
    const limit = Date.now() + 6000;
    while (Date.now() < limit) { if (await secondaryEvaluate(expression)) return; await pause(80); }
    throw new Error(`Technician refresh timed out: ${await secondaryEvaluate('document.body.innerText')}`);
  };
  assert.equal(await secondaryEvaluate(`fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'technician',password:'Browser@1234'})}).then(r=>r.status)`), 200);
  await secondaryEvaluate('location.reload()');
  await secondaryWait('Boolean([...document.querySelectorAll("nav button")].find(button=>button.textContent.includes("Parts requests")))');
  await secondaryEvaluate('[...document.querySelectorAll("nav button")].find(button=>button.textContent.includes("Parts requests")).click()');
  await secondaryWait('Boolean([...document.querySelectorAll("button")].find(button=>button.textContent.includes("Open request")))');
  await secondaryEvaluate('[...document.querySelectorAll("button")].find(button=>button.textContent.includes("Open request")).click()');
  await secondaryWait('document.body.innerText.includes("Inspection report sent")');
  await send('Page.bringToFront');
  await click('Send materials to technician'); await fill('.material-row input', '4');
  await mobile(); await snapshot('connected-arrangement-materials-mobile'); await desktop();
  assert.equal(await evaluate('Boolean(document.querySelector("#workflow-action textarea"))'), false, 'Material handoff has no arrangement notes field'); await click('Send materials to technician', '[role=dialog] button'); await waitFor('!document.querySelector("#workflow-action")', 'arrangements recorded');
  assert(!(await evaluate('document.body.innerText')).includes('Check & rate work'), 'Supervisor cannot review before technician report');
  await browserSend('Target.activateTarget', { targetId: secondaryTarget });
  await secondaryEvaluate('window.dispatchEvent(new Event("focus"))');
  await secondaryWait('Boolean(document.querySelector("#completion-report-form"))');
  assert(await secondaryEvaluate('document.body.innerText.includes("Materials from supervisor") && !document.body.innerText.includes("The inspection report is ready.")'), 'Previously open technician screen shows sent materials without re-login or page reload');
  console.log('PASS previously open technician task refreshes after supervisor material handoff without notes');
  secondarySocket.close(); secondarySocket = null;
  await browserSend('Target.disposeBrowserContext', { browserContextId: secondaryContext }); secondaryContext = null; secondaryTarget = null;
  browserSocket.close(); browserSocket = null;
  await send('Page.bringToFront');
  await logout(); await login('technician'); await click('Complete work & report'); await check('Materials from supervisor');
  assert.equal(await evaluate('document.querySelectorAll("#completion-report-form .material-row").length'), 2, 'Arranged materials appear in technician work report');
  assert.equal(await evaluate('document.querySelector("#completion-report-form .material-row input").value'), '0', 'Actual usage starts at zero');
  await fill('#completed-work', 'Lamp holder replaced, circuit tested, and the room returned to service.');
  await fill('#actual-hours', '0'); await fill('#actual-minutes', '0'); await click('Submit completion report'); await check('Enter the actual work time');
  await fill('#actual-hours', '1'); await fill('#actual-minutes', '15'); await fill('#completion-report-form .material-row input', '2');
  await fill('#material-usage-notes', 'Second arranged item was not used.');
  await mobile(); await evaluate('document.querySelector("#completion-report-form").scrollIntoView()'); await snapshot('connected-technician-completion-mobile'); await desktop();
  await click('Submit completion report'); await waitFor('!document.querySelector("#completion-report-form")', 'completion report submitted');
  await check('Awaiting supervisor verification'); await check('1 hr 15 min'); await check('Second arranged item was not used.');
  await logout(); await login('supervisor'); await click('Check & rate work'); await check('Technician completion report'); await check('1 hr 15 min');
  assert.equal(await evaluate('document.querySelector(".material-usage-table tbody tr td").textContent'), '4', 'Supervisor sees arranged quantity');
  assert.equal(await evaluate('document.querySelectorAll(".material-usage-table tbody tr td")[1].textContent'), '2', 'Supervisor sees actual quantity');
  await fill('#workflow-action textarea', 'Checked the repair, actual duration, and material usage. Work is safe and satisfactory.');
  await click('Confirm & close request'); assert(await evaluate('Boolean(document.querySelector("#workflow-action"))'), 'Rating and verification are required');
  await evaluate(`document.querySelector('.rating-options input[value="4"]').click()`);
  await evaluate('document.querySelector(".verification-confirmation input").click()');
  await mobile();
  assert(await evaluate('document.querySelector("#workflow-action").parentElement.scrollWidth - document.querySelector("#workflow-action").parentElement.clientWidth <= 1'), 'Supervisor review has no internal horizontal overflow');
  await evaluate('document.querySelector(".work-rating").scrollIntoView()'); await snapshot('connected-supervisor-rating-mobile'); await desktop();
  assert(await evaluate('document.querySelector("[role=dialog]").getBoundingClientRect().top >= 0 && document.querySelector("[role=dialog]").getBoundingClientRect().bottom <= innerHeight'), 'Report dialog fits the viewport');
  await click('Confirm & close request'); await waitFor('!document.querySelector("#workflow-action")', 'supervisor verification saved'); await snapshot('connected-supervisor-desktop');
  await logout(); await login('user'); await check('Completed'); await evaluate('document.querySelector(".request-row").click()'); await check('Lamp holder replaced, circuit tested'); await snapshot('connected-completed-request-desktop');
  await check('Arranged materials'); assert(await evaluate('document.querySelector(".inspection-report").innerText.includes(": 2")'), 'Original technician quantities remain visible');
  await check('Supervisor rating: 4/5'); await check('1 hr 15 min'); await check('Checked the repair, actual duration');
  await send('Page.reload'); await waitFor('Boolean(document.querySelector("main .portal-page"))', 'session survives reload'); await check('Something needs fixing?');
  await click('My requests', 'nav button'); await fill('input[type=search]', requestId); await check('1 request found'); await click('Export CSV'); await pause(300); assert(fs.readFileSync(path.join(temporaryDirectory, 'maintenance-requests.csv'),'utf8').includes(requestId));
  await click('Updates', 'nav button'); await click('Mark All as Read'); await waitFor('document.querySelector(".notification-button")?.getAttribute("aria-label")==="Notifications, 0 unread"', 'notification read count saved');
  await mobile(); await snapshot('connected-updates-mobile'); await click('My profile'); await snapshot('connected-profile-mobile');
  await fill('input[autocomplete=current-password]', 'Browser@1234'); await fill('input[autocomplete=new-password]', 'ChangedBrowser@1234');
  await evaluate(`(() => {const field=document.querySelectorAll('input[autocomplete=new-password]')[1];Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(field,'ChangedBrowser@1234');field.dispatchEvent(new Event('input',{bubbles:true}));})()`); await click('Change password','form button'); await check('Password changed successfully.');
  await logout(); await login('user', 'ChangedBrowser@1234'); await check('Something needs fixing?');
  await openMenuPage('Campus locations'); await snapshot('connected-locations-mobile'); await desktop();
  await logout(); await login('admin'); await check('Maintenance overview'); await click('Export CSV'); await pause(300); assert(fs.readFileSync(path.join(temporaryDirectory,'maintenance-summary.csv'),'utf8').includes('Completed'));
  await click('User accounts','nav button'); await click('Add account'); await fill('#account-form label:nth-child(1) input','Browser Test Staff'); await fill('#account-form input[type=email]','browser-new@vau.ac.lk'); await fill('#account-form input[type=password]','NewStaff@1234'); await click('Create account'); await check('Browser Test Staff');
  await openMenuPage('System settings'); await fill('form label:nth-child(1) input','Connected campus maintenance'); await click('Save changes'); await check('Portal settings saved.');
  await mobile(); await click('Switch to Dark Mode'); await snapshot('connected-settings-mobile-dark');
  await openMenuPage('Response targets'); await click('Save targets'); await snapshot('connected-targets-mobile-dark');
  await openMenuPage('Activity logs'); await click('Export Audit Log'); await pause(300); assert(fs.readFileSync(path.join(temporaryDirectory,'maintenance-audit.csv'),'utf8').includes('SUBMIT_REQUEST')); await snapshot('connected-audit-mobile-dark');
  assert.deepEqual(errors, [], 'No uncaught browser errors');
  console.log('PASS all 8 roles with real MongoDB/API/proxy, approval stages, uploads, stock, completion, persistence, account creation, settings, CSV exports, and mobile layouts.');
} finally {
  secondarySocket?.close();
  if (secondaryTarget && socket?.readyState === WebSocket.OPEN) await send('Target.closeTarget', { targetId: secondaryTarget }).catch(() => {});
  if (secondaryContext && browserSocket?.readyState === WebSocket.OPEN) await browserSend('Target.disposeBrowserContext', { browserContextId: secondaryContext }).catch(() => {});
  browserSocket?.close();
  if (socket?.readyState === WebSocket.OPEN) {
    await evaluate("fetch('/api/auth/logout',{method:'POST',credentials:'include'}).catch(()=>{})").catch(() => {});
    await send('Emulation.clearDeviceMetricsOverride').catch(() => {});
    await send('Page.navigate', { url: 'http://127.0.0.1:5173' }).catch(() => {});
    socket.close();
  }
  if (vite) { vite.kill(); await Promise.race([new Promise((resolve)=>vite.once('exit',resolve)),pause(2000)]); }
  if (server?.listening) await new Promise((resolve)=>server.close(resolve));
  if (mongoose.connection.readyState===1 && mongoose.connection.name===databaseName && databaseName.startsWith('maintenance_browser_')) await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  // Keep screenshots/downloads for review; the database and server have been removed.
}

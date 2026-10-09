const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..', 'extension');
let passed = 0;
function test(name, fn) { try { fn(); passed++; console.log('PASS', name); } catch(e) { console.error('FAIL', name); throw e; } }
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const gecko = manifest.browser_specific_settings.gecko;

test('manifest is Firefox MV3 and uses a stable signing identity', () => {
  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.version, '1.2.1');
  assert.equal(manifest.browser_specific_settings.gecko.id, 'send-to-wheregoes@thomasewoolley.github.io');
});
test('newly submitted add-ons declare transmitted URL data', () => {
  assert.deepEqual(gecko.data_collection_permissions.required, ['browsingActivity','websiteContent']);
  assert(Number.parseInt(gecko.strict_min_version, 10) >= 140);
});
test('unlisted updates use stable HTTPS manifest URL', () => {
  assert.equal(gecko.update_url, 'https://raw.githubusercontent.com/ThomasEWoolley/send-to-wheregoes/main/docs/updates.json');
  assert.equal(new URL(gecko.update_url).protocol, 'https:');
});
test('the extension cannot access arbitrary destination websites', () => {
  assert.deepEqual(manifest.host_permissions, ['https://wheregoes.com/*']);
  assert.deepEqual(manifest.content_scripts[0].matches, ['https://wheregoes.com/*']);
});
test('the extension cannot monitor or alter ordinary browsing', () => {
  assert.deepEqual(manifest.permissions, ['menus', 'activeTab']);
  assert.equal(manifest.web_accessible_resources, undefined);
  assert.equal(manifest.declarative_net_request, undefined);
  assert.equal(manifest.content_scripts.length, 1);
  assert.equal(manifest.background.scripts.length, 1);
});
test('old resolver and all-site permissions have been removed', () => {
  assert(!JSON.stringify(manifest).includes('*://*/*'));
  assert(!JSON.stringify(manifest).includes('resolver-core'));
});

function backgroundHarness() {
  const registered = {};
  const tabs = [];
  const menus = [];
  const browser = {
    runtime: {onInstalled: {addListener: fn => registered.installed=fn}},
    menus: {create: options => menus.push(options),onClicked: {addListener: fn => registered.clicked=fn}},
    tabs: {create: options => {tabs.push(options);return Promise.resolve()}}
  };
  vm.runInNewContext(fs.readFileSync(path.join(root,'background.js'),'utf8'), { browser, URL });
  return { registered, tabs, menus };
}

test('right-click menu registers once on installation', () => {
  const h = backgroundHarness(); h.registered.installed();
  assert.equal(h.menus.length, 1);
  assert.equal(h.menus[0].contexts[0], 'link');
});
test('right-click sends an encoded Klaviyo URL only to WhereGoes', () => {
  const h = backgroundHarness();
  const link = 'https://ctrk.klclick1.com/l/01M4DF6GZKCBRC7A5DH1DDCBK7_3';
  h.registered.clicked({menuItemId:'send-link-to-wheregoes', linkUrl: link});
  assert.equal(h.tabs.length,1);
  assert.equal(h.tabs[0].url,'https://wheregoes.com/#flr-url='+encodeURIComponent(link));
});
test('query strings and fragments survive handoff exactly', () => {
  const h = backgroundHarness(); const link = 'https://x.example/path?a=1&b=a%20b#frag';
  h.registered.clicked({menuItemId:'send-link-to-wheregoes',linkUrl:link});
  assert.equal(decodeURIComponent(h.tabs[0].url.split('#flr-url=')[1]),link);
});
test('unsafe and malformed links are not opened', () => {
  const h = backgroundHarness();
  for (const linkUrl of ['javascript:alert(1)', 'data:text/plain,evil', 'file:///etc/passwd', 'relative/path', '']) {
    h.registered.clicked({menuItemId:'send-link-to-wheregoes',linkUrl});
  }
  h.registered.clicked({menuItemId:'some-other-menu', linkUrl:'https://example.com'});
  assert.equal(h.tabs.length,0);
});

function pageHarness(hash, options={}) {
  const calls = { replaced: [], events: [], submitted: 0, requested: 0, observerDisconnects:0};
  const form = {
    querySelectorAll: () => options.buttons === false ? [] : [button],
    requestSubmit: () => calls.requested++
  };
  const button = {
    disabled: false,
    getAttribute: key => key === 'type' ? (options.buttonType || 'submit') : null,
    click: () => calls.submitted++,
    textContent: 'Trace URL'
  };
  const input = {
    disabled: false, readOnly:false, type:'text',isConnected:true, value:'',
    getAttribute: () => null,
    closest: () => options.noForm ? null : form,
    dispatchEvent: event => calls.events.push(event.type)
  };
  let present = options.present !== false;
  let observerCallback;
  const timerQueue = [];
  class Event { constructor(type) { this.type = type; } }
  class MutationObserver {
    constructor(callback) { observerCallback=callback; }
    observe() {}
    disconnect() { calls.observerDisconnects++; }
  }
  const doc = {
    documentElement: {},
    querySelectorAll: selector => present && selector === 'input[name="url"]' ? [input] : []
  };
  const context = {
    location: {hash,pathname:'/',search:''},
    history: {state:null,replaceState: (...args) => calls.replaced.push(args)},
    document:doc, URL, decodeURIComponent, Event, MutationObserver,
    setTimeout: (fn,time) => { timerQueue.push({fn,time}); return timerQueue.length; },
    clearTimeout:()=>{}
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'wheregoes-fill.js'),'utf8'), context);
  return { calls, input, timerQueue, setPresent: value => {present=value;}, trigger: () => observerCallback?.() };
}

test('ordinary WhereGoes visit is completely untouched',()=> {
  const h=pageHarness('');
  assert.equal(h.input.value,'');
  assert.equal(h.timerQueue.length,0);
  assert.equal(h.calls.replaced.length,0);
});
test('Klaviyo tracking link fills URL box and triggers WhereGoes form',()=> {
  const link='https://ctrk.klclick1.com/l/01M4DF6GZKCBRC7A5DH1DDCBK7_3';
  const h=pageHarness('#flr-url='+encodeURIComponent(link));
  assert.equal(h.input.value,link);
  assert.deepEqual(h.calls.events,['input','change']);
  assert.equal(h.calls.replaced[0][2],'/');
  assert.equal(h.calls.submitted,0);
  h.timerQueue.find(t=>t.time===250).fn();
  assert.equal(h.calls.submitted,1);
});
test('URL is filled without submission when WhereGoes has no form',()=> {
  const h=pageHarness('#flr-url='+encodeURIComponent('https://example.org'),{noForm:true});
  assert.equal(h.input.value,'https://example.org');
  assert.equal(h.calls.submitted,0);
});
test('requestSubmit is used when there is no submit button',()=> {
  const h=pageHarness('#flr-url='+encodeURIComponent('https://example.org'),{buttons:false});
  h.timerQueue.find(t=>t.time===250).fn();
  assert.equal(h.calls.requested,1);
});
test('delayed form appearance triggers exactly one submission',()=> {
  const h=pageHarness('#flr-url='+encodeURIComponent('https://example.org'),{present:false});
  assert.equal(h.timerQueue.some(t=>t.time===10000),true);
  h.setPresent(true);h.trigger();h.trigger();
  assert.equal(h.input.value,'https://example.org');
  h.timerQueue.find(t=>t.time===250).fn();
  assert.equal(h.calls.submitted,1);
});
test('invalid or unsafe URL fragment never submits',()=> {
  for (const fragment of ['#flr-url=javascript%3Aalert(1)', '#flr-url=%BAD', '#flr-url=data%3Atext%2Fplain%2Cx']) {
    const h=pageHarness(fragment);
    assert.equal(h.input.value,'');
    assert.equal(h.calls.submitted,0);
  }
});
test('no direct resolver, fetch, XHR or arbitrary script execution exists',()=> {
  const all=['background.js','wheregoes-fill.js','popup.js'].map(s=>fs.readFileSync(path.join(root,s),'utf8')).join('\n');
  assert(!/\b(fetch|XMLHttpRequest|eval|executeScript)\s*\(/.test(all));
  assert(!/\bwebRequest\b/.test(all));
});
console.log('\n' + passed + ' tests passed.');

/* Install-app button for any device — © 2026 Saimir Neziri. All rights reserved.
   Shows a small "Install app" button. One tap installs where the browser allows it (Android, Windows, Mac,
   Chromebook – Chrome / Edge / Samsung Internet). On iPhone/iPad and other browsers it shows the exact steps.
   Hidden once the app is installed. Colour: <script src="/install.js" data-accent="#e10600" data-name="App"> */
(function () {
  if (window.__cosInstall) return; window.__cosInstall = 1;
  var me = document.currentScript || document.querySelector('script[src*="install.js"]');
  var ACCENT = (me && me.getAttribute('data-accent')) || '#2563eb';
  var NAME = (me && me.getAttribute('data-name')) || document.title.split(/[–—|-]/)[0].trim() || 'this app';
  var LS = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  var standalone = function () { return (window.matchMedia && (matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches || matchMedia('(display-mode: minimal-ui)').matches)) || navigator.standalone === true; };
  if (standalone()) return;
  var sq = /^sq/i.test(navigator.language || '');
  var T = sq ? { btn: 'Instalo aplikacionin', title: 'Instalo ' + NAME, sub: 'Shtoje në ekranin kryesor – hapet si aplikacion, pa shiritat e shfletuesit.', ok: 'Në rregull', now: 'Instalo tani', done: 'U instalua! Kërkoje ikonën në pajisjen tënde.', this: 'Kjo pajisje', hide: 'Fshih' }
                : { btn: 'Install app', title: 'Install ' + NAME, sub: 'Put it on your home screen or desktop – it opens like an app, full screen, with no browser bars.', ok: 'Got it', now: 'Install now', done: 'Installed! Look for the icon on your device.', this: 'This device', hide: 'Hide' };
  var ua = navigator.userAgent || '';
  var iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var android = /Android/i.test(ua), samsung = /SamsungBrowser/i.test(ua), firefox = /Firefox|FxiOS/i.test(ua);
  var edge = /Edg\//.test(ua), chrome = /Chrome|CriOS/.test(ua) && !edge && !samsung;
  var mac = /Macintosh/.test(ua) && !iOS, safari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS|Edg\//.test(ua);
  var tv = /SMART-TV|SmartTV|Tizen|Web0S|webOS|BRAVIA|AFT|CrKey|GoogleTV|Android TV/i.test(ua);
  var deferred = null;

  var css = document.createElement('style');
  css.textContent =
    '#ciBtn{position:fixed;left:12px;bottom:calc(84px + env(safe-area-inset-bottom));z-index:2147483600;display:none;align-items:center;gap:6px;background:' + ACCENT + ';color:#fff;border:0;border-radius:999px;padding:10px 14px 10px 12px;font:700 14px/1 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.35);cursor:pointer}' +
    '#ciBtn .x{margin-left:4px;opacity:.75;font-size:15px;padding:0 2px}#ciBtn .x:hover{opacity:1}' +
    '#ciBg{position:fixed;inset:0;z-index:2147483601;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center;padding:12px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
    '#ciBox{background:#fff;color:#111;border-radius:18px;max-width:460px;width:100%;max-height:86vh;overflow:auto;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.45)}' +
    '#ciBox h3{margin:0 0 4px;font-size:20px}#ciBox p{margin:0 0 12px;color:#555;font-size:14px}' +
    '#ciBox .d{border:1.5px solid #e5e7eb;border-radius:12px;padding:10px 12px;margin:8px 0;font-size:14px;line-height:1.45}#ciBox .d .h{display:block;font-weight:800;margin-bottom:3px}' +
    '#ciBox .d.me{border-color:' + ACCENT + ';background:rgba(0,0,0,.03)}#ciBox .tag{font-size:11px;font-weight:800;color:' + ACCENT + ';margin-left:6px}' +
    '#ciBox .row{display:flex;gap:8px;margin-top:12px}#ciBox button{flex:1;border:0;border-radius:12px;padding:12px;font:700 15px system-ui,sans-serif;cursor:pointer}' +
    '#ciBox .p{background:' + ACCENT + ';color:#fff}#ciBox .g{background:#f3f4f6;color:#111}' +
    '@media (min-width:700px){#ciBg{align-items:center}#ciBtn{bottom:20px}}';
  document.head.appendChild(css);

  var btn = document.createElement('button');
  btn.id = 'ciBtn'; btn.type = 'button';
  btn.innerHTML = '<span>⬇</span><span>' + T.btn + '</span><span class="x" title="' + T.hide + '" aria-label="' + T.hide + '">✕</span>';
  function mount() { if (!document.body) return setTimeout(mount, 50); document.body.appendChild(btn); show(); }
  function show() { var until = +(LS.get('ci_hide_until') || 0); if (Date.now() < until || standalone()) return; btn.style.display = 'inline-flex'; }
  btn.addEventListener('click', function (e) {
    if (e.target.classList.contains('x')) { e.stopPropagation(); btn.style.display = 'none'; LS.set('ci_hide_until', String(Date.now() + 3 * 864e5)); return; }
    if (deferred) promptNow(); else open();
  });

  function steps() {
    var L = [
      { k: iOS, t: '📱 iPhone / iPad', s: sq ? 'Hape në <b>Safari</b> → butoni Share (katror me shigjetë) → <b>Add to Home Screen</b> → Add.' : 'Open in <b>Safari</b> → tap the Share button (square with arrow) → <b>Add to Home Screen</b> → Add.' },
      { k: android && !samsung, t: '🤖 Android (Chrome)', s: sq ? 'Menyja ⋮ → <b>Install app</b> (ose Add to Home screen).' : 'Tap the ⋮ menu → <b>Install app</b> (or Add to Home screen).' },
      { k: samsung, t: '📲 Samsung Internet', s: sq ? 'Menyja ☰ → <b>Add page to</b> → Home screen.' : 'Tap ☰ menu → <b>Add page to</b> → Home screen.' },
      { k: !android && !iOS && (chrome || edge), t: '💻 Windows / Mac / Chromebook (Chrome or Edge)', s: sq ? 'Kliko ikonën <b>Install</b> në shiritin e adresës (monitor me shigjetë), ose menyja ⋮ → <b>Install</b>.' : 'Click the <b>Install</b> icon in the address bar (a screen with an arrow), or menu ⋮ → <b>Cast, save and share → Install</b>.' },
      { k: mac && safari, t: '🍎 Mac (Safari)', s: sq ? 'Menyja <b>File → Add to Dock</b>.' : 'Menu <b>File → Add to Dock</b>.' },
      { k: firefox && !iOS && !android, t: '🦊 Firefox', s: sq ? 'Firefox nuk e instalon. Hape këtë link në Chrome ose Edge.' : 'Firefox on computers can’t install apps – open this link in Chrome or Edge instead.' },
      { k: tv, t: '📺 Smart TV / projector', s: sq ? 'Hape linkun në shfletuesin e televizorit dhe shtoje te të preferuarat, ose transmetoje nga telefoni (Cast / AirPlay).' : 'Open the link in the TV’s web browser and add it to favourites, or cast it from your phone (Chromecast / AirPlay).' }
    ];
    L.sort(function (a, b) { return (b.k ? 1 : 0) - (a.k ? 1 : 0); });
    return L.map(function (x) { return '<div class="d' + (x.k ? ' me' : '') + '"><span class="h">' + x.t + (x.k ? '<span class="tag">' + T.this + '</span>' : '') + '</span>' + x.s + '</div>'; }).join('');
  }
  function close() { var b = document.getElementById('ciBg'); if (b) b.remove(); }
  function toast(m) { var d = document.createElement('div'); d.textContent = m; d.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483602;background:#111;color:#fff;padding:12px 16px;border-radius:12px;font:600 14px system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.4)'; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 3500); }
  function open() {
    close();
    var bg = document.createElement('div'); bg.id = 'ciBg';
    bg.innerHTML = '<div id="ciBox" role="dialog" aria-modal="true"><h3>⬇ ' + T.title + '</h3><p>' + T.sub + '</p>' + steps() +
      '<div class="row">' + (deferred ? '<button class="p" id="ciNow">' + T.now + '</button>' : '') + '<button class="g" id="ciOk">' + T.ok + '</button></div></div>';
    bg.addEventListener('click', function (e) { if (e.target === bg) close(); });
    document.body.appendChild(bg);
    document.getElementById('ciOk').onclick = close;
    var now = document.getElementById('ciNow');
    if (now) now.onclick = function () { close(); promptNow(); };
  }
  function promptNow() {
    if (!deferred) return open();
    var d = deferred; deferred = null;
    try { d.prompt(); d.userChoice && d.userChoice.then(function (r) { if (r && r.outcome === 'accepted') { btn.style.display = 'none'; } }); } catch (e) { open(); }
  }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; window.__deferredInstall = e; show(); });
  window.addEventListener('appinstalled', function () { btn.style.display = 'none'; close(); toast(T.done); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
  // let the apps open it from their own menus too
  window.openInstall = open;
})();

/* UniVerse-OS service worker – keeps the app working offline. © 2026 Saimir Neziri. */
const V='uvos-2';const CORE=['/','/index.html','/install.js','/manifest.webmanifest','/icons/icon-192.png','/icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(K=>Promise.all(K.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET')return;
 if(u.origin!==location.origin){e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(res.ok&&/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){const c=res.clone();caches.open(V).then(x=>x.put(e.request,c))}return res})));return}
 e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('/index.html'))))});

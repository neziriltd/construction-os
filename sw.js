/* Construction-OS Server – service worker: keeps the app itself available offline. Your data always comes from your server. */
const V='cos-server-2';const CORE=['/','/index.html','/cos-server.js','/install.js','/manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(K=>Promise.all(K.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.origin!==location.origin||e.request.method!=='GET')return;
 if(u.pathname.startsWith('/api/')||u.pathname.startsWith('/_blob/'))return;
 if(e.request.mode==='navigate'||u.pathname==='/'||/\.(html|js)$/.test(u.pathname)&&!u.pathname.startsWith('/libs/')){e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('/index.html'))));return}
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(e.request,c))}return res})))});

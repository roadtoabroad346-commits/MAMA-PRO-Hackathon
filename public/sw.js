/* Only build-generated public assets. API/private navigation never enter caches. */
const PREFIX='qoldau-public-shell-';
let shellCache;
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const manifest=await fetch('/app-shell.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('SHELL_UNAVAILABLE');return r.json();});
 const name=PREFIX+manifest.version;const cache=await caches.open(name);await cache.addAll(manifest.assets);shellCache=name;
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const names=await caches.keys();if(!shellCache){const manifest=await fetch('/app-shell.json',{cache:'no-store'}).then(r=>r.json());shellCache=PREFIX+manifest.version;}
 await Promise.all(names.filter(n=>n.startsWith(PREFIX)&&n!==shellCache).map(n=>caches.delete(n)));await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
 if(event.request.mode==='navigate'){
  event.respondWith((async()=>{try{return await fetch(event.request);}catch{
   const cache=await activeCache();
   if(url.pathname==='/pilot'||url.pathname.startsWith('/pilot/'))return (await cache.match('/offline.html'))||Response.error();
   return (await cache.match('/index.html'))||Response.error();
  }})());return;
 }
 if(url.pathname.startsWith('/assets/')||['/icon.svg','/manifest.webmanifest'].includes(url.pathname))event.respondWith((async()=>{const cache=await activeCache();return (await cache.match(event.request))||fetch(event.request);})());
});
async function activeCache(){if(!shellCache){const names=(await caches.keys()).filter(n=>n.startsWith(PREFIX));shellCache=names.at(-1);}return caches.open(shellCache||PREFIX+'missing');}

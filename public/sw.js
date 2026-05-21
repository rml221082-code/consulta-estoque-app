const CACHE_NAME = "ponto-cache-v11";

// 🔥 SOMENTE arquivos do ponto offline
const urlsToCache = [

  "./ponto.html",

  // FIREBASE
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js",
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js",

  // XLSX
  "https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js"

];

// ============================
// INSTALAR
// ============================

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
    .then(cache => {

      console.log("Cache criado");

      return cache.addAll(urlsToCache);

    })

  );

  self.skipWaiting();

});

// ============================
// ATIVAR
// ============================

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys.map(key => {

          if(key !== CACHE_NAME){
            return caches.delete(key);
          }

        })

      );

    })

  );

  self.clients.claim();

});

// ============================
// FETCH
// ============================

self.addEventListener("fetch", event => {

  const url = event.request.url;

  // 🔥 CACHE SOMENTE NO ponto.html
  if(url.includes("ponto.html")){

    event.respondWith(

      caches.match(event.request)
      .then(response => {

        return response || fetch(event.request);

      })

    );

    return;
  }

  // 🔥 TODAS AS OUTRAS PÁGINAS SEM CACHE
  event.respondWith(

    fetch(event.request, {
      cache: "no-store"
    })

  );

});
// caches
const staticCacheName = "site-static-v2";
const dynamicCacheName = "site-dynamic-v1";

// request URLs for assets
const assets = [
  "/",
  "/index.html",
  "/js/app.js",
  "/js/ui.js",
  "/js/materialize.min.js",
  "/css/styles.css",
  "/css/materialize.min.css",
  "/img/dish.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v53/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
  "/pages/fallback.html",
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.key().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install service worker
self.addEventListener("install", (evt) => {
  // Pre-Caching: because its in "install" event
  // waitUntil => Makes sure all assets are cached before installed evt is finished
  evt.waitUntil(
    // Create (if it doesn't exist) and open cache
    caches.open(staticCacheName).then((cache) => {
      // add single item => cache.add()
      // add all items in array => cache.addAll([])
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener("activate", (evt) => {
  // console.log("service worker has been activated");
  evt.waitUntil(
    caches.keys().then((keys) => {
      // console.log(keys);/
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// fetch event - when accessing a server (could be img, css, js file. anything really)
self.addEventListener("fetch", (evt) => {
  // console.log("fetch event", evt);
  evt.respondWith(
    caches
      .match(evt.request)
      .then((cacheRes) => {
        return (
          cacheRes ||
          fetch(evt.request).then((fetchRes) => {
            return caches.open(dynamicCacheName).then((cache) => {
              cache.put(evt.request.url, fetchRes.clone());
              limitCacheSize(dynamicCacheName, 15);
              return fetchRes;
            });
          })
        );
      })
      // fallback
      .catch(() => {
        // conditional fallback
        if (evt.request.url.indexOf(".html") > -1) {
          // fallback page
          caches.match("/pages/fallback.html");
        }
      })
  );
});

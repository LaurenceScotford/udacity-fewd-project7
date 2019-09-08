// Service worker

// Name of current caches - version up when application is updated
const dynamicCacheName = 'restaurant-reviews-dynamic-v1';

// Cache all required resources when application is first opened
self.addEventListener('install', event => {
 event.waitUntil(
   caches.open(dynamicCacheName).then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/restaurant.html',
       '/js/main.js',
       '/js/dbhelper.js',
       '/js/restaurant_info.js',
       '/css/styles.css',
       '/data/restaurants.json'
     ]);
   })
 );
});

// If a new service worker has been activated after application is updated, remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restaurant-reviews-')
            && cacheName != dynamicCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// When a resource is requsted, try to get if from the cache. If not there, get it from
// the network then add it to the cache
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(dynamicCacheName).then(function(cache) {
      // We must ignore search options for resturant.html when matching
      let options = event.request.url.includes('restaurant.html') ? {ignoreSearch: true} : {};
      return cache.match(event.request, options).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

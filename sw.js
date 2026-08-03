// sw.js — رُزاوی
// همیشه اول از سرور (نسخه‌ی تازه) میاره؛ فقط اگه اینترنت نبود از کش استفاده می‌کنه.
// روی هر نصب جدید، تمام کش‌های قدیمی رو پاک می‌کنه تا فایل کهنه هیچ‌وقت گیر نکنه.

self.addEventListener('install', function (e) {
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { return caches.delete(k); }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function (res) {
      var resClone = res.clone();
      caches.open('rosavie-cache').then(function (cache) {
        cache.put(e.request, resClone);
      });
      return res;
    }).catch(function () {
      return caches.match(e.request);
    })
  );
});

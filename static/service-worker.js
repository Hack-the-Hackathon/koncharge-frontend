const CACHE_NAME = 'offline-cache-v1';
const urlsToCache = [
	'/',
	'/offline.html',
	'/favicon.ico',
	'/manifest.json',
	'/css/globals.css',
	'/css/fonts/loader.css',
	'/img/logo_192.png',
	'/img/logo_512.png',
	'/img/logo_1024.png',
	'/img/logo_128.ico',
	'/img/logo_256.ico',
	'/img/offline.png',
	'/css/fonts/Noto_Sans/NotoSans-VariableFont_wdth,wght.ttf',
	'/css/fonts/DM_Sans/DMSans-VariableFont_opsz,wght.ttf'
];
self.addEventListener('install', (event) => {
	self.skipWaiting();
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== CACHE_NAME) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
	self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	if (event.request.mode === 'navigate') {
		event.respondWith(
			fetch(event.request)
				.then((response) => {
					return response;
				})
				.catch(() => {
					return caches.match('/offline.html');
				})
		);
	} else {
		event.respondWith(
			caches.match(event.request).then((response) => {
				if (response) {
					if (urlsToCache.includes(event.request.url)) {
						return fetch(event.request)
							.then((networkResponse) => {
								caches.open(CACHE_NAME).then((cache) => {
									cache.put(event.request, networkResponse.clone());
								});
								return networkResponse;
							})
							.catch(() => {
								return response;
							});
					}
					return response;
				}
				return fetch(event.request).then((networkResponse) => {
					return networkResponse;
				});
			})
		);
	}
});

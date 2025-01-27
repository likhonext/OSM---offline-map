const CACHE_NAME = 'map-tile-cache-v1';

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME)
	);
});

self.addEventListener('fetch', (event) => {
	if (event.request.url.includes('tile.openstreetmap.org')) {
		event.respondWith(
			caches.match(event.request).then((response) => {
				return response || fetch(event.request).then((response) => {
					const responseClone = response.clone();
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, responseClone);
					});
					return response;
				});
			})
		);
	}
});
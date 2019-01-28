'use strict';

// Static Files as version
var staticCache = 'v0.01';

// Files to cache
var files = [
	'./',
	'./index.html',
	'./css/style.css',
	'https://fonts.googleapis.com/css?family=Dosis:400,600',
	'./images/forecast/01d.jpg',
	'./images/forecast/01n.jpg',
	'./images/forecast/02d.jpg',
	'./images/forecast/02n.jpg',
	'./images/forecast/03d.jpg',
	'./images/forecast/03n.jpg',
	'./images/forecast/04d.jpg',
	'./images/forecast/04n.jpg',
	'./images/forecast/09d.jpg',
	'./images/forecast/09n.jpg',
	'./images/forecast/10d.jpg',
	'./images/forecast/10n.jpg',
	'./images/forecast/11d.jpg',
	'./images/forecast/11n.jpg',
	'./images/forecast/13d.jpg',
	'./images/forecast/13n.jpg',
	'./images/forecast/50d.jpg',
	'./images/forecast/50n.jpg',
	'./images/fav.png',
	'./images/logo-192.png',
	'./images/logo-512.png',
	'./images/logo.png',
	'./js/city.list.js',
	'./js/script.js',
	'./manifest.json',
];

// Install
self.addEventListener('install', e => {
	self.skipWaiting();
	e.waitUntil(
		caches.open(staticCache).then(cache => {
			return cache
				.addAll(files)
				.then(() => console.log('App Version: ' + staticCache))
				.catch(err => console.error('Error adding files to cache', err));
		}),
	);
});

// Activate
self.addEventListener('activate', e => {
	e.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cache => {
					if (cache !== staticCache) {
						console.info('Deleting Old Cache', cache);
						return caches.delete(cache);
					}
				}),
			);
		}),
	);
	return self.clients.claim();
});

// Fetch
self.addEventListener('fetch', e => {
	const req = e.request;
	const url = new URL(req.url);
	if (url.origin === location.origin) return e.respondWith(cacheFirst(req));
	else return e.respondWith(networkFirst(req));
});

async function cacheFirst(req) {
	let cacheRes = await caches.match(req);
	return cacheRes || fetch(req);
}

async function networkFirst(req) {
	const dynamicCache = await caches.open('dynamic');
	try {
		const networkResponse = await fetch(req);
		if (req.method !== 'POST') dynamicCache.put(req, networkResponse.clone());
		return networkResponse;
	} catch (err) {
		const cacheResponse = await caches.match(req);
		return cacheResponse;
	}
}

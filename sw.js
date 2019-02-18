const CACHE_NAME = 'hiyoko';
const urlsToCache = [
	'./',
	'./chikuwa-hiyoko.png'
];

//�o�^����
self.addEventListener('install', (event) => {
	console.info('install', event);

	event.waitUntil(
	caches.open(CACHE_NAME)
	  .then((cache) => {
		console.log('Opened cache');
	  
		  // �w�肳�ꂽ���\�[�X���L���b�V���ɒǉ�����
		  return cache.addAll(urlsToCache);
	  })
	);
});

self.addEventListener('activate', (event) => {
	console.info('activate', event);

var cacheWhitelist = [CACHE_NAME];

event.waitUntil(
	caches.keys().then((cacheNames) => {
		return Promise.all(
			cacheNames.map((cacheName) => {
				// �Â��L���b�V���͍폜����
				if (cacheWhitelist.indexOf(cacheName) === -1) {
					return caches.delete(cacheName);
				}
			})
			);
		})
	);
});

self.addEventListener('fetch', (event) => {
	console.info('fetch', event);

	event.respondWith(
	caches.match(event.request)
	  .then((response) => {
		  if (response) {
		  	return response;
		  }


		let fetchRequest = event.request.clone();

		return fetch(fetchRequest).then((response) => {
			if (!response || response.status !== 200 || response.type !== 'basic') {
				return response;
			}

			let responseToCache = response.clone();

			caches.open(CACHE_NAME).then((cache) => {
				cache.put(event.request, responseToCache);
			});

			return response;

			});
		})
	);
});
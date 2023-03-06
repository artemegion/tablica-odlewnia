const GITHUB_REPO_PATH = '/tablica-odlewnia';
const APP_PREFIX = 'tblcdlwn_';
const APP_VERSION = 2;

const URLS = [
    `${GITHUB_REPO_PATH}/`,
    `${GITHUB_REPO_PATH}/index.html`,
    `${GITHUB_REPO_PATH}/assets/icon_192.png`,
    `${GITHUB_REPO_PATH}/assets/icon_512.png`,
    `${GITHUB_REPO_PATH}/assets/icon.svg`
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        (async () => {
            const cache = await caches.open(APP_PREFIX + APP_VERSION);
            await cache.addAll(URLS);
        })()
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        (async () => {
            const r = await caches.match(APP_PREFIX + APP_VERSION);
            if (r) return r;

            const response = await fetch(e.request);
            const cache = await caches.open(APP_PREFIX + APP_VERSION);
            await cache.put(e.request, response.clone());

            return response;
        })()
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        (async () => {
            // delete caches for previous versions of the app
            for (let ver = 0; ver < APP_VERSION; ver++) {
                await caches.delete(APP_PREFIX + APP_VERSION);
            }
        })()
    );
});
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" /> 

const DEBUG = false;

importScripts(
    '/tablica-odlewnia/sw/utils.js',
    '/tablica-odlewnia/sw/GitHub.js',
    '/tablica-odlewnia/sw/WorkerCache.js',
    '/tablica-odlewnia/sw/updates.js');

/**
 * Service worker
 */
const MyWorker = {
    async onInstall(e) {
        const sha = await GitHub.fetchLatestCommit();

        if (sha === undefined) {
            await WorkerCache.getCachedCommit();
        } else {
            if (!await WorkerCache.hasFilesForCommit(sha)) {
                let fetchedFiles = await GitHub.fetchFiles(false);
                await WorkerCache.setFilesForCommit(sha, fetchedFiles, false);
                await WorkerCache.setCachedCommit(sha);
            }
        }
    },

    async onActivate(e) {
        await WorkerCache.deleteCachedFiles(true);
        await self.clients?.claim();
    },

    async onFetch(e) {
        const filePath = requestUrlToFilePath(e.request.url);

        if (filePath === undefined) {
            if (DEBUG === true) {
                console.log('fetching ', e.request.url);
            }

            return fetch(e.request);
        } else {
            if (!await WorkerCache.hasFilesForCachedCommit(filePath)) {
                await this.fetchAndCacheFilesForCachedCommit();
            }

            const response = await WorkerCache.getFileForCachedCommit(filePath);
            if (response === undefined) {
                console.error('Could not download and cache a file.', e.request.url, filePath);
                return undefined;
            }

            if (DEBUG === true) {
                console.log('returning cached ', filePath === undefined ? e.request.url : filePath);
            }

            return response;
        }
    },

    async fetchAndCacheFilesForCachedCommit() {
        const files = await GitHub.fetchFiles(true, await WorkerCache.getFilesForCachedCommit());
        await WorkerCache.setFilesForCachedCommit(files, true);
    },

    async updateCachedFiles() {
        const latestCommit = await GitHub.fetchLatestCommit();

        if (latestCommit === undefined) return false;

        const files = await GitHub.fetchFiles();
        await WorkerCache.setFilesForCommit(latestCommit, files, false);
        await WorkerCache.setCachedCommit(latestCommit);
        await WorkerCache.deleteCachedFiles(true);

        return true;
    }
};

(() => {
    self.addEventListener('install', e => { e.waitUntil(MyWorker.onInstall(e)) });
    self.addEventListener('activate', e => { e.waitUntil(MyWorker.onActivate(e)) });
    self.addEventListener('fetch', e => { e.respondWith(MyWorker.onFetch(e)) });
})();

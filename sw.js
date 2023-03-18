importScripts(
    '/tablica-odlewnia/sw/utils.js',
    '/tablica-odlewnia/sw/GitHub.js',
    '/tablica-odlewnia/sw/WorkerCache.js',
    '/tablica-odlewnia/sw/updates.js');

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
    },

    async onFetch(e) {
        const filePath = requestUrlToFilePath(e.request.url);

        if (filePath === undefined) {
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

            return response;
        }
    },

    async fetchAndCacheFilesForCachedCommit() {
        const files = await GitHub.fetchFiles(true, await WorkerCache.getFilesForCachedCommit());
        await WorkerCache.setFilesForCachedCommit(files, true);
    },

    async updateCachedFiles() {
        const latestCommit = await GitHub.fetchLatestCommit();
        const files = await GitHub.fetchFiles();
        await WorkerCache.setFilesForCommit(latestCommit, files, false);
        await WorkerCache.setCachedCommit(latestCommit);
        await WorkerCache.deleteCachedFiles(true);
    }
};

self.addEventListener('install', e => { e.waitUntil(MyWorker.onInstall(e)) });
self.addEventListener('activate', e => { e.waitUntil(MyWorker.onActivate(e)) });
self.addEventListener('fetch', e => { e.respondWith(MyWorker.onFetch(e)) });

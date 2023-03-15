const GitHub = {
    username: 'artemegion',
    repository: 'tablica-odlewnia',
    branch: 'main',

    getApiUrl() {
        return `https://api.github.com/repos/${this.username}/${this.repository}`;
    },

    getPageUrl() {
        return `https://${this.username}.github.io/${this.repository}`;
    },

    /**
     * 
     * @param {string} path 
     * @returns {Promise<string[]>}
     */
    async fetchFilePaths(path = '') {
        let response = await fetch(`${this.getApiUrl()}/contents/${path}?ref=${this.branch}`);
        let responseArr = await response.json();

        let filePaths = [];

        for (let fileMeta of responseArr) {
            if (fileMeta.type === 'dir') {
                filePaths.push(...await this.fetchFilePaths(fileMeta.path));
            } else if (fileMeta.type === 'file') {
                filePaths.push('/' + fileMeta.path);
            }
        }

        return filePaths;
    },

    /**
     * @param {boolean} incremental
     * @param {string[]} paths
     * @returns {Promise<{ [key: string]: Response }>}
     */
    async fetchFiles(incremental = false, ...paths) {
        let responses = {};
        let filePaths = incremental ? (await GitHub.fetchFilePaths()).filter(path => paths.indexOf(path) < 0) : paths.length > 0 ? paths : await GitHub.fetchFilePaths();

        for (let filePath of filePaths) {
            let response = await fetch(`${this.getPageUrl()}${filePath}`, {
                headers: {
                    'Accept': '*/*'
                }
            });
            responses[filePath] = response;
        }

        return responses;
    },

    async fetchLatestCommit() {
        let response = await fetch(`${this.getApiUrl()}/commits/${this.branch}`, {
            headers: {
                'Accept': 'application/vnd.github.sha'
            }
        });

        return await response.text();
    }
};

const WorkerCache = {
    // name of the cache where the latest known commit will be stored
    commitCacheName: 'latest-commit',
    // default commit to use when its impossible to fetch
    // the latest commit or get the cached commit
    defaultCommit: 'e0b7a6c85413b4043129517d7c58d22fc58aac77',

    async getCachedCommit() {
        const cache = await caches.open(this.commitCacheName);
        const response = await cache.match(this.commitCacheName);

        if (response === undefined) {
            cache.put(this.commitCacheName, new Response(this.defaultCommit, { status: 200 }));
            return this.defaultCommit;
        } else {
            return await response.text();
        }
    },

    async setCachedCommit(sha) {
        const cache = await caches.open(this.commitCacheName);
        await cache.put(this.commitCacheName, new Response(sha, { status: 200 }));
    },

    /**
     * @param {string[]} files
     * @returns {Promise<boolean>}
     */
    async hasFilesForCachedCommit(...files) {
        return await this.hasFilesForCommit(await this.getCachedCommit(), ...files);
    },


    /**
     * @param {string} [sha]
     * @param {string[]} files
     * @returns {Promise<boolean>}
     */
    async hasFilesForCommit(sha, ...files) {
        if (files.length > 0) {
            if (!await caches.has(sha)) return false;
            const cache = await caches.open(sha);

            for (let file of files) {
                if (await cache.match(file) === undefined) return false;
            }

            return true;
        } else {
            return await caches.has(sha);
        }
    },

    /**
     * 
     * @param {string} sha 
     * @returns {Promise<string[]>}
     */
    async getFilesForCommit(sha) {
        const cache = await caches.open(sha);
        return (await cache.keys()).map(req => requestUrlToFilePath(req.url)).filter(a => a !== undefined);
    },

    /**
     * 
     * @returns {Promise<string[]>}
     */
    async getFilesForCachedCommit() {
        return await this.getFilesForCommit(await this.getCachedCommit());
    },

    /**
     * 
     * @param {string} sha 
     * @param {string} filePath
     * @returns {Promise<Response | undefined>}
     */
    async getFileForCommit(sha, filePath) {
        const cache = await caches.open(sha);
        return await cache.match(filePath);
    },

    /**
     * 
     * @param {string} filePath
     * @returns {Promise<Response | undefined>}
     */
    async getFileForCachedCommit(filePath) {
        return await this.getFileForCommit(await this.getCachedCommit(), filePath);
    },

    /**
     * 
     * @param {{ [path: string]: Response }} files 
     * @param {boolean} incremental
     * @param {string | undefined} [useSha]
     * @returns {Promise<void>}
     */
    async setFilesForCachedCommit(files, incremental = true) {
        await this.setFilesForCommit(await this.getCachedCommit(), files, incremental);
    },

    /**
    * 
    * @param {string} sha
    * @param {{ [path: string]: Response }} files 
    * @param {boolean} incremental 
    * @returns {Promise<void>}
    */
    async setFilesForCommit(sha, files, incremental = true) {
        if (incremental === false) await caches.delete(sha);

        const cache = await caches.open(sha);

        for (let path of Object.keys(files)) {
            await cache.put(path, files[path]);
        }
    },

    /**
     * 
     * @param {boolean} omitFilesForCachedCommit 
     * @returns {Promise<void>}
     */
    async deleteCachedFiles(omitFilesForCachedCommit = false) {
        for (let cacheName of await caches.keys()) {
            if (cacheName === this.commitCacheName || (omitFilesForCachedCommit && cacheName === await this.getCachedCommit())) continue;
            await caches.delete(cacheName);
        }
    }
};

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
                await this.fetchAndCacheFiles();
            }

            const response = await WorkerCache.getFileForCachedCommit(filePath);
            if (response === undefined) {
                console.error('Could not download and cache a file.', e.request.url, filePath);
                return undefined;
            }

            return response;
        }
    },

    async fetchAndCacheFiles() {
        const files = await GitHub.fetchFiles(true, await WorkerCache.getFilesForCachedCommit());
        await WorkerCache.setFilesForCachedCommit(files, true);
    }
};

self.addEventListener('install', e => { e.waitUntil(MyWorker.onInstall(e)) });
self.addEventListener('activate', e => { e.waitUntil(MyWorker.onActivate(e)) });
self.addEventListener('fetch', e => { e.respondWith(MyWorker.onFetch(e)) });

/**
 * 
 * @param {string} url 
 */
function requestUrlToFilePath(url) {
    let pURL = new URL(url);

    if (pURL.pathname.startsWith('/' + GitHub.repository)) {
        pURL.pathname = pURL.pathname.slice(GitHub.repository.length + 1);
        if (pURL.pathname === '/') pURL.pathname = '/index.html';

        return pURL.pathname;
    } else {
        return undefined;
    }
}

/**
 * 
 * @param {RequestInfo} input
 * @param {number} timeout
 * @param {RequestInit} [init] 
 */
function fetchWithTimeout(input, timeout, init = undefined) {
    let abortController = new AbortController();
    let timeoutId = setTimeout(() => { abortController.abort('timeout'); }, timeout);

    let fetchPromise = fetch(input, Object.assign({}, init, { signal: abortController.signal }));
    return fetchPromise.then(response => { clearTimeout(timeoutId); return response; });
}

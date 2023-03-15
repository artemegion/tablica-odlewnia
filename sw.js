// the name of the GitHub Pages page, must start with a forward slash
const APP_PREFIX = "/tablica-odlewnia";

// name for the cache that holds the latest known commit
const GH_COMMIT_CACHE_NAME = APP_PREFIX + '/GH_COMMIT'
// url for a fake request that returns the latest known commit
const GH_COMMIT_REQ = '/latest-commit';

const GH_REPO_API_URL = 'https://api.github.com/repos/artemegion/tablica-odlewnia';
const GH_PAGE_URL = 'https://artemegion.github.io/tablica-odlewnia';

async function onInstall(e) {
    try {
        let sha = await fetchLatestCommitSha();

        if (sha === undefined) {
            // sets the cached commit sha to a default value if none exists but doesn't change it if it does
            await getCachedCommitSha();
        } else {
            if (!await hasFilesForCachedSha()) {
                await fetchFilesForCachedSha(false);
                await clearCachedFiles(true);
            }
        }
    } catch {

    }
}

async function onActivate(e) {
    await clearCachedFiles(true);

    if (!await hasFilesForCachedSha()) {
        fetchFilesForCachedSha(false);
    }
}

async function onFetch(e) {
    const filePath = requestUrlToFilePath(e.request.url);

    if (filePath === undefined) {
        return fetch(e.request);
    } else {
        if (!await hasFilesForCachedSha()) {
            await fetchFilesForCachedSha(false);
        }

        const file = await getCachedFile(filePath);
        if (file === undefined) {
            await fetchFilesForCachedSha(true);
        }

        if (file === undefined) {
            return new Response('No assets in cache, could not download assets.', { status: 418 });
        } else {
            return file;
        }
    }
}

self.addEventListener('install', (e) => {
    e.waitUntil(onInstall(e));
});

self.addEventListener('activate', (e) => {
    e.waitUntil(onActivate(e));
});

self.addEventListener('fetch', (e) => {
    e.respondWith(onFetch(e));
});

/**
 * 
 * @returns {Promise<boolean>}
 */
async function hasFilesForCachedSha() {
    const sha = await getCachedCommitSha();
    return await caches.has(sha);
}

/**
 * 
 * @param {string} path
 * @returns {Promise<Response | undefined>}
 */
async function getCachedFile(path) {
    const sha = await getCachedCommitSha();

    const cache = await caches.open(sha);
    const cached = await cache.match(path);

    return cached;
}

/**
 * Clears cached files, optionally keeping files for the cached version.
 * @param {boolean} [keepCachedShaFiles] whether to keep files for the cached version
 */
async function clearCachedFiles(keepCachedShaFiles = true) {
    for (let key of await caches.keys()) {
        if (key === GH_COMMIT_CACHE_NAME) continue;
        if (keepCachedShaFiles && key === await getCachedCommitSha()) continue;

        await caches.delete(key);
    }
}

/**
 * fetches file paths for all app files
 * @param {string} [path] 
 * @returns {Promise<string[]>}
 */
async function fetchFilePaths(path = '') {
    let contentsResponse = await fetch(GH_REPO_API_URL + '/contents/' + path);
    let contents = await contentsResponse.json();

    let arr = [];

    for (let content of contents) {
        if (content.type === 'dir') {
            arr.push(...await fetchFilePaths(content.path));
        } else if (content.type === 'file') {
            arr.push('/' + content.path);
        }
    }

    return arr;
}

/**
 * fetches all app files
 * @param {boolean} [incremental] only download files that are not already downloaded
 */
async function fetchFilesForCachedSha(incremental = true) {
    const sha = await fetchLatestCommitSha();
    const filePaths = await fetchFilePaths();

    if (sha === undefined) {
        // no internet connection/bad internet connection/server unavailable
    } else {
        const cache = await caches.open(sha);

        for (let filePath of filePaths) {
            if (!incremental || await cache.match(filePath) === undefined) {
                let response = await fetch(GH_PAGE_URL + filePath);
                await cache.put(filePath, response);
            }
        }

        await setCachedCommitSha(sha);
    }
}

/**
 * 
 * @param {string} url 
 */
function requestUrlToFilePath(url) {
    const parsedUrl = new URL(url);

    if (parsedUrl.pathname.startsWith(APP_PREFIX)) {
        parsedUrl.pathname = parsedUrl.pathname.slice(APP_PREFIX.length);
        if (parsedUrl.pathname === '/') parsedUrl.pathname = '/index.html';

        return parsedUrl.pathname;
    } else return undefined;
}

/**
 * @param {string} sha 
 */
async function setCachedCommitSha(sha) {
    const ghCommitCache = await caches.open(GH_COMMIT_CACHE_NAME);
    await ghCommitCache.put(GH_COMMIT_REQ, new Response(sha, { status: 200, statusText: 'OK' }));
}

/**
 * @returns {Promise<string>}
 */
async function getCachedCommitSha() {
    try {
        const ghCommitCache = await caches.open(GH_COMMIT_CACHE_NAME);
        const cachedCommitShaResponse = await ghCommitCache.match(GH_COMMIT_REQ);

        if (cachedCommitShaResponse === undefined) {
            setCachedCommitSha('9150aeaaf68534b3b1dced9c72c8a11537181b01');
            return '9150aeaaf68534b3b1dced9c72c8a11537181b01';
        }

        return await cachedCommitShaResponse.text();
    }
    catch {
        return '9150aeaaf68534b3b1dced9c72c8a11537181b01';
    }
}

/**
 * @returns {Promise<string | undefined>}
 */
async function fetchLatestCommitSha() {
    try {
        let commitResponse = await fetch(GH_REPO_API_URL + '/commits/main', {
            headers: {
                'Accept': 'application/json'
            }
        });

        let commitObj = await commitResponse.json();
        let commitSha = commitObj.sha;

        if (typeof commitSha !== 'string') {
            return undefined;
        }

        return commitSha;
    } catch (e) {
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

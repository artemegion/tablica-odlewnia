// the name of the GitHub Pages page, must start with a forward slash
const APP_PREFIX = "/tablica-odlewnia";

// name for the cache that holds the latest known commit
const GH_COMMIT_CACHE_NAME = APP_PREFIX + '/GH_COMMIT'
// url for a fake request that returns the latest known commit
const GH_COMMIT_REQ = '/latest-commit';

const GH_REPO_API_URL = 'https://api.github.com/repos/artemegion/tablica-odlewnia';
const GH_PAGE_URL = 'https://artemegion.github.io/tablica-odlewnia';

self.addEventListener('install', (e) => {
    try {
        e.waitUntil(setCachedCommitSha('9150aeaaf68534b3b1dced9c72c8a11537181b01'));
    } catch (e) { console.log(e); }
});

self.addEventListener('activate', (e) => {
    e.waitUntil((async () => {
        try {
            let sha = await getCachedCommitSha();
            const newSha = await fetchLatestCommitSha();

            if (newSha === undefined) {
                // no way to check for app update
            } else {
                if (sha !== newSha) {
                    setCachedCommitSha(newSha);
                    sha = newSha;

                    await fetchFiles();
                }
            }
        } catch (e) { console.log(e); }
    })());
});

self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
        try {
            const reqPath = requestUrlToFilePath(e.request.url);

            if (reqPath === undefined) {
                return fetch(e.request);
            }
            else {
                const cached = await getCachedFile(reqPath);
                if (cached === undefined) {
                    await fetchFiles();
                    cached = await getCachedFile(reqPath);
                }

                // file is not in cache and could not download the file
                if (cached === undefined) {
                    // TODO: better error presentation
                    return new Response('<h1>This is bad</h1>', { status: 500, statusText: 'This is bad' });
                }

                return cached;
            }
        } catch (e) { console.log(e); }
    })())
});

/**
 * 
 * @param {string} sha 
 * @param {string} path
 * @returns {Promise<Response | undefined>}
 */
async function getCachedFile(path) {
    const sha = await getCachedCommitSha();

    const cache = await caches.open(sha);
    const cached = await cache.match(path);

    return cached;
}

async function fetchFiles() {
    const sha = await getCachedCommitSha();

    for (let key of await caches.keys()) {
        if (key === GH_COMMIT_CACHE_NAME || key === sha) continue;
        await caches.delete(key);
    }

    // get repo files
    // request files from GitHub Pages site by their path

    /**
     * 
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

    let filePaths = await fetchFilePaths();

    const cache = await caches.open(await getCachedCommitSha());

    for (let filePath of filePaths) {
        let response = await fetch(GH_PAGE_URL + filePath);
        cache.put(filePath, response);
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
        let commitResponse = await fetchWithTimeout(GH_REPO_API_URL + '/commits/main', 3000, {
            headers: {
                'Accept': 'application/json'
            }
        });

        let commitObj = await commitResponse.json();
        let commitSha = commitObj.sha;

        if (typeof commitSha !== 'string') {
            return undefined;
        }
    } catch {
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

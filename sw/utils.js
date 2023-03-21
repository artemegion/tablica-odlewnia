/**
 * Converts request url to a file path relative to app scope,
 * will return `undefined` if the url doesn't point to the GitHub Pages page.
 * @param {string} url 
 * @returns {string | undefined} If the url points to the GitHub Pages page, returns filepath relative to app scope, undefined otherwise.
 */
function requestUrlToFilePath(url) {
    let pURL = new URL(url);

    if (DEBUG === true
        ? pURL.hostname === '127.0.0.1' && pURL.pathname.startsWith('/' + GitHub.repository)
        : pURL.hostname === (GitHub.username + '.github.io') && pURL.pathname.startsWith('/' + GitHub.repository)) {
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

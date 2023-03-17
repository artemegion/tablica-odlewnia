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

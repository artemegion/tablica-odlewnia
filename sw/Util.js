/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" /> 

export class Util {
    /**
     * Converts request url to a file path relative to app scope,
     * will return `undefined` if the url doesn't point to the GitHub Pages page.
     * @param {string} url 
     * @param {string} repository 
     * @param {string} username  
     * @returns {string | undefined} If the url points to the GitHub Pages page, returns filepath relative to app scope, undefined otherwise.
     */
    requestUrlToFilePath(url, repository, username) {
        let pURL = new URL(url);

        if (pURL.hostname === (username + '.github.io')) {
            if (pURL.pathname === '/') pURL.pathname = '/index.html';
            if (pURL.pathname.startsWith('/' + repository)) pURL.pathname = pURL.pathname.slice(repository.length + 1);

            return pURL.pathname;
        } else {
            return undefined;
        }
    }
}

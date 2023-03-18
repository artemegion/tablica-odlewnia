const DEBUG = true;

const GitHub = {
    username: 'artemegion',
    repository: 'tablica-odlewnia',
    branch: 'deploy',

    getApiUrl() {
        return `https://api.github.com/repos/${this.username}/${this.repository}`;
    },

    getPageUrl() {
        return DEBUG
            ? `http://127.0.0.1:3000/${this.repository}`
            : `https://${this.username}.github.io/${this.repository}`;
    },

    /**
     * 
     * @param {string} path 
     * @returns {Promise<string[]>}
     */
    async fetchFilePaths(path = '') {
        if (DEBUG === true) {
            return [
                '/sw.js',
                '/README.md',
                '/manifest.webmanifest',
                '/LICENSE',
                '/index.html',
                '/.gitignore',
                '/sw/WorkerCache.js',
                '/sw/utils.js',
                '/sw/updates.js',
                '/sw/GitHub.js',
                '/styles/index.css',
                '/js/updates.js',
                '/js/theme-selector.js',
                '/js/current-shift.js',
                '/js/collapsible.js',
                '/js/cells.js',
                '/assets/icon.svg',
                '/assets/icon_512.png',
                '/assets/icon_192.png'
            ];
        } else {
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
        }
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
                },
                redirect: 'follow'
            });

            // Not all browsers support the Response.body stream, so fall back to reading
            // the entire body into memory as a blob.
            const body = await ('body' in response ?
                Promise.resolve(response.body) :
                response.blob());

            responses[filePath] = new Response(body, {
                headers: response.headers,
                status: response.status,
                statusText: response.statusText,
            });
        }

        return responses;
    },

    async fetchLatestCommit() {
        if (DEBUG === true) {
            return 'DEBUG-1';
        } else {
            let response = await fetch(`${this.getApiUrl()}/commits/${this.branch}`, {
                headers: {
                    'Accept': 'application/vnd.github.sha'
                }
            });

            return await response.text();
        }
    }
};

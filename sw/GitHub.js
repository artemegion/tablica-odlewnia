/**
 * GitHub API wrappers
 */
const GitHub = {
    /** @type {string} username of the page's repository owner */
    username: 'artemegion',
    /** @type {string} repository name */
    repository: 'tablica-odlewnia',
    /** @type {string} branch used to fetch file list, should be the branch used to deploy the GitHub page */
    branch: 'multiple-breakdowns',

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
                '/.gitignore',
                '/manifest.webmanifest',
                '/index.html',
                '/README.md',
                '/LICENSE',
                '/sw.js',
                '/sw/WorkerCache.js',
                '/sw/utils.js',
                '/sw/updates.js',
                '/sw/GitHub.js',

                '/styles/index.css',
                '/styles/themes/blue.css',
                '/styles/themes/dark.css',
                '/styles/themes/light.css',
                '/styles/themes/purple.css',
                '/styles/themes/theme.css',
                '/styles/elements/body.css',
                '/styles/elements/button.css',
                '/styles/elements/fieldset.css',
                '/styles/elements/form.css',
                '/styles/elements/hr.css',
                '/styles/elements/input.css',
                '/styles/elements/legend.css',
                '/styles/elements/radio.css',

                '/vendor/lit.js',

                '/components/AppTitlebar.js',
                '/components/AppUpdatesListener.js',
                '/components/DowntimeWizard.js',
                '/components/FoldableContent.js',
                '/components/DropDown.js',
                '/components/ShiftHoursBubbles.js',
                '/components/ShiftThisWeek.js',
                '/components/TablicaApp.js',
                '/components/ThemeSelector.js',

                '/assets/icon.svg',
                '/assets/icon_512.png',
                '/assets/icon_192.png'
            ];
        } else {
            try {
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
            } catch {
                return [];
            }
        }
    },

    /**
     * @param {boolean} incremental
     * @param {string[]} paths
     * @returns {Promise<{ [key: string]: Response }>}
     */
    async fetchFiles(incremental = false, ...paths) {
        try {
            let responses = {};
            let filePaths = incremental ? (await GitHub.fetchFilePaths()).filter(path => paths.indexOf(path) < 0) : paths.length > 0 ? paths : await GitHub.fetchFilePaths();

            for (let filePath of filePaths) {

                let response = await fetch(`${this.getPageUrl()}${filePath}`, {
                    headers: {
                        'Accept': '*/*'
                    },
                    redirect: 'follow'
                });

                // Not all browsers support the Response.body stream, so fall back to reading the entire body into memory as a blob.
                const body = await ('body' in response ?
                    Promise.resolve(response.body) :
                    response.blob());

                responses[filePath] = new Response(body, {
                    headers: response.headers,
                    status: 200,
                    statusText: 'OK',
                });
            }

            return responses;
        } catch {
            return {};
        }
    },

    async fetchLatestCommit() {
        if (DEBUG === true) {
            try {
                return await (await fetch('debug-latest-commit.txt')).text();
            } catch {
                return await WorkerCache.getCachedCommit();
            }
        } else {
            try {
                let response = await fetch(`${this.getApiUrl()}/commits/${this.branch}`, {
                    headers: {
                        'Accept': 'application/vnd.github.sha'
                    }
                });

                return await response.text();
            } catch {
                return undefined;
            }
        }
    }
};

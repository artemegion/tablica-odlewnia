const GitHub = {
    username: 'artemegion',
    repository: 'tablica-odlewnia',
    branch: 'deploy',

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

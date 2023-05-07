/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" /> 

export class GitHub {
    /**
     *
     * @param {string} username
     * @param {string} repository
     * @param {string} branch
     */
    constructor(username, repository, branch) {
        this.username = username;
        this.repository = repository;
        this.branch = branch;
    }

    /** @type {string} */ username;
    /** @type {string} */ repository;
    /** @type {string} */ branch;

    get apiUrl() {
        return `https://api.github.com/repos/${this.username}/${this.repository}`;
    }

    get pageUrl() {
        return `https://${this.username}.github.io/${this.repository}`;
    }

    /**
     * Recusively fetch a list of all files in a directory and subdirectories.
     * The file names are prepended with their parent directories' names.
     * @param {string} path Path to a directory.
     * @returns {Promise<string[] | Error>} A promise that resolves with a list of file paths.
     */
    async fetchFilePaths(path = '') {
        try {
            let response = await fetch(`${this.apiUrl}/contents/${path}?ref=${this.branch}`);
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
        } catch (e) {
            return new Error(`Could not fetch file paths.\n${e}`);
        }
    }

    /**
     * Fetches files specified in `paths`.
     * @param {string[]} paths Paths of files to fetch.
     * @returns {Promise<{ [path: string]: Response | Error }>}
     */
    async fetchFiles(paths) {
        let responses = {};

        for (let path of paths) {
            if (!path.startsWith('/'))
                path = '/' + path;

            try {
                let response = await fetch(`${this.pageUrl}${path}`, {
                    headers: {
                        'Accept': '*/*'
                    },
                    redirect: 'follow'
                });

                // every 2xx and 3xx response is treated as 200, every other response is an error
                if (![2, 3].includes(Math.floor(response.status / 100))) {
                    responses[path] = new Error(`Could not fetch '${path}'. Response code was ${response.status}.`);
                }

                // Not all browsers support the Response.body stream, so fall back to reading the entire body into memory as a blob.
                const body = await ('body' in response ?
                    Promise.resolve(response.body) :
                    response.blob());

                responses[path] = new Response(body, {
                    headers: response.headers,
                    status: 200,
                    statusText: 'OK',
                });
            } catch (e) {
                responses[path] = new Error(`Could not fetch '${path}'.\n${e}`);
            }
        }

        return responses;
    }

    /**
     * Fetches the latest commit.
     * @returns {Promise<string | Error>}
     */
    async fetchLatestCommit() {
        try {
            let response = await fetch(`${this.apiUrl}/commits/${this.branch}`, {
                headers: {
                    'Accept': 'application/vnd.github.sha'
                }
            });

            return await response.text();
        } catch (e) {
            return new Error('Could not fetch the latest commit.' + e);
        }
    }
}

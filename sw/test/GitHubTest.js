import { GitHub } from '../GitHub.js';

export class GitHubTest extends GitHub {
    constructor(username, repository, branch) {
        super(username, repository, branch);
    }

    get pageUrl() {
        return `http://127.0.0.1:3000/${this.repository}`;
    }

    async fetchFilePaths(path = '') {
        let response = await fetch('http://127.0.0.1:3000/tablica-odlewnia/sw/test/GitHubFiles.txt');
        return (await response.text()).split('\n');
    }

    async fetchLatestCommit() {
        let response = await fetch('http://127.0.0.1:3000/tablica-odlewnia/sw/test/GitHubCommit.txt', {
            headers: {
                'Accept': '*/*'
            }
        });
        return await response.text();
    }
}

import { MyWorker } from '../MyWorker.js';
import { UtilTest } from './UtilTest.js';
import { GitHubTest } from './GitHubTest.js';

export class MyWorkerTest extends MyWorker {
    constructor() {
        super();

        this.util = new UtilTest();
        this.github = new GitHubTest('artemegion', 'tablica-odlewnia', 'deploy');
    }

    async onFetch(e) {
        const filePath = this.util.requestUrlToFilePath(e.request.url, this.github.repository, this.github.username);

        if (filePath === undefined) {
            console.log(`Fetching file '${e.request.url}'`);
            return fetch(e.request);
        } else {
            if (!await this.cache.hasFiles([filePath])) {
                console.log(`File '${filePath}' is not cached`);
                await this.fetchAndCacheFiles();
            }

            const response = await this.cache.getFile(filePath);
            if (response === undefined) {
                console.error('Could not download and cache a file.', e.request.url, filePath);
                return undefined;
            }

            console.log(`Returning cached file '${filePath}'`);
            return response;
        }
    }
}
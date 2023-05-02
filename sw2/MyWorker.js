/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" /> 

import { GitHub } from './GitHub.js';
import { WorkerCache } from './WorkerCache.js';
import { requestUrlToFilePath } from './utils.js';

export class MyWorker {
    constructor() {
        this.#github = new GitHub('artemegion', 'tablica-odlewnia', 'deploy');
        this.#cache = new WorkerCache('0b9c22939d35f534b51d62041a88ca78fe5828e1');
    }

    #github;
    #cache;

    init() {
        self.addEventListener('install', (e => { e.waitUntil(this.onInstall(e)) }).bind(this));
        self.addEventListener('activate', (e => { e.waitUntil(this.onActivate(e)) }).bind(this));
        self.addEventListener('fetch', (e => { e.respondWith(this.onFetch(e)) }).bind(this));

        self.addEventListener('message', async (ev) => {
            if (typeof ev.data !== 'object' || typeof ev.data.command !== 'string') return;

            switch (ev.data.command) {
                case 'check-for-updates':
                    let latestCommit = await this.#github.fetchLatestCommit();

                    if (latestCommit instanceof Error) {
                        console.error(latestCommit);
                        return;
                    }

                    let cachedCommit = await this.#cache.getCachedCommit();

                    if (latestCommit !== cachedCommit) {
                        if (await this.fetchAndCacheFiles()) {
                            for (let client of await self.clients.matchAll()) {
                                client.postMessage({ command: 'show-app-updated' });
                            }
                        }
                    }
                    break;
            }
        });
    }

    async onInstall(e) {
        const sha = await this.#github.fetchLatestCommit();

        if (sha instanceof Error) {
            await this.#cache.getCachedCommit();
        } else {
            if (!await this.#cache.hasFiles([], sha)) {
                let fetchedFilePaths = await this.#github.fetchFilePaths();
                if (fetchedFilePaths instanceof Error) return;

                let fetchedFiles = await this.#github.fetchFiles(fetchedFilePaths);

                await this.#cache.setFiles(fetchedFiles, false, sha);
                await this.#cache.setCachedCommit(sha);
            }
        }
    }

    async onActivate(e) {
        await this.#cache.purgeCache(true);
        await self.clients?.claim();
    }

    async onFetch(e) {
        const filePath = requestUrlToFilePath(e.request.url);

        if (filePath === undefined) {
            return fetch(e.request);
        } else {
            if (!await this.#cache.hasFiles([filePath])) {
                await this.fetchAndCacheFiles();
            }

            const response = await this.#cache.getFile(filePath);
            if (response === undefined) {
                console.error('Could not download and cache a file.', e.request.url, filePath);
                return undefined;
            }

            return response;
        }
    }

    async fetchAndCacheFiles() {
        const latestCommit = await this.#github.fetchLatestCommit();
        if (latestCommit instanceof Error) return false;

        const fetchedFilePaths = await this.#github.fetchFilePaths();
        if (fetchedFilePaths instanceof Error) return false;

        const files = await this.#github.fetchFiles(fetchedFilePaths);

        await this.#cache.setFiles(files, false, latestCommit);
        await this.#cache.setCachedCommit(latestCommit);
        await this.#cache.purgeCache(true);

        return true;
    }
}
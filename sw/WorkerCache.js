/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" /> 

import { MyWorker } from './MyWorker.js';
import { requestUrlToFilePath } from './utils.js';

const COMMIT_CACHE_NAME = 'latest-commit';

export class WorkerCache {
    /**
     * 
     * @param {string} defaultCommit 
     */
    constructor(worker, defaultCommit) {
        this.#defaultCommit = defaultCommit;
        this.worker = worker;
    }

    /** @type {string} */ #defaultCommit;
    /** @type {MyWorker} */ worker;

    get defaultCommit() {
        return this.#defaultCommit;
    }

    /**
     * 
     * @returns {Promise<string>} 
     */
    async getCachedCommit() {
        const cache = await caches.open(COMMIT_CACHE_NAME);
        const response = await cache.match(COMMIT_CACHE_NAME);

        if (response === undefined) {
            cache.put(COMMIT_CACHE_NAME, new Response(this.#defaultCommit, { status: 200 }));
            return this.#defaultCommit;
        } else {
            return await response.text();
        }
    }

    /**
     * 
     * @param {string} sha 
     * @returns {Promise<void>}
     */
    async setCachedCommit(sha) {
        const cache = await caches.open(COMMIT_CACHE_NAME);
        await cache.put(COMMIT_CACHE_NAME, new Response(sha, { status: 200 }));
    }

    /**
     * @param {string[]} files
     * @param {string | undefined} [sha]
     * @returns {Promise<boolean>} 
     */
    async hasFiles(files = [], sha) {
        if (typeof sha !== 'string') sha = await this.getCachedCommit();

        if (files.length > 0) {
            if (!await caches.has(sha)) return false;
            const cache = await caches.open(sha);

            for (let file of files) {
                if (await cache.match(file) === undefined) return false;
            }

            return true;
        } else {
            return await caches.has(sha);
        }
    }

    /**
     * 
     * @param {string | undefined} [sha] 
     * @returns {Promise<string[]>} 
     */
    async getFiles(sha) {
        if (typeof sha !== 'string') sha = await this.getCachedCommit();

        const cache = await caches.open(sha);
        return (await cache.keys()).map(req => requestUrlToFilePath(req.url, this.worker.github.repository, this.worker.github.username)).filter(path => path !== undefined);
    }

    /**
     * 
     * @param {{ [path: string]: Response }} files 
     * @param {boolean | undefined} [incremental]
     * @param {string | undefined} [sha] 
     */
    async setFiles(files, incremental, sha) {
        if (typeof sha !== 'string') sha = await this.getCachedCommit();

        if (incremental !== true) await caches.delete(sha);
        const cache = await caches.open(sha);

        for (let path of Object.keys(files)) {
            if (files[path] instanceof Response) {
                await cache.put(path, files[path]);
            }
        }
    }

    /**
     * 
     * @param {string} path 
     * @param {string | undefined} [sha]
     * @returns {Promise<Response | undefined>}
     */
    async getFile(path, sha) {
        if (typeof sha !== 'string') sha = await this.getCachedCommit();

        const cache = await caches.open(sha);
        return await cache.match(path);
    }

    /**
     * 
     * @param {boolean | undefined} [omitFilesForCachedCommit] 
     * @returns {Promise<void>}
     */
    async purgeCache(omitFilesForCachedCommit) {
        for (let cacheName of await caches.keys()) {
            if (cacheName === COMMIT_CACHE_NAME || (omitFilesForCachedCommit === true && cacheName === await this.getCachedCommit())) continue;

            await caches.delete(cacheName);
        }
    }
}
const WorkerCache = {
    // name of the cache where the latest known commit will be stored
    commitCacheName: 'latest-commit',
    // default commit to use when its impossible to fetch
    // the latest commit or get the cached commit
    defaultCommit: 'e0b7a6c85413b4043129517d7c58d22fc58aac77',

    async getCachedCommit() {
        const cache = await caches.open(this.commitCacheName);
        const response = await cache.match(this.commitCacheName);

        if (response === undefined) {
            cache.put(this.commitCacheName, new Response(this.defaultCommit, { status: 200 }));
            return this.defaultCommit;
        } else {
            return await response.text();
        }
    },

    async setCachedCommit(sha) {
        const cache = await caches.open(this.commitCacheName);
        await cache.put(this.commitCacheName, new Response(sha, { status: 200 }));
    },

    /**
     * @param {string[]} files
     * @returns {Promise<boolean>}
     */
    async hasFilesForCachedCommit(...files) {
        return await this.hasFilesForCommit(await this.getCachedCommit(), ...files);
    },


    /**
     * @param {string} [sha]
     * @param {string[]} files
     * @returns {Promise<boolean>}
     */
    async hasFilesForCommit(sha, ...files) {
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
    },

    /**
     * 
     * @param {string} sha 
     * @returns {Promise<string[]>}
     */
    async getFilesForCommit(sha) {
        const cache = await caches.open(sha);
        return (await cache.keys()).map(req => requestUrlToFilePath(req.url)).filter(a => a !== undefined);
    },

    /**
     * 
     * @returns {Promise<string[]>}
     */
    async getFilesForCachedCommit() {
        return await this.getFilesForCommit(await this.getCachedCommit());
    },

    /**
     * 
     * @param {string} sha 
     * @param {string} filePath
     * @returns {Promise<Response | undefined>}
     */
    async getFileForCommit(sha, filePath) {
        const cache = await caches.open(sha);
        return await cache.match(filePath);
    },

    /**
     * 
     * @param {string} filePath
     * @returns {Promise<Response | undefined>}
     */
    async getFileForCachedCommit(filePath) {
        return await this.getFileForCommit(await this.getCachedCommit(), filePath);
    },

    /**
     * 
     * @param {{ [path: string]: Response }} files 
     * @param {boolean} incremental
     * @param {string | undefined} [useSha]
     * @returns {Promise<void>}
     */
    async setFilesForCachedCommit(files, incremental = true) {
        await this.setFilesForCommit(await this.getCachedCommit(), files, incremental);
    },

    /**
    * 
    * @param {string} sha
    * @param {{ [path: string]: Response }} files 
    * @param {boolean} incremental 
    * @returns {Promise<void>}
    */
    async setFilesForCommit(sha, files, incremental = true) {
        if (incremental === false) await caches.delete(sha);

        const cache = await caches.open(sha);

        for (let path of Object.keys(files)) {
            await cache.put(path, files[path]);
        }
    },

    /**
     * 
     * @param {boolean} omitFilesForCachedCommit 
     * @returns {Promise<void>}
     */
    async deleteCachedFiles(omitFilesForCachedCommit = false) {
        for (let cacheName of await caches.keys()) {
            if (cacheName === this.commitCacheName || (omitFilesForCachedCommit && cacheName === await this.getCachedCommit())) continue;
            await caches.delete(cacheName);
        }
    }
};
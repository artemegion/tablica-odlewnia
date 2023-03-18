(async () => {
    self.addEventListener('message', async (ev) => {
        if (typeof ev.data !== 'object' || typeof ev.data.command !== 'string') return;

        switch (ev.data.command) {
            case 'check-for-updates':
                let latestCommit = await GitHub.fetchLatestCommit();
                let cachedCommit = await WorkerCache.getCachedCommit();

                if (latestCommit !== cachedCommit) {
                    await MyWorker.updateCachedFiles();
                }
                break;
        }
    });
})();

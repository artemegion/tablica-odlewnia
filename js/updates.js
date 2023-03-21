(async () => {
    if (typeof navigator.serviceWorker !== 'object') return;
    await navigator.serviceWorker.ready;

    navigator.serviceWorker.addEventListener('message', ev => {
        if (typeof ev.data !== 'object' || typeof ev.data.command !== 'string') return;

        switch (ev.data.command) {
            case 'show-app-updated':
                rpcShowAppUpdated();
                break;
            case 'hide-app-updated':
                rpcHideAppUpdated();
                break;
        }
    });

    setTimeout(() => {
        navigator.serviceWorker.controller?.postMessage({
            command: 'check-for-updates'
        });
    }, DEBUG === true ? 100 : 5000);

    const appUpdatedIconElem = document.getElementById('app-updated-icon');
    appUpdatedIconElem.addEventListener('click', onAppUpdatedIconClicked);

    rpcHideAppUpdated();

    function rpcShowAppUpdated() {
        appUpdatedIconElem.style.opacity = '1';
        appUpdatedIconElem.style.pointerEvents = 'all';
    }

    function rpcHideAppUpdated() {
        appUpdatedIconElem.style.opacity = '0.0';
        appUpdatedIconElem.style.pointerEvents = 'none';
    }

    function onAppUpdatedIconClicked() {
        location.reload();
    }
})();

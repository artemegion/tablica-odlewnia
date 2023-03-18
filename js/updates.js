(async () => {
    if (typeof navigator.serviceWorker !== 'object') return;
    await navigator.serviceWorker.ready;

    navigator.serviceWorker.addEventListener('message', ev => {
        if (ev.data?.command === 'show-app-updated') {
            appUpdatedIconElem.style.opacity = '1.0';
            appUpdatedIconElem.style.pointerEvents = 'all';
        }

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
    }, 1500);

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

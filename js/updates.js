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

    const appUpdateNotifElem = document.getElementById('app-update-notif');
    appUpdateNotifElem.addEventListener('click', onAppUpdatedIconClicked);

    rpcHideAppUpdated();

    function rpcShowAppUpdated() {
        appUpdateNotifElem.style.display = 'block';
        appUpdateNotifElem.style.pointerEvents = 'all';
    }

    function rpcHideAppUpdated() {
        appUpdateNotifElem.style.display = 'none';
        appUpdateNotifElem.style.pointerEvents = 'none';
    }

    function onAppUpdatedIconClicked() {
        location.reload();
    }
})();

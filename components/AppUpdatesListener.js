import { LitElement, css, html } from '../vendor/lit.js';

export class AppUpdatesListener extends LitElement {
    static properties = {
        show: {}
    };

    static styles = css`
        :host {
            -webkit-user-select: none;
            user-select: none;

            box-sizing: border-box;
            padding: 0.5em;

            background-color: var(--top-notif-bg-color);
            color: var(--top-notif-color);

            text-align: center;
        }
    `;

    constructor() {
        super();
        this.show = false;
    }

    render() {
        return html`
            Dotknij tutaj aby zacząć używać najnowszej wersji aplikacji.
        `;
    }

    connectedCallback() {
        super.connectedCallback();

        this.#rpcHideAppUpdated();

        if (typeof navigator.serviceWorker !== 'object') return;

        navigator.serviceWorker.ready.then(() => {
            navigator.serviceWorker.addEventListener('message', ev => {
                if (typeof ev.data !== 'object' || typeof ev.data.command !== 'string') return;

                switch (ev.data.command) {
                    case 'show-app-updated':
                        this.#rpcShowAppUpdated();
                        break;
                    case 'hide-app-updated':
                        this.#rpcHideAppUpdated();
                        break;
                }
            });

            setTimeout(() => {
                navigator.serviceWorker.controller?.postMessage({
                    command: 'check-for-updates'
                });
            }, DEBUG === true ? 100 : 5000);
        });

        this.addEventListener('click', () => {
            // because all files are served from service worker cache,
            // switching to an updated version requires only a reload of the page
            location.reload();
        });
    }

    #rpcShowAppUpdated() {
        this.style.display = 'block';
        this.style.pointerEvents = 'all';
    }

    #rpcHideAppUpdated() {
        this.style.display = 'none';
        this.style.pointerEvents = 'none';
    }
}

customElements.define('app-updates-listener', AppUpdatesListener);

import { LitElement } from '../vendor/lit.js';

export class ForceSlashAtEndOfUrl extends LitElement {
    static styles = css`
    :host {
        display: none;
    }
    `;

    render() {
        return '';
    }

    connectedCallback() {
        super.connectedCallback();

        if (!location.href.endsWith('index.html') && !location.href.endsWith('/')) {
            location.replace(location.href + '/');
        }
    }
}
customElements.define('force-slash-at-end-of-url', ForceSlashAtEndOfUrl);
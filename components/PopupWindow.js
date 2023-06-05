import { booleanConverter } from '../lib/lit/booleanConverter.js';
import { html, css, LitElement } from '../vendor/lit.js';

export class PopupWindow extends LitElement {
    static properties = {
        open: {
            type: Boolean,
            reflect: true,
            converter: booleanConverter
        },

        title: {
            type: String,
            reflect: true
        }
    };

    static styles = css`
    :host {
        --container-justify-content: center;
    }

    #dialog-container {
        box-sizing: border-box;

        display: flex;
        flex-direction: column;

        justify-content: var(--container-justify-content);
        align-items: stretch;

        position: fixed;
        top: 0px;
        left: 0px;
        width: 100vw;
        height: 100vh;

        padding: 30px;

        z-index: 10000;
    }

    #dialog-container.opened {
        pointer-events: all;
    }

    #dialog-container.closed {
        pointer-events: none;
    }
    
    #dialog {
        box-sizing: border-box;
        position: relative;

        flex-basis: auto;
        flex-grow: 0;
        flex-shrink: 0;

        width: 100%;
        // padding: 1em;

        background-color: red;

        background-color: var(--field-bg-color-disabled);
        border: 1px solid var(--field-border-color);
        border-radius: 15px;

        box-shadow: 0px 8px 12px 3px rgba(0, 0, 0, 0.35);

        transition: opacity 0.15s ease-out, scale 0.15s ease-out;
    }

    #dialog.opened {
        pointer-events: all;
        opacity: 1;
        scale: 1;
    }

    #dialog.closed {
        pointer-events: none;
        opacity: 0;
        scale: 0.95;
    }

    #dialog-title {
        background-color: var(--field-bg-color);

        padding: 0.5em;
        // margin: -1em;
        margin-bottom: 1em;

        text-align: center;
        font-size: var(--font-size);

        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
    }

    slot {
        display: block;
        margin: 15px;
    }
    `;

    constructor() {
        super();
        this.open = false;
        this.title = undefined;
    }

    render() {
        return html`
        <div id="dialog-container" class="${this.open ? 'opened' : 'closed'}" @click=${this.#onContainerClick}>
            <div id="dialog" class="${this.open ? 'opened' : 'closed'}" @click=${(e) => { e.stopPropagation(); }}>
                ${this.title ? html`<div id="dialog-title">${this.title}</div>` : null}
                <slot></slot>
            </div>
        </div>`
    }

    updated(t) {
        super.updated(t);

        if (this.open === true) {
            document.body.style.overflowY = 'hidden';

        } else {
            document.body.style.overflowY = 'scroll';
        }
    }

    connectedCallback() {
        super.connectedCallback();

        if (this.parentNode !== document.body) {
            this.parentNode.removeChild(this);
            document.body.appendChild(this);
        }
    }

    #onContainerClick() {
        this.dispatchEvent(new CustomEvent('containerClick'));
    }
}
customElements.define('popup-window', PopupWindow);

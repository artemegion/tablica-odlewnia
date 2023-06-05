import { booleanConverter } from '../lib/lit/booleanConverter.js';
import { LitElement, css, html } from '../vendor/lit.js';

export class FoldableContent extends LitElement {
    static properties = {
        folded: {
            type: Boolean,
            reflect: true,
            converter: booleanConverter
        },

        unfoldedHeight: {
            type: Number,
            reflect: true
        }
    };

    static styles = css`
        :host {
            display: block;
            overflow: hidden;
            transition: max-height 0.2s ease-in-out;
        }
    `;

    constructor() {
        super();
        this.folded = false;
        this.unfoldedHeight = undefined;
    }

    render() {
        return html`<slot></slot>`;
    }

    connectedCallback() {
        super.connectedCallback();
        this.updateHeight();
    }

    updated(t) {
        super.updated(t);
        this.updateHeight();
    }

    toggleFold() {
        if (this.folded) this.folded = null;
        else this.folded = true;
    }

    unfold() {
        this.folded = null;
    }

    fold() {
        this.folded = true;
    }

    updateHeight() {
        if (this.folded === true) {
            this.style.maxHeight = '0px';
            // this.style.height = '0px';
        } else {
            this.style.maxHeight = (this.unfoldedHeight ? this.unfoldedHeight : this.scrollHeight + 1) + 'px';
            // this.style.height = this.scrollHeight + 1 + 'px';
        }
    }
}
customElements.define('foldable-content', FoldableContent);
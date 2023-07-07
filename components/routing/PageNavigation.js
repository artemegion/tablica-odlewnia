import { html, css, LitElement } from '../../vendor/lit.js';

export class PageNavigation extends LitElement {
    static properties = {
        page: {
            type: String,
            reflect: true
        }
    };

    static styles = css`
    :host {
        position: relative;
        display: block;
        overflow: hidden;
    }

    button {
        transition: background-color 0.2s ease-out;
    }

    #slots-container {
        width: 100%;
        overflow: hidden;
    }

    #slots-overflow {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: stretch;

        width: calc(100% * var(--slot-count));
    }

    slot {
        display: block;
        
        flex-basis: 100%;
        flex-grow: 1;
        flex-shrink: 1;

        opacity: 1.0;
        scale: 1.0;

        transform-origin: 50% 15%;
        transition: opacity 0.1s ease-in, scale 0.1s ease-in;
    }

    slot.hidden {
        opacity: 0;
        scale: 0.98;
    }
    `;

    constructor() {
        super();
        /** @type {string} */ this.page = '';
    }

    get pages() {
        /** @type {string[]} */ let slots = [];

        for (const child of this.children) {
            if (child.hasAttribute('slot')) {
                slots.push(child.getAttribute('slot'));
            }
        }

        return slots;
    }

    render() {
        return html`
            <link rel="stylesheet" href="/tablica-odlewnia/styles/index.css" />

            <div class="flex-row" style="margin-bottom: 1em;">
                ${this.pages.map((page, index, arr) => html`
                    <button @click=${(e) => { this.page = page; }} class="basis-1-1 ${this.page !== page ? 'subtle' : ''} ${index === 0 ? 'left' : index === arr.length - 1 ? 'right' : 'middle'}">${page}</button>
                `)}
            </div>

            <div id="slots-container">
                <div id="slots-overflow" style="--slot-count: ${this.pages.length};">
                    ${this.pages.map(page => html`
                        <slot id="${page}" name="${page}" class="hidden"></slot>
                    `)}
                </div>
            </div>
        `;
    }

    firstUpdated(t) {
        super.firstUpdated(t);

        if (!this.pages.includes(this.page)) {
            this.page = this.pages[0];
        }
    }

    /**
     * 
     * @param {Map<string, unknown>} t 
     */
    updated(t) {
        super.updated(t);

        if (t.has('page')) {
            let containerElem = this.renderRoot?.getElementById('slots-container');

            let currPage = this.page;
            let prevPage = t.get('page');

            if (prevPage === undefined || prevPage === null) {
                containerElem.scrollTo({ left: this.renderRoot?.getElementById(currPage)?.offsetLeft });
                this.renderRoot?.getElementById(currPage).classList.remove('hidden');
                return;
            }

            let currPageElem = this.renderRoot?.getElementById(currPage);
            let prevPageElem = this.renderRoot?.getElementById(prevPage);

            if (currPageElem === null || prevPageElem === null) return;

            prevPageElem.classList.add('hidden');
            setTimeout(() => {
                containerElem.scroll({ left: currPageElem.offsetLeft });
                currPageElem.classList.remove('hidden');
            }, 150);
        }
    }
}
customElements.define('page-navigation', PageNavigation);

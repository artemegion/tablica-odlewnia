import { css, html, LitElement } from '../vendor/lit.js';

export class PagesContainer extends LitElement {
    static properties = {
        page: {
            type: Number,
            reflect: true
        }
    };

    static styles = css`
    :host {
        display: block;
        position: relative;
    }

    slot {
        display: block;

        position: relative;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;

        opacity: 1;
        pointer-events: all;

        transition: opacity 0.15s ease-in-out;
    }

    slot.hidden {
        opacity: 0;
        pointer-events: none;
    }
    `;

    constructor() {
        super();
        this.page = 0;
    }

    render() {
        return html`
            <link rel="stylesheet" href="/tablica-odlewnia/styles/index.css" />
            <div></div>
        `;
    }

    /**
     *
     * @param {Map<string, unknown>} changedProperties
     */
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);

        if (changedProperties.has('page')) {
            let prevPage = changedProperties.get('page');
            let page = this.page;

            if (typeof prevPage !== 'number') {
                // no prev page just show current page
                // create slot for new page
                let newPageSlotElem = document.createElement('slot');
                newPageSlotElem.name = '' + page;
                newPageSlotElem.classList.add('hidden');

                this.createRenderRoot().appendChild(newPageSlotElem);

                // play show animation on page
                setTimeout(() => {
                    newPageSlotElem.classList.remove('hidden');
                }, 1);

                return;
            }

            // play hide animation on prev page
            for (let c of this.createRenderRoot().children) {
                if (c.name === '' + prevPage) {
                    c.classList.add('hidden');
                    break;
                }
            }

            // create slot for new page
            let newPageSlotElem = document.createElement('slot');
            newPageSlotElem.name = '' + page;
            newPageSlotElem.classList.add('hidden');

            this.createRenderRoot().appendChild(newPageSlotElem);

            setTimeout(() => {
                // play show animation on page
                newPageSlotElem.classList.remove('hidden');

                // remove old nodes
                for (let child of this.createRenderRoot().children) {
                    if (child.name !== '' + page) {
                        child.remove();
                    }
                }
            }, 150);


        }
    }
}
customElements.define('pages-container', PagesContainer);

import { html, css, LitElement, unsafeHTML } from '../vendor/lit.js';
import './FoldableContent.js';

/**
 * @prop {{ type: 'list' } | { type: 'grid', x: number, y: number }} layout
 */
export class DropDown extends LitElement {
    static properties = {
        selected: {
            type: String,
            reflect: true
        },

        opened: {
            type: Boolean,
            reflect: true
        },

        layout: {
            type: Object,
            reflect: true,
            converter: {
                // the default converter returns true when the attribute is present, regardless of its value
                // this converter returns true only if the attribute is set to "true" or ""
                fromAttribute: (value, type) => {
                    // `value` is a string
                    // Convert it to a value of type `type` and return it

                    if (value === undefined || value === null || value === '') return { type: 'list' };

                    const tokens = value.split(' ');
                    if (tokens.length < 1) return { type: 'list' };

                    switch (tokens[0]) {
                        case 'list': return { type: 'list' };
                        case 'grid':
                            let x = parseInt(tokens[1]);
                            let y = parseInt(tokens[2]);

                            if (isNaN(x) || isNaN(y)) return { type: 'list' };

                            return { type: 'grid', x: x, y: y };
                        default: return { type: 'list' };
                    }
                },
                toAttribute: (value, type) => {
                    // `value` is of type `type`
                    // Convert it to a string and return it

                    switch (value.type) {
                        case 'list': return 'list';
                        case 'grid': return `grid ${value.x} ${value.y}`;
                        default: return null;
                    }
                }
            }
        }
    };

    static styles = css`
        :host {
            display: block;
            --client-width: 0px;
        }

        .header {
            -webkit-user-select: none;
            user-select: none;

            display: block;
            box-sizing: border-box;

            margin: 0;
            padding: 0.5em;
            padding-top: 0.7em;

            line-height: 1;

            background-color: var(--field-bg-color);
            color: var(--field-color);

            font-size: var(--font-size);
            text-align: center;

            outline: none;
            border: 1px solid var(--field-border-color);
            border-color: var(--field-border-color);
            border-radius: 15px;

            transition: border-color 0.1s ease-out, border-radius 0.1s ease-out;
        }

        .header[opened="true"] {
            border-bottom-left-radius: 0px;
            border-bottom-right-radius: 0px;
        }

        .header:after {
            content: "▼";
            position: relative;
            float: right;
        }
        
        .header:before {
            content: "▼";
            position: relative;
            float: left;
            color: transparent;
        }

        .item {
            display: block;
            box-sizing: border-box;

            -webkit-user-select: none;
            user-select: none;

            width: var(--client-width);

            padding: 0.5em;
            padding-top: 0.7em;

            /* fix the button having different height then the input due to input bottom border */
            padding-top: calc(0.7em + 2px);
            padding-bottom: calc(0.5em + 4px);

            margin: 0;

            line-height: 1;

            background-color: var(--item-bg-color);
            color: var(--item-color);

            font-size: var(--font-size);
            text-align: center;

            border: 1px solid var(--item-border-color);
            border-top: none;
        }

        .item:last-of-type {
            border-bottom-left-radius: 15px;
            border-bottom-right-radius: 15px;
        }

        foldable-content {
            position: absolute;
            width: var(--client-width);
        }

        foldable-content.grid {
            display: grid;

            grid-template-columns: repeat(var(--grid-x), calc(var(--client-width) / var(--grid-x)));
            grid-template-rows: repeat(var(--grid-y), auto);
        }

        foldable-content.grid .item {
            width: auto;
        }
    `;

    constructor() {
        super();

        this.selected = '';
        this.opened = false;
        this.layout = { type: 'list' };
    }

    render() {
        const clientWidth = this.clientWidth;
        this.style.setProperty('--client-width', clientWidth + 'px');

        // keep reference to `this` for map callbacks
        let dis = this;

        let childrenElems = [];
        for (let childElem of this.children) {
            if (childElem instanceof HTMLOptionElement)
                childrenElems.push(childElem);
        }

        let foldableClasses = [];
        if (this.layout.type === 'grid') foldableClasses.push('grid');

        let foldableStyles = [];
        if (this.layout.type === 'grid') {
            foldableStyles.push(`--grid-x: ${this.layout.x};`);
            foldableStyles.push(`--grid-y: ${this.layout.y};`);
        }

        return html`
            <link rel="stylesheet" href="/tablica-odlewnia/styles/index.css" />

            <div @click=${this.#onHeaderClick.bind(this)} class="header" opened=${this.opened}>${unsafeHTML(childrenElems.find(child => child.value === this.selected)?.innerHTML ?? '&nbsp;')}</div>

            <foldable-content class=${foldableClasses.join(' ')} style="${foldableStyles.join(' ')}" folded=${!this.opened}>
                ${childrenElems.map(child => html`<div @click=${this.#onItemClick.bind(dis, child.value)} class="item">${unsafeHTML(child.innerHTML)}</div>`)}
            </foldable-content>
        `;
    }

    connectedCallback() {
        super.connectedCallback();

        document.addEventListener('click', (e) => {
            const rect = this.getBoundingClientRect();

            // close the dropdown if the user clicks anywhere outside of it
            if (e.clientX < rect.left || e.clientX >= rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
                this.close();
            }
        });
    }

    /**
     * 
     * @param {Map<string, any>} changedProperties 
     */
    updated(changedProperties) {
        if (changedProperties.has('selected')) {
            this.dispatchEvent(new Event('input'));
        }
    }

    open() {
        this.opened = true;
    }

    close() {
        this.opened = false;
    }

    toggleOpened() {
        this.opened = !this.opened;
    }

    #onHeaderClick() {
        this.toggleOpened();
    }

    #onItemClick(name) {
        this.selected = name;
        this.close();
    }
}
customElements.define('drop-down', DropDown);

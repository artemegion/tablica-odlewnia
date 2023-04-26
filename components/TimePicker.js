import { html, css, LitElement, unsafeHTML } from '../vendor/lit.js';
import { Time } from '../lib/Time.js';
import './FoldableContent.js';

/**
 * @prop {{ type: 'list' } | { type: 'grid', x: number, y: number }} layout
 */
export class TimePicker extends LitElement {
    static properties = {
        time: {
            type: Time,
            reflect: true,
            converter: {
                fromAttribute: (value, type) => {
                    return Time.fromString(value);
                },
                toAttribute: (value, type) => {
                    return value.toString();
                }
            }
        },

        opened: {
            type: Boolean,
            reflect: true
        },
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
            border: none;
            border-style: solid;
            border-width: 0;
            border-bottom-width: 4px;
            border-color: var(--field-border-color);

            transition: border-color 0.1s ease-out;
        }

        .header[opened="true"] {
            border-color: var(--field-border-color-focus);
        }

        .header:after {
            content: "▼";
            position: relative;
            float: right;
            color: transparent;
        }

        .header:before {
            content: "▼";
            position: relative;
            float: left;
        }

        .item {
            /*
            flex-basis: auto;
            flex-grow: 0;
            flex-shrink: 0;
            */

            display: block;
            box-sizing: border-box;

            -webkit-user-select: none;
            user-select: none;

            width: auto;

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

            border: none;
            border-bottom: 1px solid var(--item-border-color);
        }

        foldable-content {
            position: absolute;
            width: var(--client-width);
            height: 200px;
            
            display: flex;
            flex-direction: row;

            justify-content: flex-start;
            align-items: stretch;
        }

        foldable-content .hours {
            flex-basis: 50%;
            flex-grow: 0;
            flex-shrink: 0;

            display: grid;
            --grid-x: 3;

            grid-template-columns: repeat(var(--grid-x), auto);
            grid-template-rows: repeat(var(--grid-y), auto);

            overflow-y: scroll;
            overflow-x: hidden;
        }

        .hours::-webkit-scrollbar {
            width: 4px;
        }

        .hours::-webkit-scrollbar-track {
            background-color: var(--scrollbar-bg-color);
        }

        .hours::-webkit-scrollbar-thumb {
            background-color: var(--scrollbar-thumb-color);
        }

        .hours::-webkit-scrollbar-button {
            background-color: var(--scrollbar-bg-color);
            width: 4px;
            height: 4px;
        }


        foldable-content .minutes {
            flex-basis: 50%;
            flex-grow: 0;
            flex-shrink: 0;

            display: grid;
            --grid-x: 3;

            grid-template-columns: repeat(var(--grid-x), auto);
            grid-template-rows: repeat(var(--grid-y), auto);

            overflow-y: scroll;
            overflow-x: hidden;
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

            <foldable-content class=${foldableClasses.join(' ')} style="${foldableStyles.join(' ')}" folded=${!this.opened} unfoldedHeight="200">
                <div class="hours">
                    ${[...iterRange(0, 23, 1)].map(h => html`<div class="item">${h}</div>`)}
                </div>
                <div class="minutes">
                ${[...iterRange(0, 60, 5)].map(h => html`<div class="item">${h}</div>`)}
                </div>
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
customElements.define('time-picker', TimePicker);

/**
 * 
 * @param {number} from 
 * @param {number} to 
 * @param {number} step 
 * @returns {Generator<number, number, number>}
 */
function* iterRange(from, to, step) {
    for (let i = from; i < to; i += step) {
        yield i;
    }

    yield to;
}

import { ShiftTable } from '../lib/ShiftTable.js';
import { html, css, LitElement } from '../vendor/lit.js';

export class ShiftHoursBubbles extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: row;

            justify-content: flex-start:
            align-items: stretch;
        }

        .bubble {
            -webkit-user-select: none;
            user-select: none;

            padding: 0.5em;

            width: 1.1em;
            height: 1.1em;
            line-height: 1;

            background-color: var(--hour-bubble-bg-color);
            color: var(--hour-bubble-color);
            
            border: 1px solid var(--hour-bubble-border-color);
            border-color: var(--hour-bubble-border-color);

            border-radius: 50%;

            display: flex;
            flex-direction: column;

            justify-content: center;
            align-items: center;

            gap: 1em;
        }

        .bubble.of-this-shift {
            background-color: var(--hour-bubble-bg-color-active);
            color: var(--hour-bubble-color-active);
            border-color: var(--hour-bubble-border-color-active);
        }

        .bubbles-row {
            display: flex;
            flex-direction: row;

            justify-content: flex-start;
            align-items: stretch;

            flex-basis: 50%;
            flex-grow: 1;
            flex-shrink: 1;

            gap: 1em;
        }

        .bubbles-row:not(:first-child) {
            justify-content: flex-end;
        }
    `;

    render() {
        return html`
            <div class="bubbles-row">
                <div class="bubble shift-1">10</div>
                <div class="bubble shift-2">18</div>
                <div class="bubble shift-3">2</div>
            </div>

            <div class="bubbles-row">
                <div class="bubble shift-1">14</div>
                <div class="bubble shift-2">22</div>
                <div class="bubble shift-3">6</div>
            </div>
        `;
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        this.#updateBubblesHighlights();
    }

    #updateBubblesHighlights() {
        let shift = ShiftTable.getDayShift();

        switch (shift) {
            case 1:
                this.renderRoot?.querySelectorAll('.shift-1')?.forEach(elem => elem.classList.add('of-this-shift'));
                break;
            case 2:
                this.renderRoot?.querySelectorAll('.shift-2')?.forEach(elem => elem.classList.add('of-this-shift'));
                break;
            case 3:
                this.renderRoot?.querySelectorAll('.shift-3')?.forEach(elem => elem.classList.add('of-this-shift'));
                break;
        }
    }
}

customElements.define('shift-hours-bubbles', ShiftHoursBubbles);
import { LitElement, css, html } from '../vendor/lit.js';
import { ShiftTable } from '../lib/ShiftTable.js';

export class ShiftThisWeek extends LitElement {
    static properties = {

    };

    static styles = css`
        :host {
            display: block;
            text-align: center;
        }
    `;

    constructor() {
        super();
    }

    render() {
        return html`
            Zmiana ${ShiftTable.getWeekShift()}/${ShiftTable.getWeek()}
        `;
    }
}

customElements.define('shift-this-week', ShiftThisWeek);

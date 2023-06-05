import { html, css, LitElement } from '../../vendor/lit.js';

export class TablicaMinuty extends LitElement {
    static styles = css`
    :host {
        display: block;
    }
    `;

    constructor() {
        super();
    }

    render() {
        return html`
        <link rel="stylesheet" href="/tablica-odlewnia/styles/index.css" />
        
        <div class="form">
            <fieldset>
                <legend>Minuty na części dziesiętne godziny</legend>

                <input id="minuty" type="number" placeholder="Minuty" style="width: 100%;" @input=${this.#onMinutyInput} />
                <input id="godziny" type="number" placeholder="Części dziesiętne" style="width: 100%;" @input=${this.#onGodzinyInput} />
            </fieldset>
        </div>
        `;
    }

    #onMinutyInput(e) {
        let godzinyElem = this.renderRoot?.getElementById('godziny');
        if (!godzinyElem) return;

        let minutes = Number.parseInt(e.target.value);
        if (Number.isNaN(minutes)) {
            godzinyElem.value = '';
        } else {
            godzinyElem.value = (minutes / 60).toFixed(2);
        }
    }

    #onGodzinyInput(e) {
        let minutyElem = this.renderRoot?.getElementById('minuty');
        if (!minutyElem) return;

        let hours = Number.parseFloat(e.target.value);
        if (Number.isNaN(hours)) {
            minutyElem.value = '';
        } else {
            minutyElem.value = Math.round(hours * 60);
        }
    }
}
customElements.define('tablica-minuty', TablicaMinuty);

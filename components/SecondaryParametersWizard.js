import { LitElement, css, html } from '../vendor/lit.js';
import { TablicaState } from '../lib/state/TablicaState.js';
import './PopupWindow.js';
import './FoldableContent.js';
import './DropDown.js';

export class SecondaryParametersWizard extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;

            justify-content: flex-start;
            align-items: stretch;

            // background-color: var(--field-bg-color-disabled);
            // border: 1px solid var(--field-bg-color-disabled);
            border-radius: 15px;
        }

        foldable-content {
            display: flex;
            flex-direction: column;

            justify-content: flex-start;
            align-items: stretch;

            padding-left: 0.5em;
            padding-right: 0.5em;
        }

        fieldset {
            transition: max-height 0.2s ease-in-out;
        }

        button {
            width: 100%;
        }

        fieldset.hidden {
            pointer-events: none;

            overflow: hidden;
            max-height: 0;
            margin: 0;
        }

        #parameters-wizard-form {
            width: 100%;
            height: 50vh;

            overflow-y: scroll;
                    
        }
    `;

    /**
    * @typedef SecondaryParameters
    * @prop {String} asortyment 
    * @prop {number} takt 
    * @prop {number} celPolowa 
    * @prop {number} celKoniec cel 100%
    * @prop {number} celLiniiPolowa 
    * @prop {number} celLiniiKoniec norma
    * @prop {number} brakiPolowa 
    * @prop {number} brakiKoniec 
    * @prop {number} czyszczenie
    */

    /** @type {Array<SecondaryParameters>} */
    static secondaryParameters = [
        {
            asortyment: "74L103",
            takt: 1.125,
            celPolowa: 213,
            celKoniec: 427,
            celLiniiPolowa: 180,
            celLiniiKoniec: 360,
            brakiPolowa: 3,
            brakiKoniec: 3,
            czyszczenie: 20
        },

        {
            asortyment: "74L112",
            takt: 1.125,
            celPolowa: 213,
            celKoniec: 427,
            celLiniiPolowa: 180,
            celLiniiKoniec: 360,
            brakiPolowa: 3,
            brakiKoniec: 3,
            czyszczenie: 20
        },

        {
            asortyment: "82L207",
            takt: 0.85,
            celPolowa: 282,
            celKoniec: 565,
            celLiniiPolowa: 245,
            celLiniiKoniec: 490,
            brakiPolowa: 4,
            brakiKoniec: 4,
            czyszczenie: 20
        },

        {
            asortyment: "82L209",
            takt: 0.85,
            celPolowa: 282,
            celKoniec: 565,
            celLiniiPolowa: 245,
            celLiniiKoniec: 490,
            brakiPolowa: 4,
            brakiKoniec: 4,
            czyszczenie: 20
        },

        {
            asortyment: "82L244",
            takt: 1.2,
            celPolowa: 200,
            celKoniec: 400,
            celLiniiPolowa: 164,
            celLiniiKoniec: 330,
            brakiPolowa: 3,
            brakiKoniec: 3,
            czyszczenie: 20
        },

        {
            asortyment: "83L149",
            takt: 1.1,
            celPolowa: 218,
            celKoniec: 436,
            celLiniiPolowa: 170,
            celLiniiKoniec: 340,
            brakiPolowa: 3,
            brakiKoniec: 3,
            czyszczenie: 20
        },

        {
            asortyment: "83L150",
            takt: 0.8,
            celPolowa: 300,
            celKoniec: 600,
            celLiniiPolowa: 250,
            celLiniiKoniec: 500,
            brakiPolowa: 4,
            brakiKoniec: 4,
            czyszczenie: 20
        },

        {
            asortyment: "83L192",
            takt: 1.2,
            celPolowa: 200,
            celKoniec: 400,
            celLiniiPolowa: 170,
            celLiniiKoniec: 340,
            brakiPolowa: 3,
            brakiKoniec: 3,
            czyszczenie: 20
        }
    ]

    static properties = {
        folded: {
            type: Boolean,
            reflect: false
        }
    };

    constructor() {
        super();
        this.folded = true;
    }

    /** @type {TablicaState | undefined} */ state;

    render() {
        if (this.state === undefined) return undefined;

        return html`
        <link rel="stylesheet" href="/tablica-odlewnia/styles/index.css" />

        <button type="button" @click=${() => { this.folded = false; }}>Wybierz z listy</button>

        <popup-window title="Wybierz parametry z listy" ?open=${!this.folded} @containerClick=${() => { this.fold(); }}>
            <style>
                #parameters-wizard-form {
                    display: flex;
                    flex-direction: column;

                    height: 75vh;
                    overflow-y: scroll;
                }

                #parameters-wizard-form fieldset * {
                    flex-basis: 100%;
                    flex-grow: 1;
                    flex-shrink: 1;
                }

                #parameters-wizard-form button {
                    margin-bottom: 1em;
                }
            </style>
            <div class="form" id="parameters-wizard-form">
                <fieldset>
                    <input id="parameters-wizard-form_bramka_1" type="radio" name="parameters-wizard-form_bramka" title="Jedna bramka">
                    <label for="parameters-wizard-form_bramka_1" class="basis-1-2 join-right">Jedna bramka</label>
                    <input id="parameters-wizard-form_bramka_2" type="radio" name="parameters-wizard-form_bramka" title="Dwie bramki" checked>
                    <label for="parameters-wizard-form_bramka_2" class="basis-1-2 join-left">Dwie bramki</label>
                </fieldset>
                ${SecondaryParametersWizard.secondaryParameters.map(asortyment => html`
                    <button @click=${this.onParametersButtonClick.bind(this, asortyment)}>${asortyment.asortyment}</button>
                `)}
            </div>
        </popup-window>
        `;
    }

    /** @param {SecondaryParameters} asortyment */
    onParametersButtonClick(asortyment) {
        let b1 = document.getElementById("parameters-wizard-form_bramka_1").checked;
        let b2 = document.getElementById("parameters-wizard-form_bramka_2").checked;

        let bramki;
        if (b1) {
            bramki = 1;
        }
        if (b2) {
            bramki = 2;
        }

        if (bramki != null) {
            this.state.sheet.setValue("bramki", bramki);

            this.state.sheet.setValue("takt", asortyment.takt);

            this.state.sheet.setValue("cel-polowa", asortyment.celPolowa * bramki);
            this.state.sheet.setValue("cel-koniec", asortyment.celKoniec * bramki);

            this.state.sheet.setValue("cel-linii-polowa", asortyment.celLiniiPolowa * bramki);
            this.state.sheet.setValue("cel-linii-koniec", asortyment.celLiniiKoniec * bramki);

            this.state.sheet.setValue("braki-polowa", asortyment.brakiPolowa * bramki);
            this.state.sheet.setValue("braki-koniec", asortyment.brakiKoniec * bramki);
        }

        if (bramki >= 1) {
            this.state.sheet.setValue("czyszczenie-b1-polowa", asortyment.czyszczenie);
            this.state.sheet.setValue("czyszczenie-b1-koniec", asortyment.czyszczenie);
        } else {
            this.state.sheet.setValue("czyszczenie-b1-polowa", 0);
            this.state.sheet.setValue("czyszczenie-b1-koniec", 0);
        }

        if (bramki >= 2) {
            this.state.sheet.setValue("czyszczenie-b2-polowa", asortyment.czyszczenie);
            this.state.sheet.setValue("czyszczenie-b2-koniec", asortyment.czyszczenie);
        } else {
            this.state.sheet.setValue("czyszczenie-b2-polowa", 0);
            this.state.sheet.setValue("czyszczenie-b2-koniec", 0);
        }

        if (this.state.sheet.getValue('sztuki-we-wozku-polowa') === 0) {
            this.state.sheet.setValue('sztuki-we-wozku-polowa', asortyment.celLiniiPolowa);
        }

        if (this.state.sheet.getValue('sztuki-we-wozku-koniec') === 0) {
            this.state.sheet.setValue('sztuki-we-wozku-koniec', asortyment.celLiniiKoniec);
        }

        this.fold();
    }

    firstUpdated(t) {
        super.firstUpdated(t);
    }

    fold() {
        this.folded = true;
    }

    unfold() {
        this.folded = false;
    }
}
customElements.define('secondary-parameters-wizard', SecondaryParametersWizard);

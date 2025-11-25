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

    static secondaryParameters = [
        {
            asortyment: "82L207",

            1: {
                takt: 0.85,
                "cel-polowa": 282,
                "cel-koniec": 565,
                "cel-linii-polowa": 245,
                "cel-linii-koniec": 490,
                "braki-polowa": 4,
                "braki-koniec": 4
            },
            2: {
                takt: 0.85,
                "cel-polowa": 565,
                "cel-koniec": 1125,
                "cel-linii-polowa": 490,
                "cel-linii-koniec": 980,
                "braki-polowa": 8,
                "braki-koniec": 8
            }
        },

        {
            asortyment: "82L209",

            1: {
                takt: 0.85,
                "cel-polowa": 282,
                "cel-koniec": 565,
                "cel-linii-polowa": 245,
                "cel-linii-koniec": 490,
                "braki-polowa": 4,
                "braki-koniec": 4
            },
            2: {
                takt: 0.85,
                "cel-polowa": 565,
                "cel-koniec": 1125,
                "cel-linii-polowa": 490,
                "cel-linii-koniec": 980,
                "braki-polowa": 8,
                "braki-koniec": 8
            }
        },

        {
            asortyment: "74L103",

            1: {
                takt: 1.125,
                "cel-polowa": 213,
                "cel-koniec": 427,
                "cel-linii-polowa": 180,
                "cel-linii-koniec": 360,
                "braki-polowa": 3,
                "braki-koniec": 3
            },

            2: {
                takt: 1.125,
                "cel-polowa": 427,
                "cel-koniec": 850,
                "cel-linii-polowa": 360,
                "cel-linii-koniec": 720,
                "braki-polowa": 6,
                "braki-koniec": 6
            }
        },

        {
            asortyment: "74L112",

            1: {
                takt: 1.125,
                "cel-polowa": 213,
                "cel-koniec": 427,
                "cel-linii-polowa": 180,
                "cel-linii-koniec": 360,
                "braki-polowa": 3,
                "braki-koniec": 3
            },

            2: {
                takt: 1.125,
                "cel-polowa": 427,
                "cel-koniec": 850,
                "cel-linii-polowa": 360,
                "cel-linii-koniec": 720,
                "braki-polowa": 6,
                "braki-koniec": 6
            }
        }
    ];

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

    onParametersButtonClick(asortyment) {
        let b1 = document.getElementById("parameters-wizard-form_bramka_1").checked;
        let b2 = document.getElementById("parameters-wizard-form_bramka_2").checked;

        let p;
        if (b1) {
            p = asortyment[1];
        }
        if (b2) {
            p = asortyment[2];
        }

        if (p != null) {
            this.state.sheet.setValue("takt", p["takt"]);

            this.state.sheet.setValue("cel-polowa", p["cel-polowa"]);
            this.state.sheet.setValue("cel-koniec", p["cel-koniec"]);

            this.state.sheet.setValue("cel-linii-polowa", p["cel-linii-polowa"]);
            this.state.sheet.setValue("cel-linii-koniec", p["cel-linii-koniec"]);

            this.state.sheet.setValue("braki-polowa", p["braki-polowa"]);
            this.state.sheet.setValue("braki-koniec", p["braki-koniec"]);
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

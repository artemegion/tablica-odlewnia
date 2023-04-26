import { LitElement, css, html } from '../vendor/lit.js';
import { Downtime, Downtimes } from '../lib/Downtimes.js';
import { Time } from '../lib/Time.js';
import { TimeRange } from '../lib/TimeRange.js';
import { ShiftTable } from '../lib/ShiftTable.js';
import './FoldableContent.js';
import './DropDown.js';
import './TimePicker.js';

export class DowntimesWizard extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;

            justify-content: flex-start;
            align-items: stretch;
        }

        #dodaj-przestoj.show-error {
            background-color: rgb(120, 50, 50);
        }

        foldable-content {
            display: flex;
            flex-direction: column;

            justify-content: flex-start;
            align-items: stretch;
        }

        fieldset {
            transition: max-height 0.2s ease-in-out;
        }

        fieldset.hidden {
            pointer-events: none;

            overflow: hidden;
            max-height: 0;
            margin: 0;
        }
    `;

    static properties = {
        downtimes: {
            type: Downtimes,
            reflect: false
        },

        error: {
            type: String,
            reflect: true
        }
    };

    static errorMessages = {
        'poczatek': 'Czas rozpoczęcia nie może być poza godzinami zmiany',
        'koniec': 'Czas zakończenia nie może być poza godzinami zmiany'
    };

    constructor() {
        super();
        this.downtimes = new Downtimes();
        this.error = undefined;
    }

    render() {
        return html`
        <link rel="stylesheet" href="/tablica-odlewnia/styles/index.css" />

        <foldable-content id="wizard" folded>
            <button title="Anuluj dodawanie przestoju" type="button" @click=${this.#onAnulujClick}>Anuluj dodawanie przestoju</button>

            <form id="wizard-form">
                <fieldset>
                    <label class="basis-1-2">Typ</label>

                    <drop-down id="typ" selected="naprawa" class="basis-1-2">
                        <option value="awaria">Awaria</option>
                        <option value="naprawa">Naprawa</option>
                    </drop-down>
                </fieldset>

                <fieldset>
                    <label class="basis-1-2">Bramka</label>

                    <div class="flex-row flex-gap basis-1-2">
                    <input id="bramka_1" name="bramka" title="Bramka 1" type="radio" checked/>
                    <label class="basis-1-2" for="bramka_1">1</label>

                    <input id="bramka_2" name="bramka" title="Bramka 2" type="radio" />
                    <label class="basis-1-2" for="bramka_2">2</label>
                    </div>
                </fieldset>

                <fieldset>
                    <label class="basis-1-2">Początek</label>
                    <input type="time" id="poczatek" title="Początek" @input=${this.#onPoczatekInput.bind(this)} class="basis-1-2" />
                </fieldset>

                <fieldset>
                    <label class="basis-1-2">Koniec</label>
                    <input type="time" id="koniec" title="Koniec" @input=${this.#onKoniecInput.bind(this)} class="basis-1-2" />
                </fieldset>

                <fieldset>
                    <label class="basis-1-4">Uwagi</label>
                    <input class="basis-3-4" id="uwagi" style="text-align: left;" name="uwagi" title="Uwagi" type="text" placeholder="" value="" />
                </fieldset>
            </form>
        </foldable-content>

        <button type="button" id="dodaj-przestoj" @click=${this.#onDodajPrzestojClick} class="${this.error ? 'show-error' : ''}">
            ${this.error === undefined ? 'Dodaj przestój' : DowntimesWizard.errorMessages[this.error]}
        </button>
        `;
    }

    #onDodajPrzestojClick() {
        if (typeof this.error === 'string') return;

        let wizardElem = this.renderRoot?.getElementById('wizard');

        if (wizardElem?.folded) {
            wizardElem.unfold();
        } else {
            let typ = this.renderRoot?.getElementById('typ')?.selected;
            let bramka = this.renderRoot?.getElementById('bramka_1')?.checked ? 1 : 2;
            let poczatek = this.renderRoot?.getElementById('poczatek')?.value;
            let koniec = this.renderRoot?.getElementById('koniec')?.value;
            let uwagi = this.renderRoot?.getElementById('uwagi')?.value;

            if (!typ || !bramka || !poczatek || !koniec || !uwagi) {
                console.error('no val pres', bramka, poczatek, koniec, uwagi);
                return;
            }

            let [pHour, pMinute] = poczatek.split(':').map(s => parseInt(s));
            let [kHour, kMinute] = koniec.split(':').map(s => parseInt(s));

            // if end is before the beginning it means its the next day
            if (pHour > kHour) {
                kHour += 24;
            }

            let shiftHours = ShiftTable.getShiftHours(ShiftTable.getDayShift());

            if (pHour < shiftHours.from.hour || (pHour === shiftHours.from.hour && pMinute < shiftHours.from.minute)) {
                this.error = 'poczatek';
                return;
            }

            if (kHour > shiftHours.to.hour || (kHour === shiftHours.to.hour && kMinute > shiftHours.to.minute)) {
                this.error = 'koniec';
                return;
            }

            this.downtimes.push(new Downtime(typ, bramka, uwagi, new TimeRange(new Time(pHour, pMinute), new Time(kHour, kMinute))))

            this.renderRoot?.getElementById('wizard-form')?.reset();
            wizardElem?.fold();
        }
    }

    #onAnulujClick() {
        this.renderRoot?.getElementById('wizard')?.fold();
        this.error = undefined;
    }

    #onPoczatekInput() {
        if (this.error === 'poczatek') {
            this.error = undefined;
        }
    }

    #onKoniecInput() {
        if (this.error === 'koniec') {
            this.error = undefined;
        }
    }
}
customElements.define('downtimes-wizard', DowntimesWizard);

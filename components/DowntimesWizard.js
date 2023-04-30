import { LitElement, css, html } from '../vendor/lit.js';
import { Downtime, Downtimes } from '../lib/Downtimes.js';
import { TimeV2 } from '../lib/Time.js';
import { TimeRange } from '../lib/TimeRange.js';
import { ShiftTable } from '../lib/ShiftTable.js';
import './FoldableContent.js';
import './DropDown.js';

const STRINGS = {
    cancelAdd: 'Anuluj dodawanie przestoju',
    cancelEdit: 'Anuluj edycję przestoju',
    add: 'Dodaj przestój',
    edit: 'Zatwierdź zmianę'
};

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
        },

        editMode: {
            type: String,
            reflect: false
        }
    };

    static errorMessages = {
        'poczatek': 'Czas rozpoczęcia nie może być poza godzinami zmiany',
        'koniec': 'Czas zakończenia nie może być poza godzinami zmiany',
        'poczatek > koniec': 'Czas rozpoczęcia musi być przed czasem zakończenia'
    };

    constructor() {
        super();
        this.downtimes = new Downtimes();
        this.error = undefined;
        this.editMode = undefined;
    }

    render() {
        return html`
        <link rel="stylesheet" href="/tablica-odlewnia/styles/index.css" />

        <foldable-content id="wizard" folded>
            <button title="${this.editMode ? STRINGS.cancelEdit : STRINGS.cancelAdd}" type="button" @click=${this.#onAnulujClick}>
                ${this.editMode ? STRINGS.cancelEdit : STRINGS.cancelAdd}
            </button>

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
            ${this.error === undefined ? (this.editMode ? STRINGS.edit : STRINGS.add) : DowntimesWizard.errorMessages[this.error]}
        </button>
        `;
    }

    updated(props) {
        if (props.has('downtimes')) {
            props.get('downtimes')?.removeEventListener('edit-requested', this.#onDowntimesEditRequested);

            this.downtimes.addEventListener('edit-requested', this.#onDowntimesEditRequested, this);
        }
    }

    unfold() {
        this.renderRoot?.getElementById('wizard').unfold();
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
            let timeRange = new TimeRange(TimeV2.fromTime(pHour, pMinute), TimeV2.fromTime(kHour, kMinute));

            let shiftHours = ShiftTable.getShiftHours(ShiftTable.getDayShift());

            let validFromTime = ShiftTable.getDayShift() === 3
                ? timeRange.from.ticks <= shiftHours.to.ticks || timeRange.from.ticks >= shiftHours.from.ticks
                : timeRange.from.ticks >= shiftHours.from.ticks && timeRange.from.ticks <= shiftHours.to.ticks;

            if (!validFromTime) {
                this.error = 'poczatek';
                return;
            }

            let validToTime = ShiftTable.getDayShift() === 3
                ? timeRange.to.ticks <= shiftHours.to.ticks || timeRange.to.ticks >= shiftHours.from.ticks
                : timeRange.to.ticks >= shiftHours.from.ticks && timeRange.to.ticks <= shiftHours.to.ticks;

            if (!validToTime) {
                this.error = 'koniec';
                return;
            }

            if (ShiftTable.getDayShift() === 3) {
                // before 0:00 | after 0:00
                //         p k | _ _ - p > k
                //         _ _ | p k - p > k
                //         p _ | k _ - never
                //         k _ | p _ - always

                // ("p k | _ _" or "_ _ | p k") and "p > k"
                if (((timeRange.from.ticks >= shiftHours.from.ticks && timeRange.to.ticks >= shiftHours.from.ticks)
                    || (timeRange.from.ticks <= shiftHours.to.ticks && timeRange.to.ticks <= shiftHours.to.ticks))
                    && timeRange.from.ticks > timeRange.to.ticks) {
                    this.error = 'poczatek > koniec';
                    return;
                } else {
                    // "k _ | p _"
                    if (timeRange.to.ticks >= shiftHours.from.ticks && timeRange.from.ticks <= shiftHours.to.ticks) {
                        this.error = 'poczatek > koniec';
                        return;
                    }
                }
            } else {
                if (timeRange.from.ticks > timeRange.to.ticks) {
                    this.error = 'poczatek > koniec';
                    return;
                }
            }

            if (typeof this.editMode === 'string') {
                let downtime = this.downtimes.getById(this.editMode);
                if (downtime === undefined) {
                    this.downtimes.push(new Downtime(typ, bramka, uwagi, timeRange));
                }

                downtime.typ = typ;
                downtime.bramka = bramka;
                downtime.uwagi = uwagi;
                downtime.timeRange = timeRange;

                this.downtimes.emit('entries-changed');
                this.editMode = undefined;
            } else {
                this.downtimes.push(new Downtime(typ, bramka, uwagi, timeRange));
            }

            this.renderRoot?.getElementById('wizard-form')?.reset();
            wizardElem?.fold();
        }
    }

    #onAnulujClick() {
        if (this.editMode) {
            this.renderRoot?.getElementById('wizard-form')?.reset();
        }

        this.renderRoot?.getElementById('wizard')?.fold();
        this.error = undefined;
        this.editMode = undefined;
    }

    #onPoczatekInput() {
        if (this.error === 'poczatek' || this.error === 'poczatek > koniec') {
            this.error = undefined;
        }
    }

    #onKoniecInput() {
        if (this.error === 'koniec' || this.error === 'poczatek > koniec') {
            this.error = undefined;
        }
    }

    /**
     * @param {string} id
     */
    #onDowntimesEditRequested(id) {
        let downtime = this.downtimes.getById(id);
        // this.downtimes.removeById(id);

        if (downtime !== undefined) {
            this.editMode = id;
            this.error = undefined;
            this.renderRoot.getElementById('typ').selected = downtime.typ;
            this.renderRoot.getElementById('bramka_1').checked = downtime.bramka === 1;
            this.renderRoot.getElementById('bramka_2').checked = downtime.bramka === 2;
            this.renderRoot.getElementById('poczatek').value = downtime.timeRange.from.toString();
            this.renderRoot.getElementById('koniec').value = downtime.timeRange.to.toString();
            this.renderRoot.getElementById('uwagi').value = downtime.uwagi;
        }
    }
}
customElements.define('downtimes-wizard', DowntimesWizard);

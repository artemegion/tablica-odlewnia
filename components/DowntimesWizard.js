import { LitElement, createRef, ref, css, html } from '../vendor/lit.js';
import { Downtime } from '../lib/Downtimes.js';
import { TimeV2 } from '../lib/Time.js';
import { TimeRange } from '../lib/TimeRange.js';
import { ShiftTable } from '../lib/ShiftTable.js';
import { TablicaState } from '../lib/state/TablicaState.js';
import './PopupWindow.js';
import './FoldableContent.js';
import './DropDown.js';

export class DowntimesWizard extends LitElement {
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

        #dodaj-przestoj.show-error {
            background-color: rgb(120, 50, 50);
        }

        #cancel-button {
            margin-left: -0.5em;
            margin-right: -0.5em;
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

        fieldset.hidden {
            pointer-events: none;

            overflow: hidden;
            max-height: 0;
            margin: 0;
        }
    `;

    static properties = {
        error: {
            type: String,
            reflect: true
        },

        editMode: {
            type: String,
            reflect: false
        },

        folded: {
            type: Boolean,
            reflect: false
        }
    };

    static strings = {
        'add': 'Dodaj przestój',
        'add.confirm': 'Dodaj',
        'add.cancel': 'Anuluj',
        'edit': 'Edytuj przestój',
        'edit.confirm': 'Zatwierdź',
        'edit.cancel': 'Anuluj',
        'error.start-time-too-early': 'Czas rozpoczęcia nie może być poza godzinami zmiany',
        'error.end-time-too-late': 'Czas zakończenia nie może być poza godzinami zmiany',
        'error.start-after-end': 'Czas rozpoczęcia musi być przed czasem zakończenia'
    };

    constructor() {
        super();
        this.error = undefined;
        this.editMode = undefined;
        this.folded = true;
    }

    /** @type {TablicaState | undefined} */ state;
    formElem = createRef();

    render() {
        if (this.state === undefined) return undefined;

        let cancelAddButtonTitle = this.editMode ? DowntimesWizard.strings['edit.cancel'] : DowntimesWizard.strings['add.cancel'];
        let confirmAddButtonTitle = this.error === undefined ? (this.editMode ? DowntimesWizard.strings['edit.confirm'] : DowntimesWizard.strings['add.confirm']) : DowntimesWizard.strings[`error.${this.error}`];

        return html`
        <link rel="stylesheet" href="/tablica-odlewnia/styles/index.css" />

        <button type="button" id="dodaj-przestoj" @click=${() => { this.folded = false; }} class="${this.error ? 'show-error' : ''}">${DowntimesWizard.strings['add']}</button>

        <popup-window  title="${this.editMode ? DowntimesWizard.strings['edit'] : DowntimesWizard.strings['add']}" ?open=${!this.folded} @containerClick=${() => { this.reset(); this.fold(); }}>
                <div ${ref(this.formElem)} class="form" id="wizard-form">
                    <fieldset>
                        <label class="basis-1-2">Typ</label>

                        <drop-down id="typ" selected="naprawa" class="basis-1-2">
                            <option value="awaria">Awaria</option>
                            <option value="naprawa">Naprawa</option>
                        </drop-down>
                    </fieldset>

                    <fieldset>
                        <label class="basis-1-2">Bramka</label>

                        <div class="flex-row basis-1-2">
                        <input id="bramka_1" type="radio" name="bramka" title="Bramka 1" checked/>
                        <label for="bramka_1" class="basis-1-2 join-right">1</label>

                        <input id="bramka_2" type="radio" name="bramka" title="Bramka 2" />
                        <label for="bramka_2" class="basis-1-2 join-left">2</label>
                        </div>
                    </fieldset>

                    <fieldset>
                        <label class="basis-1-2">Początek</label>
                        <input id="poczatek" type="time" title="Początek" class="basis-1-2" @input=${this.#onPoczatekInput.bind(this)} />
                    </fieldset>

                    <fieldset>
                        <label class="basis-1-2">Koniec</label>
                        <input id="koniec" type="time" title="Koniec" class="basis-1-2" @input=${this.#onKoniecInput.bind(this)} />
                    </fieldset>

                    <fieldset>
                        <label class="basis-1-4">Uwagi</label>
                        <input id="uwagi" type="text" name="uwagi" title="Uwagi" placeholder="" value="" class="basis-3-4" style="text-align: left;" />
                    </fieldset>
                </div>

                <hr />

                <div class="flex-row flex-gap-s">
                    <button @click=${this.#onPopupLeftButtonClick.bind(this)} class="basis-1-1 left">${cancelAddButtonTitle}</button>
                    <button @click=${this.#onPopupRightButtonClick.bind(this)} class="basis-1-1 right">${confirmAddButtonTitle}</button>
                </div>
        </popup-window>
        `;
    }

    firstUpdated(t) {
        super.firstUpdated(t);

        this.state.downtimes.on('edit-requested', this.#onDowntimesEditRequested, this);
    }

    fold() {
        this.folded = true;
    }

    unfold() {
        this.folded = false;
    }

    #onPopupRightButtonClick() {
        if (this.state === undefined) return;

        if (typeof this.error === 'string') return;

        if (this.folded) {
            this.folded = false;
        } else {
            let typ = this.formElem.value.querySelector('#typ')?.selected;
            let bramka = this.formElem.value.querySelector('#bramka_1')?.checked ? 1 : 2;
            let poczatek = this.formElem.value.querySelector('#poczatek')?.value;
            let koniec = this.formElem.value.querySelector('#koniec')?.value;
            let uwagi = this.formElem.value.querySelector('#uwagi')?.value;

            if (!typ || !bramka || !poczatek || !koniec || !uwagi) {
                console.error('no val pres', typ, bramka, poczatek, koniec, uwagi);
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
                this.error = 'start-time-too-early';
                return;
            }

            let validToTime = ShiftTable.getDayShift() === 3
                ? timeRange.to.ticks <= shiftHours.to.ticks || timeRange.to.ticks >= shiftHours.from.ticks
                : timeRange.to.ticks >= shiftHours.from.ticks && timeRange.to.ticks <= shiftHours.to.ticks;

            if (!validToTime) {
                this.error = 'end-time-too-late';
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
                    this.error = 'start-after-end';
                    return;
                } else {
                    // "k _ | p _"
                    if (timeRange.to.ticks >= shiftHours.from.ticks && timeRange.from.ticks <= shiftHours.to.ticks) {
                        this.error = 'start-after-end';
                        return;
                    }
                }
            } else {
                if (timeRange.from.ticks > timeRange.to.ticks) {
                    this.error = 'start-after-end';
                    return;
                }
            }

            if (typeof this.editMode === 'string') {
                let downtime = this.state.downtimes.getById(this.editMode);
                if (downtime === undefined) {
                    this.state.downtimes.push(new Downtime(typ, bramka, uwagi, timeRange));
                }

                downtime.typ = typ;
                downtime.bramka = bramka;
                downtime.uwagi = uwagi;
                downtime.timeRange = timeRange;

                this.state.downtimes.emit('entries-changed');
                this.editMode = undefined;
            } else {
                this.state.downtimes.push(new Downtime(typ, bramka, uwagi, timeRange));
            }

            this.reset();
            this.folded = true;
        }
    }

    reset() {
        this.editMode = undefined;
        this.error = undefined;

        this.formElem.value.querySelector('#typ').selected = 'naprawa';
        this.formElem.value.querySelector('#bramka_1').checked = true;
        this.formElem.value.querySelector('#bramka_2').checked = false;
        this.formElem.value.querySelector('#poczatek').value = '';
        this.formElem.value.querySelector('#koniec').value = '';
        this.formElem.value.querySelector('#uwagi').value = '';
    }

    #onPopupLeftButtonClick() {
        if (this.editMode) {
            this.reset();
        }

        this.folded = true;
        this.error = undefined;
        this.editMode = undefined;
    }

    #onPoczatekInput() {
        if (this.error === 'start-time-too-early' || this.error === 'start-after-end') {
            this.error = undefined;
        }
    }

    #onKoniecInput() {
        if (this.error === 'end-time-too-late' || this.error === 'start-after-end') {
            this.error = undefined;
        }
    }

    /**
     * @param {string} id
     */
    #onDowntimesEditRequested(id) {
        let downtime = this.state.downtimes.getById(id);

        if (downtime !== undefined) {
            this.editMode = id;
            this.error = undefined;

            this.formElem.value.querySelector('#typ').selected = downtime.typ;
            this.formElem.value.querySelector('#bramka_1').checked = downtime.bramka === 1;
            this.formElem.value.querySelector('#bramka_2').checked = downtime.bramka === 2;
            this.formElem.value.querySelector('#poczatek').value = downtime.timeRange.from.toString();
            this.formElem.value.querySelector('#koniec').value = downtime.timeRange.to.toString();
            this.formElem.value.querySelector('#uwagi').value = downtime.uwagi;

            this.folded = false;
        }
    }
}
customElements.define('downtimes-wizard', DowntimesWizard);

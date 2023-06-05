import { css, html, LitElement } from '../vendor/lit.js';

import './ForceSlashAtEndOfUrl.js';
import './AppUpdatesListener.js';
import './AppTitlebar.js';
import './routing/PageNavigation.js';
import './TablicaApp/TablicaKody.js';
import './TablicaApp/TablicaMinuty.js';
import './TablicaApp/TablicaForm.js';

import { TablicaState } from '../lib/state/TablicaState.js';
import { ShiftTable } from '../lib/ShiftTable.js';
import { TimeRange } from '../lib/TimeRange.js';
import { BoxStorage } from '../lib/storage/BoxStorage.js';
import { NumberBox } from '../lib/storage/NumberBox.js';
import { DowntimeBox } from '../lib/storage/DowntimeBox.js';

export class TablicaApp3 extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;

            justify-content: flex-start;
            align-items: stretch;

            padding-top: 1em;
            padding-bottom: 5em;

            margin-left: 1em;
            margin-right: 1em;
        }

        @media screen and (min-width: 500px) {
            :host {
                width: 500px;
            }
        }

        shift-hours-bubbles {
            margin-top: 1em;
        }

        #czas-strat-suma::placeholder {
            font-size: 0.8em;
        }
    `;

    constructor() {
        super();
        this.state = new TablicaState();
    }

    /** @type {TablicaState} */ state;

    render() {

        return html`
            <link rel="stylesheet" href="/tablica-odlewnia/styles/index.css" />
            <force-slash-at-end-of-url></force-slash-at-end-of-url>
            <app-updates-listener></app-updates-listener>

            <app-titlebar></app-titlebar>
            
            <page-navigation page="tablica">
                <div slot="🪧&nbsp;Tablica">
                    <tablica-form .state=${this.state}></tablica-form>
                </div>

                <div slot="⌚&nbsp;Minuty">
                    <tablica-minuty></tablica-minuty>
                </div>

                <div slot="🔢&nbsp;Kody">
                    <tablica-kody></tablica-kody>
                </div>
            </page-navigation>

            <footer style="margin-bottom: -4.5em; margin-top: 3em;">
                <div>Copyright ${new Date().getFullYear()} Paweł Ignasiak</div>
                <div>Licensed under the MIT License. <a href="https://www.github.com/artemegion/tablica-odlewnia">GitHub</a></div>
            </footer>
        `;
    }

    firstUpdated(t) {
        super.firstUpdated(t);

        this.#bindDowntimesToSheet();
        this.#bindSheetToBoxStorage();
        this.#bindDowntimesToBoxStorage();
        this.#loadSheetFromBoxStorage();
        this.#loadDowntimesFromBoxStorage();
    }

    #bindDowntimesToSheet() {
        this.state.downtimes.on('entries-changed', () => {

            let cells = {
                'awaria': [
                    ['strata-awaria-b1-polowa', 'strata-awaria-b2-polowa'],
                    ['strata-awaria-b1-koniec', 'strata-awaria-b2-koniec']
                ],

                'naprawa': [
                    ['strata-naprawa-b1-polowa', 'strata-naprawa-b2-polowa'],
                    ['strata-naprawa-b1-koniec', 'strata-naprawa-b2-koniec']
                ]
            };

            // sum of downtime durations, layout same as `cells` above
            let values = {
                'awaria': [[0, 0], [0, 0]],
                'naprawa': [[0, 0], [0, 0]]
            };

            let shiftHalves = ShiftTable.getShiftHalves(ShiftTable.getDayShift());

            for (let downtime of this.state.downtimes.entries) {
                // calculate how many minutes the downtime takes place in each half of the current shift
                let firstHalfMinutes = (TimeRange.intersect(downtime.timeRange, shiftHalves[0]) ?? { minutes: 0 }).minutes;
                let secondHalfMinutes = (TimeRange.intersect(downtime.timeRange, shiftHalves[1]) ?? { minutes: 0 }).minutes;

                values[downtime.typ][0][downtime.bramka - 1] += firstHalfMinutes;
                values[downtime.typ][1][downtime.bramka - 1] += secondHalfMinutes;
            }

            for (let typ of Object.keys(values)) {
                this.state.sheet.setValue(cells[typ][0][0], values[typ][0][0]);
                this.state.sheet.setValue(cells[typ][0][1], values[typ][0][1]);
                this.state.sheet.setValue(cells[typ][1][0], values[typ][1][0]);
                this.state.sheet.setValue(cells[typ][1][1], values[typ][1][1]);
            }
        }, this);
    }

    #bindSheetToBoxStorage() {
        let box = new NumberBox();
        box.expiresAfter = null;

        const cellsToStore = {
            'sztuki-we-wozku-polowa': 'shift',
            'sztuki-we-wozku-koniec': 'shift',
            'takt': null,
            'cel-polowa': null,
            'cel-koniec': null,
            'cel-linii-polowa': null,
            'cel-linii-koniec': null,
            'braki-polowa': null,
            'braki-koniec': null,
            'czyszczenie-b1-polowa': null,
            'czyszczenie-b2-polowa': null,
            'czyszczenie-b1-koniec': null,
            'czyszczenie-b2-koniec': null
        };

        this.state.sheet.on('value-changed', (cellId, oldValue) => {
            if (cellId in cellsToStore) {
                box.expiresAfter = cellsToStore[cellId];
                box.value = this.state.sheet.getValue(cellId);

                BoxStorage.set('cells-' + cellId, box);
            }
        });
    }

    #bindDowntimesToBoxStorage() {
        this.state.downtimes.on('entries-changed', () => {
            // clear all old entries from box storage
            for (let key of BoxStorage.enumerateKeys(/downtime-.+/)) {
                BoxStorage.remove(key);
            }

            let box = new DowntimeBox();
            box.expiresAfter = 'shift';

            for (let downtime of this.state.downtimes.entries) {
                box.value = downtime;
                BoxStorage.set('downtime-' + downtime.id, box);
            }
        }, this);
    }

    #loadSheetFromBoxStorage() {
        let box = new NumberBox();
        box.expiresAfter = null;

        for (let key of BoxStorage.enumerateKeys(/cells-.+/)) {
            if (BoxStorage.get(key, box)) {
                let cellId = key.slice('cells-'.length);

                this.state.sheet.setValue(cellId, box.value);
            }
        }
    }

    #loadDowntimesFromBoxStorage() {
        let box = new DowntimeBox();

        for (let key of BoxStorage.enumerateKeys(/downtime-.+/)) {
            if (BoxStorage.get(key, box) === true) {
                this.state.downtimes.push(box.value);
            }
        }
    }
}
customElements.define('tablica-app-3', TablicaApp3);

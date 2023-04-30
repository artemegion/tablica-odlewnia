import { LitElement, css, html } from '../vendor/lit.js';
import './AppUpdatesListener.js';
import './AppTitlebar.js';
import './ShiftHoursBubbles.js';
import './FoldableContent.js';
import './DowntimesWizard.js';
import './DowntimesRenderer.js';
import { CalcSheet } from '../lib/CalcSheet.js';
import { Downtime, Downtimes } from '../lib/Downtimes.js';
import { TimeRange } from '../lib/TimeRange.js';
import { ShiftTable } from '../lib/ShiftTable.js';

export class TablicaApp extends LitElement {
    static properties = {
        detailedSpeedLoss: {
            type: Boolean,
            reflect: false
        },

        showParameters: {
            type: Boolean,
            reflect: false
        }
    };

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
        this.detailedSpeedLoss = false;
        this.showParameters = false;

        this.#calcSheet = new CalcSheet();
        this.#downtimes = new Downtimes();
        this.#downtimes.addEventListener('edit-requested', this.#onDowntimesEditRequested, this);

        if (DEBUG === true) {
            this.calcSheet = this.#calcSheet;
            this.downtimes = this.#downtimes;
        }

        this.#connectDowntimesToCalcSheet();
    }

    #calcSheet;
    #downtimes;

    #connectDowntimesToCalcSheet() {
        this.#downtimes.addEventListener('entries-changed', () => {
            this.#calcSheet.emit('formula-arg-changed');

            let cells = {
                'awaria': [
                    [this.#calcSheet.getCell('strata-awaria-b1-polowa'), this.#calcSheet.getCell('strata-awaria-b2-polowa')],
                    [this.#calcSheet.getCell('strata-awaria-b1-koniec'), this.#calcSheet.getCell('strata-awaria-b2-koniec')]
                ],
                'naprawa': [
                    [this.#calcSheet.getCell('strata-naprawa-b1-polowa'), this.#calcSheet.getCell('strata-naprawa-b2-polowa')],
                    [this.#calcSheet.getCell('strata-naprawa-b1-koniec'), this.#calcSheet.getCell('strata-naprawa-b2-koniec')]
                ]
            };

            let cacheValue = {
                'awaria': [[0, 0], [0, 0]],
                'naprawa': [[0, 0], [0, 0]],
            }

            let shiftHalves = ShiftTable.getShiftHalves(ShiftTable.getDayShift());

            for (let downtime of this.#downtimes.entries) {
                let firstHalfMinutes = (TimeRange.intersect(downtime.timeRange, shiftHalves[0]) ?? { minutes: 0 }).minutes;
                let secondHalfMinutes = (TimeRange.intersect(downtime.timeRange, shiftHalves[1]) ?? { minutes: 0 }).minutes;

                cacheValue[downtime.typ][0][downtime.bramka - 1] += firstHalfMinutes;
                cacheValue[downtime.typ][1][downtime.bramka - 1] += secondHalfMinutes;
            }

            for (let typ of Object.keys(cacheValue)) {
                cells[typ][0][0].value = cacheValue[typ][0][0];
                cells[typ][0][1].value = cacheValue[typ][0][1];
                cells[typ][1][0].value = cacheValue[typ][1][0];
                cells[typ][1][1].value = cacheValue[typ][1][1];
            }
        }, this);
    }

    render() {
        return html`
            <link rel="stylesheet" href="/tablica-odlewnia/styles/index.css" />
            <app-updates-listener></app-updates-listener>

            <app-titlebar></app-titlebar>
            <shift-hours-bubbles></shift-hours-bubbles>

            <form>
                <fieldset style="margin-bottom: 0;">
                    <legend>Sztuki we wózku</legend>
                    <input id="sztuki-we-wozku-polowa" title="Sztuki we wózku połowa" placeholder="" type="number" />
                    <input id="sztuki-we-wozku-koniec" title="Sztuki we wózku koniec" placeholder="" type="number" />
                </fieldset>

                <foldable-content folded=${!this.showParameters}>
                <fieldset style="margin-top: 1em;">
                    <legend>Takt</legend>
                    <input id="takt" title="Takt" placeholder="" type="number" value="0.85" />
                </fieldset>

                <fieldset>
                    <legend>Cel 100%</legend>
                    <input id="cel-polowa" title="Cel 100% połowa" placeholder="" type="number" value="565" />
                    <input id="cel-koniec" title="Cel 100% koniec" placeholder="" type="number" value="1125" />
                </fieldset>

                <fieldset>
                    <legend>Cel linii</legend>
                    <input id="cel-linii-polowa" title="Cel linii połowa" placeholder="" type="number" value="480" />
                    <input id="cel-linii-koniec" title="Cel linii koniec" placeholder="" type="number" value="960" />
                </fieldset>

                <fieldset>
                    <legend>Braki</legend>
                    <input id="braki-polowa" title="Braki połowa" placeholder="" type="number" value="8" />
                    <input id="braki-koniec" title="Braki koniec" placeholder="" type="number" value="8" />
                </fieldset>

                <fieldset style="margin-bottom: 0;">
                    <legend>Czyszczenie i pokrywanie narzędzia</legend>
                    <input id="czyszczenie-b1-polowa" title="Czyszczenie bramka 1 połowa" type="number" value="20" />
                    <input id="czyszczenie-b2-polowa" title="Czyszczenie bramka 2 połowa" type="number" value="20" />
                    <input id="czyszczenie-b1-koniec" title="Czyszczenie bramka 1 koniec" type="number" value="20" />
                    <input id="czyszczenie-b2-koniec" title="Czyszczenie bramka 2 koniec" type="number" value="20" />
                </fieldset>
                </foldable-content>

                <fieldset>
                    <button @click=${() => { this.showParameters = !this.showParameters; }} type="button" class="basis-1-1" style="padding: 0; margin: 0; padding-top: 0.2em; padding-bottom: 0.2em; margin-top: 0.2em;text-align: center; background-color: var(--field-bg-color-disabled); font-size: var(--font-size-s);">${this.showParameters === false ? '▼' : '▲'}</button>
                </fieldset>

                <downtimes-wizard id="downtimes-wizard" showTimeError .downtimes=${this.#downtimes}></downtimes-wizard>

                <hr />

                <downtimes-renderer .downtimes=${this.#downtimes}></downtimes-renderer>

                <fieldset disabled>
                    <legend>Spływ narastająco [zgodne + braki]</legend>
                    <input id="splyw-narastajaco-polowa" title="Spływ narastająco połowa" type="number" />
                    <input id="splyw-narastajaco-koniec" title="Spływ narastająco koniec" type="number" />
                </fieldset>

                <fieldset disabled>
                    <legend>Spływ z godziny [zgodne + braki]</legend>
                    <input id="splyw-z-godziny-polowa" title="Spływ z godziny połowa" type="number" />
                    <input id="splyw-z-godziny-koniec" title="Spływ z godziny koniec" type="number" />
                </fieldset>

                <fieldset disabled>
                    <legend>Brakujące sztuki do 100%</legend>
                    <input id="brakujace-sztuki-do-100" title="Brakujące sztuki do 100%" type="number" />
                </fieldset>

                <fieldset disabled>
                    <legend>Czas strat</legend>
                    <input id="czas-strat-polowa" title="Czas strat połowa" type="number" class="basis-1-2" />
                    
                    <div class="basis-1-2 flex-row flex-gap">
                        <input id="czas-strat-koniec" title="Czas strat koniec" type="number" />
                        <input id="czas-strat-suma" title="Czas strat suma" type="number" style="flex-basis: 60px;"/>
                    </div>
                </fieldset>

                <fieldset disabled style="margin-bottom: 0;">
                    <legend>Strata prędkości</legend>

                    <input id="strata-predkosci-b1-polowa" title="Strata prędkości bramka 1 - połowa" type="number" />
                    <input id="strata-predkosci-b2-polowa" title="Strata prędkości bramka 2 - połowa" type="number" />
                    <input id="strata-predkosci-b1-koniec" title="Strata prędkości bramka 1 - koniec" type="number" />
                    <input id="strata-predkosci-b2-koniec" title="Strata prędkości bramka 2 - koniec" type="number" />
                </fieldset>
                
                <foldable-content id="detailed-speed-loss-foldable" folded=${!this.detailedSpeedLoss}>
                <fieldset disabled style="margin-top: 1em;">
                    <legend>Awaria</legend>

                    <input id="strata-awaria-b1-polowa" title="Strata prędkości bramka 1 - połowa" type="text" />
                    <input id="strata-awaria-b2-polowa" title="Strata prędkości bramka 2 - połowa" type="text" />
                    <input id="strata-awaria-b1-koniec" title="Strata prędkości bramka 1 - koniec" type="text" />
                    <input id="strata-awaria-b2-koniec" title="Strata prędkości bramka 2 - koniec" type="text" />
                </fieldset>

                <fieldset disabled style="margin-bottom: 0;">
                    <legend>Naprawa narzędzia</legend>

                    <input id="strata-naprawa-b1-polowa" title="Strata prędkości bramka 1 - połowa" type="text" />
                    <input id="strata-naprawa-b2-polowa" title="Strata prędkości bramka 2 - połowa" type="text" />
                    <input id="strata-naprawa-b1-koniec" title="Strata prędkości bramka 1 - koniec" type="text" />
                    <input id="strata-naprawa-b2-koniec" title="Strata prędkości bramka 2 - koniec" type="text" />
                </fieldset>
                </foldable-content>
                <fieldset>
                    <button @click=${() => { this.detailedSpeedLoss = !this.detailedSpeedLoss; this.#calcSheet.emit('formula-arg-changed'); }} type="button" class="basis-1-1" style="padding: 0; margin: 0; padding-top: 0.2em; padding-bottom: 0.2em; margin-top: 0.2em;text-align: center; background-color: var(--field-bg-color-disabled); font-size: var(--font-size-s);">${this.detailedSpeedLoss === false ? '▼' : '▲'}</button>
                </fieldset>

                <fieldset disabled>
                    <legend>OEU</legend>
                    <input id="oeu" title="OEU" type="number" />
                </fieldset>

                <hr />

                <fieldset disabled>
                    <legend>Plan produkcji</legend>
                    <input id="plan-produkcji" title="Plan produkcji" type="text" />
                </fieldset>

                <fieldset disabled>
                    <legend>% braków</legend>
                    <input id="procent-brakow" title="Procent braków" type="number" />
                </fieldset>
            </form>

            <footer style="margin-bottom: -4.5em; margin-top: 3em;">
                <div>Copyright ${new Date().getFullYear()} Paweł Ignasiak</div>
                <div>Licensed under the MIT License. <a href="https://www.github.com/artemegion/tablica-odlewnia">GitHub</a></div>
            </footer>`;
    }

    firstUpdated(t) {
        super.firstUpdated(t);

        this.#calcSheet = new CalcSheet({
            'sztuki-we-wozku-polowa': {
                type: 'int',
                defaultValue: undefined
            },

            'sztuki-we-wozku-koniec': {
                type: 'int',
                defaultValue: undefined
            },

            'takt': {
                type: 'float',
                defaultValue: 0.85
            },

            'cel-polowa': {
                type: 'int',
                defaultValue: 565
            },
            'cel-koniec': {
                type: 'int',
                defaultValue: 1125
            },

            'cel-linii-polowa': {
                type: 'int',
                defaultValue: 480
            },
            'cel-linii-koniec': {
                type: 'int',
                defaultValue: 960
            },

            'braki-polowa': {
                type: 'int',
                defaultValue: 8
            },
            'braki-koniec': {
                type: 'int',
                defaultValue: 8
            },

            'czyszczenie-b1-polowa': {
                type: 'int',
                defaultValue: 20
            },
            'czyszczenie-b2-polowa': {
                type: 'int',
                defaultValue: 20
            },
            'czyszczenie-b1-koniec': {
                type: 'int',
                defaultValue: 20
            },
            'czyszczenie-b2-koniec': {
                type: 'int',
                defaultValue: 20
            },

            'splyw-narastajaco-polowa': {
                type: 'int',
                defaultValue: undefined,
                formulaArgs: ['sztuki-we-wozku-polowa', 'braki-polowa'],
                formula: (sztukiWeWozkuPolowa, brakiPolowa) => sztukiWeWozkuPolowa + brakiPolowa
            },
            'splyw-narastajaco-koniec': {
                type: 'int',
                defaultValue: undefined,
                formulaArgs: ['sztuki-we-wozku-koniec', 'braki-koniec'],
                formula: (sztukiWeWozkuKoniec, brakiKoniec) => sztukiWeWozkuKoniec + brakiKoniec
            },

            'splyw-z-godziny-polowa': {
                type: 'int',
                defaultValue: undefined,
                formulaArgs: ['splyw-narastajaco-polowa'],
                formula: splywNarastajacoPolowa => splywNarastajacoPolowa
            },
            'splyw-z-godziny-koniec': {
                type: 'int',
                defaultValue: undefined,
                formulaArgs: ['sztuki-we-wozku-polowa', 'sztuki-we-wozku-koniec', 'braki-koniec'],
                formula: (sztukiWeWozkuPolowa, sztukiWeWozkuKoniec, brakiKoniec) => sztukiWeWozkuKoniec - sztukiWeWozkuPolowa + brakiKoniec
            },

            'brakujace-sztuki-do-100': {
                type: 'int',
                defaultValue: undefined,
                formulaArgs: ['cel-koniec', 'splyw-narastajaco-koniec'],
                formula: (celKoniec, splywNarastajacoKoniec) => celKoniec - splywNarastajacoKoniec
            },

            'czas-strat-polowa': {
                type: 'int',
                defaultValue: undefined,
                formulaArgs: ['cel-polowa', 'splyw-z-godziny-polowa', 'takt'],
                formula: (celPolowa, splywZGodzinyPolowa, takt) => Math.round((celPolowa - splywZGodzinyPolowa) * takt)
            },
            'czas-strat-koniec': {
                type: 'int',
                defaultValue: undefined,
                formulaArgs: ['cel-polowa', 'splyw-z-godziny-koniec', 'takt'],
                formula: (celPolowa, splywZGodzinyKoniec, takt) => Math.round((celPolowa - splywZGodzinyKoniec) * takt)
            },
            'czas-strat-suma': {
                type: 'int',
                defaultValue: undefined,
                formulaArgs: ['czas-strat-polowa', 'czas-strat-koniec'],
                formula: (czasStratPolowa, czasStratKoniec) => czasStratPolowa + czasStratKoniec
            },

            'strata-awaria-b1-polowa': {
                type: 'int',
                defaultValue: 0,
                valueFormatter: (val) => typeof val !== 'number' || val === 0 ? '' : val
            },
            'strata-awaria-b2-polowa': {
                type: 'int',
                defaultValue: 0,
                valueFormatter: (val) => typeof val !== 'number' || val === 0 ? '' : val
            },
            'strata-awaria-b1-koniec': {
                type: 'int',
                defaultValue: 0,
                valueFormatter: (val) => typeof val !== 'number' || val === 0 ? '' : val
            },
            'strata-awaria-b2-koniec': {
                type: 'int',
                defaultValue: 0,
                valueFormatter: (val) => typeof val !== 'number' || val === 0 ? '' : val
            },

            'strata-naprawa-b1-polowa': {
                type: 'int',
                defaultValue: 0,
                valueFormatter: (val) => typeof val !== 'number' || val === 0 ? '' : val
            },
            'strata-naprawa-b2-polowa': {
                type: 'int',
                defaultValue: 0,
                valueFormatter: (val) => typeof val !== 'number' || val === 0 ? '' : val
            },
            'strata-naprawa-b1-koniec': {
                type: 'int',
                defaultValue: 0,
                valueFormatter: (val) => typeof val !== 'number' || val === 0 ? '' : val
            },
            'strata-naprawa-b2-koniec': {
                type: 'int',
                defaultValue: 0,
                valueFormatter: (val) => typeof val !== 'number' || val === 0 ? '' : val
            },

            'strata-predkosci-b1-polowa': {
                type: 'int',
                defaultValue: undefined,
                formulaArgs: ['czas-strat-polowa', /czyszczenie-(b1|b2)-polowa/, /strata-(awaria|naprawa)-(b1|b2)-polowa/],
                formula: ((czasStrat, czyszczenie, strataPrzestoj) => Math.floor(
                    (czasStrat - czyszczenie.sum() - (this.detailedSpeedLoss ? strataPrzestoj.sum() : 0)) / 2)
                ).bind(this)
            },
            'strata-predkosci-b2-polowa': {
                type: 'int',
                defaultValue: undefined,
                formulaArgs: ['czas-strat-polowa', /czyszczenie-(b1|b2)-polowa/, /strata-(awaria|naprawa)-(b1|b2)-polowa/],
                formula: ((czasStrat, czyszczenie, strataPrzestoj) => Math.ceil(
                    (czasStrat - czyszczenie.sum() - (this.detailedSpeedLoss ? strataPrzestoj.sum() : 0)) / 2)
                ).bind(this)
            },
            'strata-predkosci-b1-koniec': {
                type: 'int',
                defaultValue: undefined,
                formulaArgs: ['czas-strat-koniec', /czyszczenie-(b1|b2)-koniec/, /strata-(awaria|naprawa)-(b1|b2)-koniec/],
                formula: ((czasStrat, czyszczenie, strataPrzestoj) => Math.floor(
                    (czasStrat - czyszczenie.sum() - (this.detailedSpeedLoss ? strataPrzestoj.sum() : 0)) / 2)
                ).bind(this)
            },
            'strata-predkosci-b2-koniec': {
                type: 'int',
                defaultValue: undefined,
                formulaArgs: ['czas-strat-koniec', /czyszczenie-(b1|b2)-koniec/, /strata-(awaria|naprawa)-(b1|b2)-koniec/],
                formula: ((czasStrat, czyszczenie, strataPrzestoj) => Math.ceil(
                    (czasStrat - czyszczenie.sum() - (this.detailedSpeedLoss ? strataPrzestoj.sum() : 0)) / 2)
                ).bind(this)
            },

            'oeu': {
                type: 'int',
                defaultValue: undefined,
                formulaArgs: ['splyw-narastajaco-koniec', 'takt', 'cel-linii-koniec'],
                formula: (splywNarastajacoKoniec, takt, celLiniiKoniec) => Math.round(splywNarastajacoKoniec * takt / celLiniiKoniec * 100)
            },
            'plan-produkcji': {
                type: 'int',
                defaultValue: undefined,
                formulaArgs: ['cel-linii-koniec', 'sztuki-we-wozku-koniec'],
                formula: (celLiniiKoniec, sztukiWeWozkuKoniec) => (celLiniiKoniec - sztukiWeWozkuKoniec) * -1,
                valueFormatter: (value) => {
                    let numVal = Number.parseInt(value);
                    if (Number.isNaN(numVal)) {
                        return '';
                    } else {
                        return value > 0 ? `+${value}` : value.toString();
                    }
                }
            },
            'procent-brakow': {
                type: 'float',
                defaultValue: undefined,
                formulaArgs: ['braki-polowa', 'braki-koniec', 'splyw-narastajaco-koniec'],
                formula: (brakiPolowa, brakiKoniec, splywNarastajacoKoniec) => ((brakiPolowa + brakiKoniec) / splywNarastajacoKoniec * 100).toFixed(2)
            }
        }, this.renderRoot);

        if (DEBUG === true) {
            this.calcSheet = this.#calcSheet;
        }

        this.#calcSheet.init();
    }

    /**
     * 
     * @param {string} id 
     */
    #onDowntimesEditRequested(id) {
        this.renderRoot?.getElementById('downtimes-wizard')?.unfold();
    }
}

customElements.define('tablica-app', TablicaApp);

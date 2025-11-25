import { html, css, LitElement } from '../../vendor/lit.js';

import '../SecondaryParametersWizard.js';
import '../DowntimesWizard.js';
import '../DowntimesRenderer.js';

import { TablicaState } from '../../lib/state/TablicaState.js';
import { ValueConversion } from '../../lib/calc/ValueConversion.js';

export class TablicaForm extends LitElement {
    constructor() {
        super();
    }

    /** @type {TablicaState | undefined} */ state;

    render() {
        if (this.state === undefined) return undefined;

        return html`
        <link rel="stylesheet" href="/tablica-odlewnia/styles/index.css" />

        <div class="form">
            <fieldset style="margin-bottom: 0;">
                <legend>Sztuki we wózku</legend>
                <input id="sztuki-we-wozku-polowa" title="Sztuki we wózku połowa" placeholder="" type="number" class="${this.state.showSecondaryParameters ? '' : 'join-to-bottom'}" />
                <input id="sztuki-we-wozku-koniec" title="Sztuki we wózku koniec" placeholder="" type="number" class="${this.state.showSecondaryParameters ? '' : 'join-to-bottom'}" />
            </fieldset>

            <foldable-content folded=${!this.state.showSecondaryParameters}>
            <hr style="color: white; background-color: var(--color-3); height: 1px;" width="100%" size="2">

            <fieldset style="margin-top: 1em;">
                <secondary-parameters-wizard style="flex-grow: 1;" .state=${this.state}></secondary-parameters-wizard>
            </fieldset>

            <fieldset style="margin-top: 1em;">
                <legend>Takt</legend>
                <input id="takt" title="Takt" placeholder="" type="number" />
            </fieldset>

            <fieldset>
                <legend>Cel 100%</legend>
                <input id="cel-polowa" title="Cel 100% połowa" placeholder="" type="number" />
                <input id="cel-koniec" title="Cel 100% koniec" placeholder="" type="number" />
            </fieldset>

            <fieldset>
                <legend>Cel linii</legend>
                <input id="cel-linii-polowa" title="Cel linii połowa" placeholder="" type="number" />
                <input id="cel-linii-koniec" title="Cel linii koniec" placeholder="" type="number" />
            </fieldset>

            <fieldset>
                <legend>Braki</legend>
                <input id="braki-polowa" title="Braki połowa" placeholder="" type="number" />
                <input id="braki-koniec" title="Braki koniec" placeholder="" type="number" />
            </fieldset>

            <fieldset style="margin-bottom: 0;">
                <legend>Czyszczenie i pokrywanie narzędzia</legend>
                <input id="czyszczenie-b1-polowa" title="Czyszczenie bramka 1 połowa" type="number" value="20" class="join-to-bottom" />
                <input id="czyszczenie-b2-polowa" title="Czyszczenie bramka 2 połowa" type="number" value="20" />
                <input id="czyszczenie-b1-koniec" title="Czyszczenie bramka 1 koniec" type="number" value="20" />
                <input id="czyszczenie-b2-koniec" title="Czyszczenie bramka 2 koniec" type="number" value="20" class="join-to-bottom" />
            </fieldset>
            </foldable-content>

            <fieldset>
                <button @click=${() => { this.state.showSecondaryParameters = !this.state.showSecondaryParameters; }} type="button" class="expander-button bottom subtle basis-1-1">${this.state.showSecondaryParameters === false ? '▼' : '▲'}</button>
            </fieldset>

            <downtimes-wizard id="downtimes-wizard" showTimeError .state=${this.state}></downtimes-wizard>

            <hr />

            <downtimes-renderer .state=${this.state}></downtimes-renderer>

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
                <input id="czas-strat-polowa" title="Czas strat połowa" type="number" class="basis-1-2 left" />
                    
                <div class="basis-1-2 flex-row flex-gap-s">
                    <input id="czas-strat-koniec" title="Czas strat koniec" type="number" class="middle" />
                    <input id="czas-strat-suma" title="Czas strat suma" type="number" class="right" style="flex-basis: 60px;" />
                </div>
            </fieldset>

            <fieldset disabled style="margin-bottom: 0;">
                <legend>Strata prędkości</legend>

                <input id="strata-predkosci-b1-polowa" title="Strata prędkości bramka 1 - połowa" type="number" class="${this.state.useDetailedSpeedLoss ? '' : 'join-to-bottom'}" />
                <input id="strata-predkosci-b2-polowa" title="Strata prędkości bramka 2 - połowa" type="number" />
                <input id="strata-predkosci-b1-koniec" title="Strata prędkości bramka 1 - koniec" type="number" />
                <input id="strata-predkosci-b2-koniec" title="Strata prędkości bramka 2 - koniec" type="number" class="${this.state.useDetailedSpeedLoss ? '' : 'join-to-bottom'}" />
            </fieldset>
                
            <foldable-content id="detailed-speed-loss-foldable" folded=${!this.state.useDetailedSpeedLoss}>
            <fieldset disabled style="margin-top: 1em;">
                <legend>Awaria</legend>

                <input id="strata-awaria-b1-polowa" title="Strata prędkości bramka 1 - połowa" type="text" />
                <input id="strata-awaria-b2-polowa" title="Strata prędkości bramka 2 - połowa" type="text" />
                <input id="strata-awaria-b1-koniec" title="Strata prędkości bramka 1 - koniec" type="text" />
                <input id="strata-awaria-b2-koniec" title="Strata prędkości bramka 2 - koniec" type="text" />
            </fieldset>

            <fieldset disabled style="margin-bottom: 0;">
                <legend>Naprawa narzędzia</legend>

                <input id="strata-naprawa-b1-polowa" title="Strata prędkości bramka 1 - połowa" type="text" class="join-to-bottom" />
                <input id="strata-naprawa-b2-polowa" title="Strata prędkości bramka 2 - połowa" type="text" />
                <input id="strata-naprawa-b1-koniec" title="Strata prędkości bramka 1 - koniec" type="text" />
                <input id="strata-naprawa-b2-koniec" title="Strata prędkości bramka 2 - koniec" type="text" class="join-to-bottom" />
            </fieldset>
            </foldable-content>

            <fieldset>
                <button @click=${this.#onUseDetailedSpeedLossClick.bind(this)} type="button" class="basis-1-1 expander-button subtle join-to-top">${this.state.useDetailedSpeedLoss === false ? '▼' : '▲'}</button>
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
        </div>
        `;
    }

    firstUpdated(t) {
        super.firstUpdated(t);

        this.state.observe(this, ['showSecondaryParameters', 'useDetailedSpeedLoss']);
        this.#bindFormToSheet();
    }

    #bindFormToSheet() {
        this.state.sheet.on('value-changed', (cellId, oldValue) => {
            const cell = this.state.sheet.getCell(cellId);
            const cellElem = this.renderRoot?.getElementById(cell.id);

            if (!cellElem || !cell) return;

            if (typeof cell.valueFormatter === 'function') {
                cellElem.value = cell.valueFormatter(this.state.sheet.getValue(cellId));
            } else {
                cellElem.value = this.state.sheet.getValue(cellId);
            }
        });

        for (const cell of this.state.sheet.cells) {
            let cellElem = this.renderRoot?.getElementById(cell.id);
            if (!cellElem) continue;

            cellElem.addEventListener('input', () => {
                if (ValueConversion.isValueConvertible(cell.valueType, cellElem.value) || ValueConversion.isValueAssignable(cell.valueType, cellElem.value)) {
                    this.state.sheet.setValue(cell.id, cellElem.value);
                }
            });

            if (typeof cell.valueFormatter === 'function') {
                cellElem.value = cell.valueFormatter(this.state.sheet.getValue(cell.id));
            } else {
                cellElem.value = this.state.sheet.getValue(cell.id).toString();
            }
        }
    }

    #onUseDetailedSpeedLossClick() {
        this.state.useDetailedSpeedLoss = !this.state.useDetailedSpeedLoss;

        ['strata-awaria-b1-polowa',
            'strata-awaria-b2-polowa',
            'strata-awaria-b1-koniec',
            'strata-awaria-b2-koniec',
            'strata-naprawa-b1-polowa',
            'strata-naprawa-b2-polowa',
            'strata-naprawa-b1-koniec',
            'strata-naprawa-b2-koniec'].forEach(id => {
                this.state.sheet.runFormulasWithArgument(id);
            });
    }
}
customElements.define('tablica-form', TablicaForm);

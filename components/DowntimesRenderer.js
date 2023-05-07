import { LitElement, css, html } from '../vendor/lit.js';
import { Downtimes } from '../lib/Downtimes.js';
import { TimeRange } from '../lib/TimeRange.js';

/**
 * 
 */
export class DowntimesRenderer extends LitElement {
    static styles = css`
    .downtime-total-header {
        padding: 0.4em;
        padding-top: 0.5em;

        background-color: var(--field-bg-color-disabled);
        border-bottom: 1px solid var(--field-border-color-disabled);

        text-align: center;
        font-size: var(--font-size-xs);
        line-height: 1;
    }

    .downtime-total-time {
        padding: 0.5em;
        padding-bottom: 0;

        background-color: var(--field-bg-color-disabled);

        font-size: var(--font-size);
        text-align: center;
    }

    .downtime-total-minutes {
        padding-bottom: 0.5em;

        background-color: var(--field-bg-color-disabled);
        border-bottom: 4px solid var(--field-border-color-disabled);
        color: var(--color-dim);

        font-size: 6pt;
        text-align: center;
    }

    .downtime-uwagi-column {
        /* basis-1-1 flex-col flex-gap-s justify-start */
        flex-basis: 1;
        flex-grow: 1;
        flex-shrink: 1;

        display: flex;
        flex-direction: column;

        justify-content: flex-start;
        align-items: stretch;
    }

    .downtime-column-label {
        padding: 0.4em;
        padding-top: 0.5em;

        /* border-bottom: 1px solid var(--field-border-color-disabled); */

        text-align: center;
        font-size: var(--font-size-s);
        line-height: 1;
    }

    .downtime-duration-column {
        font-size: var(--font-size-s);
        flex-basis: calc(8ch + 1em);
    }

    .downtime-time-span {
        -webkit-user-select: none;
        user-select: none;
    }

    .downtime {
        padding: 0.5em;
        margin-bottom: 0.25em;

        background-color: var(--field-bg-color-disabled);
    }

    .downtime .edit-button {
        -webkit-user-select: none;
        user-select: none;

        margin: -0.5em;
        margin-left: 4px;
        padding: 0.5em;

        background-color: var(--field-bg-color);
    }

    .downtime-uwagi {
        margin-top: 1em;
    }
    `;

    static properties = {
        downtimes: {
            type: Downtimes,
            reflect: false
        }
    };

    constructor() {
        super();
        this.downtimes = new Downtimes();
    }

    render() {

        let przestoje = this.downtimes.entries;

        const renderBramka = ((typ, bramka, firstRendered) => {
            let przestojeOfTyp = przestoje.filter(p => p.typ === typ && p.bramka === bramka);
            let przestojeTotalMinutes = TimeRange.sumMinutes(przestojeOfTyp.map(p => p.timeRange));
            let przestojeTotalMinutesAsFractionOfHour = (przestojeTotalMinutes / 60).toFixed(2);

            return html`
                <div class="flex-row flex-gap-s align-stretch">
                    <div class="downtime-duration-column basis-auto flex-col">
                        ${firstRendered ? html`<div class="downtime-column-label" style="border-bottom: none;">CZAS</div>` : undefined}
                        <div class="downtime-total-header">BRAMKA ${bramka}</div>
                        <div class="downtime-total-time">${przestojeTotalMinutesAsFractionOfHour}&nbsp;h</div>
                        <div class="downtime-total-minutes">${przestojeTotalMinutes}&nbsp;minut</div>
                    </div>

                    <div class="downtime-uwagi-column">
                        ${firstRendered ? html`<div class="downtime-column-label">UWAGI</div>` : undefined}
                        ${przestojeOfTyp.map(p => html`
                        <div class="downtime">
                            <div class="flex-column justify-start align-stretch flex-gap">
                                <div class="basis-auto flex-row flex-gap-s">
                                    <div class="downtime-time-span basis-1-1">
                                        ${p.timeRange.toString().replace('-', '—')}
                                    </div>

                                    <div @click=${this.#onEditClick.bind(this, p.id)} class="edit-button basis-auto">✏️</div>
                                    <div @click=${this.#onDeleteClick.bind(this, p.id)} class="edit-button basis-auto">❌</div>
                                </div>

                                <div class="basis-auto downtime-uwagi">${p.uwagi}</div>
                            </div>
                        </div>
                        `)}
                    </div>
                </div>
            `;
        }).bind(this);

        const renderDowntimesOfType = (typ) => {
            let typToName = {
                'awaria': 'Awaria',
                'naprawa': 'Naprawa narzędzia'
            };

            let typToCode = {
                'awaria': '0010',
                'naprawa': '0110'
            };

            let bramka1Przestoje = przestoje.filter(p => p.typ === typ && p.bramka === 1);
            let bramka2Przestoje = przestoje.filter(p => p.typ === typ && p.bramka === 2);

            let bramka1HTML = bramka1Przestoje.length < 1 ? undefined : renderBramka(typ, 1, true);
            let bramka2HTML = bramka2Przestoje.length < 1 ? undefined : renderBramka(typ, 2, bramka1Przestoje.length < 1);

            // Calculate total downtime for bramka1, round it to 2 decimal places.
            // Do the same for bramka2. Add them together, round to 2 decimal places
            let bramka1Fraction = Number.parseFloat((TimeRange.sumMinutes(bramka1Przestoje.filter(p => p.typ === typ).map(p => p.timeRange)) / 60).toFixed(2));
            let bramka2Fraction = Number.parseFloat((TimeRange.sumMinutes(bramka2Przestoje.filter(p => p.typ === typ).map(p => p.timeRange)) / 60).toFixed(2));

            let przestojeTotalMinutesAsFractionOfHour = (bramka1Fraction + bramka2Fraction).toFixed(2);

            return html`
            <fieldset class="align-stretch flex-gap-s flex-col">
                <legend>${typToName[typ]}&nbsp;(${typToCode[typ]}) — ${przestojeTotalMinutesAsFractionOfHour}h</legend>
                ${bramka1HTML}
                ${bramka2HTML}
            </fieldset>
            `;
        }

        return html`
        <link rel="stylesheet" href="/tablica-odlewnia/styles/index.css" />
        ${przestoje.filter(p => p.typ === 'awaria').length > 0 ? renderDowntimesOfType('awaria') : undefined}
        ${przestoje.filter(p => p.typ === 'naprawa').length > 0 ? renderDowntimesOfType('naprawa') : undefined}
        ${przestoje.length > 0 ? html`<hr />` : undefined}
        `;
    }

    /**
     * 
     * @param {Map} t 
     */
    updated(t) {
        super.updated(t);

        if (t.has('downtimes')) {
            t.get('downtimes')?.off('entries-changed', this.#onDowntimesChanged);
            this.downtimes.on('entries-changed', this.#onDowntimesChanged, this);
        }
    }

    /**
     * 
     */
    #onDowntimesChanged() {
        this.requestUpdate();
    }

    /**
     * 
     * @param {string} id 
     */
    #onEditClick(id) {
        this.downtimes.emit('edit-requested', id);
    }

    /**
     * 
     * @param {string} id 
     */
    #onDeleteClick(id) {
        // this.downtimes.emit('delete-requested', id);
        this.downtimes.removeById(id);
    }
}
customElements.define('downtimes-renderer', DowntimesRenderer);
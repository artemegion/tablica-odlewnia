import { css, html, LitElement } from '../../vendor/lit.js';

export class TablicaKody extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .detail {
            font-size: var(--font-size-s);
            color: var(--text-color-dim);
        }
    `;

    static codes = {
        '0110': ['Regeneracja narzędzia', ''],
        '0010': ['Awaria maszyny', 'portal, łyżka odlewnicza, ucinak sitka, podajnik sitka, drzwi bezpieczeństwa, osłona pieca, brak odbioru odlewu, brak ruchu MK, AK, SB, BK, brak chłodzenia, brak smarowania, brak mediów, brak temperatury metalu'],
        '0020': ['Wymiana/wadliwe narzędzie', 'wymiana pinolek solnych, pinol głównych'],
        '0030': ['Brak/wadliwy materiał', 'zbrakowane odlewy na strukturę metalu, niezgodności pomiarowe'],
        '0040': ['Personel', 'brak operatora'],
        '0050': ['Faza rozruchu', 'czyszczenie kokili, rozruch, wymiana numerów tygodniowych'],
        '0060': ['Pomiar/wzorce odlewy do pomiaru', 'próby technologiczne'],
        '0070': ['Zadania/problemy organizacyjne', 'brak metalu, brak alfinu'],
        '0080': ['Nieplanowane przerwy logistyczne', 'brak wkładek tłokowych, rdzeni solnych, pasków wzmacniających'],
        '0090': ['Autonomiczne utrzymanie ruchu', 'płukanie kokili, wyładowania atmosferyczne'],
        '0100': ['Wykonanie odlewu próbnego do weryfikacji formy odlewniczej', '']
    };

    render() {
        return html`
            <link rel="stylesheet" href="/tablica-odlewnia/styles/index.css" />

            <div class="table" style="--table-columns: 2fr 2fr;">
                <div class="title">Typy błędów EEP64PF</div>
                <div class="cell header">Kod błędu</div>
                <div class="cell header">Opis</div>
                ${Object.keys(TablicaKody.codes).map(code => html`
                    <div class="cell">${code}</div>
                    <div class="cell">${TablicaKody.codes[code][0]}<br /><span class="detail">${TablicaKody.codes[code][1]}</span></div>
                `)}
            </div>
        `;
    }
}
customElements.define('tablica-kody', TablicaKody);

import { LitElement, css, html } from '../vendor/lit.js';
import './PopupWindow.js';
import './FoldableContent.js';

export class ThemeSelector extends LitElement {
    static properties = {
        themeName: {
            type: String,
            reflect: false
        },

        selectorOpen: {
            type: Boolean,
            reflect: false
        }
    };

    static styles = css`
        :host {
            display: block;
        }
    `;

    constructor() {
        super();
        this.themeName = this.#getThemeId();
        this.selectorOpen = false;
    }

    #themes = [
        {
            name: 'dark',
            icon: '🌘'
        },
        {
            name: 'light',
            icon: '☀️'
        },
        {
            name: 'blue',
            icon: '🦚'
        },
        {
            name: 'coffee',
            icon: '☕'
        }
    ];

    render() {
        return html`
        <link rel="stylesheet" href="/tablica-odlewnia/styles/index.css" />

        <div id="icon" @click=${this.#onIconClick.bind(this)}>🎨</div>

        <popup-window title="Wybierz motyw" ?open=${this.selectorOpen} style="--container-justify-content: flex-start;" @containerClick=${() => { this.selectorOpen = false; }}>
            <div class="flex-row justify-center flex-gap">
                ${this.#themes.map(theme => html`<div style="font-size: 24pt;" @click=${this.#onThemeClick.bind(this, theme.name)}>${theme.icon}</div>`)}
            </div>
        </popup-window>
        `;
    }

    connectedCallback() {
        super.connectedCallback();

        // apply side effects without changing the theme
        this.#setThemeId(this.#getThemeId());
    }

    /**
     * 
     * @param {number} id 
     */
    #setThemeId(id) {
        if (this.#themes.findIndex(theme => theme.name === id) < 0) id = 'dark';

        document.body.setAttribute('data-app-theme', id);

        localStorage.setItem('app-theme', id);
        this.themeName = id;
    }

    /**
     * @returns {number}
     */
    #getThemeId() {
        let appThemeId = localStorage.getItem('app-theme');

        if (this.#themes.findIndex(theme => theme.name === appThemeId) < 0) {
            appThemeId = 'dark';
            this.#setThemeId('dark');
        }

        return appThemeId;
    }

    #onIconClick() {
        this.selectorOpen = !this.selectorOpen;
    }

    #onThemeClick(themeName) {
        this.selectorOpen = false;
        this.#setThemeId(themeName);
    }
}

customElements.define('theme-selector', ThemeSelector);

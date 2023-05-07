import { LitElement, css, html } from '../vendor/lit.js';
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
            font-size: var(--font-size);
        }

        #theme-selector-dialog {
            position: fixed;
            top: 2em;
            left: 10vw;
            width: 80vw;

            padding: 0.25em;

            background-color: var(--field-bg-color);
            border: 0px solid var(--field-border-color);
            border-bottom-width: 4px;

            box-shadow: 0px 6px 23px -10px rgba(43, 48, 60, 1);

            transition: opacity 0.2s ease-in-out;
        }

        #theme-selector-dialog[data-opened="true"] {
            pointer-events: all;
            opacity: 1;
        }

        #theme-selector-dialog[data-opened="false"] {
            pointer-events: none;
            opacity: 0;
        }

        #theme-selector-dialog label {
            font-size: var(--font-size);
        }

        #theme-selector-behind {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;

            pointer-events: none;
        }

        #theme-selector-behind[data-opened="true"] {
            pointer-events: all;
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

        <div id="theme-selector-behind" data-opened="${this.selectorOpen}" @click=${this.#onThemeSelectorBehindClick.bind(this)}></div>
        <div id="theme-selector-dialog" data-opened="${this.selectorOpen}"  @click=${this.#onThemeSelectorDialogClick.bind(this)} class="flex-column justify-start align-center">
            <label class="basis-auto">Wybierz motyw aplikacji</label>
            &nbsp;<br />&nbsp;
            <div class="basis-1-1 flex-row justify-center align-start flex-gap-s">
                ${this.#themes.map(theme => html`<div @click=${this.#onThemeClick.bind(this, theme.name)}>${theme.icon}</div>`)}
            </div>
        </div>
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

        // this.renderRoot?.getElementById('text')?.innerText = this.#themes[id].icon;
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

    #onThemeSelectorBehindClick() {
        this.selectorOpen = false;
    }

    #onThemeSelectorDialogClick(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    #onIconClick() {
        this.selectorOpen = !this.selectorOpen;

        if (this.selectorOpen) {
            this.renderRoot.getElementById('theme-selector-dialog').style.top = this.renderRoot.getElementById('icon').getBoundingClientRect().bottom + 1 + 'px';
        }
    }

    #onThemeClick(themeName) {
        this.selectorOpen = false;
        this.#setThemeId(themeName);
    }
}

customElements.define('theme-selector', ThemeSelector);

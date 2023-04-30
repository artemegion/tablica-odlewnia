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

        .theme-dropdown {
            display: flex;
            flex-direction: row;

            justify-content: flex-start;
            align-items: center;

            flex-wrap: wrap;
            gap: 0.25em;

            background-color: var(--field-bg-color);
            padding: 0.25em;
        }

        foldable-content {
            position: absolute;
            max-width: 30%;

            margin-left: calc(var(--client-width) * -1);
        }

        foldable-content[folded="false"] {
            border: 1px solid var(--field-bg-color-disabled);
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
        }
    ];

    render() {
        let icon = this.#themes.find(theme => theme.name === this.themeName).icon;

        return html`
        <link rel="stylesheet" href="/tablica-odlewnia/styles/index.css" />

        <div @click=${this.#onIconClick.bind(this)}>🎨</div>
        <foldable-content id="theme-foldable" folded=${!this.selectorOpen}>
            <div class="theme-dropdown">
                ${this.#themes.map(theme => html`<div @click=${this.#onThemeClick.bind(this, theme.name)}>${theme.icon}</div>`)}
            </div>
        </foldable-content>
        `;
    }

    connectedCallback() {
        super.connectedCallback();

        // apply side effects without changing the theme
        this.#setThemeId(this.#getThemeId());
    }

    updated(t) {
        super.updated(t);

        let themeFoldableElem = this.renderRoot?.getElementById('theme-foldable');
        this.style.setProperty('--client-width', themeFoldableElem.getBoundingClientRect().width + 1 - this.getBoundingClientRect().width + 'px');
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

    #onIconClick() {
        this.selectorOpen = !this.selectorOpen;
    }

    #onThemeClick(themeName) {
        this.selectorOpen = false;
        this.#setThemeId(themeName);
    }
}

customElements.define('theme-selector', ThemeSelector);

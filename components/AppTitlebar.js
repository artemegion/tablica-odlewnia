import { LitElement, css, html } from '../vendor/lit.js';
import './ShiftThisWeek.js';
import './ThemeSelector.js';

export class AppTitlebar extends LitElement {
    static properties = {

    };

    static styles = css`
        :host {
            -webkit-user-select: none;
            user-select: none;

            display: block;

            margin-bottom: 1em;
        }

        #app-title {
            margin-top: 0.5em;

            text-align: center;
            font-size: 1.4em;
        }

        #padding-emoji {
            opacity: 0;
            pointer-events: none;
            float: left;
            font-size: 1.3em;
        }

        theme-selector {
            float: right;
            font-size: 1.3em;
        }
    `;

    constructor() {
        super();
    }

    render() {
        return html`
            <div id="app-title">
                <span>Tablica odlewnia</span>
                <span id="padding-emoji">⬇️</span>
                <theme-selector></theme-selector>
            </div>
            <shift-this-week />
        `;
    }
}

customElements.define('app-titlebar', AppTitlebar);

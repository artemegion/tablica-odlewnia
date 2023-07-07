import { State } from './State.js';
import { Downtimes } from '../Downtimes.js';
import { TablicaSheet } from '../calc/TablicaSheet.js';

export class TablicaState extends State {
    constructor() {
        super();

        this.showSecondaryParameters = false;
        this.useDetailedSpeedLoss = false;

        this.downtimes = new Downtimes();
        this.sheet = new TablicaSheet(this);
    }

    /** @type {boolean} */ useDetailedSpeedLoss;
    /** @type {boolean} */ showSecondaryParameters;

    /** @type {Downtimes} */ downtimes;
    /** @type {TablicaSheet} */ sheet;
}

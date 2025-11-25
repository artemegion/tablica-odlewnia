import { State } from './State.js';
import { Downtimes } from '../Downtimes.js';
import { TablicaSheet } from '../calc/TablicaSheet.js';
import { AutomatyTablicaSheet } from '../calc/AutomatyTablicaSheet.js';

export class TablicaState extends State {
    constructor() {
        super();

        this.showSecondaryParameters = false;
        this.useDetailedSpeedLoss = false;
        this.showSecondaryParametersPicker = false;

        this.downtimes = new Downtimes();
        this.sheet = new TablicaSheet(this);
    }

    /** @type {boolean} */ useDetailedSpeedLoss;
    /** @type {boolean} */ showSecondaryParameters;
    /** @type {boolean} */ showSecondaryParametersPicker;

    /** @type {Downtimes} */ downtimes;
    /** @type {TablicaSheet} */ sheet;
}

export class AutomatyTablicaState extends State {
    constructor() {
        super();

        this.showSecondaryParameters = false;
        this.useDetailedSpeedLoss = false;

        this.downtimes = new Downtimes();
        this.sheet = new AutomatyTablicaSheet(this);
    }

    /** @type {boolean} */ useDetailedSpeedLoss;
    /** @type {boolean} */ showSecondaryParameters;

    /** @type {Downtimes} */ downtimes;
    /** @type {AutomatyTablicaSheet} */ sheet;
}
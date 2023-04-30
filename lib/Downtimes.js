import { TimeRange } from './TimeRange.js';
import { EventEmitter } from './EventEmitter.js';
import { id } from './id.js';

export class Downtimes extends EventEmitter {
    constructor() {
        super();
        this.#downtimes = [];
    }

    /** @type {Downtime[]} */ #downtimes;

    /**
     * @returns {readonly Downtime[]}
     */
    get entries() {
        return this.#downtimes;
    }

    get totalMinutesAwaria() {
        return this.#downtimes.map(d => d.typ === 'awaria' ? d.minutes : 0).reduce((pV, cV) => pV + cV);
    }

    get totalMinutesNaprawa() {
        return this.#downtimes.map(d => d.typ === 'naprawa' ? d.minutes : 0).reduce((pV, cV) => pV + cV);
    }

    /**
     * Get a downtime by id.
     * @param {string} id 
     * @returns {Downtime | undefined}
     */
    getById(id) {
        return this.#downtimes.find(d => d.id === id);
    }

    /**
     * 
     * @param {Downtime} downtime 
     */
    push(downtime) {
        this.#downtimes.push(downtime);
        this.emit('entries-changed', {});
    }

    pop() {
        this.#downtimes.pop();
        this.emit('entries-changed', {});
    }

    /**
     * Removes a downtime with specified id.
     * @param {string} id 
     */
    removeById(id) {
        let index = this.#downtimes.findIndex(d => d.id === id);
        if (index > -1) this.removeAt(index);
    }

    /**
     * 
     * @param {Downtime} downtime 
     */
    remove(downtime) {
        let index = this.#downtimes.findIndex(d => d === downtime);
        if (index > -1) {
            this.#downtimes.splice(index, 1);
            this.emit('entries-changed', {});
        }
    }

    /**
     * 
     * @param {number} index 
     */
    removeAt(index) {
        if (index > -1 && index < this.#downtimes.length) {
            this.#downtimes.splice(index, 1);
            this.emit('entries-changed', {});
        }
    }

    clear() {
        this.#downtimes = [];
        this.emit('entries-changed', {});
    }
}

export class Downtime {
    /**
     * 
     * @param {'awaria' | 'naprawa'} [typ]
     * @param {1 | 2} [bramka] 
     * @param {string} [uwagi] 
     * @param {TimeRange} [timeRange] 
     */
    constructor(typ, bramka, uwagi, timeRange) {
        this.#id = id();
        this.typ = typ ?? '';
        this.bramka = bramka ?? 1;
        this.uwagi = uwagi ?? '';
        this.timeRange = timeRange ?? new TimeRange();
    }

    /** @type {string} */ #id;
    /** @type {'awaria' | 'naprawa'} */ #typ;
    /** @type {1 | 2} */ #bramka;
    /** @type {string} */ #uwagi;
    /** @type {TimeRange} */ #timeRange;

    get id() {
        return this.#id;
    }

    get typ() {
        return this.#typ;
    }

    set typ(val) {
        this.#typ = val;
    }

    get bramka() {
        return this.#bramka;
    }

    set bramka(val) {
        this.#bramka = val;
    }

    get uwagi() {
        return this.#uwagi;
    }

    set uwagi(val) {
        this.#uwagi = val;
    }

    get timeRange() {
        return this.#timeRange;
    }

    set timeRange(val) {
        if (val instanceof TimeRange) {
            this.#timeRange = val;
        } else if (typeof val === 'string') {
            this.#timeRange = TimeRange.fromString(val);
        }
    }

    get minutes() {
        return this.#timeRange.minutes;
    }
}
import { ShiftTable } from '../ShiftTable.js';

/**
 * @typedef ShiftStamp
 * @prop {1|2|3} shift
 * @prop {{ day: number, month: number, year: number }} date
 */

/**
 * @typedef BoxModel
 * @prop {boolean} hasValue
 * @prop {string} valueJson
 * @prop {ShiftStamp?} expiresAfter
 */

const STORAGE_PREFIX = 'jKmRtZxQ';

export class BoxStorage {
    /**
     * 
     * @template T
     * @param {string} key 
     * @param {Box<T>} box 
     */
    static set(key, box) {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify({
            hasValue: box.hasValue,
            valueJson: box.hasValue ? box.valueJSON : "null",
            expiresAfter: box.expiresAfter
        }));
    }

    /**
     * 
     * @template {T}
     * @param {string} key 
     * @param {Box<T>} box 
     */
    static get(key, box) {
        let boxJSON = localStorage.getItem(STORAGE_PREFIX + key);
        if (boxJSON === null) return new Error(`No box associated with key '${key}' was found.`);

        /** @type {BoxModel} */ let boxModel = JSON.parse(boxJSON);

        // check if value is expired
        if (boxModel.expiresAfter !== null) {
            let shift = ShiftTable.getDayShift();
            let today = ShiftTable.getShiftDate();

            if (boxModel.expiresAfter.shift !== shift
                || boxModel.expiresAfter.date.day !== today.getDate()
                || boxModel.expiresAfter.date.month !== today.getMonth()
                || boxModel.expiresAfter.date.year !== today.getFullYear()) {

                localStorage.removeItem(STORAGE_PREFIX + key);
                return new Error(`Box associated with key '${key}' is expired.`);
            }
        }

        box.expiresAfter = boxModel.expiresAfter;
        if (!boxModel.hasValue) box.hasValue = false;
        else box.valueJSON = boxModel.valueJson;

        return true;
    }

    /**
     * 
     * @param {string} key 
     */
    static remove(key) {
        localStorage.removeItem(STORAGE_PREFIX + key);
    }

    static clear() {
        for (let i = 0, len = localStorage.length; i < len; i++) {
            let key = localStorage.key(i);

            if (key?.startsWith(STORAGE_PREFIX)) {
                localStorage.removeItem(key);
            }
        }
    }

    /**
     * 
     * @param {RegExp} keyExpr 
     * @returns {Generator<string, void, never>}
     */
    static *enumerateKeys(keyExpr) {
        for (let i = 0, len = localStorage.length; i < len; i++) {
            let key = localStorage.key(i);
            if (key === null) continue;
            if (!key.startsWith(STORAGE_PREFIX)) continue;

            key = key.slice(STORAGE_PREFIX.length);

            if (keyExpr.test(key)) {
                yield key;
            }
        }
    }
}

/**
 * @template T
 */
export class Box {
    static valueType = Object;

    constructor() {
        this.hasValue = false;
        this.expiresAfter = null;
    }

    /** @type {T} */ #value;
    /** @type {boolean} */ #hasValue;
    /** @type {ShiftStamp?} */ #expiresAfter;

    /**
     * @returns {ShiftStamp?}
     */
    get expiresAfter() {
        return this.#expiresAfter;
    }

    /**
     * @param {ShiftStamp | 'shift' | null} val
     */
    set expiresAfter(val) {
        if (val === 'shift') {
            let date = ShiftTable.getShiftDate();
            val = {
                shift: ShiftTable.getDayShift(),
                date: {
                    day: date.getDate(),
                    month: date.getMonth(),
                    year: date.getFullYear()
                }
            };
        }

        this.#expiresAfter = val;
    }

    /**
     * @returns {boolean}
     */
    get hasValue() {
        return this.#hasValue;
    }

    /**
     * @param {false} val
     */
    set hasValue(val) {
        if (val !== false) throw new Error('Can only set Box#hasValue to false, to clear the value from the Box.');
        this.#value = undefined;
        this.#hasValue = false;
    }

    /**
     * @returns {T | Error}
     */
    get value() {
        return this.#hasValue ? this.#value : new Error('No value stored in Box.');
    }

    /**
     * @param {T} val
     */
    set value(val) {
        if (val.constructor.name !== this.constructor.valueType.name) {
            throw new Error(`${this.constructor.name}#value can only be set to a value of type ${this.constructor.valueType.name}.`);
        }

        this.#value = val;
        this.#hasValue = true;
    }

    /**
     * @returns {string}
     */
    get valueJSON() {
        return JSON.stringify(this.value);
    }

    /**
     * @param {string} val
     */
    set valueJSON(val) {
        this.value = JSON.parse(val);
    }
}

window.BoxStorage = BoxStorage;

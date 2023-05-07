import { EventEmitter } from './EventEmitter.js';

/**
 * @callback ValueFormatterFn
 * @param {unknown} value the value to format
 * @returns {string} value formatted for display purposes
 */

/**
 * 
 */
export class CalcCell extends EventEmitter {
    constructor() {
        super();
        this.inputElement = null;
        this.valueFormatter = null;
    }

    /** @type {string} */ id;
    /** @type {string} */ type;
    /** @type {any} */ defaultValue;
    /** @type {(CalcCell | CalcCell[])[]} */ formulaArgs;
    /** @type {Function} */ formula;
    /** @type {HTMLInputElement?} */ inputElement;
    /** @type {ValueFormatterFn?} */ valueFormatter;

    /** @type {any} */ #value;

    /**
     * @returns {any}
     */
    get value() {
        return this.#value;
    }

    /**
     * @param {any} val
     */
    set value(val) {
        if (typeof val === 'string') {
            if (this.isValueConvertible(val)) {
                val = this.convertValue(val);
                if (this.#value !== val) {
                    this.#value = val;
                    this.emit('value-changed', this.#value);
                }
            } else {
                this.value = this.defaultValue;
                this.emit('value-changed', this.#value);
            }
        } else {
            if (this.isValueValid(val) && this.#value !== val) {
                this.#value = val;
                this.emit('value-changed', this.#value);
            }
        }
    }

    isValueConvertible(value) {
        if (value === undefined) {
            return this.type.endsWith('?');
        }
        else if (typeof value === 'string') {
            switch (this.type) {
                case 'int':
                    return Number.isInteger(Number.parseInt(value));
                case 'int?':
                    return Number.isInteger(Number.parseInt(value)) || value === '';
                case 'float':
                    return !Number.isNaN(Number.parseFloat(value));
                case 'float?':
                    return !Number.isNaN(Number.parseFloat(value)) || value === '';
                case 'bool':
                    return ['true', 'false'].includes(value.toLowerCase());
                case 'bool?':
                    return ['true', 'false'].includes(value.toLowerCase()) || value === '';
                case 'string':
                case 'string?':
                    return true;
            }
        }
    }

    convertValue(value) {
        switch (this.type) {
            case 'int': return Number.parseInt(value);
            case 'int?': return Number.isInteger(Number.parseInt(value)) ? Number.parseInt(value) : undefined;
            case 'float': return Number.parseFloat(value);
            case 'float?': return !Number.isNaN(Number.parseFloat(value)) ? Number.parseFloat(value) : undefined;
            case 'bool': return value.toLowerCase() === 'true' ? true : false;
            case 'bool?': return value.toLowerCase() === 'true' ? true : value.toLowerCase() === 'false' ? false : undefined;
            case 'string':
            case 'string?': return value;
            default: return undefined;
        }
    }

    isValueValid(value = undefined) {
        value = value ?? this.#value;

        switch (this.type) {
            case 'int': return Number.isInteger(value);
            case 'int?': return Number.isInteger(value) || value === undefined;
            case 'float': return !Number.isNaN(value);
            case 'float?': return !Number.isNaN(value) || value === undefined;
            case 'bool': return value === true || value === false;
            case 'bool?': return value === true || value === false || value === undefined;
            case 'string': return typeof value === 'string';
            case 'string?': return typeof value === 'string' || value === undefined;
            default: return false;
        }
    }
}
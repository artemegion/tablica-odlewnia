// import { CalcCell } from './CalcCell.js';
import '../ArrayExt.js';
import { ValueConversion } from './ValueConversion.js';
import { EventEmitter } from '../EventEmitter.js';

/**
 * @typedef {'int' | 'int?' | 'float' | 'float?' | 'bool' | 'bool?' | 'string' | 'string?'} ValueType
 */

/**
 * @typedef { (string | RegExp)[] } FormulaArgs
 */

/**
 * @callback FormulaFn
 * @param {Sheet} this
 * @param {...unknown} args
 * @returns {unknown}
 */

/**
 * @typedef Cell
 * @prop {string} id
 * @prop {ValueType} valueType
 * 
 * @prop {unknown} [defaultValue]
 * 
 * @prop {FormulaArgs} [formulaArgs]
 * @prop {FormulaFn} [formula]
 */

/**
 * If value is not a number or its value is 0, format it to an empty string. Otherwise, return the original value.
 * @param {number | any} val Value to be formatted.
 * @returns {string | any} Formatted string or original value.
 */
export const VAL_FMT_EMPTY_ON_ZERO = (val) => typeof val !== 'number' || val === 0 ? '' : val;

/**
 * 
 */
export class Sheet extends EventEmitter {
    constructor() {
        super();
        this.#cells = [];
        this.#cellValues = new Map();
    }

    /** @type {Cell[]} */ #cells;
    /** @type {Map<string, unknown>} */ #cellValues;

    /**
     * @returns {(Readonly<Cell>)[]}
     */
    get cells() {
        return this.#cells;
    }

    /**
     * Add a new cell into this sheet.
     * @param {Cell} cell 
     * @returns {Error | void}
     */
    addCell(cell) {
        if (this.#cells.findIndex(c => c.id === cell.id) > -1) return new Error(`Could not add a new cell. Cell with id '${cell.id}' already exists.`);
        this.#cells.push(cell);
    }

    /**
     * 
     * @param {{ [cellId: string]: Omit<Cell, "id"> } } cells 
     */
    addCells(cells) {
        for (let id of Object.keys(cells)) {
            let cell = cells[id];
            this.addCell({ id, ...cell });
        }
    }

    /**
     * Delete a cell from this sheet.
     * @param {string} id 
     * @returns {void}
     */
    deleteCell(id) {
        this.#cellValues.delete(id);
        let cI = this.#cells.indexOf(c => c.id === id);
        if (cI > -1) this.#cells.splice(cI, 1);
    }

    /**
     * Get a cell from this sheet. 
     * @param {string} id 
     * @returns {Readonly<Cell> | undefined}
     */
    getCell(id) {
        let cI = this.#cells.findIndex(c => c.id === id);
        if (cI > -1) return this.#cells[cI];
        else return undefined;
    }

    /**
     * Get all cells whose id match the `regExp`.
     * @param {RegExp} regExp 
     * @returns {(Readonly<Cell>)[]}
     */
    getCells(regExp) {
        let cells = [];

        for (const cell of this.#cells) {
            if (regExp.test(cell)) cells.push(cell);
        }

        return cells;
    }

    /**
     * 
     * @param {string} id 
     * @param {any} value 
     * @returns {Error | void}
     */
    setValue(id, value) {
        let cell = this.#cells.find(c => c.id === id) ?? new Error(`No cell with id '${id}'.`);
        if (cell instanceof Error) return cell;

        let valueUpdateState = {
            updated: false,
            value: undefined
        };

        let oldValue = this.getValue(id);

        if (ValueConversion.isValueAssignable(cell.valueType, value)) {
            this.#cellValues.set(cell.id, value);
            valueUpdateState = { updated: true, value: value };
        } else if (ValueConversion.isValueConvertible(cell.valueType, value)) {
            let convertedValue = ValueConversion.convertValue(cell.valueType, value);
            if (convertedValue instanceof Error) return convertedValue;

            this.#cellValues.set(cell.id, convertedValue);
            valueUpdateState = { updated: true, value: convertedValue };
        } else if (value === undefined) {
            if (typeof cell.defaultValue === 'undefined') {
                this.#cellValues.delete(cell.id);
                valueUpdateState = { updated: true, value: undefined };
            } else {
                this.#cellValues.set(cell.id, cell.defaultValue);
                valueUpdateState = { updated: true, value: cell.defaultValue };
            }
        }

        valueUpdateState.updated = valueUpdateState.value !== oldValue;

        if (valueUpdateState.updated) {
            let fCells = this.getCellsWhoseFormulaHasParam(cell.id);
            if (fCells instanceof Error) return fCells;

            // run formulas and gather errors
            let errors = fCells
                .map(fC => [fC.id, this.runFormula(fC.id)])
                .filter(fC => fC[1] instanceof Error)
                .map(fC => fC[0] + ': ' + fC[1].toString());

            this.emit('value-changed', cell.id, oldValue);

            if (errors.length > 0) {
                return new Error(`One or more cells returned an error when running their formulas after cell's '${cell.id}' value was updated.\n${errors.join('\n')}`);
            }
        }
    }

    /**
     * 
     * @param {string} id 
     * @returns {Error | unknown}
     */
    getValue(id) {
        let cell = this.#cells.find(c => c.id === id);
        if (cell === undefined) return new Error(`No cell with id '${id}'.`);

        if (this.#cellValues.has(id)) {
            return this.#cellValues.get(id);
        } else {
            if (ValueConversion.isValueAssignable(cell.valueType, cell.defaultValue)) {
                return cell.defaultValue;
            } else return new Error(`No value stored for cell '${id}'.`);
        }
    }

    /**
     * 
     * @param {string} id 
     * @returns {boolean}
     */
    hasValue(id) {
        let cell = this.#cells.find(c => c.id === id);
        if (cell === undefined) return new Error(`No cell with id '${id}'.`);

        return this.#cellValues.has(id) || ValueConversion.isValueAssignable(cell.valueType, cell.defaultValue);
    }


    /**
     * 
     * @param {string} id 
     * @returns {boolean | Error}
     */
    testFormulaParameters(id) {
        let cell = this.#cells.find(c => c.id === id) ?? new Error(`No cell with id '${id}'.`);
        if (cell instanceof Error) return cell;

        if (typeof cell.formulaArgs === 'undefined') return false;

        /**
         * 
         * @param {Cell} c 
         * @returns {boolean}
         */
        function verifyCell(c) {
            // cell specified in the formula does not exist
            if (c === undefined) return false;

            // cell has no value set and no default value
            if (!this.hasValue(c.id)) return false;

            // cell has a value but its not of valid type
            if (!ValueConversion.isValueAssignable(c.valueType, this.getValue(c.id))) return false;

            return true;
        }
        verifyCell = verifyCell.bind(this);

        for (const formulaArg of cell.formulaArgs) {
            if (typeof formulaArg === 'string') {
                if (!verifyCell(this.#cells.find(c => c.id === formulaArg))) return false;
            } else if (formulaArg instanceof RegExp) {
                if (this.#cells.filter(c => formulaArg.test(c.id)).map(c => verifyCell(c)).includes(false)) return false;
            }
        }

        return true;
    }

    /**
     * Runs the formula for the cell specified by `cellId`, or for every cell if `cellId` is set to `undefined`.
     * @param {string | undefined} cellId 
     * @returns {boolean | Error}
     */
    runFormula(cellId) {
        if (cellId === undefined) {
            for (const cell of this.#cells) {
                if (cell.formula !== undefined) this.runFormula(cell.id);
            }
        } else {
            let cell = this.#cells.find(c => c.id === cellId);
            if (cell === undefined) return new Error(`No cell '${cellId}'.`);

            if (typeof cell.formulaArgs === 'undefined') return false;
            if (typeof cell.formula === 'undefined') return false;

            let test = this.testFormulaParameters(cellId);
            if (test instanceof Error || test === false) return test;

            /** @type {(unknown | unknown[])[]} */ let formulaCellValues = [];

            for (const fA of cell.formulaArgs) {
                if (typeof fA === 'string') {
                    if (this.#cells.findIndex(c => c.id === fA) < 0) return false;

                    if (this.hasValue(fA)) {
                        formulaCellValues.push(this.getValue(fA));
                    } else return false;
                } else if (fA instanceof RegExp) {
                    let matchingCells = this.#cells.filter(c => fA.test(c.id));
                    if (matchingCells.length < 1) return false;

                    if (matchingCells.map(c => this.hasValue(c.id)).includes(false)) return false;
                    formulaCellValues.push(matchingCells.map(c => this.getValue(c.id)));
                }
            }

            let formulaResult = cell.formula.call(this, ...formulaCellValues);
            let e = this.setValue(cell.id, formulaResult);

            if (e instanceof Error) return e;
            return true;
        }
    }

    /**
     * Runs all formulas that have cell of id `cellId` as their parameter.
     * @param {string} cellId 
     * @returns {boolean | Error}
     */
    runFormulasWithArgument(cellId) {
        let cells = this.getCellsWhoseFormulaHasParam(cellId);
        if (cells instanceof Error) return cells;

        let results = cells.map(cell => this.runFormula(cell.id));

        if (results.filter(r => r instanceof Error).length > 0)
            return new Error(`Could not run formulas with argument '${cellId}' due to one or more formulas returning an error.\n${results.filter(r => r instanceof Error)}`);
    }

    /**
     * Tests if cell with id `cellId` is an argument for formula of cell `formulaCellId`.
     * @param {string} cellId 
     * @param {string} formulaCellId 
     * @returns {boolean | Error}
     */
    isFormulaArg(cellId, formulaCellId) {
        let formulaCell = this.#cells.find(c => c.id === formulaCellId);
        let cell = this.#cells.find(c => c.id === cellId);

        if (formulaCell === undefined) return new Error(`No cell with id '${formulaCellId}'.`);
        if (cell === undefined) return new Error(`No cell with id '${cellId}'.`);

        if (formulaCell.formula === undefined || formulaCell.formulaArgs === undefined) return false;

        for (let fA of formulaCell.formulaArgs) {
            if (typeof fA === 'string') {
                if (cellId === fA) return true;
            } else {
                if (fA.test(cellId)) return true;
            }
        }

        return false;
    }

    /**
     * Finds all cells whose formula parameters include cell with id `cellId`.
     * @param {string} cellId 
     * @returns {Cell[] | Error}
     */
    getCellsWhoseFormulaHasParam(cellId) {
        let cells = [];

        for (const cell of this.#cells) {
            if (cell.formulaArgs === undefined) continue;

            for (let fA of cell.formulaArgs) {
                if (typeof fA === 'string') {
                    if (cellId === fA) {
                        cells.push(cell);
                        break;
                    }
                } else if (fA instanceof RegExp) {
                    if (fA.test(cellId)) {
                        cells.push(cell);
                        break;
                    }
                }
            }
        }

        return cells;
    }
}

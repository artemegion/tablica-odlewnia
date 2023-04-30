import { CalcCell } from './CalcCell.js';
export { CalcCell } from './CalcCell.js';

/**
 * @typedef {'int' | 'int?' | 'float' | 'float?' | 'bool' | 'bool?' | 'string' | 'string?'} CellValueType
 * Type of cell's value.
 */

/**
 * An interface to conveniently define a calc cell.
 * @typedef CalcCellDef
 * @prop {CellValueType} type value type
 * @prop {any} defaultValue default value
 * @prop {(string | RegExp)[]} formulaArgs ids of cells used in the formula
 * @prop {Function} formula the formula used to calculate cell's value
 * @prop {import('./CalcCell.js').ValueFormatterFn | undefined} valueFormatter
 */

/**
 * @typedef InputElementsContainer
 * @prop {(id: string): HTMLInputElement | undefined} getElementById
 * container with HTMLInputElements to bind to the cells
 */

const NOOP = function () { }
const DEFAULT_VALUE_FORMATTER = function (val) { return (val ?? '').toString(); }

/**
 * 
 */
export class CalcSheet {
    /**
     * 
     * @param {{ [name: string]: CalcCellDef }} cells 
     * @param {InputElementsContainer} inputElementsContainer 
     */
    constructor(cells, inputElementsContainer) {
        this.#inputElementsContainer = inputElementsContainer;
        this.#cells = cells;
        this.#cellInstances = [];

        if (DEBUG === true) {
            this.cellInstances = this.#cellInstances;
        }
    }

    /** @type {InputElementsContainer} */ #inputElementsContainer;
    /** @type {{ [name: string]: CalcCellDef }} */ #cells;
    /** @type {CalcCell[]} */ #cellInstances;

    init() {
        if (this.#cellInstances.length > 0) {
            console.warn('CalcSheet#init() can be called only once.');
            return;
        }

        // initialize all defined cells without formulas
        for (let cellId of Object.keys(this.#cells)) {
            this.#cells[cellId].formulaArgs ??= [];
            this.#cells[cellId].formula ??= NOOP;

            let cell = new CalcCell();
            cell.id = cellId;
            cell.defaultValue = this.#cells[cellId].defaultValue;
            cell.type = this.#cells[cellId].type;
            cell.formula = this.#cells[cellId].formula;
            cell.formulaArgs = [];
            cell.valueFormatter = this.#cells[cellId].valueFormatter ?? null;
            this.#cellInstances.push(cell);
        }

        // initialize formulas
        for (let cellId of Object.keys(this.#cells)) {
            let cellInstance = this.#cellInstances.find(cell => cell.id === cellId);
            if (cellInstance === undefined) continue;

            for (let formulaArgId of this.#cells[cellId].formulaArgs) {
                if (typeof formulaArgId === 'string') {
                    let formulaArgCell = this.#cellInstances.find(cell => cell.id === formulaArgId)

                    if (formulaArgCell === undefined) {
                        console.warn(`Did not find cell '${formulaArgId}' marked as formula argument for cell '${cellId}'`);
                        continue;
                    }

                    cellInstance.formulaArgs.push(formulaArgCell);
                } else if (formulaArgId instanceof RegExp) {
                    let formulaArgCells = this.#cellInstances.filter(c => formulaArgId.test(c.id));
                    cellInstance.formulaArgs.push(formulaArgCells);
                }
            }

            for (let formulaArg of cellInstance.formulaArgs) {
                if (formulaArg instanceof CalcCell) {
                    formulaArg.addEventListener('value-changed', ev => {
                        cellInstance.emit('formula-arg-changed', { detail: formulaArg.id });
                    });
                } else if (formulaArg instanceof Array) {
                    for (let fA of formulaArg) {
                        fA.addEventListener('value-changed', ev => {
                            cellInstance.emit('formula-arg-changed', { detail: fA.id });
                        });
                    }
                }
            }

            cellInstance.addEventListener('formula-arg-changed', () => {
                if (cellInstance.formulaArgs.length === 0) return;

                if (cellInstance.formulaArgs.flat(1).map(fa => fa.isValueValid()).includes(false)) {
                    cellInstance.value = cellInstance.defaultValue;
                    return;
                }

                let values = cellInstance.formulaArgs.map(c => c instanceof Array ? c.map(cb => cb.value) : c.value);
                let f = cellInstance.formula.call(undefined, ...values);

                cellInstance.value = f;
            });

            cellInstance.inputElement = this.#inputElementsContainer?.getElementById(cellId);

            cellInstance.addEventListener('value-changed', () => {
                if (cellInstance.inputElement !== null) {
                    cellInstance.inputElement.value = (cellInstance.valueFormatter ?? DEFAULT_VALUE_FORMATTER)(cellInstance.value);
                }
            });

            cellInstance.inputElement?.addEventListener('input', ev => {
                if (cellInstance.formula === NOOP) {
                    cellInstance.value = ev.target.value;
                }
            });

            cellInstance.value = cellInstance.defaultValue;
        }
    }

    /**
     * emit an event to all cells
     * @param {string} evName 
     */
    emit(evName) {
        for (let cell of this.#cellInstances) {
            cell.emit(evName, {});
        }
    }

    /**
     * 
     * @param {string} id 
     * @returns {CalcCell | null}
     */
    getCell(id) {
        let cellIndex = this.#cellInstances.findIndex(c => c.id === id);
        if (cellIndex < 0) return null;

        return this.#cellInstances[cellIndex];
    }
}

Array.prototype.sum = function () {
    return this.reduce((pV, cV) => pV + cV);
}

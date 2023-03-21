/**
 * Cells are input fields with a data-cell-id and data-cell-type attributes,
 * their value can be automatically updated if any cell set as dependency changes its value.
 * 
 * Cells are defined in the constant `cells` with the value of data-cell-id attr as the key.
 * The deps field specifies other cells to observe for value change. Update function will
 * be called when any one of the dep cells changes their value and all of them pass validation.
 * 
 * Only cells that require the update function need to be defined here, input-only cells only need
 * to have the data-cell-id and data-cell-type attributes.
 * 
 * Validation checks if the value of the field is convertible to the type specified in data-cell-id attribute.
 * Supported types are:
 * + int - value must not return NaN when passed to parseInt
 * + int? - value must either not return NaN when passed to parseInt or be equal to "" or "-"
 * + float - value must not return NaN when passed to parseFloat
 * + string - always validates
 */

(() => {
    const cells = {
        'splyw-narastajaco-polowa': {
            deps: ['sztuki-we-wozku-polowa', 'braki-polowa'],

            update() {
                this.setValue(cells['sztuki-we-wozku-polowa'].getValue() + cells['braki-polowa'].getValue())
            }
        },

        'splyw-narastajaco-koniec': {
            deps: ['sztuki-we-wozku-koniec', 'braki-koniec'],

            update() {
                this.setValue(cells['sztuki-we-wozku-koniec'].getValue() + cells['braki-koniec'].getValue())
            }
        },

        'splyw-z-godziny-polowa': {
            deps: ['splyw-narastajaco-polowa'],

            update() {
                this.setValue(cells['splyw-narastajaco-polowa'].getValue());
            }
        },

        'splyw-z-godziny-koniec': {
            deps: ['sztuki-we-wozku-polowa', 'sztuki-we-wozku-koniec', 'braki-koniec'],

            update() {
                this.setValue(cells['sztuki-we-wozku-koniec'].getValue() - cells['sztuki-we-wozku-polowa'].getValue() + cells['braki-koniec'].getValue());
            }
        },

        'czas-strat-polowa': {
            deps: ['cel-polowa', 'splyw-z-godziny-polowa', 'takt'],

            update() {
                this.setValue(Math.round((cells['cel-polowa'].getValue() - cells['splyw-z-godziny-polowa'].getValue()) * cells['takt'].getValue()));
            }
        },

        'czas-strat-koniec': {
            deps: ['cel-polowa', 'splyw-z-godziny-koniec', 'takt'],

            update() {
                this.setValue(Math.round((cells['cel-polowa'].getValue() - cells['splyw-z-godziny-koniec'].getValue()) * cells['takt'].getValue()));
            }
        },

        'czas-strat-suma': {
            deps: ['czas-strat-polowa', 'czas-strat-koniec'],

            update() {
                this.setValue(cells['czas-strat-polowa'].getValue() + cells['czas-strat-koniec'].getValue());
            }
        },

        'strata-predkosci-b1-polowa': {
            deps: ['czas-strat-polowa', 'czyszczenie-b1-polowa', 'czyszczenie-b2-polowa', 'awaria-b1-polowa', 'awaria-b2-polowa'],


            update() {
                let czas_strat_polowa = cells['czas-strat-polowa'].getValue();
                let czyszczenie_b1_polowa = cells['czyszczenie-b1-polowa'].getValue();
                let czyszczenie_b2_polowa = cells['czyszczenie-b2-polowa'].getValue();
                let awaria_b1_polowa = cells['awaria-b1-polowa'].getValue();
                let awaria_b2_polowa = cells['awaria-b2-polowa'].getValue();

                this.setValue(Math.ceil((czas_strat_polowa - awaria_b1_polowa - awaria_b2_polowa - czyszczenie_b1_polowa - czyszczenie_b2_polowa) / 2));
            }
        },

        'strata-predkosci-b2-polowa': {
            deps: ['czas-strat-polowa', 'czyszczenie-b1-polowa', 'czyszczenie-b2-polowa', 'awaria-b1-polowa', 'awaria-b2-polowa'],

            update() {
                let czas_strat_polowa = cells['czas-strat-polowa'].getValue();
                let czyszczenie_b1_polowa = cells['czyszczenie-b1-polowa'].getValue();
                let czyszczenie_b2_polowa = cells['czyszczenie-b2-polowa'].getValue();
                let awaria_b1_polowa = cells['awaria-b1-polowa'].getValue();
                let awaria_b2_polowa = cells['awaria-b2-polowa'].getValue();

                this.setValue(Math.floor((czas_strat_polowa - awaria_b1_polowa - awaria_b2_polowa - czyszczenie_b1_polowa - czyszczenie_b2_polowa) / 2));
            }
        },

        'strata-predkosci-b1-koniec': {
            deps: ['czas-strat-koniec', 'czyszczenie-b1-koniec', 'czyszczenie-b2-koniec', 'awaria-b1-koniec', 'awaria-b2-koniec'],

            update() {
                let czas_strat_koniec = cells['czas-strat-koniec'].getValue();
                let czyszczenie_b1_koniec = cells['czyszczenie-b1-koniec'].getValue();
                let czyszczenie_b2_koniec = cells['czyszczenie-b2-koniec'].getValue();
                let awaria_b1_koniec = cells['awaria-b1-koniec'].getValue();
                let awaria_b2_koniec = cells['awaria-b2-koniec'].getValue();

                this.setValue(Math.floor((czas_strat_koniec - awaria_b1_koniec - awaria_b2_koniec - czyszczenie_b1_koniec - czyszczenie_b2_koniec) / 2));
            }
        },

        'strata-predkosci-b2-koniec': {
            deps: ['czas-strat-koniec', 'czyszczenie-b1-koniec', 'czyszczenie-b2-koniec', 'awaria-b1-koniec', 'awaria-b2-koniec'],

            update() {
                let czas_strat_koniec = cells['czas-strat-koniec'].getValue();
                let czyszczenie_b1_koniec = cells['czyszczenie-b1-koniec'].getValue();
                let czyszczenie_b2_koniec = cells['czyszczenie-b2-koniec'].getValue();
                let awaria_b1_koniec = cells['awaria-b1-koniec'].getValue();
                let awaria_b2_koniec = cells['awaria-b2-koniec'].getValue();

                this.setValue(Math.ceil((czas_strat_koniec - awaria_b1_koniec - awaria_b2_koniec - czyszczenie_b1_koniec - czyszczenie_b2_koniec) / 2));
            }
        },

        'brakujace-sztuki-do-100': {
            deps: ['cel-koniec', 'splyw-narastajaco-koniec'],

            update() {
                this.setValue(cells['cel-koniec'].getValue() - cells['splyw-narastajaco-koniec'].getValue());
            }
        },

        'oeu': {
            deps: ['splyw-narastajaco-koniec', 'takt'],

            update() {
                this.setValue(Math.round(cells['splyw-narastajaco-koniec'].getValue() / 2 * cells['takt'].getValue() / 480 * 100));
            }
        },

        'procent-brakow': {
            deps: ['braki-polowa', 'braki-koniec', 'splyw-narastajaco-koniec'],

            update() {
                this.setValue(
                    (
                        (cells['braki-polowa'].getValue() + cells['braki-koniec'].getValue())
                        /
                        cells['splyw-narastajaco-koniec'].getValue()
                        *
                        100
                    ).toFixed(2)
                )
            }
        }
    };

    /**
     * ensures that a cell is properly initialized
     * @param {{ [cellId: string]: any }} cells 
     * @param {string} cellId 
     */
    function cell_ensureInitialized(cells, cellId) {
        if (typeof cells[cellId].elem != 'object') {
            cells[cellId].elem = document.querySelector(`[data-cell-id="${cellId}"]`);
        }

        if (typeof cells[cellId].setValue != 'function') {
            cells[cellId].setValue = cell_setValue.bind(cells[cellId]);
        }

        if (typeof cells[cellId].getValue != 'function') {
            cells[cellId].getValue = cell_getValue.bind(cells[cellId]);
        }

        if (typeof cells[cellId].verifyDeps != 'function') {
            cells[cellId].verifyDeps = cell_verifyDeps.bind(cells[cellId], cells);
        }
    }

    function cell_setValue(val) {
        this.elem.value = val;
        this.elem.dispatchEvent(new Event('change', { bubbles: false, cancelable: false, composed: false }));
    }

    function cell_getValue() {
        if (this.valueType === 'int') {
            return parseInt(this.elem.value);
        } else if (this.valueType === 'float') {
            return parseFloat(this.elem.value);
        } else if (this.valueType === 'int?') {
            return this.elem.value === "" ? 0 : parseInt(this.elem.value);
        } else return this.elem.value;
    }

    function cell_verifyDeps(cells) {
        for (let depId of this.deps) {
            if (cells[depId].valueType === 'string') {
                continue;
            }
            else if (cells[depId].valueType === 'int?') {
                let val = cells[depId].getValue();
                if (isNaN(parseInt(val)) && !(val === '' || val === '-')) return false;
            }
            else if (cells[depId].valueType === 'int') {
                if (isNaN(parseInt(cells[depId].getValue()))) {
                    return false;
                }
            }
            else if (cells[depId].valueType === 'float') {
                if (isNaN(parseFloat(cells[depId].getValue()))) {
                    return false;
                }
            }
            else {
                console.warn(`cell type ${cells[depId].valueType} is not supported`);
                return false;
            }
        }

        return true;
    }

    document.querySelectorAll('[data-cell-id]').forEach(dataCellElem => {
        let cellId = dataCellElem.getAttribute('data-cell-id');
        let cellType = dataCellElem.getAttribute('data-cell-type');

        if (typeof cells[cellId] === 'object') {
            // set the cell's id if its not defined
            if (typeof cells[cellId].valueType !== 'string') {
                cells[cellId].valueType = cellType;
            }
        } else {
            // add the cell if its not manually defined
            cells[cellId] = {
                elem: dataCellElem,
                valueType: cellType
            };
        }
    });

    for (let cellId of Object.getOwnPropertyNames(cells)) {
        cell_ensureInitialized(cells, cellId);

        if (typeof cells[cellId].deps == 'object' && cells[cellId].deps.length > 0) {
            for (let depId of cells[cellId].deps) {
                cell_ensureInitialized(cells, depId);

                cells[depId].elem.addEventListener('change', () => {
                    if (cells[cellId].verifyDeps() === true) cells[cellId].update();
                    return false;
                });
            }
        }
    }
})();
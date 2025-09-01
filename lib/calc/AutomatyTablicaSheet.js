import { Sheet } from './Sheet.js';
import { AutomatyTablicaState } from '../state/TablicaState.js';

export class AutomatyTablicaSheet extends Sheet {
    /**
     * 
     * @param {AutomatyTablicaState} state 
     */
    constructor(state) {
        super();
        this.state = state;

        this.addCells({
            'sztuki-we-wozku-polowa': {
                valueType: 'int',
                defaultValue: undefined
            },
            'sztuki-we-wozku-koniec': {
                valueType: 'int',
                defaultValue: undefined
            },

            'takt': {
                valueType: 'float',
                defaultValue: 1.125
            },

            'cel-polowa': {
                valueType: 'int',
                defaultValue: 640
            },
            'cel-koniec': {
                valueType: 'int',
                defaultValue: 1280
            },

            'cel-linii-polowa': {
                valueType: 'int',
                defaultValue: 540
            },
            'cel-linii-koniec': {
                valueType: 'int',
                defaultValue: 1080
            },

            'braki-polowa': {
                valueType: 'int',
                defaultValue: 8
            },
            'braki-koniec': {
                valueType: 'int',
                defaultValue: 8
            },

            'czyszczenie-b1-polowa': {
                valueType: 'int',
                defaultValue: 20
            },
            'czyszczenie-b2-polowa': {
                valueType: 'int',
                defaultValue: 20
            },
            'czyszczenie-b3-polowa': {
                valueType: 'int',
                defaultValue: 20
            },
            'czyszczenie-b1-koniec': {
                valueType: 'int',
                defaultValue: 20
            },
            'czyszczenie-b2-koniec': {
                valueType: 'int',
                defaultValue: 20
            },
            'czyszczenie-b3-koniec': {
                valueType: 'int',
                defaultValue: 20
            },
            'splyw-narastajaco-polowa': {
                valueType: 'int',
                defaultValue: undefined,
                formulaArgs: ['sztuki-we-wozku-polowa', 'braki-polowa'],
                formula: (sztukiWeWozkuPolowa, brakiPolowa) => sztukiWeWozkuPolowa + brakiPolowa
            },
            'splyw-narastajaco-koniec': {
                valueType: 'int',
                defaultValue: undefined,
                formulaArgs: ['sztuki-we-wozku-koniec', 'braki-koniec'],
                formula: (sztukiWeWozkuKoniec, brakiKoniec) => sztukiWeWozkuKoniec + brakiKoniec
            },

            'splyw-z-godziny-polowa': {
                valueType: 'int',
                defaultValue: undefined,
                formulaArgs: ['splyw-narastajaco-polowa'],
                formula: splywNarastajacoPolowa => splywNarastajacoPolowa
            },
            'splyw-z-godziny-koniec': {
                valueType: 'int',
                defaultValue: undefined,
                formulaArgs: ['sztuki-we-wozku-polowa', 'sztuki-we-wozku-koniec', 'braki-koniec'],
                formula: (sztukiWeWozkuPolowa, sztukiWeWozkuKoniec, brakiKoniec) => sztukiWeWozkuKoniec - sztukiWeWozkuPolowa + brakiKoniec
            },

            'brakujace-sztuki-do-100': {
                valueType: 'int',
                defaultValue: undefined,
                formulaArgs: ['cel-koniec', 'splyw-narastajaco-koniec'],
                formula: (celKoniec, splywNarastajacoKoniec) => celKoniec - splywNarastajacoKoniec
            },

            'czas-strat-polowa': {
                valueType: 'int',
                defaultValue: undefined,
                formulaArgs: ['cel-polowa', 'splyw-z-godziny-polowa', 'takt'],
                formula: (celPolowa, splywZGodzinyPolowa, takt) => Math.round((celPolowa - splywZGodzinyPolowa) * takt)
            },
            'czas-strat-koniec': {
                valueType: 'int',
                defaultValue: undefined,
                formulaArgs: ['cel-polowa', 'splyw-z-godziny-koniec', 'takt'],
                formula: (celPolowa, splywZGodzinyKoniec, takt) => Math.round((celPolowa - splywZGodzinyKoniec) * takt)
            },
            'czas-strat-suma': {
                valueType: 'int',
                defaultValue: undefined,
                formulaArgs: ['czas-strat-polowa', 'czas-strat-koniec'],
                formula: (czasStratPolowa, czasStratKoniec) => czasStratPolowa + czasStratKoniec
            },

            'strata-awaria-b1-polowa': {
                valueType: 'int',
                defaultValue: 0,
                valueFormatter: (val) => typeof val !== 'number' || val === 0 ? '' : val
            },
            'strata-awaria-b2-polowa': {
                valueType: 'int',
                defaultValue: 0,
                valueFormatter: (val) => typeof val !== 'number' || val === 0 ? '' : val
            },
            'strata-awaria-b1-koniec': {
                valueType: 'int',
                defaultValue: 0,
                valueFormatter: (val) => typeof val !== 'number' || val === 0 ? '' : val
            },
            'strata-awaria-b2-koniec': {
                valueType: 'int',
                defaultValue: 0,
                valueFormatter: (val) => typeof val !== 'number' || val === 0 ? '' : val
            },

            'strata-naprawa-b1-polowa': {
                valueType: 'int',
                defaultValue: 0,
                valueFormatter: (val) => typeof val !== 'number' || val === 0 ? '' : val
            },
            'strata-naprawa-b2-polowa': {
                valueType: 'int',
                defaultValue: 0,
                valueFormatter: (val) => typeof val !== 'number' || val === 0 ? '' : val
            },
            'strata-naprawa-b1-koniec': {
                valueType: 'int',
                defaultValue: 0,
                valueFormatter: (val) => typeof val !== 'number' || val === 0 ? '' : val
            },
            'strata-naprawa-b2-koniec': {
                valueType: 'int',
                defaultValue: 0,
                valueFormatter: (val) => typeof val !== 'number' || val === 0 ? '' : val
            },

            'strata-predkosci-b1-polowa': {
                valueType: 'int',
                defaultValue: undefined,
                formulaArgs: ['czas-strat-polowa', /czyszczenie-(b1|b2|b3)-polowa/, /strata-(awaria|naprawa)-(b1|b2)-polowa/],
                formula: ((czasStrat, czyszczenie, strataPrzestoj) => Math.floor(
                    (czasStrat - czyszczenie.sum() - (this.state.useDetailedSpeedLoss ? strataPrzestoj.sum() : 0)) / 3)
                )
            },
            'strata-predkosci-b2-polowa': {
                valueType: 'int',
                defaultValue: undefined,
                formulaArgs: ['czas-strat-polowa', /czyszczenie-(b1|b2|b3)-polowa/, /strata-(awaria|naprawa)-(b1|b2)-polowa/],
                formula: ((czasStrat, czyszczenie, strataPrzestoj) => Math.ceil(
                    (czasStrat - czyszczenie.sum() - (this.state.useDetailedSpeedLoss ? strataPrzestoj.sum() : 0)) / 3)
                )
            },
            'strata-predkosci-b3-polowa': {
                valueType: 'int',
                defaultValue: undefined,
                formulaArgs: ['czas-strat-polowa', /czyszczenie-(b1|b2|b3)-polowa/, /strata-(awaria|naprawa)-(b1|b2)-polowa/],
                formula: ((czasStrat, czyszczenie, strataPrzestoj) => Math.ceil(
                    (czasStrat - czyszczenie.sum() - (this.state.useDetailedSpeedLoss ? strataPrzestoj.sum() : 0)) / 3)
                )
            },
            'strata-predkosci-b1-koniec': {
                valueType: 'int',
                defaultValue: undefined,
                formulaArgs: ['czas-strat-koniec', /czyszczenie-(b1|b2|b3)-koniec/, /strata-(awaria|naprawa)-(b1|b2)-koniec/],
                formula: ((czasStrat, czyszczenie, strataPrzestoj) => Math.floor(
                    (czasStrat - czyszczenie.sum() - (this.state.useDetailedSpeedLoss ? strataPrzestoj.sum() : 0)) / 3)
                )
            },
            'strata-predkosci-b2-koniec': {
                valueType: 'int',
                defaultValue: undefined,
                formulaArgs: ['czas-strat-koniec', /czyszczenie-(b1|b2|b3)-koniec/, /strata-(awaria|naprawa)-(b1|b2)-koniec/],
                formula: ((czasStrat, czyszczenie, strataPrzestoj) => Math.ceil(
                    (czasStrat - czyszczenie.sum() - (this.state.useDetailedSpeedLoss ? strataPrzestoj.sum() : 0)) / 3)
                )
            },
            'strata-predkosci-b3-koniec': {
                valueType: 'int',
                defaultValue: undefined,
                formulaArgs: ['czas-strat-koniec', /czyszczenie-(b1|b2|b3)-koniec/, /strata-(awaria|naprawa)-(b1|b2)-koniec/],
                formula: ((czasStrat, czyszczenie, strataPrzestoj) => Math.ceil(
                    (czasStrat - czyszczenie.sum() - (this.state.useDetailedSpeedLoss ? strataPrzestoj.sum() : 0)) / 3)
                )
            },

            'oeu': {
                valueType: 'int',
                defaultValue: undefined,
                formulaArgs: ['splyw-narastajaco-koniec', 'takt', 'cel-linii-koniec'],
                //                                                                                                                                            1440 work minutes in 8 hours
                formula: (splywNarastajacoKoniec, takt, celLiniiKoniec) => Math.round(((splywNarastajacoKoniec * takt) / 1440) * 100)
            },
            'plan-produkcji': {
                valueType: 'int',
                defaultValue: undefined,
                formulaArgs: ['cel-linii-koniec', 'sztuki-we-wozku-koniec'],
                formula: (celLiniiKoniec, sztukiWeWozkuKoniec) => (celLiniiKoniec - sztukiWeWozkuKoniec) * -1,
                valueFormatter: (value) => {
                    let numVal = Number.parseInt(value);
                    if (Number.isNaN(numVal)) {
                        return '';
                    } else {
                        return value > 0 ? `+${value}` : value.toString();
                    }
                }
            },
            'procent-brakow': {
                valueType: 'float',
                defaultValue: undefined,
                formulaArgs: ['braki-polowa', 'braki-koniec', 'splyw-narastajaco-koniec'],
                formula: (brakiPolowa, brakiKoniec, splywNarastajacoKoniec) => ((brakiPolowa + brakiKoniec) / splywNarastajacoKoniec * 100).toFixed(2)
            }
        });
    }

    /** @type {AutomatyTablicaState} */ state;
}

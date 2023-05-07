import { Box } from './BoxStorage.js';

/** @extends {Box<Number>} */
export class NumberBox extends Box {
    static valueType = Number;
}

import { Box } from './BoxStorage.js';

/**
 * @extends {Box<String>}
 */

export class StringBox extends Box {
    static valueType = String;
}

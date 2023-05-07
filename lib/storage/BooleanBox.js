import { Box } from './BoxStorage.js';

/**
 * @extends {Box<Boolean>}
 */

export class BooleanBox extends Box {
    static valueType = Boolean;
}

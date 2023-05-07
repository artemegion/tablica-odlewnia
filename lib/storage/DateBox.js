import { Box } from './BoxStorage.js';

/**
 * @extends {Box<Date>}
 */

export class DateBox extends Box {
    static valueType = Date;

    get valueJSON() {
        return JSON.stringify(this.value.getTime());
    }

    set valueJSON(val) {
        this.value = new Date(JSON.parse(val));
    }
}

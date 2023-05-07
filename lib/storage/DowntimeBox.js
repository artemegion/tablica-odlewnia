import { Downtime } from '../Downtimes.js';
import { TimeRange } from '../TimeRange.js';
import { Box } from './BoxStorage.js';

/** @extends {Box<Downtime>} */
export class DowntimeBox extends Box {
    static valueType = Downtime;

    /**
     * @returns {string}
     */
    get valueJSON() {
        let v = this.value;
        if (v instanceof Error) return "null";

        return JSON.stringify({
            id: v.id,
            typ: v.typ,
            bramka: v.bramka,
            uwagi: v.uwagi,
            timeRange: v.timeRange.toString()
        });
    }

    /**
     * @param {string} val
     */
    set valueJSON(val) {
        let valueModel = JSON.parse(val);
        this.value = Downtime.withId(valueModel.id, valueModel.typ, valueModel.bramka, valueModel.uwagi, TimeRange.fromString(valueModel.timeRange));
    }
}
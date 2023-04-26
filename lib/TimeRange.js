import { Time } from './Time.js';

export class TimeRange {
    /**
     * 
     * @param {string} str 
     * @returns {TimeRange}
     */
    static fromString(str) {
        let splitStr = str.split('-').map(s => s.trim());

        if (splitStr.length === 2) {
            return new TimeRange(Time.fromString(splitStr[0]), Time.fromString(splitStr[1]));
        } else return new TimeRange(Time.invalid, Time.invalid);
    }

    /**
    * 
    * @param {TimeRange} r1 
    * @param {TimeRange} r2 
    * @returns {TimeRange | null}
    */
    static intersect(r1, r2) {
        if (r1.from.ticks > r2.to.ticks || r1.to.ticks < r2.from.ticks) {
            return null;
        }

        let fromTicks = Math.max(r1.from.ticks, r2.from.ticks);
        let toTicks = Math.min(r1.to.ticks, r2.to.ticks);

        return new TimeRange(Time.fromTicks(fromTicks), Time.fromTicks(toTicks));
    }

    /**
     * 
     * @param {TimeRange[]} r 
     * @returns {TimeRange} 
     */
    static union(...r) {
        let fromTicks = Math.min(...(r.map(timeRange => timeRange.from.ticks)));
        let toTicks = Math.max(...(r.map(timeRange => timeRange.to.ticks)));

        return new TimeRange(Time.fromTicks(fromTicks), Time.fromTicks(toTicks));
    }

    /**
     * 
     * @param {Time} [from] 
     * @param {Time} [to] 
     */
    constructor(from, to) {
        this.from = from ?? new Time();
        this.to = to ?? new Time();
    }

    /** @type {Time} */ from;
    /** @type {Time} */ to;

    get minutes() {
        let from = this.from.clone();
        let to = this.to.clone();

        if (to.hour < from.hour) {
            to.hour += 24;
        }

        return to.minutes - from.minutes;
    }

    clone() {
        return new TimeRange(new Time(this.from.hour, this.from.minute), new Time(this.to.hour, this.to.minute));
    }

    toString() {
        return `${this.from.toString()} - ${this.to.toString()}`;
    }
}
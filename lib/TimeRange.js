import { TimeV2 } from './Time.js';

export class TimeRange {
    /**
     * 
     * @param {string} str 
     * @returns {TimeRange}
     */
    static fromString(str) {
        let splitStr = str.split('-').map(s => s.trim());

        if (splitStr.length === 2) {
            return new TimeRange(TimeV2.fromString(splitStr[0]), TimeV2.fromString(splitStr[1]));
        } else return new TimeRange(new TimeV2(0), new TimeV2(0));
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

        if (r1.to.ticks === r2.from.ticks || r1.from.ticks === r2.to.ticks) {
            return null;
        }

        let fromTicks = Math.max(r1.from.ticks, r2.from.ticks);
        let toTicks = Math.min(r1.to.ticks, r2.to.ticks);

        return new TimeRange(new TimeV2(fromTicks), new TimeV2(toTicks));
    }

    /**
     * 
     * @param {TimeRange[]} r 
     * @returns {TimeRange} 
     */
    static union(...r) {
        let fromTicks = Math.min(...(r.map(timeRange => timeRange.from.ticks)));
        let toTicks = Math.max(...(r.map(timeRange => timeRange.to.ticks)));

        return new TimeRange(new TimeV2(fromTicks), new TimeV2(toTicks));
    }

    /**
     * Sums time ranges 
     * @param {TimeRange[]} timeRanges 
     * @returns {number}
     */
    static sumMinutes(timeRanges) {
        if (timeRanges.length === 0) return 0;
        if (timeRanges.length === 1) return timeRanges[0].minutes;

        // add the length of every time range, ignoring the possibility of two time ranges intersecting
        let naiveSum = timeRanges.map(tR => tR.minutes).reduce((a, b) => a + b);

        // if two time ranges intersect, then their length cannot simply be added together
        // TR1 |-==------------|
        // TR2 |-----====------|
        // TR3 |--------====---|
        // a naive sum would result in length of 10, but the length of these three together is 9
        // TRL |-==--=======---|

        // instead, we can find all intersects and substract their length from the naive sum
        // TR1 |---=====-------|
        // TR2 |-----=======---|
        // sum: 12 - intersect: 3 = len: 9

        let intersected = new Map();

        for (let r1 of timeRanges) {
            for (let r2 of timeRanges) {
                //               only substract the intersect once
                if (r1 === r2 || intersected.get(r1) === r2 || intersected.get(r2) === r1) continue;

                let intersectMinutes = this.intersect(r1, r2)?.minutes;
                if (typeof intersectMinutes === 'number') {
                    intersected.set(r1, r2);
                    naiveSum -= intersectMinutes;
                }
            }
        }

        return naiveSum;
    }

    /**
     * 
     * @param {TimeV2} [from] 
     * @param {TimeV2} [to] 
     */
    constructor(from, to) {
        this.from = from ?? new TimeV2(0);
        this.to = to ?? new TimeV2(0);
    }

    /** @type {TimeV2} */ from;
    /** @type {TimeV2} */ to;

    get minutes() {
        return TimeV2.clockDistance(this.from, this.to);
    }

    toString() {
        return `${this.from.toString()} - ${this.to.toString()}`;
    }
}
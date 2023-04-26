export class Time {
    static get invalid() {
        return new Time(-1, -1);
    }

    /**
     * 
     * @param {string} str 
     * @returns {Time}
     */
    static fromString(str) {
        let time = new Time(-1, -1);
        let splitStr = str.split(':');

        if (splitStr.length === 2) {
            time.hour = Number.parseInt(splitStr[0]);
            time.minute = Number.parseInt(splitStr[1]);
        }

        return time;
    }

    /**
     * 
     * @param {number} ticks 
     * @returns {Time}
     */
    static fromTicks(ticks) {
        let h = Math.floor(ticks / 60);
        let m = ticks - h * 60;

        return new Time(h, m);
    }

    /**
     * 
     * @param {number} [hour] 
     * @param {number} [minute] 
     */
    constructor(hour, minute) {
        this.hour = hour ?? 0;
        this.minute = minute ?? 0;
    }

    /** @type {number} */ hour;
    /** @type {number} */ minute;

    get minutes() { return this.ticks; }

    /**
     * total number of minutes since midnight
     * @returns {number} total number of minutes since midnight
     */
    get ticks() {
        return this.hour * 60 + this.minute;
    }

    clone() {
        return new Time(this.hour, this.minute);
    }

    /**
     * @returns {string}
     */
    toString() {
        return `${(this.hour > 24 ? this.hour - 24 : this.hour).toString().padStart(2, '0')}:${this.minute.toString().padStart(2, '0')}`;
    }
}
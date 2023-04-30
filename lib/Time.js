export class TimeV2 {
    /**
     * Calculates distance between two time points on an analog clock, going clockwise from `time1` to `time2`.
     * For example: distance between "23:50" and "0:10" is 20 minutes, but between "0:10" and "23:50" is 1420 minutes.
     * @param {TimeV2} time1 
     * @param {TimeV2} time2 
     * @returns {number} 
     */
    static clockDistance(time1, time2) {
        if (time1.ticks === time2.ticks) {
            return 0;
        }
        else if (time1.ticks < time2.ticks) {
            return time2.ticks - time1.ticks;
        } else {
            // from 24:00 substract time1, that gives us distance between time1 and 24:00
            // then add time2, which is the distance from 24:00 to time2
            return 1440 - time1.ticks + time2.ticks;
        }
    }

    /**
     * Create an instance of `TimeV2` from a string representation in format "HH:MM".
     * @param {string} str 
     * @returns {TimeV2}
     */
    static fromString(str) {
        if (str.length !== 5) throw new Error(`Parameter 'str' is expected to be in format 'HH:MM'.`);

        let segments = str.split(':', 2);
        if (segments.length !== 2) throw new Error(`Parameter 'str' is expected to be in format 'HH:MM'.`);

        let hourSegment = segments[0];
        let minuteSegment = segments[1];

        let hour = Number.parseInt(hourSegment);
        let minute = Number.parseInt(minuteSegment);

        return TimeV2.fromTime(hour, minute);
    }

    /**
     * 
     * @param {number} hour 
     * @param {number} minute 
     */
    static fromTime(hour, minute) {
        if (Number.isNaN(hour) || hour < 0 || hour > 23) throw new Error(`Parameter 'hour' is expected to be a number in range 0 to 23.`);
        if (Number.isNaN(minute) || minute < 0 || minute > 59) throw new Error(`Parameter 'minute' is expected to be a number in range 0 to 59.`);

        return new TimeV2(hour * 60 + minute);
    }

    /**
     * 
     * @param {number} ticks 
     */
    constructor(ticks) {
        if (ticks < 0 || ticks > 1439) throw new Error(`Parameter 'ticks' has to be in the range [0, 1439] but a value of '${ticks}' was provided.`);

        this.ticks = ticks;
    }

    /**
     * The number of minutes that have passed since 0:00
     * @type {number}
     */
    ticks;

    /**
     * hour of the day
     */
    get hour() {
        return Math.floor(this.ticks / 60);
    }

    /**
     * minute of the hour
     */
    get minute() {
        return this.ticks % 60;
    }

    /**
     * @returns {string}
     */
    toString() {
        return `${this.hour.toString().padStart(2, '0')}:${this.minute.toString().padStart(2, '0')}`;
    }
}

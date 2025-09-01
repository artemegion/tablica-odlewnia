import { TimeRange } from './TimeRange.js';

export class ShiftTable {
    /**
     * Get week of the year.
     * @returns {number}
     */
    static getWeek() {
        const date = new Date(Date.now());
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const daysSinceFirst = Math.floor((date - firstDayOfYear) / (24 * 3600 * 1000));
        const firstWeekday = firstDayOfYear.getDay();
        const offset = (firstWeekday === 0) ? 6 : firstWeekday - 1; // Adjust for ISO week
        return Math.floor((daysSinceFirst + offset) / 7) + 1;
    }

    /**
     * Get the current day shift (1-3).
     * @returns {1 | 2 | 3}
     */
    static getDayShift() {
        let date = new Date();
        let hours = date.getHours();

        let shiftThisDay = 0;

        if (hours >= 6 && hours < 14) {
            shiftThisDay = 1;
        }
        else if (hours >= 14 && hours < 22) {
            shiftThisDay = 2;
        } else {
            shiftThisDay = 3;
        }

        return shiftThisDay;
    }

    /**
     * Get the current week shift (1-21).
     * @returns {number}
     */
    static getWeekShift() {
        let date = this.getShiftDate();
        let shiftThisDay = this.getDayShift();
        let shiftThisWeek = 0;

        // 0 is sunday, 1 is monday
        switch (date.getDay()) {
            case 1:
                shiftThisWeek = 0 + shiftThisDay;
                break;
            case 2:
                shiftThisWeek = 3 + shiftThisDay;
                break;
            case 3:
                shiftThisWeek = 6 + shiftThisDay;
                break;
            case 4:
                shiftThisWeek = 9 + shiftThisDay;
                break;
            case 5:
                shiftThisWeek = 12 + shiftThisDay;
                break;
            case 6:
                shiftThisWeek = 15 + shiftThisDay;
                break;
            case 0:
                shiftThisWeek = 18 + shiftThisDay;
                break;
        }

        return shiftThisWeek;
    }

    /**
     * Get a time range of a day shift.
     * @param {1 | 2 | 3} shift
     * @returns {TimeRange}
     */
    static getShiftHours(shift) {
        switch (shift) {
            case 1:
                return TimeRange.fromString('06:00 - 14:00');
            case 2:
                return TimeRange.fromString('14:00 - 22:00');
            case 3:
                return TimeRange.fromString('22:00 - 06:00');
        }
    }

    /**
     * Get two time ranges of two halves of a day shift.
     * @param {1 | 2 | 3} shift 
     * @returns {[TimeRange, TimeRange]}
     */
    static getShiftHalves(shift) {
        switch (shift) {
            case 1: return [TimeRange.fromString('06:00 - 10:00'), TimeRange.fromString('10:00 - 14:00')];
            case 2: return [TimeRange.fromString('14:00 - 18:00'), TimeRange.fromString('18:00 - 22:00')];
            case 3: return [TimeRange.fromString('22:00 - 02:00'), TimeRange.fromString('02:00 - 06:00')];
        }
    }

    /**
     * Get current date adjusted to account for the third shift spanning two days.
     * @returns {Date}
     */
    static getShiftDate() {
        let d = new Date();
        if (this.getDayShift() === 3 && d.getHours() < 6) d.setDate(d.getDate() - 1);

        return d;
    }
}

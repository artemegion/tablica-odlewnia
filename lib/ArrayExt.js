/**
 * Sums all numbers in this array.
 * @this {Array<number>}
 */
const ArraySum = function () {
    return this.length > 0 ? this.reduce((a, b) => a + b) : 0;
};

Array.prototype.sum = ArraySum;

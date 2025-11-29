/**
 * Sums all numbers in this array.
 * @this {Array<number>}
 */
const ArraySum = function () {
    return this.length > 0 ? this.reduce((a, b) => a + b) : 0;
};

const ArraySumUpToIndex = function (indexExclusive) {
    if (this.length == 0) return 0;

    let sum = 0;

    for (let i = 0; i < this.length && i < indexExclusive; i++) {
        sum += this[i];
    }

    return sum;
}

Array.prototype.sum = ArraySum;
Array.prototype.sumUpToIndex = ArraySumUpToIndex;
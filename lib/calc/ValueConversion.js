
export class ValueConversion {
    /**
     *
     * @param {ValueType} targetValueType
     * @param {unknown} value
     */
    static isValueAssignable(targetValueType, value) {
        if (value === undefined)
            return false;

        switch (targetValueType) {
            case 'int': return Number.isInteger(value);
            case 'int?': return value === null || Number.isInteger(value);
            case 'float': return typeof value === 'number';
            case 'float?': return value === null || typeof value === 'number';
            case 'bool': return typeof value === 'boolean';
            case 'bool?': return typeof value === 'boolean' || value === null;
            case 'string': return typeof value === 'string';
            case 'string?': return typeof value === 'string' || value === null;
            default: return false;
        }
    }

    /**
     *
     * @param {ValueType} targetValueType
     * @param {unknown} value
     */
    static isValueConvertible(targetValueType, value) {
        if (value === undefined)
            return false;
        else if (value === null) {
            return targetValueType.endsWith('?');
        } else {
            switch (targetValueType) {
                case 'int':
                case 'int?':
                    return this.isValueConvertibleToInt(value);
                case 'float':
                case 'float?':
                    return this.isValueConvertibleToFloat(value);
                case 'bool':
                case 'bool?':
                    return this.isValueConvertibleToBool(value);
                case 'string':
                case 'string?':
                    return this.isValueConvertibleToString(value);
                default: return false;
            }
        }
    }

    /**
     *
     * @param {unknown} value
     * @returns {boolean}
     */
    static isValueConvertibleToFloat(value) {
        if (typeof value === 'string') return !Number.isNaN(Number.parseFloat(value));
        else if (typeof value === 'number') return true;

        return false;
    }

    /**
     *
     * @param {unknown} value
     * @returns {boolean}
     */
    static isValueConvertibleToInt(value) {
        if (typeof value === 'string') return Number.isInteger(Number.parseInt(value));
        else if (typeof value === 'number') return Number.isInteger(value);

        return false;
    }

    /**
     *
     * @param {unknown} value
     * @returns {boolean}
     */
    static isValueConvertibleToBool(value) {
        if (typeof value === 'string') return value === 'true' || value === 'false';
        else if (typeof value === 'boolean') return true;

        return false;
    }

    /**
     *
     * @param {unknown} value
     * @returns {boolean}
     */
    static isValueConvertibleToString(value) {
        return true;
    }

    /**
     *
     * @param {ValueType} targetValueType
     * @param {unknown} value
     * @returns {Error | unknown}
     */
    static convertValue(targetValueType, value) {
        if (!this.isValueConvertible(targetValueType, value))
            return new Error(`Could not convert value into '${targetValueType}'.`);

        switch (targetValueType) {
            case 'string': return value.toString();
            case 'string?': return value === null ? null : value.toString();
            case 'float': return typeof value === 'string' ? Number.parseFloat(value) : typeof value === 'number' ? value : new Error('cant convert val to float');
            case 'float?': return value === null ? value : typeof value === 'string' ? Number.parseFloat(value) : typeof value === 'number' ? value : new Error('cant convert val to float?');
            case 'int': return typeof value === 'string' ? Number.parseInt(value) : typeof value === 'number' ? Number.isInteger(value) ? value : new Error('not int') : new Error('cant convert val to int');
            case 'int?': return value === null ? null : typeof value === 'string' ? Number.parseInt(value) : typeof value === 'number' ? Number.isInteger(value) ? value : new Error('not int') : new Error('cant convert val to int');
            case 'bool': return value === 'true' ? true : false;
            case 'bool?': return value === null ? null : value === 'true' ? true : false;
            default: return new Error('unknown value type');
        }
    }
}

export const booleanConverter = {
    // the default converter returns true when the attribute is present, regardless of its value
    // this converter returns true only if the attribute is set to "true" or ""
    fromAttribute: (value, type) => {
        // `value` is a string
        // Convert it to a value of type `type` and return it

        return value?.toLowerCase() === "true" || value?.toLowerCase() === "";
    },
    toAttribute: (value, type) => {
        // `value` is of type `type`
        // Convert it to a string and return it

        if (value === true) return "true"
        else return null;
    }
};
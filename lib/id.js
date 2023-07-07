/**
 * Generate a random id string.
 * @returns {string}
 */
export function id() {
    return (Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 100).toString() + Math.floor(Math.random() * 1000).toString()).padStart('6', '0');
}
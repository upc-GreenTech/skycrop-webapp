export class StringValidator {
    static #ZERO = 0;

    static isString(value) {
        return typeof value === 'string' || value instanceof String;
    }

    static isNotEmptyString(value) {
        return this.isString(value) && value.trim().length > this.#ZERO;
    }
}
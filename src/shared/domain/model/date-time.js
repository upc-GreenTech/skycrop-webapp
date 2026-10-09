export class DateTime {
    #date;

    constructor(value) {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid datetime value');
        }
        this.#date = date;
    }

    format(locale = 'en-US', options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }) {
        return this.#date.toLocaleDateString(locale, options);
    }

    static isValidDate(date){
        return !isNaN(Date.parse(date));
    }

    toDate() {
        return new Date(this.#date.getTime());
    }

    toISOString() {
        return this.#date.toISOString();
    }

    valueOf() {
        return this.#date.getTime();
    }

    static now() {
        return new DateTime(new Date());
    }
}
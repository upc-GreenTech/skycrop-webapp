import {DateTime} from "../../../shared/domain/model/date-time.js";
import {StringValidator} from "../../../shared/domain/model/string-validator.js";

export class Diagnosis {
    #id;
    #generatedAt;
    #observations;
    #status;

    constructor(id, generated, observations, status) {
        if (!DateTime.isValidDate(generated)) {
            throw new Error("generatedAt must be a valid date value");
        }
        if (!StringValidator.isNotEmptyString(observations)){
            throw new Error("Observations must be a non-empty string");
        }
        if (!StringValidator.isNotEmptyString(status)){
            throw new Error("Status must be a non-empty string");
        }
        if (!["PENDING","PROCESSING","COMPLETED","FAILED"].includes(status.toUpperCase())){
            throw new Error("Entered status is invalid");
        }
    }

    get id(){
        return this.#id;
    }

    get generatedAt(){
        return this.#generatedAt;
    }

    get observations(){
        return this.#observations;
    }

    get status(){
        return this.#status;
    }
}
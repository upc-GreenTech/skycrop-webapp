import {DateTime} from "../../../shared/domain/model/date-time.js";
import {StringValidator} from "../../../shared/domain/model/string-validator.js";

export class Diagnosis {
    #id;
    #generatedAt;
    #observations;
    #status;
    #anomalies;

    constructor(id, generated, observations, status, anomalies) {
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

        this.#id = id;
        this.#generatedAt = generated instanceof DateTime? generated : new DateTime(generated);
        this.#observations = observations;
        this.#status = status;
        this.#anomalies = anomalies;
    }

    get id(){
        return this.#id;
    }

    get generationDate(){
        return this.#generatedAt.format();
    }

    get observations(){
        return this.#observations;
    }

    get status(){
        return this.#status;
    }

    get anomalies(){
        return this.#anomalies;
    }

    get topAnomaly(){
        return this.#anomalies[0].type;
    }

    get topLocation(){
        return this.#anomalies[0].location;
    }
}
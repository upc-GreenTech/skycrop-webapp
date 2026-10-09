import {StringValidator} from "../../../shared/domain/model/string-validator.js";

export class Anomaly {
    #id;
    #type;
    #severity;
    #description;
    #location;

    constructor(id, type, severity, description, location){
        if (!StringValidator.isNotEmptyString(type)){
            throw new Error("Type must be a non-empty string");
        }
        if (!StringValidator.isNotEmptyString(severity)){
            throw new Error("Severity must be a non-empty string");
        }
        if (!StringValidator.isNotEmptyString(description)){
            throw new Error("Description must be a non-empty string");
        }
        if (!StringValidator.isNotEmptyString(location)){
            throw new Error("Location must be a non-empty string");
        }

        if (!["WATER_STRESS","PEST","FERTILIZER_DEFICIENCITY","OTHER"].includes(type.toUpperCase())){
            throw new Error("Invalid Type");
        }

        if (!["LOW","HIGH","MEDIUM","CRITICAL"].includes(severity.toUpperCase())){
            throw new Error("Invalid Severity");
        }

        this.#id = id;
        this.#type = type;
        this.#severity = severity;
        this.#description = description;
        this.#location = location;
    }

    get id(){
        return this.#id;
    }

    get type(){
        return this.#type;
    }

    get severity(){
        return this.#severity;
    }

    get description(){
        return this.#description;
    }

    get location(){
        return this.#location;
    }




}
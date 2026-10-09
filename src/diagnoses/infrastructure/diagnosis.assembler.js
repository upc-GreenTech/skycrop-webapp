import {Diagnosis} from "../domain/model/diagnosis.entity.js";

export class DiagnosisAssembler {

    /**
     * @param {DiagnosisResource} resource
     */
    static toEntityFromResource(resource){
        const id = resource.id;
        const generatedAt = resource.generatedAt;
        const observations = resource.observations;
        const status = resource.status;
        const anomalies = resource.anomalies;

        return new Diagnosis(id,generatedAt,observations,status,anomalies);
    }

    /**
     * @param {Diagnosis} entity
     */
    static toResourceFromEntity(entity){
        const resource = {
            generatedAt: entity.generatedAt,
            observations: entity.observations,
            status: entity.status,
            anomalies: entity.anomalies
        }
        if (entity.id !== null) resource.id = entity.id;
        return resource
    }

    static toEntitiesFromResponse(response){
        return response.data.map(resource => this.toEntityFromResource(resource));
    }
}
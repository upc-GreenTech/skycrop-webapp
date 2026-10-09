import {Diagnosis} from '../domain/model/diagnosis.entity.js';
import {Anomaly} from '../domain/model/anomaly.entity.js';
export class DiagnosisAssembler {
  static toEntityFromResource(resource) {
    const anomalies = (resource.anomalies || []).map(
      (item) =>
        new Anomaly(
          item.id,
          item.type,
          item.severity,
          item.description,
          item.location,
          item.latitude ?? null,
          item.longitude ?? null,
        ),
    );
    return new Diagnosis(
      resource.id,
      resource.generatedAt,
      resource.observations,
      resource.status,
      anomalies,
      resource,
    );
  }
  static toResourceFromEntity(entity) {
    const resource = {
      generatedAt: entity.generatedAt,
      observations: entity.observations,
      status: entity.status,
      plotId: entity.plotId,
      flightId: entity.flightId,
      source: entity.source,
      scenario: entity.scenario,
      averageNdvi: entity.averageNdvi,
      anomalies: entity.anomalies.map((item) => ({
        id: item.id,
        type: item.type,
        severity: item.severity,
        description: item.description,
        location: item.location,
        latitude: item.latitude,
        longitude: item.longitude,
      })),
    };
    if (entity.id !== null && entity.id !== undefined) resource.id = entity.id;
    return resource;
  }
  static toEntitiesFromResponse(response) {
    return response.data.map((resource) => this.toEntityFromResource(resource));
  }
}

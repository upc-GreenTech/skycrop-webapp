import {Report} from '../domain/model/report.entity.js';
export class ReportAssembler {
  static toEntityFromResource(resource) {
    return new Report(resource);
  }
  static toResourceFromEntity(entity) {
    return {
      title: entity.title,
      generatedAt: entity.generatedAt,
      season: entity.season,
      year: entity.year,
      owner: entity.owner,
      generatedBy: entity.generatedBy,
      type: entity.type,
      content: entity.content,
      metrics: entity.metrics,
      ndviEvolution: entity.ndviEvolution,
      performance: entity.performance,
      sourceReportIds: entity.sourceReportIds,
    };
  }
}

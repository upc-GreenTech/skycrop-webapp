import {DateTime} from '../../../shared/domain/model/date-time.js';
import {StringValidator} from '../../../shared/domain/model/string-validator.js';

export class Diagnosis {
  #id;
  #generatedAt;
  #observations;
  #status;
  #anomalies;
  #details;

  constructor(id, generated, observations, status, anomalies = [], details = {}) {
    if (!(generated instanceof DateTime) && !DateTime.isValidDate(generated)) {
      throw new Error('generatedAt must be a valid date value');
    }
    if (!StringValidator.isNotEmptyString(observations)) {
      throw new Error('Observations must be a non-empty string');
    }
    if (!StringValidator.isNotEmptyString(status)) {
      throw new Error('Status must be a non-empty string');
    }
    if (!['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'].includes(status.toUpperCase())) {
      throw new Error('Entered status is invalid');
    }

    if (!Array.isArray(anomalies)) throw new Error('Anomalies must be an array');
    if (
      details.averageNdvi != null &&
      (!Number.isFinite(details.averageNdvi) || Math.abs(details.averageNdvi) > 1)
    )
      throw new Error('Invalid NDVI value');
    this.#details = {...details};
    this.#id = id;
    this.#generatedAt = generated instanceof DateTime ? generated : new DateTime(generated);
    this.#observations = observations;
    this.#status = status.toUpperCase();
    this.#anomalies = [...anomalies];
  }

  get id() {
    return this.#id;
  }

  get generationDate() {
    return this.#generatedAt.format();
  }

  get generatedAt() {
    return this.#generatedAt.toISOString();
  }
  get plotId() {
    return this.#details.plotId ?? null;
  }
  get flightId() {
    return this.#details.flightId ?? null;
  }
  get source() {
    return this.#details.source || '';
  }
  get averageNdvi() {
    return this.#details.averageNdvi ?? null;
  }
  get scenario() {
    return this.#details.scenario || '';
  }

  get observations() {
    return this.#observations;
  }

  get status() {
    return this.#status;
  }

  get anomalies() {
    return [...this.#anomalies];
  }

  get topAnomaly() {
    return this.#anomalies[0]?.type || '';
  }

  get topLocation() {
    return this.#anomalies[0]?.location || '';
  }
}

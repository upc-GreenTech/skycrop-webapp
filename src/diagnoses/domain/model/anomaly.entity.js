import {StringValidator} from '../../../shared/domain/model/string-validator.js';

export class Anomaly {
  #id;
  #type;
  #severity;
  #description;
  #location;
  #latitude;
  #longitude;

  constructor(id, type, severity, description, location, latitude = null, longitude = null) {
    if (!StringValidator.isNotEmptyString(type)) {
      throw new Error('Type must be a non-empty string');
    }
    if (!StringValidator.isNotEmptyString(severity)) {
      throw new Error('Severity must be a non-empty string');
    }
    if (!StringValidator.isNotEmptyString(description)) {
      throw new Error('Description must be a non-empty string');
    }
    if (!StringValidator.isNotEmptyString(location)) {
      throw new Error('Location must be a non-empty string');
    }

    if (
      ![
        'WATER_STRESS',
        'PEST',
        'FERTILIZER_DEFICIENCITY',
        'FERTILIZER_DEFICIENCY',
        'OTHER',
      ].includes(type.toUpperCase())
    ) {
      throw new Error('Invalid Type');
    }

    if (!['LOW', 'HIGH', 'MEDIUM', 'CRITICAL'].includes(severity.toUpperCase())) {
      throw new Error('Invalid Severity');
    }

    if (
      (latitude === null) !== (longitude === null) ||
      (latitude !== null &&
        (!Number.isFinite(latitude) ||
          Math.abs(latitude) > 90 ||
          !Number.isFinite(longitude) ||
          Math.abs(longitude) > 180))
    )
      throw new Error('Invalid anomaly coordinates');
    this.#latitude = latitude;
    this.#longitude = longitude;
    this.#id = id;
    this.#type =
      type.toUpperCase() === 'FERTILIZER_DEFICIENCITY'
        ? 'FERTILIZER_DEFICIENCY'
        : type.toUpperCase();
    this.#severity = severity.toUpperCase();
    this.#description = description;
    this.#location = location;
  }

  get latitude() {
    return this.#latitude;
  }
  get longitude() {
    return this.#longitude;
  }

  get id() {
    return this.#id;
  }

  get type() {
    return this.#type;
  }

  get severity() {
    return this.#severity;
  }

  get description() {
    return this.#description;
  }

  get location() {
    return this.#location;
  }
}

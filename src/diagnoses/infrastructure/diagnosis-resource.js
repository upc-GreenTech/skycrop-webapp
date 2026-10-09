/**
 * @typedef {Object} DiagnosisResource
 * @property {string} id
 * @property {string} generatedAt
 * @property {string} observations
 * @property {string} status
 * @property {Anomaly[]} anomalies
 * @property {string|number|null} plotId
 * @property {string|number|null} flightId
 * @property {string} source
 * @property {number|null} averageNdvi
 */

/**
 * @typedef {object} Anomaly
 * @property {string} id
 * @property {string} type
 * @property {string} severity
 * @property {string} description
 * @property {string} location
 * @property {number|null} latitude
 * @property {number|null} longitude
 */

/**
 * @typedef {Object} DiagnosisResponse
 * @property {DiagnosisResource[]} diagnoses
 */

export {};

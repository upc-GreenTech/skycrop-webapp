/**
 * @typedef {Object} DiagnosisResource
 * @property {string} id
 * @property {string} generatedAt
 * @property {string} observations
 * @property {string} status
 * @property {Anomaly[]} anomalies
 */

/**
 * @typedef {object} Anomaly
 * @property {string} id
 * @property {string} type
 * @property {string} severity
 * @property {string} description
 * @property {string} location
 */

/**
 * @typedef {Object} DiagnosisResponse
 * @property {DiagnosisResource[]} diagnoses
 */





export {}
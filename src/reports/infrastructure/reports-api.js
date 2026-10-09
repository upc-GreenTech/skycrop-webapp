import axios from 'axios';
export class ReportsApi {
  #http;
  constructor(baseURL = import.meta.env.VITE_SKYCROP_API_URL) {
    this.#http = axios.create({baseURL, timeout: 15000});
  }
  getAll() {
    return this.#http.get('/reports');
  }
  getById(id) {
    return this.#http.get(`/reports/${encodeURIComponent(id)}`);
  }
  create(resource) {
    return this.#http.post('/reports', resource);
  }
}

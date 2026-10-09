import axios from 'axios';
export class DronesApi {
  #http;
  constructor(baseURL = import.meta.env.VITE_SKYCROP_API_URL) {
    this.#http = axios.create({baseURL, timeout: 15000});
  }
  getAll() {
    return this.#http.get('/drones');
  }
  getById(id) {
    return this.#http.get(`/drones/${encodeURIComponent(id)}`);
  }
  create(resource) {
    return this.#http.post('/drones', resource);
  }
  update(id, resource) {
    return this.#http.patch(`/drones/${encodeURIComponent(id)}`, resource);
  }
  getPlots() {
    return this.#http.get('/plots');
  }
  getRoutes() {
    return this.#http.get('/flightRoutes');
  }
  getFlights() {
    return this.#http.get('/flights');
  }
  getImages() {
    return this.#http.get('/aerialImages');
  }
  saveRoute(resource, id) {
    return id === undefined
      ? this.#http.post('/flightRoutes', resource)
      : this.#http.patch(`/flightRoutes/${encodeURIComponent(id)}`, resource);
  }
  createFlight(resource) {
    return this.#http.post('/flights', resource);
  }
  cancelFlight(id) {
    return this.#http.patch(`/flights/${encodeURIComponent(id)}`, {status: 'CANCELLED'});
  }
}

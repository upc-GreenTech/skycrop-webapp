import axios from "axios";

export class DiagnosesApi {
    #http;

    constructor(baseURL = import.meta.env.VITE_SKYCROP_API_URL) {
        this.#http = axios.create({baseURL});
    }

    getAll() {
        return this.#http.get('/diagnoses');
    }

    getById(id) {
        return this.#http.get(`/diagnoses/${encodeURIComponent(id)}`);
    }

    create(resource) {
        return this.#http.post('/diagnoses', resource);
    }
}
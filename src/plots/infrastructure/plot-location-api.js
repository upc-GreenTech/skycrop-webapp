import axios from 'axios';

const cachedLocations = new Map();
let lastRequest = 0;

export class PlotLocationApi {
  async search(query, language) {
    const key = `${language}:${query.trim().toLowerCase()}`;
    if (cachedLocations.has(key)) return cachedLocations.get(key);
    const delay = Math.max(0, 1100 - (Date.now() - lastRequest));
    lastRequest = Date.now() + delay;
    if (delay) await new Promise(resolve => setTimeout(resolve, delay));
    const response = await axios.get(import.meta.env.VITE_GEOCODING_URL || 'https://nominatim.openstreetmap.org/search', {
      params: {q: query.trim(), format: 'jsonv2', limit: 5, 'accept-language': language},
      timeout: 10000
    });
    cachedLocations.set(key, response.data);
    return response.data;
  }
}

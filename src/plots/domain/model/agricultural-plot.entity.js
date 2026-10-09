export class AgriculturalPlot {
  #id;
  #name;
  #areaHectares;
  #location;
  #createdAt;
  #status;
  #personInCharge;
  #cropType;
  #soilType;
  #sowingDate;
  #latitude;
  #longitude;
  #imageUrl;

  constructor({id = null, name, areaHectares, location, createdAt = null, status = 'ACTIVE', personInCharge = '', cropType = '', soilType = '', sowingDate = null, latitude = null, longitude = null, imageUrl = ''}) {
    if (typeof name !== 'string' || !name.trim()) {
      throw new Error('A plot name is required.');
    }
    if (typeof areaHectares !== 'number' || !Number.isFinite(areaHectares) || areaHectares <= 0) {
      throw new Error('The plot area must be greater than zero.');
    }
    if (typeof location !== 'string' || !location.trim()) {
      throw new Error('A plot location is required.');
    }
    if (!['ACTIVE', 'INACTIVE'].includes(status)) {
      throw new Error('The plot status is invalid.');
    }

    for (const value of [personInCharge, cropType, soilType, imageUrl]) {
      if (typeof value !== 'string') throw new Error('The plot information must be text.');
    }
    if (sowingDate && (!/^\d{4}-\d{2}-\d{2}$/.test(sowingDate)
        || new Date(sowingDate).toISOString().slice(0, 10) !== sowingDate)) {
      throw new Error('The sowing date is invalid.');
    }
    if ((latitude === null) !== (longitude === null)
        || (latitude !== null && (!Number.isFinite(latitude) || Math.abs(latitude) > 90))
        || (longitude !== null && (!Number.isFinite(longitude) || Math.abs(longitude) > 180))) {
      throw new Error('The plot coordinates are invalid.');
    }
    if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
      throw new Error('The image URL must use HTTP or HTTPS.');
    }
    this.#personInCharge = personInCharge.trim();
    this.#cropType = cropType.trim();
    this.#soilType = soilType.trim();
    this.#sowingDate = sowingDate;
    this.#latitude = latitude;
    this.#longitude = longitude;
    this.#imageUrl = imageUrl.trim();
    this.#id = id;
    this.#name = name.trim();
    this.#areaHectares = areaHectares;
    this.#location = location.trim();
    this.#createdAt = createdAt;
    this.#status = status;
  }

  get id() { return this.#id; }
  get name() { return this.#name; }
  get areaHectares() { return this.#areaHectares; }
  get location() { return this.#location; }
  get createdAt() { return this.#createdAt; }
  get status() { return this.#status; }
  get personInCharge() { return this.#personInCharge; }
  get cropType() { return this.#cropType; }
  get soilType() { return this.#soilType; }
  get sowingDate() { return this.#sowingDate; }
  get latitude() { return this.#latitude; }
  get longitude() { return this.#longitude; }
  get imageUrl() { return this.#imageUrl; }
}

export class Drone {
  #attributes;
  constructor(attributes) {
    const {
      name,
      model,
      serialNumber,
      camera,
      autonomyMinutes,
      battery = 0,
      status = 'DISCONNECTED',
    } = attributes;
    if (
      ![name, model, serialNumber, camera].every(
        (value) => typeof value === 'string' && value.trim(),
      )
    )
      throw new Error('Invalid drone information');
    if (
      !Number.isFinite(autonomyMinutes) ||
      autonomyMinutes <= 0 ||
      !Number.isFinite(battery) ||
      battery < 0 ||
      battery > 100
    )
      throw new Error('Invalid drone capacity');
    if (!['DISCONNECTED', 'AVAILABLE', 'ON_MISSION', 'MAINTENANCE'].includes(status))
      throw new Error('Invalid drone status');
    if (attributes.imageUrl) {
      const url = new URL(attributes.imageUrl);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid image URL');
    }
    this.#attributes = {
      ...attributes,
      name: name.trim(),
      model: model.trim(),
      serialNumber: serialNumber.trim(),
      camera: camera.trim(),
      battery,
      status,
    };
  }
  get id() {
    return this.#attributes.id;
  }
  get name() {
    return this.#attributes.name;
  }
  get model() {
    return this.#attributes.model;
  }
  get serialNumber() {
    return this.#attributes.serialNumber;
  }
  get camera() {
    return this.#attributes.camera;
  }
  get autonomyMinutes() {
    return this.#attributes.autonomyMinutes;
  }
  get battery() {
    return this.#attributes.battery;
  }
  get status() {
    return this.#attributes.status;
  }
  get imageUrl() {
    return this.#attributes.imageUrl || '';
  }
  get createdAt() {
    return this.#attributes.createdAt;
  }
}

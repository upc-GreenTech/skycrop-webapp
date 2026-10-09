export class FlightRoute {
  #attributes;
  constructor(attributes) {
    const {name, plotId, altitudeMeters, speedMetersPerSecond, waypoints} = attributes;
    if (!name?.trim() || plotId === undefined || plotId === null || plotId === '')
      throw new Error('Invalid route information');
    if (
      !Number.isFinite(altitudeMeters) ||
      altitudeMeters <= 0 ||
      !Number.isFinite(speedMetersPerSecond) ||
      speedMetersPerSecond <= 0
    )
      throw new Error('Invalid flight parameters');
    if (
      !Array.isArray(waypoints) ||
      waypoints.length < 2 ||
      waypoints.some(
        (point) =>
          !Number.isFinite(point.latitude) ||
          Math.abs(point.latitude) > 90 ||
          !Number.isFinite(point.longitude) ||
          Math.abs(point.longitude) > 180,
      )
    )
      throw new Error('Invalid waypoints');
    this.#attributes = {
      ...attributes,
      name: name.trim(),
      waypoints: waypoints.map((point) => ({...point})),
    };
  }
  get id() {
    return this.#attributes.id;
  }
  get name() {
    return this.#attributes.name;
  }
  get plotId() {
    return this.#attributes.plotId;
  }
  get altitudeMeters() {
    return this.#attributes.altitudeMeters;
  }
  get speedMetersPerSecond() {
    return this.#attributes.speedMetersPerSecond;
  }
  get waypoints() {
    return this.#attributes.waypoints.map((point) => ({...point}));
  }
}

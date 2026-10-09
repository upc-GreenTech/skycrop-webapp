import {Drone} from '../domain/model/drone.entity.js';
export class DroneAssembler {
  static toEntityFromResource(resource) {
    return new Drone(resource);
  }
  static toResourceFromEntity(entity) {
    return {
      name: entity.name,
      model: entity.model,
      serialNumber: entity.serialNumber,
      camera: entity.camera,
      autonomyMinutes: entity.autonomyMinutes,
      battery: entity.battery,
      status: entity.status,
      imageUrl: entity.imageUrl,
      createdAt: entity.createdAt,
    };
  }
}

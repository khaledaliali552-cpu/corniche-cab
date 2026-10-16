import * as THREE from '../vendor/three.module.min.js';
import { LANE_X } from './world.js';
import { buildVehicle } from './vehicles.js';

export class Traffic {
  constructor(scene) {
    this.scene = scene;
    this.cars = [];
    this.types = ['taxi_132', 'suzuki_van', 'microbus', 'toktok'];
    this.colors = [0xffffff, 0xd63031, 0x0984e3, 0xf1c40f, 0x111111];
    this.initCars();
  }

  initCars() {
    for (let i = 0; i < 8; i++) {
      const type = this.types[Math.floor(Math.random() * this.types.length)];
      const col = this.colors[Math.floor(Math.random() * this.colors.length)];
      const mesh = buildVehicle(type, col);
      this.scene.add(mesh);

      const lane = LANE_X[Math.floor(Math.random() * LANE_X.length)];
      const z = 40 + i * 45;
      mesh.position.set(lane, 0, z);

      this.cars.push({
        mesh,
        speed: 12 + Math.random() * 8,
        lane
      });
    }
  }

  reset() {
    this.cars.forEach((c, idx) => {
      c.lane = LANE_X[Math.floor(Math.random() * LANE_X.length)];
      c.mesh.position.set(c.lane, 0, 50 + idx * 40);
    });
  }

  update(dt, playerZ, playerCar) {
    for (let c of this.cars) {
      c.mesh.position.z += c.speed * dt;

      // لو العربية بعدت أوي تعيد الظهور قدام
      if (c.mesh.position.z < playerZ - 20) {
        c.mesh.position.z = playerZ + 180 + Math.random() * 50;
        c.lane = LANE_X[Math.floor(Math.random() * LANE_X.length)];
        c.mesh.position.x = c.lane;
      } else if (c.mesh.position.z > playerZ + 250) {
        c.mesh.position.z = playerZ + 30;
      }
    }
  }
}

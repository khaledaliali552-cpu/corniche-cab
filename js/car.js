import * as THREE from '../vendor/three.module.min.js';
import { buildVehicle } from './vehicles.js';
import { clamp } from './data.js';

export class Car {
  constructor(scene, input, audio) {
    this.scene = scene;
    this.input = input;
    this.audio = audio;

    this.pos = new THREE.Vector3(0, 0, 0);
    this.speed = 0;
    this.maxSpeed = 28;
    this.accel = 16;
    this.brakeForce = 24;
    this.turnSpeed = 1.8;
    this.color = 0xffffff;
    this.carId = 'taxi_132';

    this.mesh = buildVehicle(this.carId, this.color);
    this.scene.add(this.mesh);
  }

  setColor(hex) {
    this.color = hex;
    this.scene.remove(this.mesh);
    this.mesh = buildVehicle(this.carId, this.color);
    this.scene.add(this.mesh);
  }

  setCar(carId) {
    this.carId = carId;
    this.scene.remove(this.mesh);
    this.mesh = buildVehicle(this.carId, this.color);
    this.scene.add(this.mesh);
  }

  reset() {
    this.pos.set(0, 0, 0);
    this.speed = 0;
    if (this.mesh) {
      this.mesh.position.set(0, 0, 0);
      this.mesh.rotation.set(0, 0, 0);
    }
  }

  update(dt) {
    let throttle = 0;
    let steer = 0;

    if (this.input) {
      if (this.input.isDown('ArrowUp') || this.input.isDown('KeyW')) throttle += 1;
      if (this.input.isDown('ArrowDown') || this.input.isDown('KeyS')) throttle -= 1.2;
      if (this.input.isDown('ArrowLeft') || this.input.isDown('KeyA')) steer += 1;
      if (this.input.isDown('ArrowRight') || this.input.isDown('KeyD')) steer -= 1;
      if (this.input.isDown('KeyH') && this.audio) this.audio.playHorn();
    }

    if (throttle > 0) {
      this.speed = Math.min(this.speed + this.accel * dt, this.maxSpeed);
    } else if (throttle < 0) {
      this.speed = Math.max(this.speed - this.brakeForce * dt, -8);
    } else {
      if (this.speed > 0) this.speed = Math.max(0, this.speed - 8 * dt);
      else if (this.speed < 0) this.speed = Math.min(0, this.speed + 8 * dt);
    }

    if (Math.abs(this.speed) > 0.1) {
      this.pos.x += steer * this.turnSpeed * dt * (this.speed / this.maxSpeed);
      this.pos.x = clamp(this.pos.x, -5.5, 5.5);
    }

    this.pos.z += this.speed * dt;

    if (this.mesh) {
      this.mesh.position.copy(this.pos);
      this.mesh.rotation.y = steer * 0.15;
    }
  }
}

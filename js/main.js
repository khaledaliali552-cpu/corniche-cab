import { createRenderer, createCamera, createScene } from './world.js';
import { setupUI } from './ui.js';
import { Input } from './input.js';
import { Car } from './car.js';
import { World } from './world.js';
import { Traffic } from './traffic.js';
import { Rides } from './rides.js';
import { Audio, initCassette } from './sfx.js';
import { Save } from './save.js';

const canvas = document.getElementById('gl');
const renderer = createRenderer(canvas);
const scene = createScene();
const camera = createCamera();

const audio = new Audio();
const save = new Save();
const input = new Input();
const world = new World(scene);
const car = new Car(scene, input, audio);
const traffic = new Traffic(scene);
const rides = new Rides(scene, car, audio, save);

// تشغيل الكاسيت
initCassette();

const ui = setupUI({
  save,
  audio,
  rides,
  car,
  world,
  onStartShift: (routeId) => {
    rides.startShift(routeId);
    car.reset();
    traffic.reset();
  }
});

let lastTime = performance.now();
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  if (rides.inShift) {
    input.update();
    car.update(dt, world);
    world.update(car.pos.z);
    traffic.update(dt, car.pos.z, car);
    rides.update(dt, car);
    ui.update(dt, car, rides);
  }

  camera.position.set(car.pos.x * 0.3, car.pos.y + 4, car.pos.z - 7);
  camera.lookAt(car.pos.x * 0.5, car.pos.y + 1, car.pos.z + 10);

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

requestAnimationFrame(loop);

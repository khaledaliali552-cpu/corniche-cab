import * as THREE from '../vendor/three.module.min.js';
import { World } from './world.js';
import { Car } from './car.js';
import { Traffic } from './traffic.js';
import { Rides } from './rides.js';
import { Input } from './input.js';
import { setupUI } from './ui.js';
import { Audio, initCassette } from './sfx.js';

// نظام حفظ الفلوس في المتصفح
class LocalSave {
  constructor() {
    this.key = 'corniche_cab_save_v1';
    this.data = this.load();
  }
  load() {
    try {
      const raw = localStorage.getItem(this.key);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { money: 0, day: 1, carId: 'taxi_132', carColor: 0xffffff };
  }
  save() {
    try {
      localStorage.setItem(this.key, JSON.stringify(this.data));
    } catch (e) {}
  }
}

// 1. محرك العرض
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. المشهد والإضاءة
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x76b6e4);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xfff5e6, 0.9);
dirLight.position.set(25, 45, 20);
scene.add(dirLight);

// 3. الكاميرا
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

// 4. إنشاء العالم، التاكسي، حركة المرور، والركاب
const world = new World(scene);
const input = new Input();
const audio = new Audio();
const save = new LocalSave();
const car = new Car(scene, input, audio);
const traffic = new Traffic(scene);
const rides = new Rides(scene, car, audio, save);

// تشغيل الكاسيت
initCassette();

// ربط القوائم
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

// حلقة اللعبة الأساسية
let lastTime = performance.now();
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  if (rides.inShift) {
    input.update();
    car.update(dt);
    world.update(car.pos.z);
    traffic.update(dt, car.pos.z, car);
    rides.update(dt, car);
    ui.update(dt, car, rides);
  }

  // الكاميرا خلف العربية
  camera.position.set(car.pos.x * 0.4, car.pos.y + 4.5, car.pos.z - 7.5);
  camera.lookAt(car.pos.x * 0.5, car.pos.y + 1.2, car.pos.z + 12);

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

requestAnimationFrame(loop);

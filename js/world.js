import * as THREE from '../vendor/three.module.min.js';
import { setupUI } from './ui.js';
import { Input } from './input.js';
import { Car } from './car.js';
import { Traffic } from './traffic.js';
import { Rides } from './rides.js';
import { Audio, initCassette } from './sfx.js';

// نظام حفظ التقدم مدمج
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

    return {
      money: 0,
      day: 1,
      carId: 'taxi_132',
      carColor: 0xffffff,
      ownedCars: ['taxi_132']
    };
  }

  save() {
    try {
      localStorage.setItem(this.key, JSON.stringify(this.data));
    } catch (e) {}
  }
}

// 1. إنشاء محرك العرض
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. إنشاء المشهد والإضاءة
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x76b6e4);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xfff5e6, 0.9);
dirLight.position.set(25, 45, 20);
scene.add(dirLight);

// 3. بناء الشارع والرصيف والبحر والمباني
const roadGroup = new THREE.Group();
scene.add(roadGroup);

// أسفلت الطريق
const roadGeo = new THREE.PlaneGeometry(16, 2000);
const roadMat = new THREE.MeshLambertMaterial({ color: 0x2c3437 });
const roadMesh = new THREE.Mesh(roadGeo, roadMat);
roadMesh.rotation.x = -Math.PI / 2;
roadMesh.position.z = 800;
roadGroup.add(roadMesh);

// رصيف وكورنيش البحر
const seaGeo = new THREE.PlaneGeometry(300, 2000);
const seaMat = new THREE.MeshLambertMaterial({ color: 0x1a6fa0 });
const seaMesh = new THREE.Mesh(seaGeo, seaMat);
seaMesh.rotation.x = -Math.PI / 2;
seaMesh.position.set(160, -0.2, 800);
roadGroup.add(seaMesh);

// مباني على جانب الطريق
const bldgMat1 = new THREE.MeshLambertMaterial({ color: 0xdfd2be });
const bldgMat2 = new THREE.MeshLambertMaterial({ color: 0xc8b89e });
for (let z = 0; z < 1800; z += 35) {
  const h = 18 + Math.random() * 22;
  const w = 18 + Math.random() * 8;
  const bldgGeo = new THREE.BoxGeometry(w, h, 24);
  const bldg = new THREE.Mesh(bldgGeo, (z % 70 === 0) ? bldgMat1 : bldgMat2);
  bldg.position.set(-22, h / 2, z);
  roadGroup.add(bldg);
}

// 4. إنشاء الكاميرا
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

// 5. تهيئة باقي الأنظمة
const audio = new Audio();
const save = new LocalSave();
const input = new Input();
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
    if (typeof input.update === 'function') input.update();
    car.update(dt);
    traffic.update(dt, car.pos.z, car);
    rides.update(dt, car);
    ui.update(dt, car, rides);

    // متابعة المباني والشارع مع حركة العربية
    if (car.pos.z > roadGroup.position.z + 600) {
      roadGroup.position.z += 600;
    }
  }

  // ضبط مكان الكاميرا وراء العربية
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

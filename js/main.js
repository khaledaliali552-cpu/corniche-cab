import * as THREE from '../vendor/three.module.min.js';
import { setupUIExtensions } from './ui.js';
import { initCassette } from './sfx.js';

// حالة اللعبة العامة
export const gameState = {
  money: 0,
  day: 1,
  shiftTime: 360, // 6 import * as THREE from '../vendor/three.module.min.js';
import { Game } from './world.js';
import { Car } from './car.js';
import { TrafficManager } from './traffic.js';
import { RideManager } from './rides.js';
import { setupUIExtensions } from './ui.js';
import { initCassette } from './sfx.js';
import { ROUTES } from './data.js';

// حالة اللعبة العامة
export const gameState = {
  money: 0,
  day: 1,
  shiftTime: 360,
  currentRoute: 'geish',
  carColor: 0xffffff,
  carId: 'taxi_shahin',
  inShift: false
};

// تهيئة محرك اللعبة والعالم
const canvas = document.getElementById('gl');
const game = new Game(canvas);
const car = new Car(game.scene);
const traffic = new TrafficManager(game.scene);
const rides = new RideManager(game.scene, car);

// بدء الوردية بالخط المختار
export function startShift(routeId = 'geish') {
  gameState.currentRoute = routeId;
  gameState.inShift = true;

  // إخفاء القوائم وإظهار شاشة اللعب
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById('hud')?.classList.remove('hidden');

  // إظهار أزرار اللمس للموبايل
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.getElementById('touch')?.classList.remove('hidden');
  }

  // تحديث اسم الخط في الـ HUD
  const route = ROUTES[routeId] || ROUTES.geish;
  const routeTag = document.getElementById('hud-route-tag');
  if (routeTag) routeTag.textContent = `📍 ${route.name}`;

  // تفعيل عالم اللعبة وحركة المرور والركاب للخط المختار
  if (typeof game.resetForRoute === 'function') {
    game.resetForRoute(routeId);
  }
}

// حلقة اللعبة الأساسية (Game Loop)
let lastTime = performance.now();
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  if (gameState.inShift) {
    car.update(dt);
    game.update(dt, car.position);
    traffic.update(dt, car.position);
    rides.update(dt, car.position);
  }

  game.render(car);
}

// تشغيل الواجهات الجديدة والكاسيت
window.addEventListener('DOMContentLoaded', () => {
  if (typeof initCassette === 'function') {
    initCassette();
  }
  if (typeof setupUIExtensions === 'function') {
    setupUIExtensions(gameState, (selectedRoute) => {
      startShift(selectedRoute);
    });
  }
});

// بدء الحلقة
requestAnimationFrame(loop);دقائق
  currentRoute: 'geish',
  carColor: 0xffffff,
  carId: 'taxi_shahin',
  inShift: false
};

// تهيئة المشهد ومحرك Three.js
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // سماء زرقاء

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, -8);
camera.lookAt(0, 1, 4);

// إضاءة أساسية
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xfffaed, 0.8);
dirLight.position.set(20, 40, 20);
scene.add(dirLight);

// بدء الوردية بالخط المختار
export function startShift(routeId = 'geish') {
  gameState.currentRoute = routeId;
  gameState.inShift = true;

  // إخفاء جميع شاشات القوائم وإظهار الواجهة
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  const hud = document.getElementById('hud');
  if (hud) hud.classList.remove('hidden');

  const touch = document.getElementById('touch');
  if (touch && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    touch.classList.remove('hidden');
  }

  // تحديث بيانات الـ HUD
  const routeTag = document.getElementById('hud-route-tag');
  if (routeTag) {
    const routeNames = {
      geish: 'طريق الجيش',
      abuqir: 'طريق أبوقير',
      mahmoudia: 'شريان المحمودية',
      highway: 'الطريق السريع',
      desert: 'الصحراوي'
    };
    routeTag.textContent = `📍 ${routeNames[routeId] || 'إسكندرية'}`;
  }

  const hudMoney = document.querySelector('#hud-money b');
  if (hudMoney) hudMoney.textContent = gameState.money;
}

// حلقة الرسم والتحديث (Render Loop)
function animate() {
  requestAnimationFrame(animate);

  if (gameState.inShift) {
    // منطق حركة الكاميرا والسيارة أثناء اللعب
    camera.lookAt(0, 1, 6);
  }

  renderer.render(scene, camera);
}

// ضبط الحجم عند تدوير الشاشة أو تغيير أبعاد النافذة
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// بدء تشغيل الصوتيات والشاشات فور اكتمال التحميل
window.addEventListener('DOMContentLoaded', () => {
  if (typeof initCassette === 'function') {
    initCassette();
  }
  if (typeof setupUIExtensions === 'function') {
    setupUIExtensions(gameState, (selectedRoute) => {
      startShift(selectedRoute);
    });
  }
});

// إطلاق حلقة العرض
animate();

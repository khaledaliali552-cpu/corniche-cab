import * as THREE from '../vendor/three.module.min.js';
import { setupUIExtensions } from './ui.js';
import { initCassette } from './sfx.js';

// حالة اللعبة العامة
export const gameState = {
  money: 0,
  day: 1,
  shiftTime: 360, // 6 دقائق
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

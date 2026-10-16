import * as THREE from '../vendor/three.module.min.js';
import { ROUTES } from './data.js';

export class Rides {
  constructor(scene, car, audio, save) {
    this.scene = scene;
    this.car = car;
    this.audio = audio;
    this.save = save;
    this.inShift = false;
    this.currentRoute = 'geish';
    this.passenger = null;
    this.timer = 0;
  }

  startShift(routeId = 'geish') {
    this.currentRoute = routeId;
    this.inShift = true;
    this.spawnPassenger();
  }

  spawnPassenger() {
    const route = ROUTES[this.currentRoute] || ROUTES.geish;
    const stopA = route.stops[Math.floor(Math.random() * route.stops.length)];
    let stopB = route.stops[Math.floor(Math.random() * route.stops.length)];
    while (stopB === stopA && route.stops.length > 1) {
      stopB = route.stops[Math.floor(Math.random() * route.stops.length)];
    }

    this.passenger = {
      pickup: stopA,
      dropoff: stopB,
      fare: route.fare,
      distance: Math.floor(Math.random() * 300) + 200,
      active: true
    };

    // إظهار بطاقة الراكب
    const card = document.getElementById('card');
    const title = document.getElementById('card-title');
    const sub = document.getElementById('card-sub');
    if (card && title && sub) {
      card.classList.remove('hidden');
      title.textContent = `زبون رايح: ${stopB}`;
      sub.textContent = `الأجرة: ${route.fare} ج.م · اركب من ${stopA}`;
    }

    this.showQuote(this.currentRoute, stopA, stopB);
  }

  showQuote(routeId, fromStop, toStop) {
    let quote = "على مهلك يا كابتن طريقنا سالك!";

    if (routeId === 'mahmoudia') {
      if (toStop === 'شارع محسن') quote = "وديني عند حمو علاء آخدلي صورتين!";
      else if (toStop === 'شارع الزهور') quote = "وديني عند رأفت عشان أجيب فيب وليكويد!";
      else if (toStop === 'شارع الدريسة') quote = "وديني عند عطية عشان عليا قضية!";
    } else if (routeId === 'abuqir') {
      if (toStop === 'قسم باب شرق') quote = "وديني القسم أخويا ابن خالتي في ضيقة!";
    }

    const bubble = document.getElementById('passenger-bubble');
    if (bubble) {
      bubble.textContent = `🗣️ "${quote}"`;
      bubble.classList.remove('hidden');
      clearTimeout(this._bubbleTimer);
      this._bubbleTimer = setTimeout(() => {
        bubble.classList.add('hidden');
      }, 4500);
    }
  }

  update(dt, car) {
    if (!this.inShift || !this.passenger) return;
    this.passenger.distance -= dt * 25;

    const line = document.getElementById('card-line');
    if (line) line.textContent = `فاضل ${Math.max(0, Math.round(this.passenger.distance))} متر`;

    if (this.passenger.distance <= 0) {
      this.completeRide();
    }
  }

  completeRide() {
    if (!this.passenger) return;
    const earned = this.passenger.fare;
    if (this.save) {
      this.save.data.money = (this.save.data.money || 0) + earned;
      this.save.save();
    }
    if (this.audio) this.audio.playMoney();

    const hudMoney = document.querySelector('#hud-money b');
    if (hudMoney && this.save) hudMoney.textContent = this.save.data.money;

    this.spawnPassenger();
  }
}

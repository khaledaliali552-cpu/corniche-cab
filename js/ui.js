import { ROUTES, CARS, CAR_COLORS } from './data.js';

export function setupUI(app) {
  let selectedRoute = 'geish';

  // شاشات القوائم
  const screenMenu = document.getElementById('screen-menu');
  const screenRoutes = document.getElementById('screen-routes');
  const screenGarage = document.getElementById('screen-garage');
  const screenShare = document.getElementById('screen-share');
  const hud = document.getElementById('hud');
  const touch = document.getElementById('touch');

  // فتح شاشة الخطوط
  document.getElementById('m-start')?.addEventListener('click', () => {
    screenMenu.classList.add('hidden');
    screenRoutes.classList.remove('hidden');
  });

  document.getElementById('r-back')?.addEventListener('click', () => {
    screenRoutes.classList.add('hidden');
    screenMenu.classList.remove('hidden');
  });

  // اختيار الخط
  document.querySelectorAll('.route-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.route-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedRoute = card.dataset.route;
    });
  });

  // انطلق في الخط
  document.getElementById('r-confirm')?.addEventListener('click', () => {
    screenRoutes.classList.add('hidden');
    hud?.classList.remove('hidden');
    touch?.classList.remove('hidden');

    const route = ROUTES[selectedRoute];
    const tag = document.getElementById('hud-route-tag');
    if (tag) tag.textContent = `📍 ${route.name}`;

    if (app.onStartShift) app.onStartShift(selectedRoute);
  });

  // الجراج
  document.getElementById('m-garage')?.addEventListener('click', () => {
    screenMenu.classList.add('hidden');
    screenGarage.classList.remove('hidden');
    renderGarage();
  });

  document.getElementById('g-back')?.addEventListener('click', () => {
    screenGarage.classList.add('hidden');
    screenMenu.classList.remove('hidden');
  });

  function renderGarage() {
    const list = document.getElementById('garage-list');
    const moneyTag = document.getElementById('garage-money');
    if (moneyTag && app.save) moneyTag.textContent = `💰 ${app.save.data.money || 0} ج.م`;

    if (!list) return;
    list.innerHTML = '';
    CARS.forEach(car => {
      const el = document.createElement('div');
      el.className = 'route-card';
      el.innerHTML = `
        <div class="route-header">
          <span>${car.name}</span>
          <span class="route-price">${car.price === 0 ? 'مملوكة' : car.price + ' ج.م'}</span>
        </div>
      `;
      list.appendChild(el);
    });
  }

  // رش دوكو ودهانات
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      const hex = parseInt(swatch.dataset.color);
      if (app.save && (app.save.data.money >= 200)) {
        app.save.data.money -= 200;
        app.save.save();
        if (app.car) app.car.setColor(hex);
        alert('مبروك! تم رش العربية دوكو جديد.');
        renderGarage();
      } else {
        alert('معكش فلوس كفاية للدهان (200 ج.م)');
      }
    });
  });

  // مشاركة الواتساب
  document.getElementById('m-share')?.addEventListener('click', () => {
    screenMenu.classList.add('hidden');
    screenShare.classList.remove('hidden');
  });

  document.getElementById('share-back')?.addEventListener('click', () => {
    screenShare.classList.add('hidden');
    screenMenu.classList.remove('hidden');
  });

  document.getElementById('btn-send-whatsapp')?.addEventListener('click', () => {
    const link = `https://khaledaliali552-cpu.github.io/corniche-cab/`;
    const text = encodeURIComponent(`تعالى سوق معايا في إسكندرية على طريق الجيش والمحمودية! 🚖\n${link}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');

    if (app.save) {
      app.save.data.money = (app.save.data.money || 0) + 500;
      app.save.save();
      const hudMoney = document.querySelector('#hud-money b');
      if (hudMoney) hudMoney.textContent = app.save.data.money;
    }
    alert('مبروك! نزل في رصيدك 500 جنيه عشان شاركت مع أصحابك.');
  });

  return {
    update(dt, car, rides) {
      const speed = document.getElementById('speed');
      if (speed && car) speed.textContent = Math.round(car.speed * 3.6);
    }
  };
}

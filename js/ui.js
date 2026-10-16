import { ROUTES } from './data.js';

export function setupUIExtensions(gameState, onStartShift) {
  let selectedRoute = 'geish';

  // شاشة الطرق
  document.getElementById('m-start')?.addEventListener('click', () => {
    document.getElementById('screen-menu')?.classList.add('hidden');
    document.getElementById('screen-routes')?.classList.remove('hidden');
  });

  document.getElementById('r-back')?.addEventListener('click', () => {
    document.getElementById('screen-routes')?.classList.add('hidden');
    document.getElementById('screen-menu')?.classList.remove('hidden');
  });

  document.querySelectorAll('.route-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.route-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedRoute = card.dataset.route;
    });
  });

  document.getElementById('r-confirm')?.addEventListener('click', () => {
    document.getElementById('screen-routes')?.classList.add('hidden');
    const route = ROUTES[selectedRoute];
    const tag = document.getElementById('hud-route-tag');
    if (tag) tag.textContent = `📍 ${route.name}`;
    onStartShift(selectedRoute);
  });

  // مشاركة الواتساب
  document.getElementById('m-share')?.addEventListener('click', () => {
    document.getElementById('screen-menu')?.classList.add('hidden');
    document.getElementById('screen-share')?.classList.remove('hidden');
  });

  document.getElementById('share-back')?.addEventListener('click', () => {
    document.getElementById('screen-share')?.classList.add('hidden');
    document.getElementById('screen-menu')?.classList.remove('hidden');
  });

  document.getElementById('btn-send-whatsapp')?.addEventListener('click', () => {
    const refCode = "ALEX-" + Math.floor(1000 + Math.random() * 9000);
    const gameUrl = `https://khaledaliali552-cpu.github.io/corniche-cab/?ref=${refCode}`;
    const text = encodeURIComponent(`تعالى العب معايا لعبة أجرة الكورنيش في إسكندرية وسوق ميكروباص وتاكسي! 🚖 ادخل من هنا:\n${gameUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');

    gameState.money = (gameState.money || 0) + 500;
    const hudMoney = document.querySelector('#hud-money b');
    if (hudMoney) hudMoney.textContent = gameState.money;
    alert("تسلم يا أسطى! نزل في رصيدك 500 جنيه عشان شاركت مع أصحابك.");
  });

  // اختيار الدهان
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      const colorVal = parseInt(swatch.dataset.color);
      if (gameState.money >= 200) {
        gameState.money -= 200;
        gameState.carColor = colorVal;
        alert("مبروك رشينا العربية دوكو جديد!");
      } else {
        alert("معكش فلوس كفاية للدهان (مطلوب 200 ج.م)");
      }
    });
  });
}

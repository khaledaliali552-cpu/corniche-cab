import { ROUTES } from './data.js';

export function getQuoteForRide(routeId, pickupStop, dropoffStop) {
  if (routeId === 'mahmoudia') {
    if (dropoffStop === 'شارع محسن' || pickupStop === 'شارع محسن') return "وديني عند حمو علاء آخدلي صورتين!";
    if (dropoffStop === 'شارع الزهور' || pickupStop === 'شارع الزهور') return "وديني عند رأفت عشان أجيب فيب وليكويد!";
    if (dropoffStop === 'شارع الدريسة' || pickupStop === 'شارع الدريسة') return "وديني عند عطية عشان عليا قضية!";
  }

  if (routeId === 'abuqir') {
    if (dropoffStop === 'قسم باب شرق' || pickupStop === 'قسم باب شرق') {
      return Math.random() > 0.5 ? "وديني القسم أخويا ابن خالتي في ضيقة!" : "وديني عند عطية عشان عليا قضية!";
    }
  }

  const route = ROUTES[routeId] || ROUTES.geish;
  return route.quotes[Math.floor(Math.random() * route.quotes.length)];
}

export function showPassengerBubble(text, duration = 4000) {
  const bubble = document.getElementById('passenger-bubble');
  if (!bubble) return;
  bubble.textContent = `🗣️ "${text}"`;
  bubble.classList.remove('hidden');

  clearTimeout(bubble._timer);
  bubble._timer = setTimeout(() => {
    bubble.classList.add('hidden');
  }, duration);
}

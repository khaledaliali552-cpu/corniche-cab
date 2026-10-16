import { initCassette } from './sfx.js';
import { setupUIExtensions } from './ui.js';

// استدعاء الدوال عند تحميل اللعبة
initCassette();
setupUIExtensions(gameState, (selectedRoute) => {
  // بدء اللعبة بالخط المختار
  startShift(selectedRoute);
});

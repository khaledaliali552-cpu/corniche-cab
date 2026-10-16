export class Input {
  constructor() {
    this.keys = {};

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // أزرار الموبايل
    const bindTouch = (id, code) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => { e.preventDefault(); this.keys[code] = true; });
      el.addEventListener('touchend', (e) => { e.preventDefault(); this.keys[code] = false; });
      el.addEventListener('mousedown', () => { this.keys[code] = true; });
      el.addEventListener('mouseup', () => { this.keys[code] = false; });
    };

    bindTouch('t-left', 'ArrowLeft');
    bindTouch('t-right', 'ArrowRight');
    bindTouch('t-gas', 'ArrowUp');
    bindTouch('t-brake', 'ArrowDown');
    bindTouch('t-horn', 'KeyH');
  }

  isDown(code) {
    return !!this.keys[code];
  }

  update() {}
}

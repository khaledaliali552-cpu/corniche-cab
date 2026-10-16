import { PLAYLIST } from './data.js';

// فئة المؤثرات الصوتية الأصلية للمحرك والكلاكس
export class Audio {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playHorn() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playCrash() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  playMoney() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }
}

// مشغل الكاسيت وأغاني المهرجانات
let currentTrack = 0;

export function initCassette() {
  const audioPlayer = document.getElementById('audio-player');
  const musicTitle = document.getElementById('music-title');
  const toggleBtn = document.getElementById('btn-music-toggle');

  if (!audioPlayer || !PLAYLIST || PLAYLIST.length === 0) return;

  const loadTrack = (idx) => {
    currentTrack = idx;
    audioPlayer.src = PLAYLIST[currentTrack].src;
    if (musicTitle) musicTitle.textContent = PLAYLIST[currentTrack].title;
  };

  loadTrack(0);

  toggleBtn?.addEventListener('click', () => {
    if (audioPlayer.paused) {
      audioPlayer.play().then(() => {
        if (toggleBtn) toggleBtn.textContent = '⏸';
      }).catch(() => {});
    } else {
      audioPlayer.pause();
      if (toggleBtn) toggleBtn.textContent = '▶';
    }
  });

  document.getElementById('btn-music-next')?.addEventListener('click', () => {
    loadTrack((currentTrack + 1) % PLAYLIST.length);
    audioPlayer.play().catch(() => {});
    if (toggleBtn) toggleBtn.textContent = '⏸';
  });

  document.getElementById('btn-music-prev')?.addEventListener('click', () => {
    loadTrack((currentTrack - 1 + PLAYLIST.length) % PLAYLIST.length);
    audioPlayer.play().catch(() => {});
    if (toggleBtn) toggleBtn.textContent = '⏸';
  });
}

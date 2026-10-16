import { PLAYLIST } from './data.js';

let currentTrack = 0;
const audioPlayer = document.getElementById('audio-player');
const musicTitle = document.getElementById('music-title');

export function initCassette() {
  if (!audioPlayer || PLAYLIST.length === 0) return;

  const loadTrack = (idx) => {
    currentTrack = idx;
    audioPlayer.src = PLAYLIST[currentTrack].src;
    if (musicTitle) musicTitle.textContent = PLAYLIST[currentTrack].title;
  };

  loadTrack(0);

  document.getElementById('btn-music-toggle')?.addEventListener('click', () => {
    if (audioPlayer.paused) {
      audioPlayer.play().catch(() => {});
      document.getElementById('btn-music-toggle').textContent = '⏸';
    } else {
      audioPlayer.pause();
      document.getElementById('btn-music-toggle').textContent = '▶';
    }
  });

  document.getElementById('btn-music-next')?.addEventListener('click', () => {
    loadTrack((currentTrack + 1) % PLAYLIST.length);
    audioPlayer.play().catch(() => {});
    document.getElementById('btn-music-toggle').textContent = '⏸';
  });

  document.getElementById('btn-music-prev')?.addEventListener('click', () => {
    loadTrack((currentTrack - 1 + PLAYLIST.length) % PLAYLIST.length);
    audioPlayer.play().catch(() => {});
    document.getElementById('btn-music-toggle').textContent = '⏸';
  });
}

// Music Player Controls
const audio = document.getElementById('audio-player');
const playPause = document.getElementById('play-pause');
const backward = document.getElementById('backward');
const forward = document.getElementById('forward');
const mute = document.getElementById('mute');
const seekbar = document.getElementById('seekbar');
const volume = document.getElementById('volume');
const currentTimeSpan = document.getElementById('current-time');
const durationSpan = document.getElementById('duration');

// Play/Pause Toggle
playPause.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

audio.addEventListener('play', () => {
  playPause.textContent = '⏸️';
});
audio.addEventListener('pause', () => {
  playPause.textContent = '▶️';
});

// Seekbar
audio.addEventListener('timeupdate', () => {
  seekbar.value = (audio.currentTime / audio.duration) * 100 || 0;
  currentTimeSpan.textContent = formatTime(audio.currentTime);
});
audio.addEventListener('loadedmetadata', () => {
  durationSpan.textContent = formatTime(audio.duration);
});
seekbar.addEventListener('input', () => {
  audio.currentTime = (seekbar.value / 100) * audio.duration || 0;
});

// Skip 10s
backward.addEventListener('click', () => {
  audio.currentTime = Math.max(0, audio.currentTime - 10);
});
forward.addEventListener('click', () => {
  audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
});

// Volume
volume.addEventListener('input', () => {
  audio.volume = volume.value;
});
audio.addEventListener('volumechange', () => {
  mute.textContent = audio.muted || audio.volume === 0 ? '🔇' : '🔈';
  volume.value = audio.volume;
});
mute.addEventListener('click', () => {
  audio.muted = !audio.muted;
  mute.textContent = audio.muted ? '🔇' : '🔈';
});

function formatTime(s) {
  s = Math.floor(s);
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
}

// Light/Dark Theme Toggle
const themeBtn = document.createElement('button');
themeBtn.className = 'theme-toggle';
themeBtn.innerHTML = '🌙';
document.body.appendChild(themeBtn);

function setTheme(light) {
  if (light) {
    document.body.classList.add('light');
    themeBtn.innerHTML = '🌙';
    themeBtn.title = "Switch to Night Theme";
  } else {
    document.body.classList.remove('light');
    themeBtn.innerHTML = '☀️';
    themeBtn.title = "Switch to Light Theme";
  }
  localStorage.setItem('music-theme', light ? 'light' : 'dark');
}
themeBtn.addEventListener('click', () => {
  setTheme(!document.body.classList.contains('light'));
});
window.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('music-theme');
  setTheme(theme === 'light');
  if (audio.readyState >= 1) {
    durationSpan.textContent = formatTime(audio.duration);
  }
});

// Modern Music Player Controls & Background Audio UX

const audio = document.getElementById('audio-player');
const playPause = document.getElementById('play-pause');
const backward = document.getElementById('backward');
const forward = document.getElementById('forward');
const mute = document.getElementById('mute');
const seekbar = document.getElementById('seekbar');
const volume = document.getElementById('volume');
const currentTimeSpan = document.getElementById('current-time');
const durationSpan = document.getElementById('duration');
const replay = document.getElementById('replay');
const loopBtn = document.getElementById('loop');

// Mini Now Playing Bar
const nowbar = document.getElementById('nowplaying-bar');
const miniPlay = document.getElementById('mini-play');
const miniTime = document.getElementById('mini-time');

// Theme
const themeBtn = document.getElementById('theme-toggle');

// Play/Pause Toggle
playPause.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});
miniPlay.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

// Replay button
replay.addEventListener('click', () => {
  audio.currentTime = 0;
  audio.play();
});

// Loop button (toggle)
loopBtn.addEventListener('click', () => {
  audio.loop = !audio.loop;
  loopBtn.classList.toggle('active', audio.loop);
  loopBtn.title = audio.loop ? "Loop: ON" : "Loop: OFF";
});

audio.addEventListener('loadedmetadata', () => {
  loopBtn.classList.toggle('active', audio.loop);
  loopBtn.title = audio.loop ? "Loop: ON" : "Loop: OFF";
});

// Seekbar
audio.addEventListener('timeupdate', () => {
  seekbar.value = (audio.currentTime / audio.duration) * 100 || 0;
  currentTimeSpan.textContent = formatTime(audio.currentTime);
  miniTime.textContent = formatTime(audio.currentTime);
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

// Set theme
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
  loopBtn.classList.toggle('active', audio.loop);
  loopBtn.title = audio.loop ? "Loop: ON" : "Loop: OFF";
});

// Show Now Playing Bar when audio playing and page not visible
function updateNowPlayingBar() {
  if (!audio.paused && document.visibilityState !== 'visible') {
    nowbar.classList.add('show');
  } else {
    nowbar.classList.remove('show');
  }
}
audio.addEventListener('play', () => {
  playPause.textContent = '⏸️';
  miniPlay.textContent = '⏸️';
  updateNowPlayingBar();
  showMediaSession();
});
audio.addEventListener('pause', () => {
  playPause.textContent = '▶️';
  miniPlay.textContent = '▶️';
  updateNowPlayingBar();
  showMediaSession();
});

// Hide nowplaying-bar if visible
document.addEventListener('visibilitychange', updateNowPlayingBar);

// Format time for display
function formatTime(s) {
  s = Math.floor(s);
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
}

// Media Session API: for lockscreen/notification controls (supported browsers)
function showMediaSession() {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: "Backdoor Talkin'",
      artist: '',
      album: '',
      artwork: [
        { src: 'foevonbackground.jpg', sizes: '512x512', type: 'image/jpeg' }
      ]
    });
    navigator.mediaSession.setActionHandler('play', () => { audio.play(); });
    navigator.mediaSession.setActionHandler('pause', () => { audio.pause(); });
    navigator.mediaSession.setActionHandler('seekbackward', () => { audio.currentTime = Math.max(0, audio.currentTime - 10); });
    navigator.mediaSession.setActionHandler('seekforward', () => { audio.currentTime = Math.min(audio.duration, audio.currentTime + 10); });
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.fastSeek && 'fastSeek' in audio) {
        audio.fastSeek(details.seekTime);
      } else {
        audio.currentTime = details.seekTime;
      }
    });
    navigator.mediaSession.setActionHandler('stop', () => { audio.pause(); audio.currentTime = 0; });
    navigator.mediaSession.setActionHandler('previoustrack', () => { audio.currentTime = 0; });
    navigator.mediaSession.setActionHandler('nexttrack', null);
    navigator.mediaSession.playbackState = audio.paused ? "paused" : "playing";
  }
}

// Try to keep playing audio in background (mobile tips)
if ('mediaSession' in navigator) {
  showMediaSession();
}

// PWA install hint & iOS/Android background
// For best background playback on mobile, suggest user install to home screen (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
}

/* Background music: starts on the first click, tap or key, and can be paused. */
(() => {
  const root = document.getElementById('player');
  if (!root) return;

  const list = window.PLAYLIST || [];
  const toggle = document.getElementById('playerToggle');
  const next = document.getElementById('playerNext');
  const label = document.getElementById('playerLabel');
  const audio = new Audio();
  const KEY = 'player-paused';
  const GESTURES = ['click', 'touchend', 'keydown'];

  audio.preload = 'none';
  audio.volume = 0.6;

  let index = 0;
  let failures = 0;
  let labelTimer;

  const remember = (paused) => {
    try { localStorage.setItem(KEY, paused ? '1' : '0'); } catch (e) { /* private mode */ }
  };
  const userPaused = () => {
    try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  };

  const trackName = (track) => (track.artist ? `${track.title} · ${track.artist}` : track.title);

  const flashLabel = () => {
    root.classList.add('show-label');
    clearTimeout(labelTimer);
    labelTimer = setTimeout(() => root.classList.remove('show-label'), 3500);
  };

  const paint = () => {
    const playing = !audio.paused;
    root.classList.toggle('playing', playing);
    toggle.setAttribute('aria-label', playing ? 'Pausar música' : 'Tocar música');
    toggle.querySelector('i').className = playing ? 'fas fa-pause' : 'fas fa-play';
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
  };

  const load = (i) => {
    index = (i + list.length) % list.length;
    const track = list[index];
    audio.src = track.src;
    label.textContent = trackName(track);
    if ('mediaSession' in navigator && 'MediaMetadata' in window) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist || 'maxgfortes',
        artwork: [{ src: './public/icons/icon-512.png', sizes: '512x512', type: 'image/png' }]
      });
    }
  };

  const play = () => audio.play().then(() => {
    remember(false);
    flashLabel();
    return true;
  });

  const step = (d) => {
    load(index + d);
    return play().catch(() => false);
  };

  const onGesture = (e) => {
    if (e.target.closest && e.target.closest('#player')) return;
    if (userPaused() || !audio.paused) {
      stopListening();
      return;
    }
    /* touchend after a scroll is not a valid gesture, so keep listening if it fails */
    play().then(stopListening).catch(() => {});
  };

  function stopListening() {
    GESTURES.forEach((name) => document.removeEventListener(name, onGesture, true));
  }

  audio.addEventListener('play', paint);
  audio.addEventListener('pause', paint);
  audio.addEventListener('playing', () => { failures = 0; });
  audio.addEventListener('ended', () => step(1));
  audio.addEventListener('error', () => {
    /* a missing file skips to the next one, without looping forever */
    if (!list.length || failures >= list.length) return;
    failures += 1;
    step(1);
  });

  if (!list.length) {
    root.classList.add('empty');
    label.textContent = 'Nenhuma música';
    toggle.disabled = true;
    next.disabled = true;
    return;
  }

  load(0);

  toggle.addEventListener('click', () => {
    stopListening();
    if (audio.paused) {
      play().catch(() => {});
    } else {
      audio.pause();
      remember(true);
    }
  });

  next.addEventListener('click', () => {
    stopListening();
    step(1);
  });

  if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', () => play().catch(() => {}));
    navigator.mediaSession.setActionHandler('pause', () => { audio.pause(); remember(true); });
    navigator.mediaSession.setActionHandler('nexttrack', () => step(1));
    navigator.mediaSession.setActionHandler('previoustrack', () => step(-1));
  }

  GESTURES.forEach((name) => document.addEventListener(name, onGesture, true));
})();

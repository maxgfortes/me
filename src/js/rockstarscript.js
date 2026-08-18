const dialog = document.querySelector('.video-player');
const player = dialog.querySelector('video');

document.querySelectorAll('.video-card').forEach((card) => {
  card.addEventListener('click', () => {
    player.src = card.dataset.video;
    dialog.showModal();
    player.play().catch(() => {});
  });
});

dialog.querySelector('.video-player-close').addEventListener('click', () => dialog.close());

dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

dialog.addEventListener('close', () => {
  player.pause();
  player.removeAttribute('src');
  player.load();
});

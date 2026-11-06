/* Service worker, plus the zoom blocks iOS ignores in the viewport meta tag. */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

['gesturestart', 'gesturechange', 'gestureend'].forEach((name) => {
  document.addEventListener(name, (e) => e.preventDefault(), { passive: false });
});

document.addEventListener('touchmove', (e) => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

document.addEventListener('wheel', (e) => {
  if (e.ctrlKey) e.preventDefault();
}, { passive: false });

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0'].includes(e.key)) e.preventDefault();
});

/* the full title stays for search engines; visitors get the short one once they interact */
const shortTitleEvents = ['pointermove', 'pointerdown', 'touchstart', 'keydown', 'scroll'];
const shortTitle = () => {
  document.title = 'maxgfortes';
  shortTitleEvents.forEach((name) => window.removeEventListener(name, shortTitle, true));
};
shortTitleEvents.forEach((name) => window.addEventListener(name, shortTitle, { capture: true, passive: true }));

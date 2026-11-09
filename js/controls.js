'use strict';
// ───────────────────────── controls, fullscreen, keep screen awake
function toggleFS() {
  if (document.fullscreenElement) document.exitFullscreen?.();
  else document.documentElement.requestFullscreen?.().catch(() => {});
}
addEventListener('keydown', e => {
  if (e.key >= '0' && e.key <= '9') { dOverride = +e.key / 9; timeOffset = 0; }
  else if (e.key === 'z') { dOverride = null; timeOffset = TARGET - 10500 - Date.now(); }
  else if (e.key === 'r') { dOverride = null; timeOffset = 0; }
  else if (e.key === 'f') toggleFS();
  else featureKey(e);   // feature shortcuts (c, t, x, …)
});
addEventListener('dblclick', toggleFS);
async function wake() { try { if ('wakeLock' in navigator) await navigator.wakeLock.request('screen'); } catch (_) {} }
wake();
document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(); });
addEventListener('click', wake);

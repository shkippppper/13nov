'use strict';
// ───────────────────────── controls, fullscreen, keep screen awake; p = show/hide the list of controls
function toggleFS() {
  if (document.fullscreenElement) document.exitFullscreen?.();
  else document.documentElement.requestFullscreen?.().catch(() => {});
}

const CONTROLS = [
  ['0 – 9', 'preview the danger level (0 calm … 9 worst)'],
  ['z', 'jump to 10 s before zero, to watch the ending'],
  ['r', 'back to real time'],
  ['f', 'fullscreen (or double-click)'],
  ['c', 'wake the cat up / make it talk'],
  ['t', 'the cat hops down and does its ტრაკიიიი show'],
  ['x', 'cxaduri peeks in'],
  ['i', 'io pops up'],
  ['p', 'show / hide this list'],
];
const helpEl = document.createElement('div');
helpEl.id = 'help';
helpEl.innerHTML = '<h2>Controls</h2><dl>' + CONTROLS.map(([k, what]) => `<dt>${k}</dt><dd>${what}</dd>`).join('') + '</dl>'
  + '<p>In the address: <code>?t=15</code> start 15 s before zero (<code>?t=-30</code> = 30 s after) · '
  + '<code>?d=0.7</code> danger level · <code>?full</code> all the heavy effects</p>';
document.body.appendChild(helpEl);
const toggleHelp = () => helpEl.classList.toggle('on');

addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key >= '0' && e.key <= '9') { dOverride = +e.key / 9; timeOffset = 0; }
  else if (e.key === 'z') { dOverride = null; timeOffset = TARGET - 10500 - Date.now(); }
  else if (e.key === 'r') { dOverride = null; timeOffset = 0; }
  else if (e.key === 'f') toggleFS();
  else if (e.key === 'p' || e.code === 'KeyP') toggleHelp();
  else featureKey(e);   // feature shortcuts (c, t, x, i)
});
addEventListener('dblclick', toggleFS);
async function wake() { try { if ('wakeLock' in navigator) await navigator.wakeLock.request('screen'); } catch (_) {} }
wake();
document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(); });
addEventListener('click', wake);

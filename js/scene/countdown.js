'use strict';
// ───────────────────────── countdown
let lastStr = '', lastSec = -1, lastCol = '', lastBlink = null;
function updateCountdown(rem) {
  let s = Math.max(0, Math.ceil(rem / 1000));
  const sec = s;
  const d = Math.floor(s / 86400); s %= 86400;
  const h = Math.floor(s / 3600); s %= 3600;
  const m = Math.floor(s / 60); s %= 60;
  const str = [d, h, m, s].map(v => String(v).padStart(2, '0')).join('');
  if (str !== lastStr) { for (let i = 0; i < 8; i++) if (str[i] !== lastStr[i]) DIG[i].textContent = str[i]; lastStr = str; }
  const dead = rem <= 0;
  cdEl.classList.toggle('dead', dead);
  if (!dead && rem < 60000 && sec !== lastSec) { cdEl.classList.remove('beat'); void cdEl.offsetWidth; cdEl.classList.add('beat'); }
  lastSec = sec;
  const ca = dead ? rgb('#ff2b2b') : D < 0.5 ? mixA('#dfe8ff', '#ffb347', D * 2) : mixA('#ffb347', '#ff3030', (D - 0.5) * 2);
  const col = ca.join(',');
  if (col !== lastCol) { lastCol = col; cdEl.style.setProperty('--c', `rgb(${col})`); cdEl.style.setProperty('--g', `rgba(${col},0.6)`); }
  const blink = dead || (((now() % 1000) + 1000) % 1000) < 500;
  if (blink !== lastBlink) { lastBlink = blink; SEPS.forEach(b => b.style.opacity = blink ? 1 : 0.3); }
}

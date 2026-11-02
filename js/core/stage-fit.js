'use strict';
// ───────────────────────── stage fit
const stage = $('stage'), fx = $('fx'), ctx = fx.getContext('2d');
let fitS = 1, fitX = 0, fitY = 0, rs = 1;
let fitW = 0, fitH = 0;
function fit() {
  const w = fitW = innerWidth, h = fitH = innerHeight;
  fitS = Math.min(w / 1920, h / 1080);
  fitX = (w - 1920 * fitS) / 2; fitY = (h - 1080 * fitS) / 2;
  rs = clamp(fitS * (devicePixelRatio || 1), 0.5, LITE ? 0.6 : 1);
  fx.width = Math.round(1920 * rs); fx.height = Math.round(1080 * rs);
}
addEventListener('resize', fit); fit();

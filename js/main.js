'use strict';
// ───────────────────────── main loop
function step(dt) {
  T += dt;
  const n = now(), rem = TARGET - n;
  if (rem <= 0 && state === 'calm') startEnding();
  else if (rem > 0 && state !== 'calm') resetCalm();
  const dT = state === 'calm' ? danger(n) : 1 - SUN;   // after zero: full storm, easing off as the sun comes out
  D += (dT - D) * Math.min(1, dt * 1.5);
  updateEnv(dt);
  if (state === 'calm') { updateCalm(dt); updateDrops(dt); } else updateEnding(dt);
  updateFeatures(dt, rem);
  updateFx(dt);
  return rem;
}

D = danger(now());
const sinceZero = (now() - TARGET) / 1000;
if (sinceZero >= 0) {
  // Already past zero on load: replay the ending up to now (quickly), or jump straight to the finished scene.
  D = 1; startEnding();
  if (sinceZero > END_SKIP) finishEnding();
  else for (let i = 0, n = Math.round(sinceZero * 30); i < n; i++) step(1 / 30);
  P.length = 0; shakeMag = flashA = glitchT = ghostT = 0;
} else step(0);   // pose everything before the first paint
updateCountdown(TARGET - now());

let last = performance.now();
const MIN_MS = LITE ? 1000 / 30 - 2 : 0;   // lite: ~30fps
function frame(ts) {
  requestAnimationFrame(frame);
  if (ts - last < MIN_MS) return;
  if (innerWidth !== fitW || innerHeight !== fitH) fit();
  const dt = Math.min(0.05, Math.max(0, (ts - last) / 1000)); last = ts;
  const rem = step(dt);
  updateCountdown(rem);
  drawFx();
  applyStage(dt);
}
requestAnimationFrame(frame);
// test hook: simulate N seconds instantly (used for previews)
window.__ff = secs => { for (let i = 0, n = Math.round(secs * 60); i < n; i++) { timeOffset += 1000 / 60; step(1 / 60); applyStage(1 / 60); } updateCountdown(TARGET - now()); drawFx(); };

'use strict';
// speech bubbles (an HTML layer above the vignette, so they stay crisp); one per speaker so they never steal each other's
function bubble(sayEl) {
  let sayT = 0, sayMax = 0, sayW = 0, sayH = 0, sayBy = null;
  return {
    say(who, text, dur, big) {
      sayEl.textContent = text; sayEl.classList.toggle('big', !!big);
      sayW = sayEl.offsetWidth; sayH = sayEl.offsetHeight; sayT = sayMax = dur; sayBy = who;
    },
    update(dt) {
      if (sayT <= 0) return;
      sayT -= dt;
      const u = clamp((sayMax - sayT) / 0.25, 0, 1) - 1;
      const k = (1 + 2.7 * u * u * u + 1.7 * u * u) * smooth(0, 0.2, sayT);   // pops in with a little overshoot, shrinks away at the end
      const s = sayBy.top();
      const left = clamp(s.x - sayW / 2, 16, 1904 - sayW), tx = clamp(s.x - left, 34, sayW - 34);
      sayEl.style.left = `${f(left)}px`; sayEl.style.top = `${f(s.y - sayH - 26)}px`;
      sayEl.style.setProperty('--tx', `${f(tx)}px`);
      sayEl.style.transformOrigin = `${f(tx)}px ${sayH + 26}px`;
      sayEl.style.transform = `scale(${Math.max(0, k).toFixed(3)})`;
      sayEl.style.opacity = sayT > 0 ? 1 : 0;
    },
  };
}

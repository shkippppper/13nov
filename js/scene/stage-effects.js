'use strict';
// ───────────────────────── stage shake / glitch / flash
function applyStage(dt) {
  shakeMag *= Math.exp(-dt * 5); if (shakeMag < 0.05) shakeMag = 0;
  let sx = rand(-1, 1) * shakeMag, sy = rand(-1, 1) * shakeMag;
  if (glitchT > 0) {
    glitchT -= dt; sx += rand(-24, 24);
    if (!LITE) stage.style.filter = glitchT > 0 ? `hue-rotate(${Math.round(rand(-120, 120))}deg) saturate(2.2) contrast(1.25)` : '';
  }
  stage.style.transform = `translate(${(fitX + sx * fitS).toFixed(2)}px,${(fitY + sy * fitS).toFixed(2)}px) scale(${fitS})`;
  flashA *= Math.exp(-dt * 7); if (flashA < 0.005) flashA = 0;
  flashEl.style.opacity = flashA.toFixed(3);
}

'use strict';
// ───────────────────────── foreshadowing events (calm phase)
function fireEvent() {
  const r = Math.random(), s = Math.random() < 0.5 ? -1 : 1;
  if (r < 0.18 + D * 0.12) {            // near-topple: the whole thing lurches and he skids to save it
    bendV += s * (35 + 55 * D); angV += s * (30 + 40 * D); slideV += s * (220 + 260 * D);
    dipV += 220; sweatBurst(14); shake(6 + 10 * D); redFlash = 1;
    for (const ph of PHONES) ph.ring = rand(1.5, 2.5);
  } else if (r < 0.45) {                // the tower lurches, he buckles
    angV += s * (22 + 75 * D); bendV += s * (12 + 30 * D);
    dipV += 70 + 140 * D; sweatBurst(3 + D * 9);
    for (const sx of [-260, 260]) for (let i = 0; i < 4 + D * 6; i++) {
      const a = ang * DEG;
      add({ k: 'crumb', x: PIV.x + slide + sx * Math.cos(a), y: PIV.y + curDy + sx * Math.sin(a), vx: rand(-60, 60), vy: rand(-50, 30), c: Math.random() < 0.5 ? '#8d5c30' : '#6b4423', max: 2 });
    }
    shake(2 + 6 * D);
  } else if (r < 0.62) {                // a cable sparks, LEDs go red
    const sw = pick(SWITCHES), [cx, cy] = pick(CABLE_ENDS), p = itemPt(sw, cx, cy);
    sparkBurst(p.x, p.y, Math.round(12 + 30 * D)); redFlash = 0.9; lampOff = 0.4;
  } else if (r < 0.76) {                // the duck slips
    duckV += s * (90 + 160 * D); bendV += rand(-6, 6);
  } else if (r < 0.88) {                // phones start ringing
    for (const ph of PHONES) ph.ring = rand(1.2, 2.2);
  } else {                              // ominous creak + puff of smoke
    const it = pick(ITEMS), p = itemPt(it);
    for (let i = 0; i < 6; i++) add({ k: 'smoke', dark: true, x: p.x + rand(-15, 15), y: p.y - it.h / 2, vx: rand(-20, 20), vy: rand(-80, -40), r: rand(10, 18), g: 26, a: 0.6, max: rand(2, 3) });
    shake(2 + 4 * D); redFlash = 0.5;
  }
  nextEvt = T + lerp(10, 2.6, D) * rand(0.6, 1.4);
}

'use strict';
// ───────────────────────── couch: a two-seat track-arm sofa (flat-topped, square arms) on the grass, right of him — the cat's bed
// COUCH.seatY = top of the seat cushions; inL/inR = the seat's left/right ends.
const COUCH = (() => {
  const X = 1390, W = 460;                 // center on screen, overall width
  const ARM = 54, SEAT = 818, BACK = 700, ARM_TOP = 770, BASE = 868, Y0 = GROUND;
  const FAB = '#6e2f3a', FAB_L = '#86404c', FAB_D = '#4c1f27', LINE = '#1c0b0f', WOOD = '#3a2416';
  const L = X - W / 2, Rx = X + W / 2, inL = L + ARM, inR = Rx - ARM, seatW = (inR - inL) / 2;

  const g = el('g', { id: 'couch' });
  $('world').insertBefore(g, $('heroPool'));   // behind him and the junk, in front of the weeds
  const ln = { stroke: LINE, 'stroke-width': 4, 'stroke-linejoin': 'round' };

  el('ellipse', { cx: X, cy: Y0 + 2, rx: W / 2 + 20, ry: 13, fill: '#000', opacity: 0.45 }, g);   // ground shadow
  for (const lx of [L + 16, Rx - 16]) el('path', { d: `M${lx - 9} ${BASE}H${lx + 9}L${lx + 6} ${Y0}H${lx - 6}Z`, fill: WOOD, ...ln, 'stroke-width': 3 }, g);   // tapered legs

  // back frame + two back cushions
  R(g, inL - 6, BACK, inR - inL + 12, SEAT - BACK + 10, 10, FAB_D, LINE, 4);
  for (let i = 0; i < 2; i++) {
    const x = inL + 6 + i * seatW, w = seatW - 12;
    R(g, x, BACK + 10, w, SEAT - BACK - 8, 16, FAB, LINE, 4);
    el('path', { d: `M${x + 14} ${BACK + 20}H${x + w - 14}`, stroke: FAB_L, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8 }, g);
  }

  // plinth under the seat cushions
  R(g, inL - 4, SEAT + 28, inR - inL + 8, BASE - SEAT - 26, 4, FAB_D, LINE, 4);

  // two seat cushions: top face + front face
  for (let i = 0; i < 2; i++) {
    const x = inL + i * seatW + 2, w = seatW - 4;
    R(g, x, SEAT - 8, w, 38, 9, FAB, LINE, 4);
    el('path', { d: `M${x + 8} ${SEAT + 2}H${x + w - 8}`, stroke: FAB_D, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);   // welt line
    el('path', { d: `M${x + 12} ${SEAT - 2}H${x + w - 12}`, stroke: FAB_L, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.7 }, g);
  }

  // track arms: straight, square, flat on top, level with the seat-back line
  for (const ax of [L, inR]) {
    R(g, ax, ARM_TOP, ARM, BASE - ARM_TOP, 8, FAB, LINE, 4);
    el('path', { d: `M${ax + 8} ${ARM_TOP + 9}H${ax + ARM - 8}`, stroke: FAB_L, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8 }, g);
    el('path', { d: `M${ax + 6} ${BASE - 10}H${ax + ARM - 6}`, stroke: FAB_D, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
  }

  return { x: X, w: W, g, seatY: SEAT - 8, inL, inR };
})();

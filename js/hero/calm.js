'use strict';
// ───────────────────────── calm phase: he holds it all up
function updateCalm(dt) {
  const amp = 1.2 + 5 * D;
  const tgt = amp * (0.62 * Math.sin(T * 0.85) + 0.38 * Math.sin(T * 2.2 + 1.3));
  angV += (-26 * (ang - tgt) - 4.2 * angV) * dt; ang = clamp(ang + angV * dt, -16, 16);
  const bAmp = 4 + 14 * D;
  const tgtB = bAmp * (0.65 * Math.sin(T * 0.55 + 0.7) + 0.35 * Math.sin(T * 1.37 + 2.1));
  bendV += (-9 * (bendA - tgtB) - 1.8 * bendV) * dt; bendA = clamp(bendA + bendV * dt, -34, 34);
  dipV += (-70 * dip - 9 * dipV) * dt; dip += dipV * dt;
  slideV += (-28 * slide - 7 * slideV) * dt; slide = clamp(slide + slideV * dt, -90, 90);
  const dy = 2 + 9 * D + 3 * D * Math.sin(T * 2.4) + dip;
  const trem = 0.4 + (D > 0.4 ? (D - 0.4) * 4 : 0);
  tjx = rand(-trem, trem); tjy = rand(-trem, trem) * 0.6; curDy = dy;
  const tx = -ang * 1.6;

  duckV += (-10 * duckX - 2.2 * duckV + (ang + bendA) * 10) * dt; duckX += duckV * dt;
  if (duckX > 60) { duckX = 60; duckV *= -0.4; } if (duckX < -60) { duckX = -60; duckV *= -0.4; }
  poseTower();

  heroG.setAttribute('transform', `translate(${f(slide)} 0)`);
  handsG.setAttribute('transform', `translate(${f(slide)} 0)`);
  heroPool.setAttribute('cx', f(960 + slide));
  const hjx = rand(-1, 1) * (0.3 + D * 1.6), hjy = rand(-1, 1) * (0.2 + D * 1.2);
  bodyG.setAttribute('transform', `translate(${f(tx)} ${f(dy)})`);
  headG.setAttribute('transform', `translate(${f(960 + tx + hjx)} ${f(590 + dy + hjy)}) rotate(${(-ang * 0.4 - slideV * 0.02).toFixed(2)})`);
  const a = ang * DEG, c = Math.cos(a), s = Math.sin(a);
  const hl = { x: PIV.x + tjx - 135 * c - 4 * s, y: PIV.y + dy + tjy - 135 * s + 4 * c };
  const hr = { x: PIV.x + tjx + 135 * c - 4 * s, y: PIV.y + dy + tjy + 135 * s + 4 * c };
  lastHL = hl; lastHR = hr;
  const sl = { x: 905 + tx, y: 712 + dy }, sr = { x: 1015 + tx, y: 712 + dy };
  setArms(sl, { x: sl.x + (hl.x - sl.x) * 0.55 - 34, y: (sl.y + hl.y) / 2 + 6 }, hl,
          sr, { x: sr.x + (hr.x - sr.x) * 0.55 + 34, y: (sr.y + hr.y) / 2 + 6 }, hr);
  const ko = 5 + dy * 0.9, skid = clamp(slideV * 0.05, -14, 14);
  setLegs({ x: 935 + tx * 0.6, y: 800 + dy }, { x: 926 - ko + rand(-1, 1) * D * 2.5, y: 842 + dy * 0.5 }, { x: 920 - skid, y: 879 },
          { x: 985 + tx * 0.6, y: 800 + dy }, { x: 994 + ko + rand(-1, 1) * D * 2.5, y: 842 + dy * 0.5 }, { x: 1000 - skid, y: 879 });
  if (Math.abs(slideV) > 120) emitN(30 * dt, () => add({ k: 'dust', x: 960 + slide + rand(-50, 50), y: GROUND - 4, vx: -slideV * 0.3 + rand(-40, 40), vy: rand(-60, -10), r: rand(10, 18), g: 30, a: 0.6, max: 1 }));

  faceTint.setAttribute('opacity', (0.06 + smooth(0.2, 1, D) * 0.3).toFixed(3));
  vein.setAttribute('opacity', smooth(0.4, 0.6, D).toFixed(3));
  veinS.setAttribute('transform', `translate(60 -92) scale(${(1 + 0.18 * Math.sin(T * 9)).toFixed(3)})`);

  // ambient emitters
  if (D < 0.6) emitN(2.2 * (1 - D) * dt, () => { const p = itemPt(MUG, -2, -28); add({ k: 'smoke', x: p.x + rand(-6, 6), y: p.y, vx: rand(-6, 6), vy: rand(-42, -25), r: 5, g: 11, a: 0.4, max: 2 }); });
  emitN((0.6 + D * 3) * dt, () => sweatBurst(1));
  emitN((0.4 + smooth(0.3, 0.9, D) * 2.5) * dt, () => { const it = Math.random() < 0.5 ? pick(RACKS0) : pick(ITEMS), p = itemPt(it, rand(-it.w / 3, it.w / 3), -it.h / 2); add({ k: 'smoke', dark: true, x: p.x, y: p.y, vx: rand(-10, 10), vy: rand(-70, -40), r: 10, g: 22, a: 0.6, max: 3.5 }); });
  for (const it of HOT) emitN(smooth(0.65, 1, D) * 10 * dt, () => { const p = itemPt(it, rand(-it.w / 2.5, it.w / 2.5), -it.h / 2 + 6); add({ k: 'fire', x: p.x, y: p.y, vx: rand(-15, 15), vy: rand(-140, -80), r: rand(10, 20), max: rand(0.4, 0.7) }); });
  emitN((0.15 + smooth(0.25, 1, D) * 1.3) * dt, () => { const p = itemPt(pick(SWITCHES), ...pick(CABLE_ENDS)); sparkBurst(p.x, p.y, 10); });
  // the pile smoulders, later burns
  for (const b of DROPS) {
    if (!b.ground || b.fade < 1) continue;
    emitN(smooth(0.35, 1, D) * 0.45 * dt, () => add({ k: 'smoke', dark: true, x: b.x + rand(-b.hw * 0.4, b.hw * 0.4), y: b.y - b.hh, vx: rand(-8, 8), vy: rand(-60, -35), r: 12, g: 22, a: 0.5, max: 3.5 }));
    if (b.fire) emitN(smooth(0.8, 1, D) * b.rate * 0.3 * dt, () => add({ k: 'fire', x: b.x + rand(-b.hw * 0.6, b.hw * 0.6), y: b.y - b.hh * 0.3, vx: rand(-20, 20), vy: rand(-150, -80), r: rand(12, 24) * b.fs, max: rand(0.4, 0.8) }));
  }
  if (T > nextEvt) fireEvent();
  if (T > nextDrop) { spawnDrop(); nextDrop = T + lerp(10, 3.5, D) * rand(0.7, 1.3) * DROP_EVERY; }

  // bugs crawl up the tower
  const nb = Math.round(2 + smooth(0.2, 1, D) * 7);
  while (BUGS.length < nb) BUGS.push({ r: rand(0.2, ROWG.length - 2), u: rand(-0.8, 0.8), sp: rand(0.25, 0.6), ph: rand(0, 6) });
  if (BUGS.length > nb) BUGS.length = nb;
  for (const b of BUGS) {
    b.r += b.sp * dt; if (b.r >= ROWG.length - 1) { b.r = rand(0.1, 2); b.u = rand(-0.8, 0.8); }
    const row = ROWG[Math.floor(b.r)], fr = b.r - Math.floor(b.r);
    const lx = row.jx + b.u * row.halfW * 0.85 + Math.sin(T * 3 + b.ph) * 4, ly = row.h / 2 - fr * row.h;
    const t = row.th * DEG;
    b.wx = row.cx + lx * Math.cos(t) - ly * Math.sin(t); b.wy = row.cy + lx * Math.sin(t) + ly * Math.cos(t); b.wa = t;
  }

  // final minute: the ground starts to rumble
  const rem = TARGET - now();
  if (rem < 60000) shake((1 - rem / 60000) * 7);
}

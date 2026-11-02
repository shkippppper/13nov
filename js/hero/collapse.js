'use strict';
// ───────────────────────── collapse + chaos
function startCollapse() {
  state = 'collapse'; cT = 0; bodies = null; impacts = 0; heroX = slide; fanSpd = 1;
  toppleDir = bendA >= 0 ? 1 : -1;
  faceTint.setAttribute('opacity', 0); vein.setAttribute('opacity', 0);
  BUGS.length = 0;
  for (const b of DROPS) b.ignite = rand(0.8, 3);
  shake(6); flashA = Math.max(flashA, 0.3);
  nextGlitch = 7; nextDrop = T + 6;
}

function makeBodies() {
  const mk = (elm, x, y, a, w, h, hf, id) => ({
    el: elm, x, y, a, w, h, hw: w / 2, hh: h / 2,
    vx: toppleDir * hf * rand(250, 850) + (x - 960) * 0.8 + rand(-140, 140), vy: rand(-220, 40), va: rand(-240, 240) * (id === 'plank' ? 0.2 : 1),
    ground: false, hit: false, sup: null, fade: 1, tilt: id === 'plank' ? rand(-3, 3) : rand(-12, 12), elec: ELEC.has(id),
    fire: false, ignite: 1e9, fs: clamp(Math.sqrt(w * h) / 120, 0.55, 1.4), rate: 8 + w * h / 1600, smoke: w * h > 15000 ? 1.6 : 0.6
  });
  const a = ang * DEG;
  bodies = [mk(plankEl, PIV.x + slide + 9 * Math.sin(a), PIV.y + curDy - 9 * Math.cos(a), ang, 560, 18, 0, 'plank')];
  for (const it of ITEMS) {
    const p = itemPt(it), hf = clamp((PIV.y - p.y) / TOWER_H, 0, 1);
    bodies.push(mk(it.el, p.x, p.y, it.row.th + it.a, it.w, it.h, hf, it.type));
  }
  for (const r of ROWG) r.g.setAttribute('transform', '');
  [...bodies].filter(b => b.el !== DUCK.el && b.el !== MUG.el).sort((p, q) => q.w * q.h - p.w * p.h).slice(0, LITE ? 8 : 16).forEach(b => b.fire = true);
}

function onImpact(b, v) {
  impacts++;
  if (!b.hit) { b.hit = true; b.ignite = cT + rand(0.3, 1.8); }
  dustBurst(b.x, b.y + b.hh, b.hw, Math.round(6 + b.w / 30));
  if (b.elec) sparkBurst(b.x, b.y, 14);
  shake(Math.min(28, v / 65));
  if (impacts === 1) flashA = Math.max(flashA, 0.7);
}

function chaosEmit(dt) {
  for (const b of [...bodies, ...DROPS]) {
    if (!b.fire || cT < b.ignite || b.fade < 1) continue;
    emitN(b.rate * 0.55 * dt, () => add({ k: 'fire', x: b.x + rand(-b.hw * 0.7, b.hw * 0.7), y: b.y - b.hh * 0.2 + rand(-b.hh * 0.4, b.hh * 0.3), vx: rand(-25, 25), vy: rand(-170, -90), r: rand(20, 36) * b.fs, max: rand(0.45, 0.9) }));
    emitN(b.smoke * 0.6 * dt, () => add({ k: 'smoke', dark: true, x: b.x + rand(-b.hw * 0.4, b.hw * 0.4), y: b.y - b.hh - 10, vx: rand(-10, 10), vy: rand(-75, -40), r: rand(18, 28), g: rand(18, 30), a: 0.6, max: rand(3, 4) }));
  }
  emitN(12 * dt, () => { const [x, y] = pick(TREE_PTS); add({ k: 'fire', x: x + rand(-14, 14), y: y + rand(-10, 10), vx: rand(-20, 20), vy: rand(-150, -80), r: rand(18, 32), max: rand(0.45, 0.85) }); });
  emitN(0.8 * dt, () => add({ k: 'smoke', dark: true, x: 1700 + rand(-60, 60), y: 560, vx: rand(-10, 10), vy: rand(-70, -40), r: 22, g: 26, a: 0.55, max: 5 }));
  for (const gx of [-300, 230, 520, 1420, 1560, 2150]) emitN(4 * dt, () => add({ k: 'fire', x: gx + rand(-30, 30), y: GROUND - rand(0, 12), vx: rand(-15, 15), vy: rand(-130, -70), r: rand(16, 28), max: rand(0.4, 0.8) }));
  emitN(1 * dt, () => { const b = pick(bodies); if (b.elec) sparkBurst(b.x, b.y, 14); });
}

function updateCollapse(dt) {
  cT += dt;
  // he lets go and dashes off to the right
  const armT = smooth(0, 0.35, cT), walkT = clamp((cT - 0.35) / 1.0, 0, 1);
  heroX = lerp(slide, 1350, walkT * walkT);
  const walking = cT > 0.3, ph = cT * 16;
  const bob = walking ? -Math.abs(Math.sin(ph)) * 6 : 0, sw = walking ? Math.sin(ph) : 0;
  bodyG.setAttribute('transform', `translate(0 ${f(bob)})`);
  headG.setAttribute('transform', `translate(960 ${f(590 + bob)}) rotate(${walking ? 6 : 0})`);
  const sl = { x: 905, y: 712 + bob }, sr = { x: 1015, y: 712 + bob };
  const dl = { x: 878 - sw * 16, y: 800 + bob }, dr = { x: 1042 + sw * 16, y: 800 + bob };
  const hl = { x: lerp(lastHL.x, dl.x, armT), y: lerp(lastHL.y, dl.y, armT) };
  const hr = { x: lerp(lastHR.x, dr.x, armT), y: lerp(lastHR.y, dr.y, armT) };
  setArms(sl, { x: (sl.x + hl.x) / 2 - 22, y: (sl.y + hl.y) / 2 }, hl, sr, { x: (sr.x + hr.x) / 2 + 22, y: (sr.y + hr.y) / 2 }, hr);
  const fl = { x: 920 + sw * 26, y: 879 - (walking ? Math.max(0, Math.cos(ph)) * 14 : 0) };
  const fr = { x: 1000 - sw * 26, y: 879 - (walking ? Math.max(0, -Math.cos(ph)) * 14 : 0) };
  setLegs({ x: 935, y: 800 + bob }, { x: (935 + fl.x) / 2 + 8, y: 842 + bob / 2 }, fl, { x: 985, y: 800 + bob }, { x: (985 + fr.x) / 2 + 8, y: 842 + bob / 2 }, fr);
  heroG.setAttribute('transform', `translate(${f(heroX)} 0)`);
  handsG.setAttribute('transform', `translate(${f(heroX)} 0)`);
  heroPool.setAttribute('opacity', (1 - walkT).toFixed(2));
  if (walking && heroX < 1100) emitN(14 * dt, () => add({ k: 'dust', x: 960 + heroX + rand(-30, 10), y: GROUND - 4, vx: rand(-120, -20), vy: rand(-60, -10), r: rand(10, 18), g: 30, a: 0.6, max: 1 }));
  heroG.style.display = handsG.style.display = heroX > 1150 ? 'none' : '';

  // the tower hangs in the air for a beat (cartoon physics), leans, then comes apart
  if (!bodies) {
    const tr = cT * 3;
    bendA += toppleDir * 30 * dt * (1 + cT * 2);
    ang += rand(-1, 1) * cT * 0.6;
    tjx = rand(-tr, tr); tjy = rand(-tr, tr) * 0.5;
    poseTower();
    if (cT >= 1.2) makeBodies();
  } else {
    for (const b of bodies) { const hit = stepBody(b, dt, -1500, 3400, false); if (hit) onImpact(b, hit); }
  }
  updateDrops(dt);

  fanSpd *= Math.exp(-dt * 0.4);
  if (cT > 2.4) {
    chaosEmit(dt);
    if (cT > nextGlitch) { glitchT = 0.22; ghostT = 1.4; nextGlitch = cT + rand(8, 15); }
    if (T > nextDrop) { spawnDrop(); nextDrop = T + rand(4, 8) * DROP_EVERY; }   // junk keeps raining down
  }
}

function resetCalm() {
  state = 'calm'; bodies = null; cT = 0; heroX = 0;
  heroG.style.display = handsG.style.display = '';
  heroG.setAttribute('transform', ''); handsG.setAttribute('transform', ''); heroPool.setAttribute('opacity', 1);
  for (const it of ITEMS) it.el.setAttribute('transform', it.tf);
  for (const b of DROPS) b.el.remove(); DROPS.length = 0;
  ang = angV = bendA = bendV = dip = dipV = duckX = duckV = slide = slideV = 0; fanSpd = 1;
  P.length = 0; glitchT = ghostT = 0; stage.style.filter = '';
  ghost.setAttribute('opacity', 0);
  cdEl.classList.remove('dead');
  nextDrop = T + 3;
}

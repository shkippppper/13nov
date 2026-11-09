'use strict';
// ───────────────────────── falling things (shared physics; fallen junk piles up)
function pileTop(b) {       // highest resting junk under b, or the ground
  let g = GROUND, sup = null;
  for (const o of DROPS) {
    if (o === b || !o.ground || o.fade < 1 || o.y <= b.y) continue;
    if (b.x + b.hw * 0.75 > o.x - o.hw && b.x - b.hw * 0.75 < o.x + o.hw) { const top = o.y - o.hh; if (top < g) { g = top; sup = o; } }
  }
  return [g, sup];
}
function stepBody(b, dt, xmin, xmax, pile) {
  if (b.ground && b.sup && (b.sup.fade < 1 || !b.sup.ground)) { b.ground = false; b.sup = null; }   // what it rested on is gone
  if (!b.ground) {
    b.vy += 2600 * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.a += b.va * dt;
    if (b.x < xmin) { b.x = xmin; b.vx = Math.abs(b.vx) * 0.4; }
    if (b.x > xmax) { b.x = xmax; b.vx = -Math.abs(b.vx) * 0.4; }
  } else {
    const tg = Math.round(b.a / 90) * 90 + b.tilt;
    b.a += (tg - b.a) * Math.min(1, dt * 6);
    b.vx *= 1 - Math.min(1, dt * 5); b.x += b.vx * dt;
  }
  const rr = b.a * DEG, sn = Math.abs(Math.sin(rr)), cs = Math.abs(Math.cos(rr));
  b.hh = b.w / 2 * sn + b.h / 2 * cs; b.hw = b.w / 2 * cs + b.h / 2 * sn;
  let hit = 0;
  if (b.ground) b.y = (b.sup ? b.sup.y - b.sup.hh : GROUND) - b.hh;
  else {
    const [g, sup] = pile ? pileTop(b) : [GROUND, null];
    if (b.y + b.hh >= g) {
      b.y = g - b.hh;
      if (b.vy > 250) hit = b.vy;
      b.vy = -b.vy * 0.3; b.vx *= 0.55; b.va *= 0.45;
      if (Math.abs(b.vy) < 70) { b.vy = 0; b.ground = true; b.sup = sup; }
    }
  }
  b.el.setAttribute('transform', `translate(${f(b.x)} ${f(b.y)}) rotate(${b.a.toFixed(2)})`);
  return hit;
}

// Junk falls out of the sky and piles up on both sides of him (the tower itself never loses anything).
function spawnDrop() {
  const type = pick(DROP_TYPES);
  LIVE = false;
  const g = el('g', {}, dropsG), [w, h] = BUILD[type](g, {});
  LIVE = true;
  const left = Math.random() < 0.5;
  const x = left ? rand(330 + w / 2, 800 - w / 2) : rand(1120 + w / 2, 1590 - w / 2);
  const y = -170 - h;
  const b = {
    el: g, type, x, y, a: rand(0, 360), w, h, hw: w / 2, hh: h / 2, vx: rand(-30, 30), vy: rand(250, 450), va: rand(-300, 300),
    ground: false, sup: null, tilt: rand(-15, 15), elec: ELEC.has(type), landed: 0, fade: 1,
    fire: !['duck', 'mug'].includes(type), ignite: 1e9, fs: clamp(Math.sqrt(w * h) / 120, 0.55, 1.3), rate: 6 + w * h / 2000, smoke: 0.8
  };
  DROPS.push(b);
  g.setAttribute('transform', `translate(${f(x)} ${f(y)}) rotate(${b.a.toFixed(2)})`);
}
function onDropImpact(b, v) {
  dustBurst(b.x, b.y + b.hh, b.hw, Math.round(12 + b.w / 18));
  if (b.elec) sparkBurst(b.x, b.y, 22);
  for (let i = 0; i < 10 * FX; i++) add({ k: 'crumb', x: b.x + rand(-b.hw, b.hw), y: b.y, vx: rand(-240, 240), vy: rand(-460, -150), c: pick(['#3b4757', '#9aa3b2', '#ffcf33', '#2c3340']), max: 2 });
  shake(Math.min(28, v / 65));
  if (state !== 'calm') return;
  // he flinches
  dipV += 120; angV += rand(-25, 25); bendV += rand(-12, 12); sweatBurst(7);
}
function updateDrops(dt) {
  for (const b of DROPS) {
    const hit = stepBody(b, dt, -1400, 3300, true);
    if (hit) onDropImpact(b, hit);
    if (b.ground && !b.landed) b.landed = T || 1e-3;
  }
  // never more than MAX_PILE on the ground: the oldest one crumbles away
  const landed = DROPS.filter(b => b.landed && b.fade >= 1).sort((p, q) => p.landed - q.landed);
  for (let i = 0; i < landed.length - MAX_PILE; i++) { const b = landed[i]; b.fade = 0.999; dustBurst(b.x, b.y, b.hw, 10); }
  for (let i = DROPS.length - 1; i >= 0; i--) {
    const b = DROPS[i];
    if (b.fade >= 1) continue;
    b.fade -= dt / 1.2;
    b.el.setAttribute('opacity', Math.max(0, b.fade).toFixed(2));
    if (b.fade <= 0) { b.el.remove(); DROPS.splice(i, 1); }
  }
}

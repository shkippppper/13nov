'use strict';
// ───────────────────────── the crew: after he's gone, three people come out, look at the mess, rebuild the stack (passing the pieces
// down a line, plank first), stand together for a moment, then lift it and hold it up for good — steady, no wobble.
// Built like him: big oval photo face, short body and legs, outlines in a darker shade. Listed left → right as they end up.
const CREW_SPEC = [
  { face: 'assets/images/s1-face.jpg', ring: '#2a211b', skin: '#e8c3a6', top: 'polo', shirt: '#26282d', pants: '#4b505a', shoes: '#16171a' },
  { face: 'assets/images/n1-face.jpg', ring: '#24150f', skin: '#f3d4c3', top: 'tee', shirt: '#d33b22', pants: '#2b3445', shoes: '#2a1f1a' },
  { face: 'assets/images/l1-face.jpg', ring: '#2a2119', skin: '#ddb093', top: 'tee', shirt: '#2f3d60', pants: '#5f513f', shoes: '#22252b' },
];
const HOLD_X = [770, 960, 1150];    // holding the stack, in the middle
const LOOK_X = [930, 1115, 1300];   // where they stop to take in the mess
const LINE_X = [300, 485, 650];     // the line that passes the pieces along (the mess is to their left, the stack to their right)
const GROUND_DY = GROUND - 2 - PIV.y, HOLD_DY = 6;   // stack offset: plank on the grass / up in their hands
const crewG = el('g', { id: 'crew' });
towerG.after(crewG);   // in front of the stack (hands over the plank, like his), behind falling junk

function makeCrewMember(s) {
  const k = 1, dark = c => mix(c, '#000000', 0.3), n = v => f(v * k);
  const g = el('g', {}, crewG);
  g.style.display = 'none';
  const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  const line3 = (p, q, r) => `M${f(p.x)} ${f(p.y)}L${f(q.x)} ${f(q.y)}L${f(r.x)} ${f(r.y)}`;

  const legs = [0, 1].map(() => el('path', { ...round, stroke: s.pants, 'stroke-width': n(30) }, g));
  const shoes = [0, 1].map(() => el('ellipse', { rx: n(25), ry: n(11), fill: s.shoes }, g));
  const tg = el('g', {}, g);   // shirt, origin = bottom-center
  el('path', { d: `M${n(-60)} ${n(-112)}Q0 ${n(-128)} ${n(60)} ${n(-112)}L${n(66)} 0Q0 ${n(10)} ${n(-66)} 0Z`, fill: s.shirt, stroke: dark(s.shirt), 'stroke-width': 4, 'stroke-linejoin': 'round' }, tg);
  if (s.top === 'polo') {
    const lite = mix(s.shirt, '#ffffff', 0.12);
    el('path', { d: `M${n(-6)} ${n(-118)}V${n(-62)}`, stroke: lite, 'stroke-width': 3 }, tg);
    for (const y of [-100, -80]) el('circle', { cx: 0, cy: n(y), r: n(3), fill: lite }, tg);
    for (const sd of [-1, 1]) el('path', { d: `M0 ${n(-118)}L${n(sd * 30)} ${n(-121)}L${n(sd * 20)} ${n(-96)}Z`, fill: lite, stroke: dark(s.shirt), 'stroke-width': 2, 'stroke-linejoin': 'round' }, tg);
  } else el('path', { d: `M${n(-26)} ${n(-118)}Q0 ${n(-92)} ${n(26)} ${n(-118)}Z`, fill: s.skin, stroke: dark(s.shirt), 'stroke-width': 3 }, tg);
  const arms = [0, 1].map(() => [el('path', { ...round, stroke: dark(s.shirt), 'stroke-width': n(34) }, g), el('path', { ...round, stroke: s.shirt, 'stroke-width': n(26) }, g)]);
  const hg = el('g', {}, g);   // head, origin = center of the oval
  el('ellipse', { rx: n(91), ry: n(125), fill: s.ring }, hg);
  const id = 'crewClip' + CREW_SPEC.indexOf(s);
  el('ellipse', { rx: n(85), ry: n(119) }, el('clipPath', { id }, hg));
  el('image', { href: s.face, x: n(-85), y: n(-119), width: n(170), height: n(238), preserveAspectRatio: 'xMidYMid slice', 'clip-path': `url(#${id})` }, hg);
  const hands = [0, 1].map(() => el('circle', { r: n(17), fill: s.skin, stroke: dark(s.skin), 'stroke-width': 4 }, g));

  // pose: down (arms at sides, swinging when walking) | ready (to catch) | hips | shock (hands on cheeks) | grip (hands at c.grip)
  const c = { x: 0, tx: 0, speed: 230, dir: -1, ph: 0, amp: 0, dip: 0, pose: 'down', grip: null, look: 0, lookS: 0, flinch: 0, cur: null };
  c.place = x => { c.x = c.tx = x; c.cur = null; c.dip = 0; c.pose = 'down'; g.style.display = ''; };
  c.hide = () => { g.style.display = 'none'; };
  c.walkTo = (x, speed = 230) => { c.tx = x; c.speed = speed; };
  c.arrived = () => Math.abs(c.tx - c.x) < 0.5;
  c.update = dt => {
    let moved = 0;
    if (!c.arrived()) { c.dir = Math.sign(c.tx - c.x); moved = Math.min(Math.abs(c.tx - c.x), c.speed * dt); c.x += c.dir * moved; c.ph += moved / 22; }
    c.amp += ((moved > 0 ? 1 : 0) - c.amp) * Math.min(1, dt * 8);
    c.flinch = Math.max(0, c.flinch - dt);
    const want = c.amp > 0.3 && c.pose === 'down' ? c.dir : c.look;
    c.lookS += (want - c.lookS) * Math.min(1, dt * 6);
    draw(dt);
  };
  function draw(dt) {
    const x = c.x, footY = GROUND - 6;
    const bob = -Math.abs(Math.sin(c.ph)) * 5 * c.amp, sw = Math.sin(c.ph) * c.amp;
    const hipY = footY - 73 * k + c.dip + bob, shY = hipY - 94 * k;
    for (const i of [0, 1]) {
      const sd = i ? 1 : -1, hip = { x: x + sd * 25 * k, y: hipY - 6 * k };
      const foot = { x: x + sd * 40 * k + sw * 10 * k, y: footY - Math.max(0, sd * Math.cos(c.ph)) * 14 * c.amp };
      const knee = { x: (hip.x + foot.x) / 2 + sd * (6 + c.dip * 0.8) * k, y: (hip.y + foot.y) / 2 };
      put(legs[i], 'd', line3(hip, knee, foot));
      put(shoes[i], 'cx', f(foot.x + sd * 8 * k)); put(shoes[i], 'cy', f(foot.y + 4 * k));
    }
    put(tg, 'transform', `translate(${f(x)} ${f(hipY)})`);
    const fl = c.flinch > 0 ? Math.sin(c.flinch / 0.45 * Math.PI) : 0;
    const hx = x + c.lookS * 6 * k, hy = hipY - 216 * k + fl * 10;
    put(hg, 'transform', `translate(${f(hx)} ${f(hy)}) rotate(${f(c.lookS * 7 + fl * 4 * Math.sin(T * 40))})`);

    const tgt = [0, 1].map(i => {
      const sd = i ? 1 : -1, sh = { x: x + sd * 55 * k, y: shY };
      let h, e;
      switch (c.pose) {
        case 'ready': h = { x: x + sd * 46 * k, y: shY - 34 * k }; e = { x: x + sd * 98 * k, y: shY + 36 * k }; break;
        case 'hips': h = { x: x + sd * 58 * k, y: hipY - 36 * k }; e = { x: x + sd * 112 * k, y: hipY - 74 * k }; break;
        case 'shock': h = { x: x + sd * 66 * k, y: hy + 44 * k }; e = { x: x + sd * 104 * k, y: shY + 34 * k }; break;
        case 'grip': h = c.grip[i]; e = { x: sh.x + (h.x - sh.x) * 0.55 + sd * 34, y: (sh.y + h.y) / 2 + 6 }; break;
        default: h = { x: x + sd * 82 * k, y: hipY - 6 * k + (i ? -sw : sw) * 10 * k }; e = { x: (sh.x + h.x) / 2 + sd * 22, y: (sh.y + h.y) / 2 };
      }
      return { sh, h, e };
    });
    if (!c.cur) c.cur = tgt.map(t => ({ h: { ...t.h }, e: { ...t.e } }));
    const rate = Math.min(1, dt * (c.pose === 'grip' ? 30 : 10));
    for (const i of [0, 1]) {
      const cu = c.cur[i], t = tgt[i];
      for (const key of ['h', 'e']) { cu[key].x += (t[key].x - cu[key].x) * rate; cu[key].y += (t[key].y - cu[key].y) * rate; }
      const d = line3(t.sh, cu.e, cu.h);
      put(arms[i][0], 'd', d); put(arms[i][1], 'd', d);
      put(hands[i], 'cx', f(cu.h.x)); put(hands[i], 'cy', f(cu.h.y));
    }
  }
  return c;
}

const CREW = (() => {
  const M = CREW_SPEC.map(makeCrewMember);
  const C = { phase: '', hasStack: false, liftK: 0 };
  let t = 0, bt = 0, gap = 0.55, items = [], dy = GROUND_DY, holdDip = 0, holdDipV = 0;

  // the stack straight up (no sway), plank at dy below his old hold height
  function poseStack(dyv) {
    let py = PIV.y + dyv - 18;
    for (const r of ROWG) { r.cx = 960; r.th = 0; r.cy = py - r.h / 2; py -= r.h; r.g.setAttribute('transform', `translate(960 ${f(r.cy)})`); }
    plankEl.setAttribute('transform', `translate(960 ${f(PIV.y + dyv - 9)})`);
  }
  const setItem = (e, x, y, a) => (e.it ? e.it.el : plankEl).setAttribute('transform', e.it
    ? `translate(${f(x - e.it.row.cx)} ${f(y - e.it.row.cy)}) rotate(${a.toFixed(1)})` : `translate(${f(x)} ${f(y)}) rotate(${a.toFixed(1)})`);
  const holdPt = (i, e) => ({ x: M[i].x, y: 457 - e.h / 2 + M[i].dip });
  const grips = (p, e) => { const gw = clamp(e.w / 2 - 12, 20, 62); return [{ x: p.x - gw, y: p.y + e.h / 2 + 2 }, { x: p.x + gw, y: p.y + e.h / 2 + 2 }]; };

  // the line: picked up from the heap (crouching), passed 0 → 1 → 2, set onto the stack; the next piece starts every `gap` s
  function startBuild() {
    C.hasStack = true;
    poseStack(GROUND_DY); plankEl.setAttribute('transform', '');
    items = bodies.map(b => ({ b, it: b.item || null, w: b.w, h: b.h, done: false, called: false,
                               a0: ((b.a % 360) + 540) % 360 - 180, from: { x: b.x, y: b.y } }));
    for (const e of items) {
      e.slot = e.it ? { x: 960 + e.it.x, y: e.it.row.cy + e.it.y, a: e.it.a } : { x: 960, y: PIV.y + GROUND_DY - 9, a: 0 };
      setItem(e, e.from.x, e.from.y, e.a0);
    }
    gap = items.length > 30 ? 0.36 : 0.55; bt = 0;
  }
  function updateBuild(dt) {
    bt += dt;
    const P = 0.8 * gap, H = 0.2 * gap, S = 0.8 * gap, PL = 0.9 * gap;
    const STAGES = [['pick', 0, P], ['hold', 0, H], ['toss', 0, S], ['hold', 1, H], ['toss', 1, S], ['hold', 2, H], ['place', 2, PL]];
    for (const m of M) { m.pose = 'ready'; m.look = -1; }
    let pickDip = 0;
    items.forEach((e, j) => {
      if (e.done) return;
      let u = bt - j * gap;
      if (u < 0) return;
      if (!e.called) { e.called = true; M[0].walkTo(clamp(e.from.x + 30, 150, 430), 700); }
      let st = null;
      for (const s of STAGES) { if (u < s[2]) { st = s; break; } u -= s[2]; }
      if (!st) {   // set onto the stack
        e.done = true;
        if (e.it) e.it.el.setAttribute('transform', e.it.tf); else plankEl.setAttribute('transform', `translate(960 ${f(PIV.y + GROUND_DY - 9)})`);
        if (e.slot.y > 40) { dustBurst(e.slot.x, e.slot.y + e.h / 2, e.w / 3, 4); shake(1.5); }
        return;
      }
      const [kind, i, dur] = st, s = u / dur;
      let p, a = 0, hold = null, look = 1;
      if (kind === 'pick') {
        const B = holdPt(0, e), q = smooth(0.25, 1, s);
        p = { x: lerp(e.from.x, B.x, q), y: lerp(e.from.y, B.y, q) - Math.sin(q * Math.PI) * 40 }; a = lerp(e.a0, 0, q);
        hold = 0; look = -1; pickDip = Math.max(pickDip, 46 * (1 - smooth(0.2, 0.85, s)));
      } else if (kind === 'hold') { p = holdPt(i, e); p.y -= Math.sin(s * Math.PI) * 6; hold = i; }
      else if (kind === 'toss') {
        const A = holdPt(i, e), B = holdPt(i + 1, e), q = smooth(0, 1, s);
        p = { x: lerp(A.x, B.x, q), y: lerp(A.y, B.y, q) - Math.sin(q * Math.PI) * 80 }; a = Math.sin(s * Math.PI) * 14;
        if (s < 0.22) hold = i; else if (s > 0.68) { hold = i + 1; look = -1; }
      } else {
        const A = holdPt(2, e), B = e.slot, q = smooth(0, 1, s), cx = (A.x + B.x) / 2, cy = Math.min(A.y, B.y) - 90;
        p = { x: (1 - q) * (1 - q) * A.x + 2 * (1 - q) * q * cx + q * q * B.x, y: (1 - q) * (1 - q) * A.y + 2 * (1 - q) * q * cy + q * q * B.y };
        a = lerp(0, B.a, q);
        if (s < 0.2) hold = 2;
      }
      setItem(e, p.x, p.y, a);
      if (hold !== null) { M[hold].pose = 'grip'; M[hold].grip = grips(p, e); M[hold].look = look; }
    });
    M[0].dip = pickDip;
    return items.every(e => e.done);
  }

  C.start = () => {
    C.phase = 'enter'; t = 0; C.hasStack = false; C.liftK = 0; holdDip = holdDipV = 0;
    [2060, 2250, 2440].forEach((x, i) => { M[i].place(x); M[i].walkTo(LOOK_X[i], 240); });
  };
  C.reset = () => { C.phase = ''; C.hasStack = false; C.liftK = 0; items = []; for (const m of M) m.hide(); };
  C.finish = () => {   // straight to holding it up
    for (const it of ITEMS) it.el.setAttribute('transform', it.tf);
    bodies = null; C.hasStack = true; C.liftK = 1; C.phase = 'hold'; holdDip = holdDipV = 0;
    M.forEach((m, i) => { m.place(HOLD_X[i]); m.dip = 8; });
    poseStack(HOLD_DY); C.update(0);
  };
  C.flinch = () => {
    if (C.phase !== 'hold') return;
    holdDipV += 170;
    for (const m of M) m.flinch = 0.45;
  };

  C.update = dt => {
    if (!C.phase) return;
    t += dt;
    const all = () => M.every(m => m.arrived());
    switch (C.phase) {
      case 'enter':
        for (const m of M) m.pose = 'down';
        if (all()) { C.phase = 'look'; t = 0; }
        break;
      case 'look':   // they take in the mess: wide eyes to the left, n1 grabs her cheeks, s1 glances at the others
        M.forEach(m => { m.look = -1; m.pose = 'down'; });
        M[1].pose = t > 0.4 && t < 2.3 ? 'shock' : 'down';
        if (t > 1.2 && t < 1.9) M[0].look = 1;
        if (t > 2.8) { M.forEach((m, i) => m.walkTo(LINE_X[i], 250)); C.phase = 'toLine'; }
        break;
      case 'toLine':
        for (const m of M) m.pose = 'down';
        if (all()) { startBuild(); C.phase = 'build'; t = 0; }
        break;
      case 'build':
        if (updateBuild(dt)) {
          bodies = null;
          M.forEach((m, i) => { m.pose = 'down'; m.dip = 0; m.walkTo(LINE_X[i] - 10, 200); });
          C.phase = 'together'; t = 0;
        }
        break;
      case 'together':   // side by side next to the finished stack, hands on hips, a proud nod
        if (all()) M.forEach(m => { m.pose = 'hips'; m.look = 0; m.dip = Math.max(0, Math.sin((t - 0.6) * 5)) * 6 * (t > 0.6 && t < 1.25 ? 1 : 0); });
        if (t > 3.2) { M.forEach((m, i) => { m.pose = 'down'; m.dip = 0; m.walkTo(HOLD_X[i], 210); }); C.phase = 'toHold'; t = 0; }
        break;
      case 'toHold':
        if (all()) { C.phase = 'grab'; t = 0; }
        break;
      case 'grab': {   // crouch and take the plank
        const q = smooth(0, 0.6, t);
        M.forEach(m => { m.dip = 46 * q; m.pose = 'grip'; m.look = 0; m.grip = [{ x: m.x - 62, y: lerp(m.cur ? m.cur[0].h.y : 800, PIV.y + GROUND_DY - 9, q) }, { x: m.x + 62, y: lerp(m.cur ? m.cur[1].h.y : 800, PIV.y + GROUND_DY - 9, q) }]; });
        if (t > 0.8) { C.phase = 'lift'; t = 0; }
        break;
      }
      case 'lift': {   // up over their heads, together
        const q = smooth(0, 1.7, t);
        dy = lerp(GROUND_DY, HOLD_DY, q); C.liftK = q;
        poseStack(dy);
        M.forEach(m => { m.dip = lerp(46, 8, q); m.grip = [{ x: m.x - 62, y: PIV.y + dy + lerp(-9, 4, q) }, { x: m.x + 62, y: PIV.y + dy + lerp(-9, 4, q) }]; });
        if (t > 1.8) { C.phase = 'hold'; t = 0; C.liftK = 1; }
        break;
      }
      case 'hold': {   // steady; a little dip when something lands, and they look at whatever is falling
        holdDipV += (-60 * holdDip - 9 * holdDipV) * dt; holdDip += holdDipV * dt;
        dy = HOLD_DY + holdDip + Math.sin(T * 1.2) * 1.2;
        poseStack(dy);
        const fall = DROPS.find(d => !d.ground && d.y > -250);
        M.forEach(m => {
          m.pose = 'grip'; m.dip = 8 + holdDip;
          m.grip = [{ x: m.x - 62, y: PIV.y + dy + 4 }, { x: m.x + 62, y: PIV.y + dy + 4 }];
          m.look = fall ? clamp((fall.x - m.x) / 350, -1, 1) : 0;
        });
        break;
      }
    }
    for (const m of M) m.update(dt);
  };
  return C;
})();
function crewFlinch() { CREW.flinch(); }

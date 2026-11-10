'use strict';
// ───────────────────────── the cat (niko's face as its head) lives on the couch: mostly asleep (Zzz), now and then it wakes
// up, says something and dozes off again ("ლეგ ქიქი": it stands up on its hind legs like a person and kicks with its foot).
// keys: c = wake it up / make it talk, t = it hops down and does the bubble-butt show
const KICK_LINE = 'ლეგ ქიქი';
const CAT_LINES = ['მიაუ მიაუ', 'ია პროსტა ჩლენ', 'შიბლოინ', KICK_LINE];
const CAT_SLEEP = [25, 60], CAT_AWAKE = [8, 14];   // seconds asleep / awake

function makeCat(face) {
  const FUR = '#e8913f', FAR = '#c06c2a', LINE = '#5a2f12', STRIPE = '#b65a1e', PINK = '#f29aa0';
  const g = el('g', {}, guestsG);
  const side = el('g', {}, g), rear = el('g', {}, g), hd = el('g', {}, g);
  const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  const limb = (p, c, w = 13) => [el('path', { ...round, stroke: LINE, 'stroke-width': w + 8 }, p), el('path', { ...round, stroke: c, 'stroke-width': w }, p)];
  const tailOf = p => [...limb(p, FUR, 14), el('path', { fill: 'none', stroke: STRIPE, 'stroke-width': 14, 'stroke-dasharray': '7 12' }, p)];
  const setD = (L, d) => { for (const e of L) e.setAttribute('d', d); };
  const blob = (p, shapes) => { for (const [c, w] of [[LINE, 8], [FUR, 0]]) for (const [tag, a] of shapes) el(tag, { ...a, fill: c, stroke: c, 'stroke-width': w }, p); };

  // side view (faces +x, paws on y=0), the bubble butt trailing behind
  const sb = el('g', {}, side);
  const leg = (x, y, o, k, c, front) => ({ x, y, o, k, front, L: limb(sb, c) });
  const legs = [leg(-62, -64, Math.PI, -9, FAR, false), leg(40, -72, 0, 3, FAR, true)];
  const sTail = tailOf(sb);
  blob(sb, [['circle', { cx: -56, cy: -84, r: 52 }], ['ellipse', { cx: 4, cy: -86, rx: 64, ry: 30 }], ['circle', { cx: 52, cy: -92, r: 30 }]]);
  el('path', { d: 'M-6 -114q5 10 0 20M16 -115q5 10 0 20M38 -111q4 9 0 17M-66 -130q17 8 16 27M-90 -114q14 8 14 24', ...round, stroke: STRIPE, 'stroke-width': 6 }, sb);
  el('ellipse', { cx: -76, cy: -112, rx: 17, ry: 9, transform: 'rotate(-35 -76 -112)', fill: '#fff', opacity: 0.35 }, sb);
  legs.push(leg(-44, -64, 0, -9, FUR, false), leg(58, -72, Math.PI, 3, FUR, true));

  // rear view, for the show: two big cheeks
  const rb = el('g', {}, rear);
  for (const s of [-1, 1]) setD(limb(rb, FUR), `M${s * 46} -44L${s * 50} -10`);
  blob(rb, [['ellipse', { cx: 0, cy: -116, rx: 48, ry: 46 }]]);
  el('path', { d: 'M-30 -142q30 -8 60 0M-38 -124q38 -9 76 0', ...round, stroke: STRIPE, 'stroke-width': 6 }, rb);
  const cheeks = [-1, 1].map(s => {
    const ch = el('g', {}, rb);
    el('circle', { cx: s * 37, cy: -64, r: 46, fill: FUR, stroke: LINE, 'stroke-width': 5 }, ch);
    el('ellipse', { cx: s * 37 - 14, cy: -86, rx: 13, ry: 8, transform: `rotate(-25 ${s * 37 - 14} -86)`, fill: '#fff', opacity: 0.4 }, ch);
    return ch;
  });
  const rTail = tailOf(rb);

  // head: ears, face slot, whiskers
  for (const s of [-1, 1]) {
    el('path', { d: `M${s * 50} -20L${s * 44} -90L${s * 6} -58Z`, fill: FUR, stroke: LINE, 'stroke-width': 5, 'stroke-linejoin': 'round' }, hd);
    el('path', { d: `M${s * 41} -36L${s * 39} -76L${s * 18} -58Z`, fill: PINK }, hd);
  }
  faceHead(hd, face, 52, FUR, LINE);
  el('path', { d: 'M-48 10L-84 2M-48 18L-86 20M-48 26L-82 36M48 10L84 2M48 18L86 20M48 26L82 36', ...round, stroke: '#f3ece0', 'stroke-width': 3 }, hd);

  // standing up like a person: where each leg's paw goes (screen space, cat facing +x; f = standing, k = during the kick,
  // b = how far the knee/elbow bends forward). Order matches legs: back far, front far, back near, front near.
  const UP_PIVOT = { x: -56, y: -58 };
  const UP_POSE = [
    { f: [-80, -2], b: 8 },                          // back leg, far: the one it stands on
    { f: [-16, -186], k: [-34, -196], b: -4 },       // front leg, far: fist up by its face
    { f: [-42, -2], k: [52, -100], b: 10 },          // back leg, near: the kicking foot
    { f: [-6, -160], k: [-96, -150], b: -6 },        // front leg, near: guard, swung back for balance in the kick
  ];
  // where it lives: on the seat, facing him; the show happens on the grass in front of the couch
  const BED = { x: COUCH.x + 10, y: COUCH.seatY + 2 }, LAWN = { x: COUCH.x - 20, y: GROUND - 2 };
  // modes: sleep → getup → awake → liedown → sleep;  show: (getup) → hopdown → show → hopup → awake
  const c = { x: BED.x, y: BED.y, dir: -1, mode: 'sleep', mt: 0, lie: 1, until: rand(8, 20), next: 'awake', pose: 'side',
              ph: 0, amp: 0, sT: 0, tw: 0, said: false, sayAt: 0, turn: 0, mid: null, hx: 0, hy: 0, from: null, to: null, nextZ: 0,
              up: 0, kick: 0, kicked: false, line: null };
  const setPose = p => { c.pose = p; side.style.display = p === 'side' ? '' : 'none'; rear.style.display = p === 'rear' ? '' : 'none'; };
  const turn = fn => { c.turn = 0.26; c.mid = fn; };   // squash to nothing, flip at the midpoint, stretch back
  const go = (mode, extra) => { c.mode = mode; c.mt = 0; Object.assign(c, extra); };
  setPose('side');

  c.talk = (line = pick(CAT_LINES)) => {
    say(c, line, line.length > 20 ? 3.6 : 2.6);
    if (line === KICK_LINE && c.mode === 'awake' && c.turn <= 0) go('kick');   // jumps up and kicks
  };
  c.wake = line => {   // c key: wake up (and talk), or talk if it's already up; line = what to say first (default: a random one)
    if (c.mode === 'sleep' || c.mode === 'liedown' || c.mode === 'getup') go('getup', { next: 'awake', line: line || null });
    else if (c.mode === 'awake') { c.talk(line); c.until = Math.max(c.until, T + 4); }
  };
  c.showNow = () => {   // t key: off the couch and straight into the show
    if (['hopdown', 'show', 'hopup'].includes(c.mode) || c.turn > 0) return;
    if (c.lie > 0) go('getup', { next: 'hopdown' }); else go('hopdown');
  };
  c.top = () => ({ x: c.x + c.hx, y: c.y + c.hy - 98 });

  c.update = (dt, quiet) => {
    c.mt += dt;
    if (c.turn > 0) { const was = c.turn; c.turn -= dt; if (was > 0.13 && c.turn <= 0.13) c.mid(); }
    switch (c.mode) {
      case 'sleep':
        c.lie = 1;
        if (T > c.nextZ) { c.nextZ = T + rand(1, 1.6); add({ k: 'zzz', x: c.x + c.hx + c.dir * 30, y: c.y + c.hy - 60, vx: c.dir * rand(8, 20), vy: rand(-38, -26), r: rand(30, 44), ph: rand(0, 6), max: 2.6 }); }
        if (T > c.until && !quiet) go('getup', { next: 'awake' });
        break;
      case 'getup':
        c.lie = Math.max(0, c.lie - dt / 0.6);
        if (c.lie <= 0) {
          if (c.next === 'hopdown') go('hopdown');
          else go('awake', { until: T + rand(...CAT_AWAKE), sayAt: T + 0.5 });
        }
        break;
      case 'awake':
        if (T > c.sayAt) { const l = c.line; c.line = null; c.sayAt = l || Math.random() < 0.5 ? T + rand(4, 6) : 1e9; c.talk(l || undefined); if (l) c.until = Math.max(c.until, T + 6); }
        if (c.mt > 3 && c.mt - dt <= 3 && Math.random() < 0.4) turn(() => { c.dir = -c.dir; });   // looks the other way for a bit
        if (T > c.until || (quiet && c.mt > 3)) {
          if (c.dir !== -1) turn(() => { c.dir = -1; });
          go('liedown');
        }
        break;
      case 'kick': {   // stands up on its hind legs like a person, fists up, snaps a kick out with one foot, drops back to all fours
        const t = c.mt;
        c.up = smooth(0, 0.35, t) * (1 - smooth(1.35, 1.7, t));
        c.kick = smooth(0.5, 0.62, t) * (1 - smooth(1.0, 1.2, t));
        if (c.kick > 0.95 && !c.kicked) {
          c.kicked = true;
          const px = c.x + c.dir * 70, py = c.y - 100;
          sparkBurst(px, py, 10);
          for (let i = 0; i < 3; i++) add({ k: 'dust', x: px - c.dir * i * 30, y: py, vx: -c.dir * rand(60, 140), vy: rand(-20, 20), r: rand(10, 16), g: 30, a: 0.45, max: 0.6 });
        }
        if (t >= 1.7) { c.up = c.kick = 0; c.kicked = false; go('awake'); }
        break;
      }
      case 'liedown':
        if (c.turn > 0) break;
        c.lie = Math.min(1, c.lie + dt / 0.8);
        if (c.lie >= 1) go('sleep', { until: T + rand(...CAT_SLEEP), nextZ: T + 0.8 });
        break;
      case 'hopdown': case 'hopup': {   // a little jump between the seat and the grass
        const down = c.mode === 'hopdown', A = down ? BED : LAWN, B = down ? LAWN : BED, u = clamp(c.mt / 0.5, 0, 1);
        c.x = lerp(A.x, B.x, u); c.y = lerp(A.y, B.y, u) - Math.sin(u * Math.PI) * 70;
        if (u >= 1) {
          if (down) { turn(() => setPose('rear')); go('show', { sT: 0, said: false }); }
          else go('awake', { until: T + rand(3, 5), sayAt: 1e9 });
        }
        break;
      }
      case 'show':
        c.sT += dt;
        if (c.sT > 0.35 && !c.said) { c.said = true; say(c, 'ტრაკიიიი', 3.6, true); }
        if (c.tw > 0.4) emitN(7 * dt, () => add({ k: 'heart', x: c.x + rand(-70, 70), y: c.y - rand(60, 110), vx: rand(-40, 40), vy: rand(-110, -60), r: rand(8, 13), ph: rand(0, 6), max: rand(1.2, 1.8) }));
        if (c.sT > 4.4 && c.turn <= 0) { turn(() => { setPose('side'); c.dir = -1; }); go('hopup'); }
        break;
    }
    c.tw = c.mode === 'show' ? smooth(0.3, 0.7, c.sT) * (1 - smooth(3.8, 4.3, c.sT)) : 0;
    draw(dt);
  };

  function draw(dt) {
    c.amp += (0 - c.amp) * Math.min(1, dt * 8);
    const sq = c.turn > 0 ? Math.max(0.04, Math.abs(c.turn - 0.13) / 0.13) : 1, sx = c.dir * sq;
    const L = smooth(0, 1, c.lie), breath = c.mode === 'sleep' ? Math.sin(T * 1.4) * 0.025 : 0;
    g.setAttribute('transform', `translate(${f(c.x)} ${f(c.y)})`);
    let rot = 0;
    if (c.pose === 'side') {
      side.setAttribute('transform', `scale(${sx.toFixed(3)} 1)`);
      // upright (U): the body swings up around the hips to stand like a person, leaning back a bit more in the kick (K)
      const U = c.up, K = c.kick, th = (-80 * U - 14 * K) * DEG, P = UP_PIVOT;
      const rotP = (q, a) => ({ x: P.x + (q.x - P.x) * Math.cos(a) - (q.y - P.y) * Math.sin(a), y: P.y + (q.x - P.x) * Math.sin(a) + (q.y - P.y) * Math.cos(a) });
      sb.setAttribute('transform', `translate(0 ${f(L * 30)}) rotate(${f(th / DEG)} ${P.x} ${P.y}) scale(1 ${(1 + breath).toFixed(3)})`);
      for (const l of legs) {   // all fours ↔ lying (front paws forward, back ones tucked) ↔ upright (hind legs stand, front legs are arms)
        const a = c.ph + l.o, px = l.x + Math.sin(a) * 18 * c.amp, py = -10 - Math.max(0, Math.cos(a)) * 12 * c.amp;
        const lx = l.x + (l.front ? 36 : 22), ly = -36;
        let fx = lerp(px, lx, L), fy = lerp(py, ly, L), kx = (l.x + fx) / 2 + l.k * (1 - L), ky = (l.y + fy) / 2;
        if (U > 0) {   // targets are where they should end up on screen; undo the body's rotation to draw them inside it
          const up = UP_POSE[legs.indexOf(l)], foot = { x: lerp(up.f[0], up.k ? up.k[0] : up.f[0], K), y: lerp(up.f[1], up.k ? up.k[1] : up.f[1], K) };
          const hip = rotP({ x: l.x, y: l.y }, th), knee = { x: (hip.x + foot.x) / 2 + up.b, y: (hip.y + foot.y) / 2 + (l.front ? 10 : 0) };
          const F = rotP(foot, -th), Kn = rotP(knee, -th);
          fx = lerp(fx, F.x, U); fy = lerp(fy, F.y, U); kx = lerp(kx, Kn.x, U); ky = lerp(ky, Kn.y, U);
        }
        setD(l.L, `M${l.x} ${l.y}L${f(kx)} ${f(ky)}L${f(fx)} ${f(fy)}`);
      }
      const sw = Math.sin(T * (L > 0.5 ? 0.9 : 2.3)) * 10;
      setD(sTail, L > 0.5 ? `M-98 -100C-152 -92 -150 -34 -96 -34C-50 -34 ${f(-6 + sw * 0.6)} -36 ${f(34 + sw)} -40`   // curled around it on the cushion
                          : `M-98 -104C-130 -108 ${f(-144 + sw * 0.4)} -146 ${f(-122 + sw)} -192`);
      const neck = rotP({ x: 76, y: -100 }, th);   // upright: the head sits on top of the chest
      c.hx = lerp(lerp(80, 88, L), neck.x + 6, U) * sx; c.hy = lerp(-150 + L * 66, neck.y - 44, U);
      rot = -9 * c.dir * L - 8 * c.dir * K;   // head resting on its paws / thrown back in the kick
    } else {
      const k = c.tw, b = Math.sin(T * 17) * k;   // twerk: the cheeks bounce in turn, the hips sway
      rear.setAttribute('transform', `scale(${sx.toFixed(3)} 1)`);
      cheeks[0].setAttribute('transform', `translate(0 ${f(b * 10)})`);
      cheeks[1].setAttribute('transform', `translate(0 ${f(-b * 10)})`);
      rb.setAttribute('transform', `translate(${f(Math.sin(T * 8.5) * 7 * k)} ${f(-Math.abs(b) * 4)}) rotate(${f(b * 4)} 0 -60)`);
      const w = Math.sin(T * 9) * (8 + 14 * k);
      setD(rTail, `M0 -100C8 -140 ${f(58 + w)} -132 ${f(64 + w * 1.3)} -176`);
      c.hx = -40 * sx; c.hy = -192 - Math.abs(b) * 4; rot = (-8 + b * 3) * c.dir;   // looks back over the shoulder
    }
    hd.setAttribute('transform', `translate(${f(c.hx)} ${f(c.hy)}) rotate(${f(rot)}) scale(${sq.toFixed(3)} 1)`);
  }
  return c;
}

const CAT = makeCat({ src: 'assets/images/cat-face-niko.jpg', zoom: 1.45, fx: 0.51, fy: 0.41 });
addFeature({
  update(dt, rem) { CAT.update(dt, heroTime(rem)); },   // the last 10 min and the ending: it sleeps through it (keys still work)
  keys: { c: () => CAT.wake(), t: () => CAT.showNow() },
});

'use strict';
// ───────────────────────── guest: the cat, with niko's face as its head; a third of its visits end with the bubble-butt show
// keys: c = call the cat (or make it meow if it's already here), t = straight to the show
const TRAKI_CHANCE = 1 / 3;   // share of cat visits that end with the bubble-butt show

function makeCat(face) {
  const FUR = '#e8913f', FAR = '#c06c2a', LINE = '#5a2f12', STRIPE = '#b65a1e', PINK = '#f29aa0';
  const g = el('g', {}, guestsG);
  g.style.display = 'none';
  const side = el('g', {}, g), rear = el('g', {}, g), hd = el('g', {}, g);
  const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  const limb = (p, c, w = 13) => [el('path', { ...round, stroke: LINE, 'stroke-width': w + 8 }, p), el('path', { ...round, stroke: c, 'stroke-width': w }, p)];
  const tailOf = p => [...limb(p, FUR, 14), el('path', { fill: 'none', stroke: STRIPE, 'stroke-width': 14, 'stroke-dasharray': '7 12' }, p)];
  const setD = (L, d) => { for (const e of L) e.setAttribute('d', d); };
  const blob = (p, shapes) => { for (const [c, w] of [[LINE, 8], [FUR, 0]]) for (const [tag, a] of shapes) el(tag, { ...a, fill: c, stroke: c, 'stroke-width': w }, p); };

  // side view (faces +x, paws on y=0), the bubble butt trailing behind
  const sb = el('g', {}, side);
  const leg = (x, y, o, k, c) => ({ x, y, o, k, L: limb(sb, c) });
  const legs = [leg(-62, -64, Math.PI, -9, FAR), leg(40, -72, 0, 3, FAR)];
  const sTail = tailOf(sb);
  blob(sb, [['circle', { cx: -56, cy: -84, r: 52 }], ['ellipse', { cx: 4, cy: -86, rx: 64, ry: 30 }], ['circle', { cx: 52, cy: -92, r: 30 }]]);
  el('path', { d: 'M-6 -114q5 10 0 20M16 -115q5 10 0 20M38 -111q4 9 0 17M-66 -130q17 8 16 27M-90 -114q14 8 14 24', ...round, stroke: STRIPE, 'stroke-width': 6 }, sb);
  el('ellipse', { cx: -76, cy: -112, rx: 17, ry: 9, transform: 'rotate(-35 -76 -112)', fill: '#fff', opacity: 0.35 }, sb);
  legs.push(leg(-44, -64, 0, -9, FUR), leg(58, -72, Math.PI, 3, FUR));

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

  // modes: away → walk ⇄ idle → (walk to a spot → show) → exit → away
  const c = { x: 0, y: GROUND - 2, dir: 1, mode: 'away', pose: 'side', tx: 0, ph: 0, amp: 0, until: 0, leave: 0, meowAt: 0,
              traki: false, show: false, said: false, sT: 0, tw: 0, turn: 0, mid: null, hx: 0, hy: 0 };
  const setPose = p => { c.pose = p; side.style.display = p === 'side' ? '' : 'none'; rear.style.display = p === 'rear' ? '' : 'none'; };
  const turn = fn => { c.turn = 0.26; c.mid = fn; };   // squash to nothing, flip at the midpoint, stretch back
  const go = tx => { c.tx = tx; c.mode = 'walk'; };
  const exit = (out = Math.random() < 0.5 ? -1 : 1) => { c.mode = 'exit'; c.show = false; c.tx = c.x + out * 1e5; };
  function wander() {
    if (T < c.leave) { const [lo, hi] = ROAM; let tx; do tx = rand(lo, hi); while (Math.abs(tx - c.x) < 220); go(tx); }
    else if (c.traki) { c.traki = false; c.show = true; go(960 + (c.x < 960 ? -1 : 1) * rand(260, 420)); }
    else exit();
  }
  function arrive() {
    if (c.show) { c.mode = 'show'; c.sT = 0; c.said = false; turn(() => setPose('rear')); return; }
    if (T > c.leave) return wander();
    c.mode = 'idle'; c.until = T + rand(2.5, 7);
    if (Math.random() < 0.6) c.meowAt = Math.min(c.meowAt, T + rand(0.3, 1.5));
  }
  setPose('side');

  c.enter = (traki = Math.random() < TRAKI_CHANCE, stay = rand(...VISIT)) => {
    const fromL = Math.random() < 0.5, [lo, hi] = ROAM;
    c.dir = fromL ? 1 : -1; c.x = fromL ? -170 : 2090; c.ph = c.amp = c.turn = 0;
    c.traki = traki; c.show = false; c.leave = T + stay; c.meowAt = T + rand(4, 8);
    setPose('side'); go(lerp(lo, hi, fromL ? rand(0.15, 0.4) : rand(0.6, 0.85)));
    g.style.display = '';
  };
  c.shoo = () => { if (c.mode === 'walk' || c.mode === 'idle') exit(); };
  c.meow = () => say(c, 'მიაუ მიაუ', 2.2);
  c.top = () => ({ x: c.x + c.hx, y: c.y + c.hy - 98 });
  c.update = dt => {
    if (c.mode === 'away') return false;
    let moved = 0;
    if (c.turn > 0) { const was = c.turn; c.turn -= dt; if (was > 0.13 && c.turn <= 0.13) c.mid(); }
    else if (c.mode === 'walk' || c.mode === 'exit') {
      const want = Math.sign(c.tx - c.x) || c.dir;
      if (want !== c.dir) turn(() => { c.dir = want; });
      else {
        moved = Math.min(Math.abs(c.tx - c.x), (c.mode === 'exit' ? 170 : 115) * dt);
        c.x += c.dir * moved; c.ph += moved / 20;
        if (c.mode === 'walk' && Math.abs(c.tx - c.x) < 0.5) arrive();
      }
    } else if (c.mode === 'idle') { if (T > c.until) wander(); }
    else if (c.mode === 'show') {
      c.sT += dt;
      if (c.sT > 0.35 && !c.said) { c.said = true; say(c, 'ტრაკიიიი', 3.6, true); }
      if (c.tw > 0.4) emitN(7 * dt, () => add({ k: 'heart', x: c.x + rand(-70, 70), y: c.y - rand(60, 110), vx: rand(-40, 40), vy: rand(-110, -60), r: rand(8, 13), ph: rand(0, 6), max: rand(1.2, 1.8) }));
      if (c.sT > 4.4) { const out = Math.random() < 0.5 ? -1 : 1; turn(() => { setPose('side'); c.dir = out; }); exit(out); }
    }
    if (c.mode === 'exit') {
      if ((c.x < -260 && c.dir < 0) || (c.x > 2180 && c.dir > 0)) { c.mode = 'away'; g.style.display = 'none'; return false; }
    }
    if (T > c.meowAt && c.pose === 'side' && c.mode !== 'show') { c.meow(); c.meowAt = T + rand(8, 20); }
    c.tw = c.mode === 'show' ? smooth(0.3, 0.7, c.sT) * (1 - smooth(3.8, 4.3, c.sT)) : 0;
    draw(dt, moved);
    return true;
  };
  function draw(dt, moved) {
    c.amp += ((moved > 0 ? 1 : 0) - c.amp) * Math.min(1, dt * 8);
    const sq = c.turn > 0 ? Math.max(0.04, Math.abs(c.turn - 0.13) / 0.13) : 1, sx = c.dir * sq;
    g.setAttribute('transform', `translate(${f(c.x)} ${f(c.y)})`);
    let rot = 0;
    if (c.pose === 'side') {
      const bob = -Math.abs(Math.sin(c.ph)) * 3 * c.amp;
      side.setAttribute('transform', `scale(${sx.toFixed(3)} 1)`);
      sb.setAttribute('transform', `translate(0 ${f(bob)})`);
      for (const l of legs) {   // trot: diagonal pairs swing together
        const a = c.ph + l.o, px = l.x + Math.sin(a) * 18 * c.amp, py = -10 - Math.max(0, Math.cos(a)) * 12 * c.amp;
        setD(l.L, `M${l.x} ${l.y}L${f((l.x + px) / 2 + l.k)} ${f((l.y + py) / 2)}L${f(px)} ${f(py)}`);
      }
      const sw = Math.sin(T * 2.3) * 10 + Math.sin(c.ph * 2) * 4 * c.amp;
      setD(sTail, `M-98 -104C-130 -108 ${f(-144 + sw * 0.4)} -146 ${f(-122 + sw)} -192`);
      c.hx = 80 * sx; c.hy = -150 + bob;
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
GUESTS.push(CAT);
function summon(traki) {
  if (!guest) { guest = CAT; CAT.enter(traki || Math.random() < TRAKI_CHANCE, traki ? 0 : rand(...VISIT)); }
  else if (guest === CAT) { if (traki) { CAT.traki = true; CAT.leave = 0; } else CAT.meow(); }
}
addFeature({ keys: { c: () => summon(false), t: () => summon(true) } });

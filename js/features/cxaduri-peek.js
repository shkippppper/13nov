'use strict';
// ───────────────────────── cxaduri: every 5 min he sticks his head (and a finger) in from a side edge, drops a line, and ducks back out
// key: x = peek now
const PEEK_EVERY = 300;
const PEEK_LINES = [
  'ცალსახად, არა',
  'მაგათი დედას შევეცი!',
  'ეგენი არიან ყლეები!',
  'რა ხდება?',
  'ყავა 2 საათამდე უნდა დაილიოს',
  'cold brew და მისი ჯანი',
  'ერთი ატომური ბომბი არ აწყენდათ მაგათ',
  'ეგ არის აბსოლიტური ყლეობა',
  'რომელ შამპუნს იყენებ?',
  'ევროკავშირში აიკრძალა ეგ 2022 წლის 14 ნოემბერს',
  'რა გირჩევნია?',
  'ფროიდი არის ჩვეულებრივი ყლე',
  'ვჭამოთ?',
  'არა, არა! უყურე...',
  'ყლეზე მკიდია',
  'FDA-ს არ აქვს დაეფრუვებული ეგ',
  'ფრანგებზე ყლე ნაროდი იშვიათია',
  'Fiber დალიე და დაგილაგებს კუჭნაწლავს',
  'საფლემენთები და მისი ჯანი',
  'უთხარი რო არ გააკეთებ და ეგაა, შეჩემა.',
  'წივილა ჩემი გაზრდილია',
  'ცხადია!',
];
function makePeek(src, lines) {
  const root = $('peek');
  const side = el('g', {}, root);   // drawn for the left edge, mirrored for the right one
  const hd = el('g', {}, side), arm = el('g', {}, side);
  const SKIN = '#eab08b', SKL = '#a8714f', INK = '#120b08';

  // head: the photo cut out along his real outline (hair, glasses, beard). Outline points are in photo px
  // (crop 518×860, shown 250 wide with the nose bridge at 0,0), smoothed into a closed curve.
  const PS = 250 / 518, OUTLINE = [[200, -15], [320, 12], [385, 70], [418, 180], [440, 285], [498, 362], [506, 420], [478, 480], [468, 570],
    [455, 660], [425, 740], [360, 790], [280, 812], [180, 798], [60, 745], [-30, 600], [-40, 300], [30, 40]].map(([x, y]) => [(x - 300) * PS, (y - 430) * PS]);
  const headD = smoothClosed(OUTLINE);
  el('path', { d: headD, fill: '#2b1d16' }, hd);
  el('path', { d: headD }, el('clipPath', { id: 'peekClip' }, hd));
  el('image', { href: src, x: -145, y: -208, width: 250, height: 415, preserveAspectRatio: 'none', 'clip-path': 'url(#peekClip)' }, hd);
  el('path', { d: headD, fill: 'none', stroke: INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, hd);

  // arm: jacket sleeve + a fist with the index finger up (drawn at the wrist, finger toward -y)
  const sleeve = [el('path', { fill: 'none', stroke: INK, 'stroke-width': 56, 'stroke-linecap': 'round' }, arm),
                  el('path', { fill: 'none', stroke: '#1e2742', 'stroke-width': 46, 'stroke-linecap': 'round' }, arm)];
  const hand = el('g', {}, arm);
  el('rect', { x: -22, y: -112, width: 19, height: 84, rx: 9.5, fill: SKIN, stroke: SKL, 'stroke-width': 4 }, hand);
  el('rect', { x: -18, y: -107, width: 11, height: 13, rx: 5, fill: '#f7d2b8' }, hand);
  el('rect', { x: -26, y: -46, width: 50, height: 52, rx: 16, fill: SKIN, stroke: SKL, 'stroke-width': 4 }, hand);
  for (const y of [-34, -18, -2]) el('rect', { x: 8, y: y - 8, width: 24, height: 16, rx: 8, fill: SKIN, stroke: SKL, 'stroke-width': 4 }, hand);   // curled fingers
  el('rect', { x: -24, y: -22, width: 36, height: 15, rx: 7.5, transform: 'rotate(-12 -6 -14)', fill: SKIN, stroke: SKL, 'stroke-width': 4 }, hand);   // thumb across the front

  const p = { on: false, t: 0, dir: 1, y: 0, said: false, hx: 0, hy: 0, rot: 0, line: '', stay: 0 };
  p.start = () => {
    if (p.on) return;
    let line; do line = pick(lines); while (line === p.line && lines.length > 1);
    const stay = clamp(1.6 + line.length * 0.055, 3, 5.5);   // longer lines stay up longer
    Object.assign(p, { on: true, t: 0, said: false, dir: Math.random() < 0.5 ? 1 : -1, y: rand(430, 590), line, stay });
    side.setAttribute('transform', p.dir > 0 ? '' : 'translate(1920 0) scale(-1 1)');
    root.style.display = '';
  };
  p.top = () => ({ x: p.dir > 0 ? p.hx : 1920 - p.hx, y: p.hy - 200 });
  p.update = dt => {
    if (!p.on) return;
    const t = p.t += dt;
    if (t > 0.8 && !p.said) { p.said = true; peekBubble.say(p, p.line, p.stay); }
    const out = 0.8 + p.stay + 0.3;   // ducks out right after the bubble
    const h = backOut(clamp(t / 0.7, 0, 1)) * (1 - smooth(out, out + 0.7, t));                  // head: 0 hidden … 1 peeking
    const a = backOut(clamp((t - 0.35) / 0.6, 0, 1)) * (1 - smooth(out - 0.3, out + 0.3, t));         // hand, a beat behind
    p.hx = lerp(-200, 70, h); p.hy = p.y + Math.sin(t * 2.1) * 5; p.rot = 14 * h + Math.sin(t * 1.7) * 3;
    hd.setAttribute('transform', `translate(${f(p.hx)} ${f(p.hy)}) rotate(${f(p.rot)})`);
    const ax = lerp(-110, 205, a), ay = p.y + 125;
    for (const e of sleeve) e.setAttribute('d', `M-90 ${f(p.y + 270)}Q${f(ax * 0.35)} ${f(p.y + 200)} ${f(ax - 4)} ${f(ay + 14)}`);
    hand.setAttribute('transform', `translate(${f(ax)} ${f(ay)}) rotate(-10)`);
    if (t > out + 0.8) { p.on = false; root.style.display = 'none'; }
  };
  return p;
}

const PEEK = makePeek('assets/images/cxaduri-head.jpg', PEEK_LINES);
const peekBubble = bubble($('say2'));   // cxaduri talks in #say2
let nextPeek = PEEK_EVERY;
function peekNow() { PEEK.start(); nextPeek = T + PEEK_EVERY; }
addFeature({
  update(dt, rem) {
    if (T > nextPeek && !heroTime(rem)) peekNow();
    PEEK.update(dt);
    peekBubble.update(dt);
  },
  keys: { x: peekNow, X: peekNow, KeyX: peekNow },
});

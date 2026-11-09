'use strict';
// ───────────────────────── night sky, city, gloom
const starsG = $('stars'), STARS = [];
for (let i = 0; i < 70; i++) STARS.push(el('circle', { cx: f(rand(0, 1920)), cy: f(rand(0, 640)), r: f(rand(0.7, 2.1)), opacity: f(rand(0.25, 1)) }, starsG));

const beamsG = $('beams');
const BEAMS = [
  { x: 430, y: 905, a0: -18, amp: 26, sp: 0.21, ph: 0 },
  { x: 1520, y: 905, a0: 16, amp: 24, sp: 0.29, ph: 2.1 },
  { x: 980, y: 905, a0: 0, amp: 36, sp: 0.16, ph: 4 }
].map(b => ({ ...b, e: el('polygon', { points: '-6,0 -90,-1400 90,-1400 6,0', fill: 'url(#beamG)' }, beamsG) }));

function cloudShape(parent) {
  const g = el('g', {}, parent);
  [[-60, 10, 38], [-20, -12, 48], [30, -16, 44], [70, 6, 34], [0, 14, 40]].forEach(([cx, cy, r]) => el('circle', { cx, cy, r }, g));
  el('rect', { x: -95, y: 4, width: 190, height: 44, rx: 22 }, g);
  return g;
}
const cloudsG = $('clouds');
const NCLOUDS = [
  { x: 420, y: 230, s: 1.3, v: 1 }, { x: 1180, y: 110, s: 1.0, v: 0.7 }, { x: 1520, y: 300, s: 1.4, v: 1.2 },
  { x: 860, y: 360, s: 1.1, v: 0.9 }
].map(c => ({ ...c, g: cloudShape(cloudsG) }));

const batsG = $('bats');
const BATS = [0, 1, 2].map(() => ({ x: rand(0, 1920), y: rand(150, 560), v: rand(90, 180) * (Math.random() < 0.5 ? -1 : 1), ph: rand(0, 6), s: rand(0.8, 1.4), e: el('path', {}, batsG) }));

const storm = $('storm'), stormFront = $('stormFront');
const stormMain = el('g', {}, storm), stormUnder = el('g', {}, storm);
el('rect', { x: 150, y: -500, width: 2200, height: 530 }, stormMain);
[[150, -40, 140], [90, -170, 130], [190, 40, 95]].forEach(([cx, cy, r]) => el('circle', { cx, cy, r }, stormMain));
for (let i = 0; i < 17; i++) {
  const cx = 260 + i * 125 + rand(-20, 20);
  el('circle', { cx: f(cx), cy: f(30 + rand(-15, 25)), r: f(rand(60, 95)) }, stormMain);
  el('circle', { cx: f(cx + rand(-30, 30)), cy: f(88 + rand(-10, 18)), r: f(rand(40, 62)) }, stormUnder);
  el('circle', { cx: f(cx + rand(-40, 40)), cy: f(rand(70, 150)), r: f(rand(45, 80)) }, stormFront);
}
el('circle', { cx: 200, cy: 100, r: 55 }, stormUnder);

const vultG = $('vultures');
const VULTS = [0, 1, 2].map(i => {
  const g = el('g', {}, vultG);
  const w = el('path', { fill: 'none', stroke: '#050305', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  el('ellipse', { cx: 0, cy: 3, rx: 9, ry: 6, fill: '#050305' }, g);
  el('circle', { cx: 0, cy: 10, r: 4.5, fill: '#8a3a30' }, g);
  return { g, w, ph: i * 2.094 };
});

// city skyline; windows are one path + some flickering ones
const skyline = $('skyline');
const farG = el('g', {}, skyline), nearG = el('g', {}, skyline), winG = el('g', {}, skyline), winPath = el('path', {}, winG);
const WIN = [];
{
  let x = -200, d = '';
  while (x < 2120) { const w = rand(70, 150), top = rand(600, 720); el('rect', { x: f(x), y: f(top), width: f(w), height: f(905 - top) }, farG); x += w + rand(-10, 20); }
  x = -200;
  while (x < 2120) {
    const w = rand(80, 170), top = rand(680, 800);
    el('rect', { x: f(x), y: f(top), width: f(w), height: f(905 - top) }, nearG);
    if (Math.random() < 0.3) { el('rect', { x: f(x + w / 2 - 2), y: f(top - 38), width: 4, height: 38 }, nearG); }
    for (let wx = x + 12; wx < x + w - 18; wx += 24)
      for (let wy = top + 14; wy < 860; wy += 30) {
        if (Math.random() < 0.45) continue;                       // lots of dark windows at night
        if (WIN.length < 30 && wx > -200 && wx < 2100 && Math.random() < 0.3) WIN.push(el('rect', { x: f(wx), y: f(wy), width: 11, height: 15, rx: 1.5 }, winG));
        else d += `M${f(wx)} ${f(wy)}h11v15h-11z`;
      }
    x += w + rand(0, 25);
  }
  winPath.setAttribute('d', d);
}

const fogG = $('fog');
const FOGS = [];
for (let i = 0; i < 4; i++) FOGS.push({ x: -600 + i * 700 + rand(-60, 60), y: rand(838, 878), rx: rand(480, 680), ry: rand(45, 75), v: rand(6, 16), e: el('ellipse', { fill: 'url(#fogG)' }, fogG) });

const weedsG = $('weeds'), WEEDS = [];
for (let x = -40; x < 1960; x += rand(100, 220)) {
  if (x > 840 && x < 1080) continue;
  const g = el('g', {}, weedsG);
  for (let k = 0; k < 3; k++) {
    const h = rand(18, 42), dx = rand(-8, 8);
    el('path', { d: `M${f(x + dx)} 888 Q${f(x + dx + rand(-6, 6))} ${f(888 - h * 0.6)} ${f(x + dx + rand(-12, 12))} ${f(888 - h)}`, stroke: '#3a3222', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, g);
  }
  WEEDS.push({ g, x, ph: rand(0, 6) });
}
const TREE_PTS = [[1700, 780], [1700, 700], [1620, 682], [1590, 622], [1608, 706], [1792, 642], [1830, 602], [1766, 614], [1712, 570], [1716, 530]];

const CRACKS = [
  ['M960 904 L932 938 L948 972 L906 1018 L922 1080', 0.05, 0.4],
  ['M962 904 L1000 950 L986 990 L1040 1040 L1030 1080', 0.08, 0.45],
  ['M944 922 L860 935 L800 925 L700 960 L610 950 L520 990', 0.25, 0.62],
  ['M990 926 L1080 920 L1150 950 L1260 940 L1340 975 L1450 965', 0.28, 0.65],
  ['M700 960 L660 1010 L600 1040 L560 1080', 0.45, 0.8],
  ['M1260 940 L1300 1000 L1380 1030 L1420 1080', 0.48, 0.82],
  ['M520 990 L400 980 L300 1010 L180 990 L60 1030 L-10 1020', 0.6, 0.95],
  ['M1450 965 L1560 990 L1680 970 L1800 1010 L1930 995', 0.62, 0.96]
].map(([d, a, b]) => ({
  a, b,
  g: el('path', { d, pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 }, $('crackGlow')),
  p: el('path', { d, pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 }, $('cracks'))
}));

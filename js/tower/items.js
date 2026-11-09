'use strict';
// ───────────────────────── item builders (all drawn centered on 0,0; return [w,h])
let LIVE = true;   // false while building loose copies that fall from the sky
const LEDS = [], SPIN = [], TERM = [], GRAPHS = [], QUEUES = [], PHONES = [], SANDS = [], UPSB = [];
function led(g, cx, cy, r) {
  const e = el('circle', { cx, cy, r, fill: Math.random() < 0.8 ? '#3dff7a' : '#ff3b30' }, g);
  if (LIVE) LEDS.push(e);
  return e;
}
function bRack(g, o) {
  const w = o.w || 190, h = o.h || 130;
  R(g, -w / 2, -h / 2, w, h, 8, '#2c3340', '#10141b', 4);
  const units = h > 115 ? 4 : 3, pad = 8, gap = 5, uh = (h - pad * 2 - (units - 1) * gap) / units;
  for (let i = 0; i < units; i++) {
    const y = -h / 2 + pad + i * (uh + gap);
    R(g, -w / 2 + 8, y, w - 16, uh, 3, '#3c4657');
    for (let k = 0; k < 3; k++) led(g, -w / 2 + 22 + k * 13, y + uh / 2, 4.2);
    let d = ''; for (let x = -w / 2 + 72; x < w / 2 - 14; x += 11) d += `M${f(x)} ${f(y + 7)}V${f(y + uh - 7)}`;
    el('path', { d, stroke: '#262d39', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
  }
  return [w, h];
}
function bDb(g, o) {
  const s = o.s || 1, k = el('g', { transform: `scale(${s})` }, g);
  el('path', { d: 'M-98 -40 V40 A98 15 0 0 0 98 40 V-40 Z', fill: '#3f73c7', stroke: '#1d3a6b', 'stroke-width': 4, 'stroke-linejoin': 'round' }, k);
  el('path', { d: 'M-98 -13 A98 15 0 0 0 98 -13 M-98 14 A98 15 0 0 0 98 14', fill: 'none', stroke: '#1d3a6b', 'stroke-width': 3.5 }, k);
  el('ellipse', { cx: 0, cy: -40, rx: 98, ry: 15, fill: '#7aa8f0', stroke: '#1d3a6b', 'stroke-width': 4 }, k);
  for (const [x, y] of [[72, 1], [72, 28], [58, 1], [58, 28]]) led(k, x, y, 4.5);
  return [196 * s, 110 * s];
}
function bFans(g) {
  R(g, -75, -55, 150, 110, 9, '#454f60', '#141921', 4);
  for (const cx of [-36, 36]) {
    el('circle', { cx, cy: -6, r: 29, fill: '#232934', stroke: '#11151c', 'stroke-width': 3 }, g);
    const b = el('g', { transform: `translate(${cx} -6)`, fill: '#8f9bad' }, g);
    for (let i = 0; i < 4; i++) el('path', { d: 'M0 0 C8 -10 22 -10 25 -2 C16 2 8 3 0 0Z', transform: `rotate(${i * 90})` }, b);
    el('circle', { r: 6, fill: '#c7cfdb' }, b);
    if (LIVE) SPIN.push({ e: b, x: cx, y: -6, sp: cx < 0 ? 1 : -1.1, a: rand(0, 360) });
  }
  R(g, -62, 33, 104, 9, 3, '#2a313d'); led(g, 58, 38, 4.5);
  return [150, 110];
}
const CABLE_ENDS = [[-168, 150], [152, 155], [88, 125]];
function bSwitch(g) {
  for (const [d, c] of [['M-130 10 C-175 40 -195 95 -168 150', '#ffcc33'], ['M125 10 C170 45 182 100 152 155', '#3aa0ff'], ['M70 12 C95 50 60 85 88 125', '#ff5a5a']])
    el('path', { d, stroke: c, 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, g);
  R(g, -160, -18, 320, 36, 5, '#3b4757', '#141a22', 4);
  let d = ''; for (let i = 0; i < 10; i++) { const x = -128 + i * 24; d += `M${x} -5h15v13h-15z`; led(g, x + 7.5, -11, 2.8); }
  el('path', { d, fill: '#10141a' }, g);
  return [320, 36];
}
function bCloud(g) {
  const o = el('g', { fill: '#5d9ad6' }, g), w = el('g', { fill: '#ffffff' }, g);
  for (const [cx, cy, r] of [[-30, -1, 46], [32, -7, 40], [-82, 15, 32], [86, 17, 30]]) { el('circle', { cx, cy, r: r + 6 }, o); el('circle', { cx, cy, r }, w); }
  R(o, -124, 1, 248, 52, 26); R(w, -118, 7, 236, 40, 20);
  el('path', { d: 'M0 30 V-12 M-17 4 L0 -13 L17 4', stroke: '#5d9ad6', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  return [248, 100];
}
function bDuck(g) {
  el('path', { d: 'M22 2 L34 -9 L29 9 Z', fill: '#ffd23f', stroke: '#c99a12', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
  el('ellipse', { cx: 4, cy: 8, rx: 25, ry: 14, fill: '#ffd23f', stroke: '#c99a12', 'stroke-width': 3 }, g);
  el('circle', { cx: -10, cy: -9, r: 12.5, fill: '#ffd23f', stroke: '#c99a12', 'stroke-width': 3 }, g);
  el('path', { d: 'M-21 -10 L-34 -5 L-21 -1 Z', fill: '#ff8c1a', stroke: '#c96a00', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
  el('circle', { cx: -13, cy: -12, r: 2.7, fill: '#1d1d1d' }, g);
  el('path', { d: 'M-3 6 Q7 15 17 6', fill: 'none', stroke: '#e0b11c', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
  return [60, 44];
}
function bMug(g) {
  el('path', { d: 'M14 -12 C31 -12 31 14 14 14', fill: 'none', stroke: '#4f5666', 'stroke-width': 6 }, g);
  R(g, -20, -26, 36, 54, 6, '#fafafa', '#4f5666', 3.5);
  el('ellipse', { cx: -2, cy: -22, rx: 14, ry: 3.5, fill: '#6b3e1f' }, g);
  el('path', { d: 'M-2 12 C-13 3 -11 -7 -2 -2 C7 -7 9 3 -2 12Z', fill: '#ff5a6e' }, g);
  return [50, 56];
}
function bUps(g) {
  R(g, -31, -25, 62, 50, 7, '#dfe3ea', '#4b5263', 3.5);
  R(g, -21, -11, 36, 22, 3, '#ffffff', '#4b5263', 3); R(g, 15, -5, 5, 10, 1, '#4b5263');
  const bars = [-18, -10, -2, 6].map(x => R(g, x, -8, 6.5, 16, 1, '#3ddc6a'));
  if (LIVE) UPSB.push(...bars);
  return [62, 50];
}
function bLaptop(g) {
  R(g, -70, -50, 140, 84, 6, '#2b2f3a', '#11141a', 4);
  R(g, -62, -43, 124, 66, 2, '#0f1a14');
  const cols = ['#3dff7a', '#59b7ff', '#ff7eb6', '#ffd84a', '#3dff7a'];
  for (let i = 0; i < 5; i++) { const c = cols[i], b = R(g, -54 + (i % 2) * 10, -36 + i * 12, rand(40, 90), 6, 2, c); if (LIVE) TERM.push({ e: b, c }); }
  el('path', { d: 'M-80 34 L80 34 L72 50 L-72 50 Z', fill: '#c9ced8', stroke: '#6b7282', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
  return [160, 100];
}
function graphD(d) {
  let s = '';
  for (let i = 0; i <= 10; i++) {
    const x = -68 + i * 13.6, base = 10 - i * 4 * (1 - d) + i * i * 0.45 * d;
    s += (i ? 'L' : 'M') + f(x) + ' ' + f(clamp(base + rand(-1, 1) * (4 + 26 * d), -50, 26));
  }
  return s;
}
function bMonitor(g) {
  R(g, -12, 38, 24, 16, 0, '#6b7282'); R(g, -42, 52, 84, 11, 5, '#6b7282', '#3f4552', 2.5);
  R(g, -85, -65, 170, 105, 7, '#2b2f3a', '#11141a', 4);
  R(g, -76, -56, 152, 87, 2, '#0e1420');
  el('path', { d: 'M-70 -34H70 M-70 -12H70 M-70 10H70', stroke: '#1f2a3a', 'stroke-width': 2 }, g);
  const p = el('path', { d: graphD(LIVE ? 0 : 1), fill: 'none', stroke: LIVE ? '#3dff7a' : '#ff3b30', 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
  if (LIVE) GRAPHS.push(p);
  return [170, 130];
}
const CONT_COLORS = ['#2f7fd6', '#e8742c', '#2fae6a', '#8a5cd6', '#d64545'];
function bContainer(g, o) {
  R(g, -110, -36, 220, 72, 4, o.c || pick(CONT_COLORS), '#1c2430', 4);
  let d = ''; for (let x = -96; x <= 70; x += 14) d += `M${x} -28V28`;
  el('path', { d, stroke: 'rgba(0,0,0,0.22)', 'stroke-width': 4 }, g);
  el('path', { d: 'M84 -30V30 M98 -30V30', stroke: 'rgba(0,0,0,0.35)', 'stroke-width': 4 }, g);
  return [220, 72];
}
function bWheel(g) {
  const k = el('g', {}, g);
  for (let i = 0; i < 7; i++) {
    const a = i * 360 / 7 * DEG, x = f(Math.cos(a) * 42), y = f(Math.sin(a) * 42);
    el('line', { x1: 0, y1: 0, x2: x, y2: y, stroke: '#326ce5', 'stroke-width': 7, 'stroke-linecap': 'round' }, k);
    el('circle', { cx: x, cy: y, r: 6.5, fill: '#326ce5' }, k);
  }
  el('circle', { r: 30, fill: 'none', stroke: '#326ce5', 'stroke-width': 8 }, k);
  el('circle', { r: 10, fill: '#ffffff', stroke: '#326ce5', 'stroke-width': 5 }, k);
  if (LIVE) SPIN.push({ e: k, x: 0, y: 0, sp: 0.25, a: 0 });
  return [97, 97];
}
function bRouter(g) {
  el('path', { d: 'M-45 -6 L-60 -31 M0 -6 V-31 M45 -6 L60 -31', stroke: '#4b5263', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
  R(g, -70, -6, 140, 37, 8, '#e9ecf1', '#4b5263', 3.5);
  for (let i = 0; i < 5; i++) led(g, -44 + i * 18, 13, 4);
  return [140, 62];
}
function bHdd(g) {
  R(g, -75, -17, 150, 34, 6, '#b8c0cc', '#535b6a', 3.5); R(g, -60, -4, 80, 8, 3, '#7d8696'); led(g, 58, 0, 4);
  return [150, 34];
}
function bPizza(g) {
  [-6, 5, -2].forEach((off, i) => R(g, -85 + off, -21 + i * 14, 170, 14, 2, '#d9a35f', '#8a5a24', 2.5));
  el('circle', { cx: 30, cy: -14, r: 3, fill: '#b7783a' }, g); el('circle', { cx: -40, cy: 1, r: 2.5, fill: '#b7783a' }, g);
  return [176, 42];
}
function bButton(g) {
  R(g, -45, 0.5, 90, 27, 6, '#3b4351', '#1b1f27', 3);
  el('path', { d: 'M-30 0.5 A30 28 0 0 1 30 0.5 Z', fill: '#ff3b30', stroke: '#9b1c15', 'stroke-width': 3 }, g);
  el('ellipse', { cx: -10, cy: -15, rx: 8, ry: 5, fill: '#ff9a90', opacity: 0.8 }, g);
  return [90, 55];
}
function bGear(g) {
  const pts = [], n = 10;
  for (let i = 0; i < n * 4; i++) { const a = i * Math.PI * 2 / (n * 4), r = [45, 45, 35, 35][i % 4]; pts.push(f(Math.cos(a) * r) + ',' + f(Math.sin(a) * r)); }
  const k = el('g', {}, g);
  el('polygon', { points: pts.join(' '), fill: '#9aa3b2', stroke: '#4b5263', 'stroke-width': 4, 'stroke-linejoin': 'round' }, k);
  el('circle', { r: 13, fill: '#2b2f3a' }, k);
  if (LIVE) SPIN.push({ e: k, x: 0, y: 0, sp: -0.4, a: 0 });
  return [90, 90];
}
function bLock(g) {
  el('path', { d: 'M-18 -6 V-22 A18 18 0 0 1 18 -22 V-6', stroke: '#8a8f9a', 'stroke-width': 9, fill: 'none' }, g);
  R(g, -30, -8, 60, 48, 8, '#f2c230', '#a77f10', 3.5);
  el('circle', { cx: 0, cy: 10, r: 7, fill: '#3a2f12' }, g); R(g, -3, 12, 6, 14, 2, '#3a2f12');
  return [60, 80];
}
function bQueue(g) {
  R(g, -110, -30, 220, 60, 30, '#d9eefc', '#5d8fb8', 4);
  const envs = [];
  for (let i = 0; i < 5; i++) {
    const e = el('g', { transform: `translate(${-72 + i * 36} 0)` }, g);
    R(e, -15, -11, 30, 22, 3, '#ffffff', '#5d8fb8', 2.5);
    el('path', { d: 'M-15 -10 L0 2 L15 -10', fill: 'none', stroke: '#5d8fb8', 'stroke-width': 2.5 }, e);
    envs.push(e);
  }
  el('path', { d: 'M-86 -19 H86', stroke: 'rgba(255,255,255,0.75)', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
  if (LIVE) QUEUES.push({ envs, off: rand(0, 180) });
  return [220, 60];
}
function bPhone(g) {
  const waves = el('path', { d: 'M-36 -16 Q-42 0 -36 16 M36 -16 Q42 0 36 16 M-46 -24 Q-54 0 -46 24 M46 -24 Q54 0 46 24', fill: 'none', stroke: '#ff3b30', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0 }, g);
  const k = el('g', {}, g);
  R(k, -26, -44, 52, 88, 9, '#22252b', '#0d0f12', 3);
  const sc = R(k, -20, -34, 40, 62, 3, LIVE ? '#3a7bd5' : '#ff3b30');
  el('circle', { cx: 0, cy: 36, r: 3.5, fill: '#555b66' }, k);
  if (LIVE) PHONES.push({ k, sc, waves, ring: 0 });
  return [52, 88];
}
function setSand(hs, p) {
  const t = 1 - p, yt = -2 - 33 * t, wt = 4 + 18 * (-yt / 37), wn = 4 + 18 * (2 / 37), hb = 30 * p;
  hs.top.setAttribute('d', t > 0.03 ? `M${f(-wt)} ${f(yt)} L${f(wt)} ${f(yt)} L${f(wn)} -2 L${f(-wn)} -2 Z` : '');
  hs.bot.setAttribute('d', p > 0.03 ? `M-20 35 L20 35 L${f(4 + 10 * (1 - p))} ${f(35 - hb)} L${f(-4 - 10 * (1 - p))} ${f(35 - hb)} Z` : '');
}
function bHourglass(g) {
  el('path', { d: 'M-22 -37 L22 -37 L4 0 L22 37 L-22 37 L-4 0 Z', fill: '#e8f4fb', stroke: '#6b7282', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
  const hs = { top: el('path', { fill: '#f2c46d' }, g), bot: el('path', { fill: '#f2c46d' }, g) };
  R(g, -30, -45, 60, 8, 3, '#8d5c30'); R(g, -30, 37, 60, 8, 3, '#8d5c30');
  setSand(hs, LIVE ? 0 : 0.9); if (LIVE) SANDS.push(hs);
  return [60, 90];
}
function bKeyboard(g) {
  R(g, -105, -17, 210, 34, 6, '#3a3f4b', '#14171c', 3);
  let d = ''; for (let r = 0; r < 3; r++) for (let c = 0; c < 14; c++) d += `M${f(-96 + c * 13.6)} ${-11 + r * 9}h10v6.5h-10z`;
  el('path', { d, fill: '#5d6475' }, g);
  return [210, 34];
}
function bCache(g) {
  R(g, -46, -36, 92, 72, 10, '#ffcf33', '#a3800c', 4);
  el('path', { d: 'M6 -26 L-14 4 L0 4 L-6 26 L16 -6 L2 -6 Z', fill: '#2b2f3a', 'stroke-linejoin': 'round' }, g);
  return [92, 72];
}
const BUILD = { rack: bRack, db: bDb, fans: bFans, switch: bSwitch, cloud: bCloud, duck: bDuck, mug: bMug, ups: bUps, laptop: bLaptop, monitor: bMonitor,
  container: bContainer, wheel: bWheel, router: bRouter, hdd: bHdd, pizza: bPizza, button: bButton, gear: bGear, lock: bLock, queue: bQueue,
  phone: bPhone, hourglass: bHourglass, keyboard: bKeyboard, cache: bCache };
const ELEC = new Set(['rack', 'db', 'fans', 'switch', 'ups', 'laptop', 'monitor', 'router', 'hdd', 'phone', 'button']);
const DROP_TYPES = ['rack', 'db', 'fans', 'laptop', 'monitor', 'container', 'wheel', 'router', 'hdd', 'pizza', 'button', 'gear', 'lock',
  'phone', 'hourglass', 'keyboard', 'cache', 'mug', 'queue', 'duck', 'container', 'rack', 'monitor', 'ups'];

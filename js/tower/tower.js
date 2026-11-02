'use strict';
// ───────────────────────── the tower (bottom → top)
const ROWS = [
  [['mug'], ['rack'], ['rack', { w: 186 }], ['ups']],
  [['db'], ['fans']],
  [['switch']],
  [['container', { c: '#2f7fd6' }]],
  [['laptop'], ['router']],
  [['monitor'], ['cache']],
  [['pizza']],
  [['rack', { w: 170, h: 110 }], ['wheel']],
  [['queue']],
  [['hdd'], ['hdd']],
  [['container', { c: '#e8742c' }]],
  [['gear'], ['lock'], ['phone']],
  [['keyboard']],
  [['db', { s: 0.8 }], ['fans']],
  [['switch']],
  [['monitor'], ['laptop']],
  [['container', { c: '#2fae6a' }]],
  [['button'], ['hourglass'], ['router']],
  [['rack', { w: 200, h: 120 }]],
  [['pizza']],
  [['container', { c: '#8a5cd6' }]],
  [['phone'], ['monitor'], ['mug']],
  [['queue']],
  [['keyboard']],
  [['db', { s: 0.9 }]],
  [['cache'], ['gear']],
  [['switch']],
  [['cloud']],
  [['duck']]
];
const towerG = $('tower'), plankEl = $('plank'), dropsG = $('drops');
const ROWG = [], ITEMS = [];
let TOWER_H = 0;
ROWS.forEach((spec, ri) => {
  const g = el('g', {}, towerG);
  const parts = spec.map(([type, o]) => { const ig = el('g', {}, g); const [w, h] = BUILD[type](ig, o || {}); return { type, el: ig, w, h }; });
  const H = Math.max(...parts.map(p => p.h)), gap = 12;
  const total = parts.reduce((s, p) => s + p.w, 0) + gap * (parts.length - 1);
  const jx = ri === 0 ? 0 : rand(-30, 30);
  const row = { g, h: H, halfW: total / 2, jx, fq: rand(1.2, 2.2), ph: rand(0, 6), cx: 960, cy: 0, th: 0, mid: TOWER_H + H / 2 };
  let x = -total / 2 + jx;
  for (const p of parts) {
    p.x = x + p.w / 2; p.y = H / 2 - p.h / 2; p.a = ri === 0 ? 0 : rand(-2.5, 2.5); p.dx = 0; p.row = row;
    p.tf = `translate(${f(p.x)} ${f(p.y)}) rotate(${p.a.toFixed(2)})`;
    p.el.setAttribute('transform', p.tf);
    ITEMS.push(p); x += p.w + gap;
  }
  ROWG.push(row); TOWER_H += H;
});
const MUG = ITEMS.find(i => i.type === 'mug'), DUCK = ITEMS[ITEMS.length - 1];
const RACKS0 = ITEMS.filter(i => i.row === ROWG[0] && i.type === 'rack');
const SWITCHES = ITEMS.filter(i => i.type === 'switch');
const HOT = [ITEMS.find(i => i.type === 'cache'), ITEMS.find(i => i.type === 'container' && i.row === ROWG[10]), ITEMS.find(i => i.type === 'rack' && i.row === ROWG[18]), RACKS0[1]].filter(Boolean);
// lite: keep only the tower rows that can reach the screen (row bottom at rest below y = -60;
// even at full sway the next row up stays above the top edge)
if (LITE) {
  const n = ROWG.filter(r => PIV.y - 18 - (r.mid - r.h / 2) > -60).length;
  for (const r of ROWG.slice(n)) r.g.remove();
  ROWG.length = n;
  const alive = o => o.isConnected ?? (o.e || o.k || o.top || (o.envs && o.envs[0]) || o.el).isConnected;
  for (const arr of [ITEMS, HOT, SWITCHES, LEDS, SPIN, TERM, GRAPHS, QUEUES, PHONES, SANDS, UPSB]) {
    const k = arr.filter(alive); arr.length = 0; arr.push(...k);
  }
}

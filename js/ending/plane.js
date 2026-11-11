'use strict';
// ───────────────────────── the plane, with him leaning out of a window, waving.
// start('takeoff'): at the ending it climbs out from behind the city on the right and flies away over the top left.
// start('flyby'):   afterwards (every 2 min) it just crosses the sky right → left, level, high up — never comes down.
const PLANE = (() => {
  const g = el('g', { id: 'plane' }, $('skyL'));
  g.style.display = 'none';
  const body = el('g', {}, g);   // drawn facing left (nose at -x), centered on the fuselage
  const LINE = '#4f5d72', WHITE = '#f4f6fa', BLUE = '#2f6fd6', GREY = '#c9d1de';
  const ln = { stroke: LINE, 'stroke-width': 4, 'stroke-linejoin': 'round' };
  el('path', { d: 'M-10 -30L50 -92H84L56 -30Z', fill: '#aeb8c8', ...ln }, body);                    // far wing
  el('path', { d: 'M160 -40L214 -136H258L246 -44Z', fill: BLUE, ...ln }, body);                     // tail fin
  el('path', { d: 'M-250 -6C-250 -36 -214 -46 -172 -46H192L262 -56L268 -46L236 22C230 32 218 36 202 36H-172C-218 36 -250 22 -250 -6Z', fill: WHITE, ...ln }, body);
  R(body, -236, 4, 466, 12, 6, BLUE);                                                                 // stripe
  el('path', { d: 'M-238 -20Q-228 -36 -202 -38L-196 -20Z', fill: '#26457a', ...ln, 'stroke-width': 3 }, body);   // cockpit
  for (let x = -150; x <= 170; x += 30) if (x < -140 || x > -70) el('ellipse', { cx: x, cy: -18, rx: 7, ry: 9, fill: '#bfe2ff', stroke: LINE, 'stroke-width': 2.5 }, body);
  el('ellipse', { cx: 222, cy: -36, rx: 46, ry: 9, transform: 'rotate(-8 222 -36)', fill: GREY, ...ln, 'stroke-width': 3 }, body);   // stabilizer

  // him, leaning out of an open window: head above the roof line, one arm waving
  el('ellipse', { cx: -105, cy: -16, rx: 24, ry: 22, fill: '#1c2433', stroke: LINE, 'stroke-width': 3 }, body);
  const arm = el('path', { fill: 'none', stroke: '#5f7f9c', 'stroke-width': 17, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, body);
  const armIn = el('path', { fill: 'none', stroke: '#a9c4da', 'stroke-width': 11, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, body);
  const hand = el('circle', { r: 10, fill: '#eab08b', stroke: '#a8714f', 'stroke-width': 3 }, body);
  const head = el('g', { transform: 'translate(-112 -62) rotate(-12) scale(0.4)' }, body);
  el('ellipse', { rx: 91, ry: 125, fill: '#2b2019' }, head);
  el('use', { href: '#faceImg', 'clip-path': 'url(#faceClip)' }, head);

  el('path', { d: 'M-40 8L60 84H104L56 6Z', fill: GREY, ...ln }, body);                              // near wing
  R(body, 10, 40, 74, 28, 14, '#dfe5ee', LINE, 3);                                                    // engine
  el('ellipse', { cx: 12, cy: 54, rx: 6, ry: 12, fill: '#3a4456' }, body);

  const FLY = { takeoff: 9.5, flyby: 11 };   // seconds across the sky
  const p = { t: -1, mode: 'takeoff', y0: 0 };
  p.start = (mode = 'takeoff') => { p.t = 0; p.mode = mode; p.y0 = rand(130, 230); g.style.display = ''; };
  p.flying = () => p.t >= 0;
  p.reset = () => { p.t = -1; g.style.display = 'none'; };
  p.update = dt => {
    if (p.t < 0) return;
    p.t += dt;
    const u = p.t / FLY[p.mode];
    if (u >= 1) { p.reset(); return; }
    const by = p.mode === 'flyby';
    const x = lerp(2250, -760, u);
    const y = by ? p.y0 + Math.sin(p.t * 1.3) * 6 : lerp(800, 60, smooth(0, 1, u * 1.15));
    const rot = by ? Math.sin(p.t * 1.3 + 1) * 1.5 : lerp(13, 4, u), sc = by ? 0.75 : lerp(1, 0.6, u);
    g.setAttribute('transform', `translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${sc.toFixed(3)})`);
    const w = Math.sin(T * 9) * 16, hx = -78 + w, hy = -108 + Math.abs(w) * 0.2;
    const d = `M-96 -22L-74 -64L${f(hx)} ${f(hy)}`;
    arm.setAttribute('d', d); armIn.setAttribute('d', d);
    hand.setAttribute('cx', f(hx)); hand.setAttribute('cy', f(hy));
    // contrail from the tail, once it's above the rooftops
    const r = rot * DEG, tx = x + (250 * Math.cos(r) + 10 * Math.sin(r)) * sc, ty = y + (250 * Math.sin(r) - 10 * Math.cos(r)) * sc;
    if (ty < 640) emitN(16 * dt, () => add({ k: 'smoke', x: tx + rand(-6, 6), y: ty + rand(-6, 6), vx: rand(10, 40), vy: rand(-8, 8), r: 9 * sc, g: 16, a: 0.5, max: 2.2 }));
  };
  return p;
})();

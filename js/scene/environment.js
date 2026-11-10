'use strict';
// ───────────────────────── environment (night sky, storm, city, gloom, gadgets); SUN 0 → 1 turns it all into a sunny day after the ending
const mix3A = (a, b, c, t) => t < 0.5 ? mixA(a, b, t * 2) : mixA(b, c, (t - 0.5) * 2);
const toDay = (A, day, s) => { const B = rgb(day); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], s))).join(',')})`; };
function strike() {
  const left = Math.max(stormX + 150, 40);
  const x0 = rand(left, 1880), y1 = rand(640, 860);
  const main = [[x0 + rand(-80, 80), stormY + 90]];
  let x = main[0][0], y = main[0][1];
  while (y < y1) { y = Math.min(y1, y + rand(22, 55)); x += rand(-36, 36) + (x0 - x) * 0.18; main.push([x, y]); }
  const lines = [main];
  const bi = Math.floor(rand(2, Math.max(3, main.length - 3)));
  if (main[bi]) { let [bx, by] = main[bi]; const br = [[bx, by]], dir = Math.random() < 0.5 ? -1 : 1; for (let i = 0; i < 5; i++) { bx += dir * rand(15, 40); by += rand(15, 40); br.push([bx, by]); } lines.push(br); }
  add({ k: 'bolt', lines, max: 0.32 });
  flashA = Math.max(flashA, rand(0.3, 0.55)); stormFlick = 0.2; shake(3 + 6 * D); lampOff = Math.max(lampOff, 0.25);
}

function updateEnv(dt) {
  const chaos = state !== 'calm', S = SUN, N = 1 - S, DD = chaos ? 1 - S : D, broken = chaos && S < 0.5;
  wind = -(25 + 240 * D);

  put($('skyTop'), 'stop-color', toDay(mix3A('#070914', '#0d0817', '#0c0204', D), '#4f9fe6', S));
  put($('skyBot'), 'stop-color', toDay(mix3A('#1b2342', '#2f1630', '#5e140b', D), '#cfe9ff', S));

  // stars fade behind the storm, the moon turns blood red
  put(starsG, 'opacity', ((1 - smooth(0.2, 0.75, D)) * N).toFixed(2));
  const moonCol = mix('#e9edf5', '#b3241a', smooth(0.2, 0.9, D));
  put($('moonDisc'), 'fill', moonCol);
  put($('moonGlowStop'), 'stop-color', moonCol);
  put($('moon'), 'transform', `translate(330 ${f(200 + smooth(0.6, 1, D) * 60)})`);
  put($('moon'), 'opacity', N.toFixed(2));
  // …and in the morning the sun comes up on the right
  put(sunG, 'opacity', smooth(0, 0.35, S).toFixed(2));
  put(sunG, 'transform', `translate(1500 ${f(lerp(780, 200, smooth(0, 0.8, S)))})`);
  if (S > 0) put(sunRays, 'transform', `rotate(${f((T * 6) % 360)})`);

  // searchlights sweep the sky
  put($('beamStop'), 'stop-color', mix('#c9d7ff', '#ff5a4a', smooth(0.5, 1, DD)));
  put(beamsG, 'opacity', ((0.6 + 0.35 * DD) * N).toFixed(2));
  for (const b of BEAMS) put(b.e, 'transform', `translate(${b.x} ${b.y}) rotate(${f(b.a0 + b.amp * Math.sin(T * b.sp * (1 + DD * 2.2) + b.ph))})`);

  put(cloudsG, 'fill', toDay(mixA('#262838', '#1a1015', D), '#ffffff', S));
  put(cloudsG, 'opacity', 0.9);
  for (const c of NCLOUDS) {
    c.x -= (10 + 50 * D) * c.v * dt; if (c.x < -250) c.x += 2400;
    put(c.g, 'transform', `translate(${f(c.x)} ${c.y}) scale(${c.s})`);
  }

  put(batsG, 'opacity', N.toFixed(2));
  for (const b of BATS) {
    b.x += b.v * dt * (1 + D); if (b.x < -80) b.x = 2000; if (b.x > 2000) b.x = -80;
    const fl = Math.sin(T * 16 + b.ph) * 8;
    put(b.e, 'd', `M0 2 Q-8 -4 -14 ${f(-6 + fl)} Q-20 ${f(-4 + fl)} -28 ${f(-8 + fl)} Q-24 ${f(fl * 0.4)} -18 4 Q-12 2 -8 6 Q-4 2 0 6 Q4 2 8 6 Q12 2 18 4 Q24 ${f(fl * 0.4)} 28 ${f(-8 + fl)} Q20 ${f(-4 + fl)} 14 ${f(-6 + fl)} Q8 -4 0 2 Z`);
    put(b.e, 'transform', `translate(${f(b.x)} ${f(b.y + Math.sin(T * 2 + b.ph) * 25 + Math.sin(T * 7 + b.ph) * 6)}) scale(${b.s * (b.v < 0 ? -1 : 1)} ${b.s})`);
  }
  put(vultG, 'opacity', ((chaos ? 1 : smooth(0.5, 0.8, D)) * N).toFixed(2));
  if (chaos || D > 0.45) for (const v of VULTS) {
    const a = T * 0.45 + v.ph, x = 960 + Math.cos(a) * 320, y = (chaos ? 320 : 150) + Math.sin(a) * 70;
    const wy = -8 * Math.sin(T * 3 + v.ph) - 4;
    put(v.w, 'd', `M-36 ${f(wy)} Q-18 ${f(wy * 0.4 - 8)} 0 0 Q18 ${f(wy * 0.4 - 8)} 36 ${f(wy)}`);
    put(v.g, 'transform', `translate(${f(x)} ${f(y)}) scale(${Math.sin(a) > 0 ? 1 : -1} 1)`);
  }

  // city: power fails as it gets worse
  put(farG, 'fill', toDay(mixA('#151b2e', '#0d0a12', D), '#a7bad3', S));
  put(nearG, 'fill', toDay(mixA('#0b0f1c', '#060509', D), '#7d91ad', S));
  put(winG, 'opacity', N.toFixed(2));
  put(winG, 'fill', mix('#ffd27a', '#ff4a32', smooth(0.4, 1, DD)));
  winT -= dt;
  if (winT <= 0) {
    winT = 1.2;
    for (let i = 0; i < 4; i++) pick(WIN).setAttribute('opacity', Math.random() < 0.15 + DD * 0.6 ? 0.08 : 1);
    for (let i = 0; i < 3; i++) pick(STARS).setAttribute('opacity', f(rand(0.15, 1)));
    put(winPath, 'opacity', (chaos ? 0.12 : lerp(0.8, 0.18, smooth(0.2, 1, D)) * (Math.random() < 0.004 + D * 0.03 ? 0.3 : 1)).toFixed(2));
  }

  // the storm (already here, and spreading)
  stormX = chaos ? lerp(0, 2400, smooth(0, 0.6, S)) : (1 - smooth(0, 0.85, D)) * 900;   // after the ending it rolls away
  stormY = lerp(-30, 30, D);
  const stT = `translate(${f(stormX)} ${f(stormY)})`;
  put(storm, 'transform', stT); put(stormFront, 'transform', stT);
  stormFlick -= dt;
  const under = stormFlick > 0 ? '#45425f' : mix('#17161e', '#0c090c', D);
  put(stormMain, 'fill', stormFlick > 0 ? '#5a5680' : mix('#201f2a', '#140f14', D));
  put(stormUnder, 'fill', under); put(stormFront, 'fill', under);
  put(stormFront, 'opacity', ((chaos ? 0.92 : smooth(0.35, 1, D) * 0.92) * N).toFixed(2));
  if (Math.random() < (chaos ? 1.4 : 0.35 + D * 1.0) * N * dt) stormFlick = rand(0.06, 0.14);
  if (S < 0.15 && Math.random() < (chaos ? 0.6 : 0.03 + (D > 0.3 ? (D - 0.3) * 0.9 : 0)) * dt) strike();

  // rain: drizzle now, downpour later
  const rainN = Math.round((chaos ? 260 * (1 - smooth(0, 0.3, S)) : 60 + smooth(0.25, 1, D) * 200) * (LITE ? 0.35 : 1));
  while (RAIN.length < rainN) RAIN.push({ x: rand(-100, 2100), y: rand(-50, 900), vx: 0, vy: rand(1300, 1700) });
  if (RAIN.length > rainN) RAIN.length = rainN;
  for (const r of RAIN) {
    r.vx = wind * 1.4 - 80; r.x += r.vx * dt; r.y += r.vy * dt;
    if (r.y > 905 || r.x < -60) { r.x = rand(-100, 2100); r.y = rand(-120, -10); }
  }

  // fog drifting along the ground
  put($('fogStop'), 'stop-color', mix('#7d86a6', '#7a3a30', smooth(0.4, 1, DD)));
  put(fogG, 'opacity', N.toFixed(2));
  for (const fg of FOGS) {
    fg.x -= fg.v * dt * (1 + D * 3); if (fg.x < -700) fg.x += 2800;
    put(fg.e, 'cx', f(fg.x)); put(fg.e, 'cy', f(fg.y)); put(fg.e, 'rx', f(fg.rx)); put(fg.e, 'ry', f(fg.ry));
  }

  // flickering street lamp
  lampOff -= dt;
  if (Math.random() < (chaos ? 2.5 : 0.25 + D * 2) * dt) lampOff = rand(0.05, chaos ? 1.5 : 0.35);
  const lampA = (lampOff > 0 ? (Math.random() < 0.3 ? 0.4 : 0.03) : 1) * N;
  put(lampCone, 'opacity', lampA); put(lampPool, 'opacity', lampA);
  put(lampBulb, 'fill', lampA > 0.5 ? '#ffe7a8' : '#3a3428');
  put(heroPool, 'ry', f(24 + Math.sin(T * 3) * 1.5));

  // dead tree & weeds in the wind
  put($('tree'), 'transform', `rotate(${(Math.sin(T * 1.3) * (0.8 + 3 * D) + Math.sin(T * 3.1) * D * 1.5 - D * 3).toFixed(2)} 1700 888)`);
  WEEDS.forEach(w => put(w.g, 'transform', `rotate(${(Math.sin(T * 2 + w.ph) * (3 + 7 * D) - 4 - D * 12).toFixed(2)} ${f(w.x)} 888)`));
  put($('grass'), 'fill', toDay(mixA('#1c2b20', '#24190f', D), '#4f9a45', S));
  put($('grassTop'), 'fill', toDay(mixA('#25382a', '#2f2116', D), '#6bb75a', S));
  put($('dirt'), 'fill', toDay(rgb('#120e0b'), '#4a3826', S));

  // embers drift up once things start burning
  emitN((chaos ? 14 * N : smooth(0.45, 1, D) * 9) * dt, () => add({ k: 'ember', x: rand(0, 1920), y: GROUND + 10, vx: rand(-30, 30), vy: rand(-170, -60), r: rand(2.5, 5), ph: rand(0, 6), max: rand(3, 6) }));

  // the foundation cracks
  put($('crackGlow'), 'opacity', (chaos ? (0.55 + 0.25 * Math.sin(T * 4)) * N : smooth(0.75, 1, D) * 0.45).toFixed(2));
  for (const c of CRACKS) {
    const off = (1 - (chaos ? 1 : smooth(c.a, c.b, D))).toFixed(3);
    put(c.p, 'stroke-dashoffset', off); put(c.g, 'stroke-dashoffset', off);
  }

  // gadgets: server lights, terminals, graphs, fans, queues, phones, battery, hourglass
  redFlash -= dt; ledT -= dt; slowT -= dt;
  if (ledT <= 0) {
    ledT = 0.4;
    const pr = broken ? 0.85 : 0.06 + 0.6 * D * D;
    for (const l of LEDS) {
      let c;
      if (Math.random() < (broken ? 0.4 : 0.12)) c = '#14301c';
      else if (Math.random() < pr || (redFlash > 0 && Math.random() < 0.7)) c = '#ff3b30';
      else if (Math.random() < 0.05 + D * 0.2) c = '#ffb020';
      else c = '#3dff7a';
      put(l, 'fill', c);
    }
    for (const t of TERM) put(t.e, 'fill', Math.random() < (broken ? 0.9 : 0.08 + D * 0.7) ? '#ff3b30' : t.c);
  }
  if (slowT <= 0) {
    slowT = 0.35;
    const gc = mix3('#3dff7a', '#ffb020', '#ff3b30', DD);
    for (const g of GRAPHS) { put(g, 'd', graphD(DD)); put(g, 'stroke', gc); }
    for (const hs of SANDS) setSand(hs, DD);
  }
  for (const s of SPIN) { s.a = (s.a + dt * 360 * s.sp * (1.2 + 3 * D) * fanSpd) % 360; put(s.e, 'transform', `translate(${s.x} ${s.y}) rotate(${f(s.a)})`); }
  for (const q of QUEUES) {
    q.off += dt * 70 * (1 - 0.92 * D) * fanSpd;
    q.envs.forEach((e, i) => put(e, 'transform', `translate(${f(((i * 36 + q.off) % 180) - 90)} 0)`));
  }
  if (!chaos && PHONES.length && Math.random() < (0.04 + smooth(0.2, 1, D) * 0.3) * dt) pick(PHONES).ring = rand(1, 2);
  for (const ph of PHONES) {
    ph.ring -= dt;
    const on = ph.ring > 0, blink = (T * 8) % 1 < 0.5;
    put(ph.k, 'transform', on ? `translate(${f(rand(-2.5, 2.5))} 0) rotate(${f(rand(-5, 5))})` : '');
    put(ph.waves, 'opacity', on && blink ? 1 : 0);
    put(ph.sc, 'fill', on ? (blink ? '#ff3b30' : '#ffd0cc') : broken ? '#14161a' : '#3a7bd5');
  }
  const lvl = broken ? 0 : clamp(Math.ceil((1 - D) * 4 - 1e-4), 1, 4);
  const bc = lvl >= 3 ? '#3ddc6a' : lvl === 2 ? '#ffb020' : (T * 3) % 1 < 0.5 ? '#ff3b30' : '#ffd0cc';
  UPSB.forEach((b, i) => put(b, 'fill', i < lvl ? bc : '#e8ebf0'));

  // overlays: gloom, alarm, emergency lights
  vigEl.style.opacity = lerp(chaos ? 0.85 : 0.6 + smooth(0.2, 1, D) * 0.35, 0.12, S).toFixed(3);
  alarmEl.style.opacity = ((chaos ? 0.2 + 0.15 * Math.sin(T * 7) : D > 0.85 ? (D - 0.85) * 2.5 * (0.5 + 0.5 * Math.sin(T * 5)) : 0) * N).toFixed(3);
  const sk = (chaos ? 0.55 : smooth(0.6, 1, D) * 0.45) * N, sp = (T * 2.2) % 1 < 0.5;
  sirenL.style.opacity = (sp ? sk : sk * 0.12).toFixed(3); sirenR.style.opacity = (sp ? sk * 0.12 : sk).toFixed(3);
  if (!chaos && D > 0.7 && Math.random() < (D - 0.7) * 0.25 * dt) glitchT = 0.12;

  if (ghostT > 0) {
    ghostT -= dt;
    const g = 1 - ghostT / 1.4;
    put(ghost, 'opacity', (Math.max(0, Math.sin(g * Math.PI)) * 0.34 * (Math.random() < 0.85 ? 1 : 0.35)).toFixed(3));
    put(ghost, 'transform', `translate(${f(960 + rand(-6, 6))} 300) scale(2.3)`);
  } else put(ghost, 'opacity', 0);
}

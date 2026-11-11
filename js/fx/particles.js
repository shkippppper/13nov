'use strict';
// ───────────────────────── particles
function sprite(r, stops) {
  const c = document.createElement('canvas'); c.width = c.height = r * 2;
  const g = c.getContext('2d'), gr = g.createRadialGradient(r, r, 0, r, r, r);
  stops.forEach(([o, col]) => gr.addColorStop(o, col)); g.fillStyle = gr; g.fillRect(0, 0, r * 2, r * 2);
  return c;
}
const SP = {
  smokeL: sprite(64, [[0, 'rgba(200,200,212,0.8)'], [0.5, 'rgba(180,180,195,0.4)'], [1, 'rgba(180,180,195,0)']]),
  smokeD: sprite(64, [[0, 'rgba(30,27,32,0.95)'], [0.5, 'rgba(26,23,28,0.55)'], [1, 'rgba(24,21,26,0)']]),
  dust:   sprite(64, [[0, 'rgba(140,120,95,0.85)'], [0.5, 'rgba(120,100,80,0.42)'], [1, 'rgba(110,92,72,0)']]),
  fireY:  sprite(48, [[0, 'rgba(255,250,210,1)'], [0.35, 'rgba(255,214,90,0.85)'], [1, 'rgba(255,120,0,0)']]),
  fireO:  sprite(48, [[0, 'rgba(255,200,90,0.95)'], [0.4, 'rgba(255,115,25,0.6)'], [1, 'rgba(200,40,0,0)']]),
  fireR:  sprite(48, [[0, 'rgba(255,95,35,0.7)'], [0.5, 'rgba(180,30,10,0.35)'], [1, 'rgba(120,10,0,0)']])
};
const P = [], RAIN = [], BUGS = [];
const add = p => { if (P.length < (LITE ? 220 : 700)) { p.life = 0; P.push(p); } };

function sparkBurst(x, y, n) {
  n = Math.max(1, Math.round(n * FX));
  for (let i = 0; i < n; i++) { const a = rand(0, Math.PI * 2), s = rand(150, 650); add({ k: 'spark', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 200, max: rand(0.3, 0.7) }); }
}
function dustBurst(x, y, spread, n) {
  n = Math.max(1, Math.round(n * FX));
  for (let i = 0; i < n; i++) add({ k: 'dust', x: x + rand(-spread, spread), y: y - rand(0, 10), vx: rand(-280, 280), vy: rand(-170, -20), r: rand(14, 30), g: rand(30, 60), a: 0.8, max: rand(1.2, 2.6) });
}
function sweatBurst(n) {
  n = Math.max(1, Math.round(n * FX));
  for (let i = 0; i < n; i++) { const s = Math.random() < 0.5 ? -1 : 1; add({ k: 'sweat', x: 960 + slide + s * 78, y: 545 + curDy, vx: s * rand(60, 190), vy: rand(-300, -140), max: 1.3 }); }
}

let wind = -15;
function updateFx(dt) {
  for (let i = P.length - 1; i >= 0; i--) {
    const p = P[i];
    p.life += dt;
    let dead = p.life >= p.max;
    switch (p.k) {
      case 'smoke': p.vx += wind * 0.12 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.g * dt; break;
      case 'dust': p.vx *= 1 - dt * 2; p.vy *= 1 - dt * 1.5; p.vy -= 10 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.g * dt; break;
      case 'fire': p.x += (p.vx + wind * 0.06) * dt; p.y += p.vy * dt; break;
      case 'ember': p.vx += (wind * 0.3 - p.vx) * dt * 0.5; p.x += p.vx * dt + Math.sin(p.life * 3 + p.ph) * 0.7; p.y += p.vy * dt; break;
      case 'spark': p.vy += 1300 * dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.y > GROUND + 10) dead = true; break;
      case 'sweat': case 'crumb': p.vy += 1500 * dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.y > GROUND) dead = true; break;
      case 'heart': p.x += p.vx * dt + Math.sin(p.life * 6 + p.ph) * 0.8; p.y += p.vy * dt; break;
      case 'zzz': p.x += p.vx * dt + Math.sin(p.life * 2.5 + p.ph) * 0.5; p.y += p.vy * dt; break;
    }
    if (dead) { P[i] = P[P.length - 1]; P.pop(); }
  }
}

function drawDrop(x, y, a) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a - Math.PI / 2);
  ctx.fillStyle = '#9ad8ff'; ctx.strokeStyle = '#3a8fd0'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, -12); ctx.quadraticCurveTo(8, 2, 0, 7); ctx.quadraticCurveTo(-8, 2, 0, -12); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function drawBug(x, y, a, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(1.7, 1.7);
  ctx.strokeStyle = '#111'; ctx.lineWidth = 1.4; ctx.beginPath();
  for (let i = -1; i <= 1; i++) { const w = Math.sin(t * 22 + i) * 2; ctx.moveTo(-3, i * 3); ctx.lineTo(-8, i * 4 + w); ctx.moveTo(3, i * 3); ctx.lineTo(8, i * 4 - w); }
  ctx.stroke();
  ctx.fillStyle = '#1a1a1a'; ctx.beginPath(); ctx.ellipse(0, 1, 4.2, 5.5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.ellipse(0, 1.5, 3, 4.2, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#1a1a1a'; ctx.beginPath(); ctx.arc(0, -5, 2.6, 0, 7); ctx.fill();
  ctx.restore();
}
function drawHeart(x, y, s) {
  ctx.beginPath(); ctx.moveTo(x, y + s);
  ctx.bezierCurveTo(x - s * 1.6, y - s * 0.2, x - s * 0.6, y - s * 1.3, x, y - s * 0.4);
  ctx.bezierCurveTo(x + s * 0.6, y - s * 1.3, x + s * 1.6, y - s * 0.2, x, y + s);
  ctx.fill();
}
function drawFx() {
  ctx.setTransform(rs, 0, 0, rs, 0, 0);
  ctx.clearRect(0, 0, 1920, 1080);
  ctx.globalCompositeOperation = 'source-over';
  // shadows of things about to land
  ctx.fillStyle = '#000';
  for (const list of [DROPS, bodies || []]) for (const b of list) {
    if (b.ground) continue;
    const k = clamp(1 - (GROUND - b.y) / 1600, 0, 1);
    ctx.globalAlpha = 0.5 * k; ctx.beginPath(); ctx.ellipse(b.x, GROUND - 2, b.w * 0.55 * (0.35 + 0.65 * k), 10 * (0.35 + 0.65 * k), 0, 0, 7); ctx.fill();
  }
  for (const p of P) {
    if (p.k !== 'smoke' && p.k !== 'dust') continue;
    const t = p.life / p.max, a = p.a * (1 - t) * Math.min(1, p.life * 5);
    if (a <= 0.01) continue;
    ctx.globalAlpha = a;
    ctx.drawImage(p.k === 'dust' ? SP.dust : p.dark ? SP.smokeD : SP.smokeL, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
  }
  ctx.globalAlpha = 1;
  for (const b of BUGS) drawBug(b.wx, b.wy, b.wa, T + b.ph);
  for (const p of P) {
    if (p.k === 'sweat') { ctx.globalAlpha = Math.min(1, (p.max - p.life) * 3); drawDrop(p.x, p.y, Math.atan2(p.vy, p.vx)); }
    else if (p.k === 'crumb') { ctx.globalAlpha = 1; ctx.fillStyle = p.c; ctx.fillRect(p.x - 3, p.y - 3, 6, 6); }
    else if (p.k === 'heart') { ctx.globalAlpha = Math.min(1, (p.max - p.life) * 2); ctx.fillStyle = '#ff4f8b'; drawHeart(p.x, p.y, p.r * Math.min(1, 0.4 + p.life * 3)); }
    else if (p.k === 'zzz') {   // a sleeping "Z" that drifts up, grows and fades
      const t = p.life / p.max;
      ctx.globalAlpha = Math.min(1, p.life * 3) * (1 - t);
      ctx.font = `900 ${Math.round(p.r * (0.6 + t * 0.8))}px Orbitron, system-ui, sans-serif`;
      ctx.lineWidth = 5; ctx.strokeStyle = '#1b2033'; ctx.fillStyle = '#e9efff';
      ctx.strokeText('Z', p.x, p.y); ctx.fillText('Z', p.x, p.y);
    }
  }
  ctx.globalCompositeOperation = 'lighter';
  for (const p of P) {
    if (p.k === 'fire') {
      const t = p.life / p.max, img = t < 0.3 ? SP.fireY : t < 0.65 ? SP.fireO : SP.fireR, r = p.r * (1 - t * 0.45);
      ctx.globalAlpha = Math.min(1, (1 - t) * 1.4); ctx.drawImage(img, p.x - r, p.y - r, r * 2, r * 2);
    } else if (p.k === 'ember') {
      const t = p.life / p.max;
      ctx.globalAlpha = (1 - t) * (0.55 + 0.45 * Math.sin(p.life * 11 + p.ph)); ctx.drawImage(SP.fireO, p.x - p.r * 2, p.y - p.r * 2, p.r * 4, p.r * 4);
    } else if (p.k === 'spark') {
      ctx.globalAlpha = 1 - p.life / p.max; ctx.strokeStyle = '#ffe58a'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(p.x - p.vx * 0.02, p.y - p.vy * 0.02); ctx.lineTo(p.x, p.y); ctx.stroke();
    }
  }
  // rain + lightning
  ctx.globalCompositeOperation = 'source-over';
  if (RAIN.length) {
    ctx.globalAlpha = 0.42; ctx.strokeStyle = '#9fb0dd'; ctx.lineWidth = 2; ctx.beginPath();
    for (const r of RAIN) { ctx.moveTo(r.x, r.y); ctx.lineTo(r.x - r.vx * 0.026, r.y - r.vy * 0.026); }
    ctx.stroke();
  }
  ctx.globalCompositeOperation = 'lighter';
  for (const p of P) {
    if (p.k !== 'bolt') continue;
    const t = p.life / p.max;
    ctx.globalAlpha = (1 - t) * (Math.random() < 0.75 ? 1 : 0.3); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    for (const [w, c] of [[18, 'rgba(150,140,255,0.55)'], [4.5, '#ffffff']]) {
      ctx.lineWidth = w; ctx.strokeStyle = c; ctx.beginPath();
      for (const line of p.lines) line.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.stroke();
    }
  }
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
}

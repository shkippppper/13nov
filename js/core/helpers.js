'use strict';
// ───────────────────────── helpers
const NS = 'http://www.w3.org/2000/svg';
const $ = id => document.getElementById(id);
function el(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const rand = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const f = v => v.toFixed(1);
const DEG = Math.PI / 180;
const hexCache = {};
const rgb = h => hexCache[h] || (hexCache[h] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)));
function mixA(a, b, t) { t = clamp(t, 0, 1); const A = rgb(a), B = rgb(b); return [0, 1, 2].map(i => Math.round(lerp(A[i], B[i], t))); }
const mix = (a, b, t) => `rgb(${mixA(a, b, t).join(',')})`;
const mix3 = (a, b, c, t) => t < 0.5 ? mix(a, b, t * 2) : mix(b, c, (t - 0.5) * 2);
// set an attribute only when its value changes (even an unchanged write can make the browser repaint)
function put(e, k, v) { const c = e.__a || (e.__a = {}); v = String(v); if (c[k] !== v) { c[k] = v; e.setAttribute(k, v); } }
function emitN(rate, fn) { rate *= EMIT; let n = Math.floor(rate); if (Math.random() < rate - n) n++; for (let i = 0; i < n; i++) fn(); }
function R(g, x, y, w, h, rx, fill, stroke, sw) {
  const a = { x: f(x), y: f(y), width: f(w), height: f(h) };
  if (rx) a.rx = rx; if (fill) a.fill = fill;
  if (stroke) { a.stroke = stroke; a['stroke-width'] = sw || 3; }
  return el('rect', a, g);
}

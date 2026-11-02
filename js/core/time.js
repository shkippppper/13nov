'use strict';
// ───────────────────────── time / preview controls
// Hidden preview: keys 0–9 = danger level, z = 10 s before zero, r = real time, f = fullscreen,
// c = cat now (if it's already here: a meow), t = the cat's ტრაკიიიი show, x = cxaduri peeks in.
// URL: ?d=0.7  |  ?t=15 (seconds before zero)  |  ?at=2026-11-10T12:00:00+04:00
const qs = new URLSearchParams(location.search);
let timeOffset = 0, dOverride = null;
if (qs.has('d')) dOverride = clamp(parseFloat(qs.get('d')) || 0, 0, 1);
if (qs.has('t')) timeOffset = TARGET - (parseFloat(qs.get('t')) || 0) * 1000 - Date.now();
if (qs.has('at')) { const a = Date.parse(qs.get('at')); if (!isNaN(a)) timeOffset = a - Date.now(); }
const now = () => Date.now() + timeOffset;

function danger(n) {
  if (dOverride !== null) return dOverride;
  const p = clamp((n - START) / (TARGET - START), 0, 1);
  let d = Math.pow(p, 1.6);
  const rem = TARGET - n;
  if (rem < 86400000) d = Math.max(d, 0.85 + 0.15 * (1 - rem / 86400000));
  return clamp(d, 0, 1);
}

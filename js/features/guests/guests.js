'use strict';
// ───────────────────────── guests: shared bits for characters who hang around (see cat.js)
const guestsG = $('guests'), sayEl = $('say');
let clipN = 0;
// head slot: a face photo in a round furry frame; zoom + fx/fy (face center as a fraction of the photo) crop it onto the face
function faceHead(g, { src, zoom = 1, fx = 0.5, fy = 0.5 }, r, fur, line) {
  el('circle', { r: r + 7, fill: fur, stroke: line, 'stroke-width': 4 }, g);
  const id = 'guestClip' + ++clipN;
  el('circle', { r }, el('clipPath', { id }, g));
  const fb = el('g', {}, g);
  for (const s of [-1, 1]) el('ellipse', { cx: s * 18, cy: -8, rx: 6, ry: 9, fill: '#1d1410' }, fb);
  el('path', { d: 'M-7 10H7L0 18Z', fill: '#f29aa0' }, fb);
  el('path', { d: 'M-13 24Q-6 31 0 22Q6 31 13 24', fill: 'none', stroke: '#1d1410', 'stroke-width': 3, 'stroke-linecap': 'round' }, fb);
  const S = r * 2 * zoom;
  const im = el('image', { href: src, x: f(-fx * S), y: f(-fy * S), width: f(S), height: f(S), preserveAspectRatio: 'xMidYMid slice', 'clip-path': `url(#${id})` }, g);
  const probe = new Image();
  probe.onload = () => fb.remove(); probe.onerror = () => im.remove();
  probe.src = src;
}
const guestBubble = bubble(sayEl);   // guests talk in #say
const say = guestBubble.say;
addFeature({ update(dt) { guestBubble.update(dt); } });

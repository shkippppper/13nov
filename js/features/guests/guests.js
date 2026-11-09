'use strict';
// ───────────────────────── guests: someone wanders through for 5 min, then nobody for 5 min
// Each guest has its own file (see cat.js) and joins the rotation with GUESTS.push(guest).
// A guest has enter(), update(dt) → false once it has left, shoo(), and top() → {x, y} for its speech bubble.
const VISIT = [300, 300], AWAY = [300, 300];
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
// where guests roam (on screen)
const ROAM = [180, 1740];

const guestBubble = bubble(sayEl);   // guests talk in #say
const say = guestBubble.say;
const GUESTS = [];
let guest = null, nextGuest = rand(30, 90);
addFeature({
  update(dt, rem) {
    const quiet = heroTime(rem);
    if (guest) {
      if (quiet && rem < 90000) guest.shoo();
      if (!guest.update(dt)) { guest = null; nextGuest = T + rand(...AWAY); }
    } else if (T > nextGuest && !quiet) (guest = pick(GUESTS)).enter();
    guestBubble.update(dt);
  },
});

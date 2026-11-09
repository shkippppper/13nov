'use strict';
// ───────────────────────── io: on "i" he springs up from the bottom edge in the right corner, says his line, and sinks back
// key: i = pop up now
function makeRiser(src, line, bub) {
  const root = $('io'), body = el('g', {}, root);
  // cut out along his real outline (hair, glasses, beard, jacket). Points are in photo px (560×704; the image is its
  // 482×686 crop at 78,12). His shoulder runs off the photo's right edge and the jacket off its bottom: both stay off screen.
  const OUTLINE = [[119, 41], [102, 54], [88, 73], [85, 96], [96, 149], [96, 172], [80, 220], [113, 249], [121, 291], [138, 329], [154, 352],
    [215, 403], [200, 460], [174, 493], [176, 506], [188, 521], [181, 551], [188, 568], [187, 636], [191, 646], [190, 696], [556, 696],
    [556, 173], [535, 157], [481, 144], [455, 120], [443, 122], [417, 149], [407, 148], [393, 110], [345, 60], [288, 29], [198, 14], [170, 18]];
  const d = smoothClosed(OUTLINE), S = 0.68, X = 1950 - 556 * S, UP = 630, DOWN = 1090, SAY = 2.6;
  el('path', { d, fill: '#2b1d16' }, body);
  el('path', { d }, el('clipPath', { id: 'ioClip' }, body));
  el('image', { href: src, x: 78, y: 12, width: 482, height: 686, preserveAspectRatio: 'none', 'clip-path': 'url(#ioClip)' }, body);
  el('path', { d, fill: 'none', stroke: '#120b08', 'stroke-width': f(6 / S), 'stroke-linejoin': 'round' }, body);
  const p = { on: false, t: 0, said: false, y: DOWN };
  p.start = () => { if (p.on) return; Object.assign(p, { on: true, t: 0, said: false }); root.style.display = ''; };
  p.top = () => ({ x: X + 250 * S, y: p.y + 14 * S - 6 });
  p.update = dt => {
    if (!p.on) return;
    const t = p.t += dt, out = 0.6 + SAY + 0.2;
    if (t > 0.6 && !p.said) { p.said = true; bub.say(p, line, SAY); }
    const h = backOut(clamp(t / 0.6, 0, 1)) * (1 - smooth(out, out + 0.5, t));   // 0 hidden … 1 up
    const over = Math.max(0, h - 1) * 150;   // a small bounce, so the photo's bottom edge never shows
    p.y = lerp(DOWN, UP, Math.min(h, 1)) - over + Math.sin(t * 2.4) * 3 * Math.min(h, 1);
    body.setAttribute('transform', `translate(${f(X)} ${f(p.y)}) rotate(${f(Math.sin(t * 1.9) * 1.5 * Math.min(h, 1))} ${f(300 * S)} ${f(700 * S)}) scale(${S})`);
    if (t > out + 0.5) { p.on = false; root.style.display = 'none'; }
  };
  return p;
}

const ioBubble = bubble($('say3'));   // io talks in #say3
const IO = makeRiser('assets/images/io-body.jpg', 'ცვეტში', ioBubble);
addFeature({
  update(dt) {
    IO.update(dt);
    ioBubble.update(dt);
  },
  keys: { KeyI: IO.start },
});

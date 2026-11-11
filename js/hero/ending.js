'use strict';
// ───────────────────────── the ending. At zero he steadies the stack, says "ერთი ამისიც", throws all of it to the left and walks off.
// A plane takes off with his face in the window. Then the crew (crew.js) comes out, rebuilds the stack and holds it up for good,
// and once it's up the storm gives way to a sunny day. After that, junk still falls now and then and the crew flinches.
const END_T = { say: 0.3, windup: 2.7, toss: 3.2, walk: 4.2, plane: 6.2, crew: 11 };   // seconds after zero
const SUN_RAMP = 10;   // seconds from storm to full sun, starting when the crew has the stack up
const END_SKIP = 90;   // loading the page later than this after zero jumps straight to the finished scene
const FLYBY_EVERY = 120;   // after the ending, his plane flies over every 2 minutes (counted from zero)
let heroBubble = null, heroGone = false, oldJunkCleared = false, sunStart = null, lastFlyby = 0;
const heroSpeaker = { top: () => ({ x: 960 + slide + heroX, y: 459 + curDy }) };

function startEnding() {
  state = 'end'; cT = 0; bodies = null; impacts = 0; heroX = 0; endDone = false; heroGone = false; oldJunkCleared = false; sunStart = null; lastFlyby = 0;
  faceTint.setAttribute('opacity', 0); vein.setAttribute('opacity', 0);
  BUGS.length = 0; nextDrop = 1e9;
  for (const b of DROPS) b.ignite = 1e9;
  if (!heroBubble) { const d = document.createElement('div'); d.className = 'say'; stage.insertBefore(d, cdEl); heroBubble = bubble(d); }
}

// his calm-phase pose, at the current ang / slide / curDy, without the jitter
function poseHeroHolding() {
  const dy = curDy, tx = -ang * 1.6;
  heroG.setAttribute('transform', `translate(${f(slide)} 0)`);
  handsG.setAttribute('transform', `translate(${f(slide)} 0)`);
  heroPool.setAttribute('cx', f(960 + slide));
  bodyG.setAttribute('transform', `translate(${f(tx)} ${f(dy)})`);
  headG.setAttribute('transform', `translate(${f(960 + tx)} ${f(590 + dy)}) rotate(${(-ang * 0.4).toFixed(2)})`);
  const a = ang * DEG, c = Math.cos(a), s = Math.sin(a);
  const hl = { x: PIV.x - 135 * c - 4 * s, y: PIV.y + dy - 135 * s + 4 * c };
  const hr = { x: PIV.x + 135 * c - 4 * s, y: PIV.y + dy + 135 * s + 4 * c };
  lastHL = hl; lastHR = hr;
  const sl = { x: 905 + tx, y: 712 + dy }, sr = { x: 1015 + tx, y: 712 + dy };
  setArms(sl, { x: sl.x + (hl.x - sl.x) * 0.55 - 34, y: (sl.y + hl.y) / 2 + 6 }, hl,
          sr, { x: sr.x + (hr.x - sr.x) * 0.55 + 34, y: (sr.y + hr.y) / 2 + 6 }, hr);
  const ko = 5 + dy * 0.9;
  setLegs({ x: 935 + tx * 0.6, y: 800 + dy }, { x: 926 - ko, y: 842 + dy * 0.5 }, { x: 920, y: 879 },
          { x: 985 + tx * 0.6, y: 800 + dy }, { x: 994 + ko, y: 842 + dy * 0.5 }, { x: 1000, y: 879 });
}

// the stack as loose physics bodies (plank first, then ITEMS in order), at where they are right now
function makeBodies() {
  const mk = (elm, x, y, a, w, h) => ({
    el: elm, x, y, a, w, h, hw: w / 2, hh: h / 2, vx: 0, vy: 0, va: 0,
    ground: false, hit: false, sup: null, fade: 1, tilt: 0, elec: false, fire: false, ignite: 1e9
  });
  const a = ang * DEG;
  bodies = [mk(plankEl, PIV.x + slide + 9 * Math.sin(a), PIV.y + curDy - 9 * Math.cos(a), ang, 560, 18)];
  for (const it of ITEMS) {
    const p = itemPt(it), b = mk(it.el, p.x, p.y, it.row.th + it.a, it.w, it.h);
    b.elec = ELEC.has(it.type); b.item = it;
    bodies.push(b);
  }
  for (const r of ROWG) r.g.setAttribute('transform', '');
}

// the throw: every item (and the plank) flies off to the left and lands in a heap
function throwStack() {
  makeBodies();
  for (const b of bodies) {
    const plank = b.el === plankEl;
    b.vx = plank ? -rand(650, 780) : -rand(480, 1050); b.vy = plank ? -rand(250, 350) : rand(-480, -160);
    b.va = plank ? rand(-60, 20) : rand(-380, 140); b.fire = false; b.ignite = 1e9; b.tilt = plank ? rand(-3, 3) : rand(-14, 14);
  }
  shake(7); flashA = Math.max(flashA, 0.15);
}
function onThrowImpact(b, v) {
  impacts++;
  dustBurst(b.x, b.y + b.hh, b.hw, Math.round(6 + b.w / 30));
  if (b.elec) sparkBurst(b.x, b.y, 10);
  shake(Math.min(16, v / 90));
}

function updateHero(dt) {
  if (heroGone) return;
  if (cT < END_T.toss) {
    // he steadies it (the wobble dies down), says his line, then leans it right to wind up
    const calm = Math.exp(-dt * 3);
    WOB = 1 - smooth(0, 1.6, cT); tjx = tjy = 0;
    const w = smooth(END_T.windup, END_T.toss, cT);
    ang = ang * calm + 10 * w * (1 - calm); bendA *= calm; duckX *= calm;
    slide = slide * calm + 30 * w * (1 - calm);
    curDy = lerp(curDy, 6 + 18 * w, Math.min(1, dt * 6));
    if (cT >= END_T.say && cT - dt < END_T.say) heroBubble.say(heroSpeaker, 'ერთი ამისიც', 2.3);
    poseTower(); poseHeroHolding();
    return;
  }
  if (!bodies) throwStack();
  // follow-through: arms swing over to the left and drop; then he turns and walks off to the right
  const ft = smooth(END_T.toss, END_T.toss + 0.4, cT), drop = smooth(END_T.toss + 0.5, END_T.walk, cT);
  const walkT = clamp((cT - END_T.walk) / 2.2, 0, 1), walking = cT > END_T.walk, ph = (cT - END_T.walk) * 14;
  heroX = lerp(0, 1350 - slide, walkT * walkT);
  const bob = walking ? -Math.abs(Math.sin(ph)) * 6 : 0, sw = walking ? Math.sin(ph) : 0, lean = ft * (1 - drop) * -8;
  const dy = lerp(curDy, 0, ft);
  bodyG.setAttribute('transform', `translate(0 ${f(bob + dy)}) rotate(${f(lean)} 960 806)`);
  headG.setAttribute('transform', `translate(${f(960 + lean * 3)} ${f(590 + bob + dy)}) rotate(${f(walking ? 6 : lean)})`);
  const sl = { x: 905, y: 712 + bob + dy }, sr = { x: 1015, y: 712 + bob + dy };
  const dl = { x: 878 - sw * 16, y: 800 + bob }, dr = { x: 1042 + sw * 16, y: 800 + bob };   // arms down at his sides
  const fl = { x: 700, y: 560 }, fr = { x: 790, y: 520 };                                    // flung out to the left
  const hl = { x: lerp(lerp(lastHL.x, fl.x, ft), dl.x, drop), y: lerp(lerp(lastHL.y, fl.y, ft), dl.y, drop) };
  const hr = { x: lerp(lerp(lastHR.x, fr.x, ft), dr.x, drop), y: lerp(lerp(lastHR.y, fr.y, ft), dr.y, drop) };
  setArms(sl, { x: (sl.x + hl.x) / 2 - 22, y: (sl.y + hl.y) / 2 }, hl, sr, { x: (sr.x + hr.x) / 2 + 22, y: (sr.y + hr.y) / 2 }, hr);
  const fL = { x: 920 + sw * 26, y: 879 - (walking ? Math.max(0, Math.cos(ph)) * 14 : 0) };
  const fR = { x: 1000 - sw * 26, y: 879 - (walking ? Math.max(0, -Math.cos(ph)) * 14 : 0) };
  setLegs({ x: 935, y: 800 + bob }, { x: (935 + fL.x) / 2 + 8, y: 842 + bob / 2 }, fL, { x: 985, y: 800 + bob }, { x: (985 + fR.x) / 2 + 8, y: 842 + bob / 2 }, fR);
  heroG.setAttribute('transform', `translate(${f(slide + heroX)} 0)`);
  handsG.setAttribute('transform', `translate(${f(slide + heroX)} 0)`);
  heroPool.setAttribute('opacity', (1 - walkT).toFixed(2));
  if (walking && walkT < 0.6) emitN(10 * dt, () => add({ k: 'dust', x: 960 + slide + heroX + rand(-30, 10), y: GROUND - 4, vx: rand(-120, -20), vy: rand(-60, -10), r: rand(10, 18), g: 30, a: 0.5, max: 1 }));
  if (slide + heroX > 1150) { heroGone = true; heroG.style.display = handsG.style.display = 'none'; }
}

function updateEnding(dt) {
  cT += dt;
  updateHero(dt);
  if (bodies && !CREW.hasStack) for (const b of bodies) { const hit = stepBody(b, dt, 60, 1860, false); if (hit) onThrowImpact(b, hit); }

  if (cT >= END_T.plane && cT - dt < END_T.plane) PLANE.start();
  PLANE.update(dt);
  if (cT >= END_T.crew && CREW.phase === '') CREW.start();
  CREW.update(dt);

  // the storm keeps going while they rebuild; once they have the stack up, it clears and the sun comes out
  if (CREW.phase === 'hold' && sunStart === null) sunStart = cT;
  SUN = sunStart === null ? 0 : smooth(sunStart, sunStart + SUN_RAMP, cT);
  if (SUN > 0.15 && !oldJunkCleared) {   // the junk from before crumbles away
    oldJunkCleared = true;
    DROPS.forEach((b, i) => { b.crumble = T + 0.4 * i; });
  }
  for (const b of DROPS) if (b.crumble && T > b.crumble && b.fade >= 1) { b.fade = 0.999; dustBurst(b.x, b.y, b.hw, 10); }
  fanSpd = lerp(fanSpd, SUN > 0.5 ? 1 : 0.3, Math.min(1, dt));

  if (CREW.phase === 'hold') {
    if (!endDone) CAT.wake('გაგეღვიძებინეთ დაგეხმარებოდით');   // the cat slept through all of it
    endDone = true;
    if (T > nextDrop) {   // junk still falls now and then — away from them, on either side
      spawnDrop(w => Math.random() < 0.5 ? rand(150 + w / 2, 560 - w / 2) : rand(1690, 1830));
      nextDrop = T + rand(10, 22) * DROP_EVERY;
    }
    const k = Math.floor((now() - TARGET) / 1000 / FLYBY_EVERY);   // a flyover at 2:00, 4:00, 6:00 … after zero
    if (k > lastFlyby && !PLANE.flying()) { lastFlyby = k; PLANE.start('flyby'); }
  }
  updateDrops(dt);
  heroBubble.update(dt);
}

// page opened long after zero: straight to the finished scene
function finishEnding() {
  startEnding();
  cT = 999; heroGone = true; oldJunkCleared = true; sunStart = 0;
  heroG.style.display = handsG.style.display = 'none'; heroPool.setAttribute('opacity', 0);
  for (const b of DROPS) b.el.remove(); DROPS.length = 0;
  PLANE.reset(); CREW.finish();
  lastFlyby = Math.floor((now() - TARGET) / 1000 / FLYBY_EVERY);   // next flyover at the next 2-minute mark
  SUN = 1; D = 0; endDone = true; nextDrop = T + rand(5, 12);
}

// time went back before zero (preview keys): put everything back
function resetCalm() {
  state = 'calm'; bodies = null; cT = 0; heroX = 0; WOB = 1; SUN = 0; endDone = false; heroGone = false;
  heroG.style.display = handsG.style.display = '';
  heroG.setAttribute('transform', ''); handsG.setAttribute('transform', ''); heroPool.setAttribute('opacity', 1);
  bodyG.setAttribute('transform', '');
  for (const it of ITEMS) it.el.setAttribute('transform', it.tf);
  for (const b of DROPS) b.el.remove(); DROPS.length = 0;
  PLANE.reset(); CREW.reset();
  ang = angV = bendA = bendV = dip = dipV = duckX = duckV = slide = slideV = 0; fanSpd = 1;
  P.length = 0; glitchT = ghostT = 0; stage.style.filter = '';
  ghost.setAttribute('opacity', 0);
  cdEl.classList.remove('dead');
  nextDrop = T + 3;
}

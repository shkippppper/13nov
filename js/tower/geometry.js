'use strict';
// ───────────────────────── tower geometry
function itemPt(it, lx = 0, ly = 0) {
  const ia = it.a * DEG, ci = Math.cos(ia), si = Math.sin(ia);
  const px = it.x + it.dx + lx * ci - ly * si, py = it.y + lx * si + ly * ci;
  const r = it.row, t = r.th * DEG, c = Math.cos(t), s = Math.sin(t);
  return { x: r.cx + px * c - py * s, y: r.cy + px * s + py * c };
}
function poseTower() {
  const a = ang * DEG, sa = Math.sin(a), ca = Math.cos(a), ox = PIV.x + tjx + slide;
  plankEl.setAttribute('transform', `translate(${f(ox + 9 * sa)} ${f(PIV.y + curDy + tjy - 9 * ca)}) rotate(${ang.toFixed(3)})`);
  let px = ox + 18 * sa, py = PIV.y + curDy + tjy - 18 * ca;
  for (const r of ROWG) {
    const th = ang + bendA * Math.pow(r.mid / TOWER_H, 1.4) + Math.sin(T * r.fq + r.ph) * (0.4 + D * 1.4);
    const t = th * DEG, ux = Math.sin(t), uy = -Math.cos(t);
    r.cx = px + ux * r.h / 2; r.cy = py + uy * r.h / 2; r.th = th;
    px = r.cx + ux * r.h / 2; py = r.cy + uy * r.h / 2;
    r.g.setAttribute('transform', `translate(${f(r.cx)} ${f(r.cy)}) rotate(${th.toFixed(2)})`);
  }
  DUCK.dx = duckX;
  DUCK.el.setAttribute('transform', `translate(${f(DUCK.x + duckX)} ${f(DUCK.y)}) rotate(${(DUCK.a + duckX * 0.5).toFixed(2)})`);
}

function setArms(sl, el1, hl, sr, er, hr) {
  const dl = `M${f(sl.x)} ${f(sl.y)} L${f(el1.x)} ${f(el1.y)} L${f(hl.x)} ${f(hl.y)}`;
  const dr = `M${f(sr.x)} ${f(sr.y)} L${f(er.x)} ${f(er.y)} L${f(hr.x)} ${f(hr.y)}`;
  armL.setAttribute('d', dl); armLo.setAttribute('d', dl);
  armR.setAttribute('d', dr); armRo.setAttribute('d', dr);
  handL.setAttribute('cx', f(hl.x)); handL.setAttribute('cy', f(hl.y));
  handR.setAttribute('cx', f(hr.x)); handR.setAttribute('cy', f(hr.y));
}
function setLegs(hl, kl, fl, hr, kr, fr) {
  legL.setAttribute('d', `M${f(hl.x)} ${f(hl.y)} L${f(kl.x)} ${f(kl.y)} L${f(fl.x)} ${f(fl.y)}`);
  legR.setAttribute('d', `M${f(hr.x)} ${f(hr.y)} L${f(kr.x)} ${f(kr.y)} L${f(fr.x)} ${f(fr.y)}`);
  shoeL.setAttribute('cx', f(fl.x - 8)); shoeL.setAttribute('cy', f(fl.y + 4));
  shoeR.setAttribute('cx', f(fr.x + 8)); shoeR.setAttribute('cy', f(fr.y + 4));
}

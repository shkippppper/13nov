'use strict';
// ───────────────────────── element refs
const heroG = $('hero'), handsG = $('hands'), bodyG = $('body'), headG = $('head');
const armL = $('armL'), armR = $('armR'), armLo = $('armLo'), armRo = $('armRo');
const legL = $('legL'), legR = $('legR'), shoeL = $('shoeL'), shoeR = $('shoeR');
const handL = $('handL'), handR = $('handR'), faceTint = $('faceTint'), vein = $('vein'), veinS = $('veinS');
const ghost = $('ghost'), flashEl = $('flash'), vigEl = $('vig'), alarmEl = $('alarm'), sirenL = $('sirenL'), sirenR = $('sirenR');
const lampCone = $('lampCone'), lampPool = $('lampPool'), lampBulb = $('lampBulb'), heroPool = $('heroPool');
const cdEl = $('cd'), DIG = [...cdEl.querySelectorAll('i')], SEPS = [...cdEl.querySelectorAll('b')];

// lite: no crows, bats, searchlights, fog, street lamp or siren overlays
if (LITE) {
  BEAMS.length = 0; BATS.length = 0; VULTS.length = 0; FOGS.length = 0;
  for (const g of [beamsG, batsG, vultG, fogG, $('lamp')]) g.remove();
  for (const id of ['sirenL', 'sirenR', 'alarm']) $(id).style.display = 'none';
}

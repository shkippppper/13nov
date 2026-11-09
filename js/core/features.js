'use strict';
// ───────────────────────── features: self-contained extras (guests, cxaduri, …) plug in here
// addFeature({ update(dt, rem), keys: { x: fn } }) — update runs every frame after the hero and the scene (rem = ms left
// on the countdown); keys are keyboard shortcuts, matched against e.key, then e.code. Features run in script order.
const FEATURES = [];
function addFeature(feature) { FEATURES.push(feature); return feature; }
function updateFeatures(dt, rem) { for (const ft of FEATURES) ft.update?.(dt, rem); }
function featureKey(e) {
  for (const ft of FEATURES) { const fn = ft.keys?.[e.key] || ft.keys?.[e.code]; if (fn) { fn(e); return true; } }
  return false;
}
// the last 10 min and the collapse belong to the hero: features stay out of the way
function heroTime(rem) { return rem < 600000 && rem > -60000; }

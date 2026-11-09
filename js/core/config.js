'use strict';
// ───────────────────────── config
// Zero = his last working day, Wed 11 Nov 2026, 17:00 Tbilisi (UTC+4, no DST).
const TARGET = Date.parse('2026-11-11T17:00:00+04:00');
// Danger ramps from this moment up to TARGET (max chaos).
const START  = Date.parse('2026-10-11T00:00:00+04:00');
const GROUND = 885;
const PIV = { x: 960, y: 458 };   // underside-center of the plank he holds
const LITE = !location.search.includes('full');   // lite mode for slow machines; add ?full to the URL for everything
const FX = LITE ? 0.4 : 1;          // lite: share of particles per burst (impacts, sparks, dust)
const EMIT = LITE ? 0.6 : 1;        // lite: share of continuous fire/smoke/ember emission
const DROP_EVERY = LITE ? 2.5 : 1;  // lite: junk falls from the sky this many times less often
const MAX_PILE = LITE ? 4 : 10;   // most fallen items allowed on the ground at once

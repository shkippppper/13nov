'use strict';
// ───────────────────────── state
let state = 'calm', cT = 0, bodies = null, heroX = 0, toppleDir = 1;
let ang = 0, angV = 0, bendA = 0, bendV = 0, dip = 0, dipV = 0, duckX = 0, duckV = 0, slide = 0, slideV = 0;
let tjx = 0, tjy = 0, curDy = 0;
let lastHL = { x: 825, y: 466 }, lastHR = { x: 1095, y: 466 };
let shakeMag = 0, flashA = 0, stormFlick = 0, glitchT = 0, ghostT = 0, nextGlitch = 0, redFlash = 0, lampOff = 0;
let nextEvt = 5, nextDrop = 4, ledT = 0, winT = 0, slowT = 0, fanSpd = 1, impacts = 0;
let stormX = 900, stormY = -40;
let T = 0, D = 0;
const DROPS = [];
const shake = m => { shakeMag = Math.max(shakeMag, m); };

# 13nov

A countdown to Nikoloz's last day: he holds up a tower of servers that gets wobblier as zero gets closer. At zero he says
"ერთი ამისიც", throws the whole stack to the left and walks off; a plane flies away with him waving out of the window. Then
three people (s1, n1, l1) come out, look at the mess, rebuild the stack and hold it up together, steady; only then does the
storm clear into a sunny day. Junk still falls now and then and they flinch. The countdown then counts up: time since he left.
No build step — open `index.html` in a browser (or serve the folder). Add `?full` to the URL for the heavy-effects mode.

## Layout

```
index.html              markup only (the SVG scene + overlays) and the list of scripts, in load order
css/                    base (stage, overlays), countdown, speech bubbles
js/core/                config (dates, lite mode), helpers, time & danger, stage fit, element refs, state, feature hooks
js/tower/               item drawings, the tower, its geometry, junk falling from the sky
js/hero/                calm phase, foreshadowing events, the ending (line, throw, walk-off; runs the whole sequence)
js/ending/              the plane, the crew (the three who rebuild and hold the stack)
js/scene/               sky & city (+ the sun), environment (storm → sunny day via SUN), countdown, shake/flash
js/fx/                  canvas particles (sparks, dust, smoke, rain, hearts, the cat's Zzz)
js/features/            self-contained extras: the couch, the cat who lives on it (guests/), cxaduri peeking in, io popping up
js/main.js              the frame loop
js/controls.js          keyboard, fullscreen, keep-awake
assets/images/          images used by the page; assets/images/source/ holds originals that aren't loaded
```

The scripts are plain `<script>` files that share one scope, so later files can use anything earlier ones define —
**load order in `index.html` matters**.

## Adding a feature

1. Create `js/features/my-feature.js`:

   ```js
   'use strict';
   // ───────────────────────── my feature: what it does
   addFeature({
     update(dt, rem) {             // every frame; dt = seconds since last frame, rem = ms left on the countdown
       if (heroTime(rem)) return;  // the last 10 min + the whole ending belong to the hero
       // …
     },
     keys: { m: () => { /* … */ } },   // optional shortcuts (matched on e.key, then e.code)
   });
   ```

2. Add `<script src="js/features/my-feature.js"></script>` inside the `<!-- features -->` block in `index.html`.
3. Put any images in `assets/images/` with a descriptive kebab-case name (`who-what.jpg`).

A new **guest** character goes in `js/features/guests/` next to `cat.js`; `guests.js` has the shared bits (`faceHead`, `say`).
The three crew members (faces, clothes, order) are listed at the top of `js/ending/crew.js`; their photos are
`assets/images/{s1,n1,l1}-face.jpg` (cropped from the originals in `assets/images/source/`).

Handy helpers: `el(tag, attrs, parent)` makes SVG elements, `rand`, `pick`, `lerp`, `clamp`, `smooth`, `backOut`, `smoothClosed(points)` (outline → smooth path), `say(who, text, secs)`
for a guest speech bubble, `add({...})` for a particle. `T` is seconds since load, `D` is danger 0…1.

## Keys

`0`–`9` preview danger level · `z` jump to 10 s before zero · `r` back to real time · `f` / double-click fullscreen ·
`c` wake the cat up / make it talk · `t` cat's show · `x` cxaduri peeks in · `i` io pops up ·
`p` show / hide the list of controls on screen (the list lives in `js/controls.js`)

URL: `?t=15` start 15 s before zero (`?t=-30` = 30 s after) · `?d=0.7` danger level · `?at=2026-11-11T16:00:00+04:00`.
Opening the page more than 90 s after zero skips straight to the final scene.

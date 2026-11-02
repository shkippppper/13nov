# 13nov

A countdown to Nikoloz's last day: he holds up a tower of servers that gets wobblier as zero gets closer, then it all comes down.
No build step — open `index.html` in a browser (or serve the folder). Add `?full` to the URL for the heavy-effects mode.

## Layout

```
index.html              markup only (the SVG scene + overlays) and the list of scripts, in load order
css/                    base (stage, overlays), countdown, speech bubbles
js/core/                config (dates, lite mode), helpers, time & danger, stage fit, element refs, state, feature hooks
js/tower/               item drawings, the tower, its geometry, junk falling from the sky
js/hero/                calm phase, foreshadowing events, collapse
js/scene/               night sky & city, environment (storm, gloom, gadgets), countdown, shake/flash
js/fx/                  canvas particles (sparks, dust, smoke, rain, hearts)
js/features/            self-contained extras: guests (the cat), cxaduri peeking in
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
       if (heroTime(rem)) return;  // last 10 min + the collapse belong to the hero
       // …
     },
     keys: { m: () => { /* … */ } },   // optional shortcuts (matched on e.key, then e.code)
   });
   ```

2. Add `<script src="js/features/my-feature.js"></script>` inside the `<!-- features -->` block in `index.html`.
3. Put any images in `assets/images/` with a descriptive kebab-case name (`who-what.jpg`).

A new **guest** (someone who wanders in like the cat) goes in `js/features/guests/` and joins the rotation with
`GUESTS.push(myGuest)` — see `cat.js` for the shape a guest needs.

Handy helpers: `el(tag, attrs, parent)` makes SVG elements, `rand`, `pick`, `lerp`, `clamp`, `smooth`, `say(who, text, secs)`
for a guest speech bubble, `add({...})` for a particle. `T` is seconds since load, `D` is danger 0…1.

## Keys

`0`–`9` preview danger level · `z` jump to 10 s before zero · `r` back to real time · `f` / double-click fullscreen ·
`c` call the cat · `t` cat's show · `x` cxaduri peeks in

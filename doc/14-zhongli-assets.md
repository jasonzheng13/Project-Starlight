# Zhongli chapter assets

The constellation outline and six anchor positions are authored paths traced from the user's September 24, 2026 screenshot, normalized to the same 600 × 700 coordinate plane as Jean. `chapter-art.ts` supplies paths, edges, and memory-node mappings to the shared Three.js renderer. CSS changes the scene to amber while retaining the existing motion and effects.

## Emblems

The six unmodified PNGs under `public/constellations/zhongli/` were downloaded from image links on [Genshin.gg's Zhongli page](https://genshin.gg/characters/zhongli/), matching the second supplied screenshot:

1. Rock, the Backbone of Earth
2. Stone, the Cradle of Jade
3. Jade, Shimmering through Darkness
4. Topaz, Unbreakable and Fearless
5. Lazuli, Herald of the Order
6. Chrysos, Bounty of Dominator

Source pattern: `https://sunderarmor.com/GENSHIN/Skill/1/Zhongli/constellation_N.png` for N = 1–6. Artwork belongs to Genshin Impact's rights holders; the mirror is not a grant of reuse rights. The emblems are decorative; the surrounding buttons provide accessible labels.

## Transition research

The user replaced the doorway concept with the white seven-element title-entry loading screen. The [loading-screen reference](https://genshin-impact.fandom.com/wiki/Loading_Screen) distinguishes this variant from teleport loading screens with regional symbols and tips.

The clean element strip comes from [healer-op's loading-screen recreation](https://github.com/healer-op/Genshin-Teleport-Loading-Screen), at `Images/loading-bar.png`. Its actual format is WebP, retained unchanged locally as `public/transitions/elements.webp`. The artwork belongs to Genshin Impact's rights holders. The recreation's stylesheet demonstrates a left-to-right reveal; its code is not bundled. Exact in-game disappearance/reappearance timing was not independently verified.

Our animation follows the user's requested disappearance/return behavior: Pyro, Hydro, Anemo, Electro, Dendro, Cryo, Geo fade out and return in a staggered wave on white. One cycle lasts 2400 ms, and the chapter switches under the opaque screen at 1100 ms. These are authored preview timings, not claimed frame-exact game timings. The image is preloaded; luminance masks isolate its white symbols from dark outlines. Reduced motion and sky pause bypass the transition. Navigation stays guarded against overlapping transitions.

## Pending media

Six second-year memories remain empty and do not make media requests. The development music allowlist reserves `music/liyue.mp3`; until supplied, the existing music controls show “Soundtrack not available yet.” No OST has been downloaded for this chapter.

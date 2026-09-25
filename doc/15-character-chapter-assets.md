# Character chapter assets

The reference illustrations were supplied by the user on September 24, 2026. Their constellation drawings have been authored as replaceable SVG line paths in `src/features/constellations/chapter-art.ts`; they are visual approximations rather than extracted game artwork.

Six C1–C6 PNG emblems for each character are stored under `public/constellations/neuvillette/`, `public/constellations/baizhu/`, and `public/constellations/yae-miko/`. They were obtained through the image links on [Genshin.gg's Neuvillette page](https://genshin.gg/characters/neuvillette/), [Baizhu page](https://genshin.gg/characters/baizhu/), and [Yae Miko page](https://genshin.gg/characters/yaemiko/). The direct image pattern is `https://sunderarmor.com/GENSHIN/Skill/1/{character}/constellation_N.png` for N = 1–6; the source uses `Neuvillette2`, `Baizhu`, and `Yae Miko`. Names and order follow those character pages and the supplied screenshots. Artwork belongs to Genshin Impact's rights holders; these mirrors do not grant reuse rights.

| Year | Character   | Theme          | Soundtrack     |
| ---- | ----------- | -------------- | -------------- |
| III  | Neuvillette | Hydro blue     | Not configured |
| IV   | Baizhu      | Dendro green   | Not configured |
| V    | Yae Miko    | Electro violet | Not configured |

Each has six year-scoped placeholder IDs. Empty slots do not request a photo or increment progress. The user's quotes live in the chapter configuration. Add music only after the user chooses tracks.

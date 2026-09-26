# Project Starlight

Temporary name for a private fifth-anniversary constellation scrapbook.

Five local chapters are available: Jean (Year I), Zhongli (Year II), Neuvillette (Year III), Baizhu (Year IV), and Yae Miko (Year V). Each has six memory stars, a keyboard-accessible viewer, and session-only illumination. Jean has three supplied photos; Years II–V have empty placeholders. The intended gift date is September 28, 2026. Authentication, database persistence, and deployment are still ahead.

## Run locally

Requires Node.js 22+ and npm. From this repository:

```sh
npm ci
cp .env.example .env.local # macOS: enable the local media preview
npm run dev
```

Open **http://127.0.0.1:3000**. The dev server listens only on this computer. Fonts are bundled locally; no font CDN is needed.

The supplied photos in `pictures/first_year/` and audio in `music/` are tracked so a clone or pull includes them. Copy `.env.example` to `.env.local` on a new computer (PowerShell: `Copy-Item .env.example .env.local`). The example enables `LOCAL_PRIVATE_MEDIA=true`; local secrets remain ignored. Originals display at their original proportions. Titles and notes are drafts.

This is a local preview, not authenticated hosting. `/api/local-media/[id]` uses a fixed filename allowlist, requires the local flag and development mode, and returns 404 in production even if the flag is enabled. Do not put private images in `public/` or deploy this adapter as a private-access solution.

## Development checks

### Music

Cat B is the selected header mascot. Click the cat to open the volume slider, play/pause, and mute controls. The player attempts autoplay at 30% volume and loops; browsers may require clicking the cat or Play before audible playback is allowed. Music continues inside memory dialogs and stops on the overview. Settings currently last for the mounted page session.

Year I uses the supplied `music/sfx/City of Winds and Idylls - Disc 1 City of Winds and Idylls｜Genshin Impact.mp3` (tracked for cross-computer development). The page passes its soundtrack to the cat controls; the overview and chapters without a soundtrack are silent, and leaving a constellation stops and resets the track. Memory dialogs keep it playing. Year II selects Liyue; place the forthcoming track at `music/liyue.mp3`. Until then, the controls report that its soundtrack is not available. Years III–V have no soundtrack source configured and remain silent. The development-only `/api/local-music?constellation=year-1` endpoint maps the ID to a fixed local file, supports byte-range streaming, and returns 404 in production or for unknown IDs. A missing file shows a recoverable unavailable state. Automated tests use a generated silent WAV.

Add the remaining first-year photos as `pictures/first_year/first_year_4.png`, `first_year_5.png`, and `first_year_6.png`. The route already accepts them. Missing photos show an awaiting-content message; retry loads a newly added file without a code change. Progress increases only when a photo loads successfully.

| Command                | Purpose                                                               |
| ---------------------- | --------------------------------------------------------------------- |
| `npm run dev`          | Start the local development preview                                   |
| `npm run lint`         | Check Next.js, React, and TypeScript conventions                      |
| `npm run typecheck`    | Check TypeScript without emitting code                                |
| `npm run format`       | Format source and configuration with Prettier                         |
| `npm run format:check` | Verify source formatting without changes                              |
| `npm test`             | Run browser behavior checks using installed Google Chrome             |
| `npm run build`        | Compile and type-check the production application                     |
| `npm start`            | Preview the production build locally; private photo route is disabled |

Playwright uses synthetic images for behavior tests. An additional local-only check verifies supplied photos if present. Screenshots stay in ignored `.local/` or `test-results/`; do not share private screenshots. A fresh clone includes the supplied media; copy the example environment file to enable the local preview.

## First slice: how the pieces connect

- `src/features/memories/memories.ts`: stable memory IDs. Visual positions belong to `chapter-art.ts`, keeping memory content independent of the constellation shape. `chapters.ts` binds year, quote, art, theme, photo placeholders, emblem names, and optional soundtrack for all five pages.
- `src/features/constellations/constellation-experience.tsx`: selected memory, overview navigation, and in-memory viewed IDs.
- `src/features/constellations/space-scene.tsx`: Three.js rendering, animated teal nebula shader, layered particles, star flares, pointer parallax, and projected HTML hit targets. Reduced motion and pause freeze rendering; WebGL failure leaves memory navigation available.
- `src/features/constellations/chapter-art.ts`: authored linework and six star anchors for all five character references. Each star opens the matching year-specific memory.
- `src/features/constellations/mascot-brand.tsx`: selected Cat B, audio playback state, and accessible volume popover. Assets and edit prompts are documented in [the mascot notes](doc/11-mascot-assets.md).
- `src/app/jean-theme.css` and `src/app/character-themes.css`: each character's palette and shared layout styling. The left panel uses the user's supplied quote; the bottom footer and decorative captions are removed.
- `src/app/constellation-menu.css` and `src/features/constellations/memory-emblem.tsx`: reference-informed curved right-side menu, the original game emblems, and hover/focus/viewed styling. Memory selection still uses the same stable IDs.
- `src/features/memories/memory-viewer.tsx`: native dialog gallery, isolated photo focus, loading/error/retry, and previous/next controls.
- `src/app/api/local-media/[id]/route.ts`: development-only filesystem adapter, to be replaced with authorized storage access.
- `tests/constellation.spec.ts`: behavior checks for navigation, failures, stale requests, focus, and responsive/reduced-motion behavior.

Clicking a star selects its ID. The viewer looks up that moment’s photo list in `gallery-photos.ts`. Successfully opening a full photo adds the memory ID to the viewed set; loading thumbnails or opening empty preview slots does not. The scene derives illumination from that set, so reopening a memory never double-counts it. Reloading clears this session-only state. Years II–V placeholders do not request photos or increase progress. Switching between chapters previews a 2.4-second white loading screen with seven elemental emblems disappearing and returning; reduced motion or paused sky skips it. Visual review and the next implementation task follow the user’s priorities.

## Start here

Read [the master specification](doc/00-master-spec.md), then follow [the build plan](doc/08-build-plan.md). Build one small, complete experience at a time. The specifications describe the full intended behavior; this README describes the implemented slice.

| Document                                                                  | What it answers                                                            |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [00 Master specification](doc/00-master-spec.md)                          | What are we making and why?                                                |
| [01 Application architecture](doc/01-architecture.md)                     | How do the pieces work together?                                           |
| [02 Private access and data](doc/02-private-access-and-data.md)           | Who can access memories, and how are they stored?                          |
| [03 Content and media](doc/03-content-and-media.md)                       | How do photos, videos, notes, and drawings enter the app?                  |
| [04 Constellation experience](doc/04-constellation-experience.md)         | How does exploration work?                                                 |
| [05 Progress and ending](doc/05-progress-and-ending.md)                   | What lights up, what is saved, and how does the gift end?                  |
| [06 Hand-drawn loading](doc/06-hand-drawn-loading.md)                     | How do personal drawings become useful loading animations?                 |
| [07 Infrastructure and release](doc/07-infrastructure-and-release.md)     | How do we deploy, protect, monitor, and preserve it?                       |
| [08 Build plan](doc/08-build-plan.md)                                     | What do we build next, and how do we know it is ready?                     |
| [09 Optional AI memory search](doc/09-optional-ai-memory-search.md)       | What AI feature remains on the roadmap?                                    |
| [10 Decisions and open questions](doc/10-decisions-and-open-questions.md) | What is agreed, proposed, or still unknown?                                |
| [12 UI audio](doc/12-ui-audio.md)                                         | Where do the local effects come from, and how do playback and volume work? |

## Documentation approach

Use a short master document plus focused feature specs. Keep requirements in their owning file and link to them rather than copying them everywhere. Markdown keeps the documents readable in a code editor and easy to review alongside code changes.

When a meaningful decision changes, update the affected spec and record why in the decision log. A small project does not need a large approval process. The original research is background; the user's later choices are the basis for this plan.

## Preparing gallery photos

Each star opens one moment with its own photo list in `src/features/memories/gallery-photos.ts`. The six decorative empty cards are preview slots, not a six-photo limit. Existing photos remain in their separate moments until you choose their final grouping. Captions are not displayed.

To add a picture:

1. Keep its file under `pictures/first_year/` for the current local adapter.
2. Add a unique photo ID and filename to the explicit `files` allowlist in `src/app/api/local-media/[id]/route.ts`. The adapter currently serves PNG files.
3. Append `{ id: "your-photo-id", alt: "An accurate description" }` to the appropriate memory’s array in `gallery-photos.ts`. Array order is display order. Multiple photo IDs can belong to the same moment.

For other folders or formats, extend the server’s explicit mapping and MIME handling; never accept a browser-supplied filesystem path. Development mode and `LOCAL_PRIVATE_MEDIA=true` remain required. Thumbnail cards currently load the originals; image derivatives are future work.

Click a card to isolate it, use arrow keys or the round arrows to browse, and press Escape to return to the grid. A second Escape closes the gallery. Empty slots preview the same interaction without requesting a missing file or illuminating a star.

## 1080p video entrance

The entrance uses the user's replacement `music/sfx/GENSHIN IMPACT _ CELESTIA DOOR _ LOADING SCREEN (1).mp4`, verified at 1920×1080 and approximately 17 seconds. The Three.js recreation was removed at the user's request. The recording keeps its original proportions, with the bottom 8% clipped to remove the account text and version number; other viewport shapes receive letterboxing. The remaining recorded game UI stays visible. Only the overlaid Start Game hit target is interactive; recorded controls are part of the footage.

Provisional timing is centralized in `src/features/intro/intro-timing.ts`: loop the cursor-free 0.15–1.05 second section at half speed with a brief dissolve on rewind, restore normal speed and continue the remaining clip on Start, and reveal Jean at 15.7 seconds. The loading segment currently remains in the clip, pending the user's requested cut points. Source footage is not modified. The real button overlays the recorded Start Game label to avoid duplicate text and retains a keyboard focus outline.

`/api/local-intro` serves the fixed filename with bounded byte ranges under the development/loopback/`LOCAL_PRIVATE_MEDIA=true` gate. No video moves into public assets. Playback is muted; constellation music starts after entry. Reduced motion pauses on a still frame and enters immediately. Playback failure preserves entry; a 20-second timeout bounds stalls. Reloading returns to the entrance.

The entrance now plays Twilight Serenity independently of the scenery loop, then switches to the recording's audio at the door sequence (12 seconds). Start has a preloaded button sound. Browsers that block audible autoplay require a click or keypress before music starts. Intro audio stops before the first constellation mounts; all sources retain the development-only local-media gate. See `music/sfx/INTRO-SOURCES.md` for provenance.

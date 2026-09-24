# Project Starlight

Temporary name for a private fifth-anniversary constellation scrapbook.

The first local slice is working: one constellation with six memory stars, a keyboard-accessible viewer, and session-only illumination. Three photos are supplied; the other three slots await content. The intended gift date is September 28, 2026. Authentication, database persistence, the other four chapters, and deployment are still ahead.

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

Year I uses the supplied `music/sfx/City of Winds and Idylls - Disc 1 City of Winds and Idylls｜Genshin Impact.mp3` (tracked for cross-computer development). The page passes its soundtrack to the cat controls; the overview is silent, and leaving the constellation stops and resets the track. Memory dialogs keep it playing. Future pages select their own soundtrack. The development-only `/api/local-music?constellation=year-1` endpoint maps the ID to a fixed local file, supports byte-range streaming, and returns 404 in production or for unknown IDs. A missing file shows a recoverable unavailable state. Automated tests use a generated silent WAV.

Add the remaining first-year photos as `pictures/first_year/first_year_4.png`, `first_year_5.png`, and `first_year_6.png`. The route already accepts them. Missing photos show an awaiting-content message; retry loads a newly added file without a code change. Progress increases only when a photo loads successfully.

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local development preview |
| `npm run lint` | Check Next.js, React, and TypeScript conventions |
| `npm run typecheck` | Check TypeScript without emitting code |
| `npm run format` | Format source and configuration with Prettier |
| `npm run format:check` | Verify source formatting without changes |
| `npm test` | Run browser behavior checks using installed Google Chrome |
| `npm run build` | Compile and type-check the production application |
| `npm start` | Preview the production build locally; private photo route is disabled |

Playwright uses synthetic images for behavior tests. An additional local-only check verifies supplied photos if present. Screenshots stay in ignored `.local/` or `test-results/`; do not share private screenshots. A fresh clone includes the supplied media; copy the example environment file to enable the local preview.

## First slice: how the pieces connect

- `src/features/memories/memories.ts`: stable IDs and draft captions. Visual positions belong to `jean-art.ts`, keeping memory content independent of the constellation shape.
- `src/features/constellations/constellation-experience.tsx`: selected memory, overview navigation, and in-memory viewed IDs.
- `src/features/constellations/space-scene.tsx`: Three.js rendering, animated teal nebula shader, layered particles, star flares, pointer parallax, and projected HTML hit targets. Reduced motion and pause freeze rendering; WebGL failure leaves memory navigation available.
- `src/features/constellations/jean-art.ts`: authored lion linework and six star anchors based on the supplied Jean reference. Each opens a distinct memory; the original three keep their existing positions.
- `src/features/constellations/mascot-brand.tsx`: selected Cat B, audio playback state, and accessible volume popover. Assets and edit prompts are documented in [the mascot notes](doc/11-mascot-assets.md).
- `src/app/jean-theme.css`: Jean's teal-green palette and pared-back layout. The left panel uses the user's supplied quote; the bottom footer and decorative captions are removed.
- `src/app/constellation-menu.css` and `src/features/constellations/memory-emblem.tsx`: reference-informed curved right-side menu, six original emblems, and hover/focus/viewed styling. Memory selection still uses the same stable IDs.
- `src/features/memories/memory-viewer.tsx`: native dialog, photo loading/error/retry, enlargement, and previous/next controls.
- `src/app/api/local-media/[id]/route.ts`: development-only filesystem adapter, to be replaced with authorized storage access.
- `tests/constellation.spec.ts`: behavior checks for navigation, failures, stale requests, focus, and responsive/reduced-motion behavior.

Clicking a star selects its ID. The viewer requests that ID's photo; a successful load adds the ID to the viewed set. The scene derives illumination from that set, so reopening a memory never double-counts it. Reloading clears this session-only state. Next comes visual review on the presentation computer, then a protected backend for one memory before expanding the collection.

## Start here

Read [the master specification](doc/00-master-spec.md), then follow [the build plan](doc/08-build-plan.md). Build one small, complete experience at a time. The specifications describe the full intended behavior; this README describes the implemented slice.

| Document | What it answers |
|---|---|
| [00 Master specification](doc/00-master-spec.md) | What are we making and why? |
| [01 Application architecture](doc/01-architecture.md) | How do the pieces work together? |
| [02 Private access and data](doc/02-private-access-and-data.md) | Who can access memories, and how are they stored? |
| [03 Content and media](doc/03-content-and-media.md) | How do photos, videos, notes, and drawings enter the app? |
| [04 Constellation experience](doc/04-constellation-experience.md) | How does exploration work? |
| [05 Progress and ending](doc/05-progress-and-ending.md) | What lights up, what is saved, and how does the gift end? |
| [06 Hand-drawn loading](doc/06-hand-drawn-loading.md) | How do personal drawings become useful loading animations? |
| [07 Infrastructure and release](doc/07-infrastructure-and-release.md) | How do we deploy, protect, monitor, and preserve it? |
| [08 Build plan](doc/08-build-plan.md) | What do we build next, and how do we know it is ready? |
| [09 Optional AI memory search](doc/09-optional-ai-memory-search.md) | What AI feature remains on the roadmap? |
| [10 Decisions and open questions](doc/10-decisions-and-open-questions.md) | What is agreed, proposed, or still unknown? |
| [12 UI audio](doc/12-ui-audio.md) | Where do the local effects come from, and how do playback and volume work? |

## Documentation approach

Use a short master document plus focused feature specs. Keep requirements in their owning file and link to them rather than copying them everywhere. Markdown keeps the documents readable in a code editor and easy to review alongside code changes.

When a meaningful decision changes, update the affected spec and record why in the decision log. A small project does not need a large approval process. The original research is background; the user's later choices are the basis for this plan.

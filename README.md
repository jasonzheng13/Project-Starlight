# Project Starlight

Temporary name for a private fifth-anniversary constellation scrapbook.

The first local slice is working: one original constellation, three photo memories, a keyboard-accessible viewer, and session-only illumination. The intended gift date is September 28, 2026. Authentication, database persistence, the other four chapters, and deployment are still ahead.

## Run locally

Requires Node.js 22+ and npm. From this repository:

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:3000**. The dev server listens only on this computer. Fonts are bundled locally; no font CDN is needed.

For the supplied photo preview, put `first_year_1.png`, `first_year_2.png`, and `first_year_3.png` in `pictures/first_year/`. Copy `.env.example` to `.env.local` and set `LOCAL_PRIVATE_MEDIA=true`. The existing local workspace is already configured. Photos and `.env.local` are ignored by Git. Originals remain unchanged and display at their original proportions. Titles and notes are clearly marked drafts in the viewer.

This is a local preview, not authenticated hosting. `/api/local-media/[id]` uses a fixed filename allowlist, requires the local flag and development mode, and returns 404 in production even if the flag is enabled. Do not put private images in `public/` or deploy this adapter as a private-access solution.

## Development checks

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

Playwright uses synthetic images for behavior tests. An additional local-only check verifies supplied photos if present. Screenshots stay in ignored `.local/` or `test-results/`; do not share private screenshots. A fresh clone works without personal photos and shows a recoverable photo error until configured.

## First slice: how the pieces connect

- `src/features/memories/memories.ts`: stable IDs, draft captions, and authored star positions.
- `src/features/constellations/constellation-experience.tsx`: selected memory, overview navigation, and in-memory viewed IDs.
- `src/features/constellations/sky.tsx`: original SVG art and deterministic starfield; CSS supplies glow and atmosphere.
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

## Documentation approach

Use a short master document plus focused feature specs. Keep requirements in their owning file and link to them rather than copying them everywhere. Markdown keeps the documents readable in a code editor and easy to review alongside code changes.

When a meaningful decision changes, update the affected spec and record why in the decision log. A small project does not need a large approval process. The original research is background; the user's later choices are the basis for this plan.

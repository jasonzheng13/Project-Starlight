# Build plan

Status: first local constellation slice implemented September 22, 2026. Following visual review on September 23, Three.js replaces the static scene with a teal Jean-inspired lion constellation. One year has three clickable photo memories, a viewer with loading/error/retry, and session-only illumination. Revised visual review is next. Private backend access, importing, durable progress, and the remaining chapters are not implemented.

## Work in complete slices

Each slice produces something usable and includes its backend behavior, visible experience, and relevant checks. Avoid finishing all database work before seeing a single real memory on screen.

| Target dates in 2026 | Slice | Exit check |
|---|---|---|
| September 17–18 | First constellation | One attractive constellation, three representative memories, placeholder personal loader, basic controls; choose rendering approach |
| September 19–21 | Complete private chapter | Real database and private storage, repeatable import, saved progress, one full year, rough final-message route; unauthorized-user checks pass |
| September 22–24 | Full gift | All five years, personal notes, actual drawings, illumination and final reveal; complete journey works |
| September 25–26 | Quality and reliability | Real-computer performance, loading/error states, audio if used, access tests, content review, deploy and backup |
| September 27 | Rehearsal and freeze | Full presentation rehearsal, recovery plan, fixes only |
| September 28 | Anniversary | Open prepared private session and share the experience |

Dates are targets, not feasibility guarantees. Reassess after the first slice. The developer's primary learning focus is backend application work, so protected data, import safety, server validation, and persistence deserve deliberate attention.

## First working session

1. Record the target computer/browser and select three actual memories.
2. Scaffold the app with synthetic fixtures first; no provider spending is necessary yet.
3. Build the overview, one constellation, and the memory viewer.
4. Compare the visual result against the intended feeling and references.
5. Add one real authorized data flow before expanding to five years.

## Content track alongside implementation

Choose symbols later without blocking IDs or navigation. Start selecting memories and writing notes now. By the full-gift slice, supply the selected media, five constellation symbols or acceptable placeholders, loading artwork, and final letter. Final notes need time for revision just as code does.

## AI entry gate

Consider [AI memory search](09-optional-ai-memory-search.md) only once all five chapters and the ending work, access checks pass, the real-device rehearsal is healthy, and budget/time remain. Keep it behind a setting and removable without changing the gift journey. If those conditions are not met by September 25, schedule AI after the anniversary.

## If work slips

First remove optional ambience, extra media, elaborate effects, and AI. Keep five years represented with fewer well-chosen memories if needed. Preserve private access, readable notes, clear navigation, personal drawings, and a reliable ending.

## Portfolio work after the gift

Create a synthetic public dataset, a short demo video, and a concise engineering case study. Explain what was actually built, what was managed by providers, what AI assisted with, and what tradeoffs the developer made. Include measured load times, representative access tests, and failure recovery evidence rather than unverified scale claims.

## Learning review at each slice

- Explain one request from browser to server to database.
- Explain a failure case and show its recovery behavior.
- Explain one tradeoff and why the simpler or more complex option was chosen.
- Record one thing learned without relying on generated explanations that have not been checked against the code.

# Content and media

## User outcome

Every star opens a chosen memory quickly, with a photo or video and a personal note. The import workflow lets the developer prepare content without spending the anniversary window building an admin dashboard.

## Current gallery preview (September 26)

Each of the thirty memory stars opens a gallery for one moment. `gallery-photos.ts` owns ordered photo IDs and accessible descriptions; the local media route owns the filesystem allowlist. Existing first-year photos remain in their original separate moments. Empty moments show six word-free ornamental preview cards, and longer photo arrays expand the grid. No captions or personal messages are supplied or displayed by the gallery.

A card opens a separate focused view with the full image contained without cropping. The grid is removed from keyboard navigation while focused. Escape returns focus to the selected card; another Escape returns to the opening star or emblem. Full-photo load success illuminates the memory once per session; thumbnails, missing files, and empty previews do not. Failures expose an icon retry control with an accessible name. Reduced motion and paused sky disable gallery animations.

The following importer/video requirements remain proposed; the local preview currently supports PNG photos through its development-only route. The user has authorized tracking development photos and music in the private repository; see the current private-data rules.

## Content preparation

Start with five key memories per year. For each, supply a stable ID, year, title, note, optional date, local media path, and order. Select a cover image for videos. Notes should answer a personal question such as what the developer remembers, appreciates, or noticed about her in that moment.

Create a local JSON manifest validated against a schema. Private manifests and original media stay outside source control. Commit only the format, importer, and synthetic examples. Placeholder constellation IDs remain stable when symbols change.

## Import workflow

1. Dry-run validation reports missing files, duplicate IDs, unsupported types, invalid years, and empty required text before uploading anything.
2. Prepare browser-friendly image/video variants and record dimensions/duration. Test actual phone formats on the presentation browser rather than assuming they play.
3. Upload originals and derivatives to private paths.
4. Upsert metadata using stable IDs; rerunning the same import must not create duplicates.
5. Mark an asset ready only after its required variant exists.
6. Produce a local report listing successes and failures without exposing secrets.

This can run locally. A permanent queue is deferred until a real need exists. An interrupted run must resume safely. Changing an asset should use a new versioned object key; old-object cleanup is explicit so replacements are not accidentally deleted.

## Viewer behavior

- Show a preview before fetching full-resolution content.
- Fetch full media for the selected memory; preload only the likely next item when useful.
- Preserve photo proportions and allow enlargement.
- Video has visible play/pause, volume, and retry controls. Do not rely on autoplay with sound.
- Text remains readable when an asset fails. Offer retry and continue.
- Memory controls work by mouse and keyboard; include meaningful image descriptions.
- Navigating away stops video/audio and cancels irrelevant requests where practical.

## Acceptance checks

- Import the same three-memory fixture twice and observe no duplicates.
- An interrupted upload can be retried without an apparently ready broken record.
- A mixed photo/video year plays on the actual presentation computer.
- Missing media produces a readable note and recovery controls.
- Loading a year does not download all full-size videos.
- Private filenames, media, and personal notes are absent from the public source repository.

Depends on [private data rules](02-private-access-and-data.md). Loading presentation follows [the drawing spec](06-hand-drawn-loading.md).

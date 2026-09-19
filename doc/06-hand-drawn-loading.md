# Hand-drawn loading animations

## Purpose

The developer wants to draw cute loading artwork personally. This is part of the gift's identity and a direct connection to the recipient's tradition of drawing anniversary gifts.

## Required behavior

- Use original hand-drawn art during initial loading and genuine waits between constellations or memories.
- Begin with a placeholder that uses the same layout and animation interface; replace it when drawings are ready.
- A small set of frames or a gently animated single drawing is enough. Scan/photograph, clean up, and export at appropriate resolution.
- Do not add artificial delays just to display the drawing. If content is ready, continue promptly.
- During a short navigation transition, the art may appear as a brief decorative element without claiming something is still loading.
- Do not show fabricated percentages. Use simple text such as “Opening this memory” unless real measurable progress exists.
- Keep the animation subtle, with a still-image reduced-motion version.
- Long waits expose retry and back controls; errors do not loop a cheerful animation forever.

## Application states

Idle -> loading destination -> ready -> transition completed.

Loading destination may instead become failed or cancelled. Only the currently selected destination may replace the active view. Keep the existing scene visible where possible instead of blanking the whole screen for every asset request.

## Suggested first asset

One small personal character carrying a star, drawing a line between stars, or waving from a moon. This is a suggestion, not an agreed design. Final character, colors, and frame count are up to the developer.

## Acceptance checks

- A slow asset shows the drawing and a readable status.
- Cached navigation is not held back by a minimum animation duration.
- A failed request offers retry/back; a cancelled request cannot take over the screen later.
- Reduced-motion preference produces a calm still version.
- Animation files are small enough that loading the loader does not become its own delay.
- The artwork works at the actual presentation screen size.

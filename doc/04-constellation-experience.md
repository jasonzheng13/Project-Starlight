# Constellation experience

## User outcome

Explore five years as five personal constellations. The scene should be attractive and understandable, with no puzzles, free-flight learning curve, or need to ask the developer where to click.

## Required behavior

- Overview shows five selectable year constellations with readable labels.
- Selecting a year moves to an authored viewpoint and exposes its memory stars.
- Selecting a star opens the memory viewer; viewed stars have a distinct visual treatment.
- Connecting lines and the underlying drawing gradually illuminate as memories are opened.
- A visible back control returns to the overview. A simple year/memory list provides alternative navigation.
- Star hit areas are comfortably larger than their tiny visible centers.
- Repeated rapid selections resolve to the latest destination; old loads do not reopen a previous memory.
- Pointer hover is helpful but never the only way to discover information.

## Art direction

September 24–25 chapter additions: Years III–V bring Neuvillette, Baizhu, and Yae Miko from the supplied references into the shared chapter experience. Each has an authored constellation outline, six game constellation emblems, the requested quote, a character-specific palette, and six intentional photo placeholders. No music source is assigned to these chapters. IDs use `year-N-memory-M`; progress remains per year. See [character chapter assets](15-character-chapter-assets.md).

September 24 Zhongli chapter: Year II follows the supplied amber Lapis Dei screenshot with authored outline paths, six interactive stars, and Zhongli's six original emblems and labels. The left quote is “Osmanthus wine tastes the same as I remember... But where are those who share the memory?” All six memory slots are intentional placeholders: no photo request, retry control, or illumination until content is implemented. Reuse the existing sky motion, pointer response, viewer navigation, and UI effects. Chapter progress is isolated by stable year-specific IDs. Liyue is reserved at `music/liyue.mp3`; missing audio remains unavailable.

Navigation between any two chapters previews the user's white seven-element loading screen: a staggered disappearance/return wave over 2.4 seconds, with the chapter change under opaque white at 1.1 seconds. Preload the emblem strip, clean up timers on unmount, and prevent overlapping transitions. Reduced motion and the pause control use instant navigation. The same transition connects all five available chapters. Source research and art provenance: [Zhongli assets](14-zhongli-assets.md). This replaces the initial doorway-glow preview.

September 24 right-menu fidelity pass: compare against [Jean's in-game constellation menu on HoYoLAB](https://www.hoyolab.com/article/346366). Arrange six round emblems on a shallow arc with a subdued curved connector. Use a single bold cream title per entry, removing memory-number labels, repeated opening instructions, and chevrons. Original sword, shield, wing, dandelion, wind, and lion emblems replace the repeated star. Hover, focus, and viewed states glow teal. All memories remain accessible rather than displaying misleading game-style locks. Georgia Bold approximates the reference's weight; neither the font nor the emblems are exact game assets. At tablet widths, use two columns to preserve readable titles.

September 24 follow-up: Cat B is selected. Clicking it opens a compact volume slider underneath, plus play/pause and mute. Attempt the requested looping Mondstadt soundtrack on page entry at 30% volume, but handle browser autoplay rejection by allowing a cat/Play click to start it. Keep audio mounted across memory and overview navigation. The actual track file is pending; do not imply music is playing when unavailable.

September 24 update: all six Jean anchors now open distinct memory slots. Preserve the original three IDs and positions; memories 4–6 await photos. Missing content does not advance illumination. Two transparent cat mascot variants can be compared with temporary A/B header controls; see [mascot assets](11-mascot-assets.md). Final choice is pending. This supersedes the three-active-anchor count in the initial review below.

September 23 visual review: the user rejected the first SVG/CSS scene as too plain and static and explicitly selected Three.js. Year I follows the supplied Jean constellation reference: a dark teal-green Anemo sky, organic moving nebulae, small stars at varied depths, a lion outline, thin luminous connections, and bright white-green flares. The intended feeling mixes illustrated artwork with realistic light and depth. Six anchor stars form the shape; three currently carry memories. Years II–V are now implemented as character chapters; refine their linework after visual review.

Use the user's exact left-panel quote: “I am Jean, the Dandelion Knight, requesting approval to join your party. From this day onwards, my honor and loyalty lie with you.” Remove the bottom footer and decorative captions. Keep the scene dominant and controls restrained. The current lion is authored linework based on the supplied reference, not an extracted game asset; visual fidelity remains subject to user review.

Use the supplied references for luminous stars, thin connecting lines, a restrained colored drawing, and a dark background. Choose personal shapes later. Do not let missing final symbols block the first chapter: use an original placeholder outline with replaceable art.

Layered depth is enough; fully realistic space simulation is unnecessary. Start with one coherent palette, readable typography, and gentle movement. The user subsequently requested original constellation emblems; see the chapter asset provenance notes.

## Accessibility and performance

Support keyboard access, visible focus, readable contrast, and reduced motion. Avoid flashing effects. Reduced-motion mode uses short fades or instant navigation. Provide a simpler list-based view if the graphics cannot initialize.

Provisional performance targets on the named presentation computer: usable initial scene within 5 seconds on the rehearsal connection; approximately 50–60 FPS during ordinary movement; immediate visible feedback after selection. These are test targets, not measured results. Record actual device, browser, network, scene size, and measurements; simplify effects if necessary.

## First proof

Build one constellation with three real memories and representative art, movement, viewer, and loading states. Evaluate it at full screen on the intended computer. This is a quality checkpoint before multiplying it into five years.

## Done when

A person unfamiliar with the controls can open a memory, return, and change years; the same actions work from the alternative list; failed graphics do not hide the story; replacing a symbol requires content/art changes rather than rewriting navigation.

## September 26 gallery revision

All five chapters use the gallery behavior owned by [content and media](03-content-and-media.md#current-gallery-preview-september-26). Right-side emblems retain their curved placement, accessible labels, effects, and focus states; visible labels are removed. Existing left quotes are unchanged.

The gallery adapts the framed-card and ornamental menu treatment seen in [Genshin's Archive and Character Archive references](https://interfaceingame.com/games/genshin-impact-mobile/). Staggered card entrances, subtle hover lift, and a short photo reveal are original CSS animations inspired by that presentation, not captured game animations. Numeric coordinates and icon controls keep personal writing space blank.

## September 26 regional gallery refinement

The user's later reference supersedes the dark archive grid. Center a cream ornamental banner reading “Memory 1” through “Memory 6” over a bright blurred regional screenshot. Translucent empty cards reveal the scenery; populated cards keep their photos opaque. Jean uses Mondstadt, Zhongli and Baizhu use Liyue (Baizhu with a jade tint), Neuvillette uses Fontaine, and Yae Miko uses Inazuma's Sacred Sakura. [Region roster reference](https://bannerhistory.app/en/genshin-region-roster); [scenery provenance](../public/images/regions/SOURCES.md).

`chapters.ts` owns the character-to-region assignment and `gallery-regions.ts` maps regions to local decorative assets. The shared viewer receives this configuration and a tint override. Missing decorative images fall back to a bright gradient; memory media stays behind the development-only private endpoint. Focused photos keep their dark isolated presentation. No additional personal copy is introduced.

## September 26 video entrance trial

Replace the overview/back-to-universe flow with the supplied Celestia bridge recording and one Start Game action. The default route opens the entrance; chapter tabs remain available after entering Jean. Reloading returns to the entrance. No additional game account/server controls are introduced.

For the uploaded 640×360 sunset recording, use 8.8–11.4 seconds for the moving bridge wait with a captured-frame dissolve over the seek. Start continues from the current bridge position through door formation and opening. At 15.65 seconds, mount the constellation under a 900ms white reveal. Crop the video's baked-in edge controls and lower text using a shared video/canvas viewport. The footage's low resolution and repeated camera motion remain visible trial limitations; this is not a reconstructed scene.

Keep the clip muted and stop it before mounting constellation music. Respect reduced motion with a paused door frame at 13.15 seconds and immediate entry. Permit entry before media finishes loading or when playback fails; bound a stalled entrance with a 10-second fallback. The local video endpoint owns the fixed filename and byte-range validation, and rejects production or non-loopback access. An authored replacement remains conditional on the user's review.

## September 26 authored entrance (supersedes video trial)

The user rejected the low-resolution recording and selected a reconstruction. The runtime now uses original Three.js geometry and procedural sky/cloud effects, with a blue daytime palette based on the supplied screenshot. Retain the clip only as a reference; remove the local intro streaming endpoint.

The camera approaches along the bridge and eases toward the closed door without looping a recording. Start animates two hinged leaves and moves through the portal over approximately 5.3 seconds, then reveals Jean. A late-frame white veil joins the scene to the existing handoff. Keep only Start Game visible on the home screen. Use a static door and immediate handoff for reduced motion, a CSS architectural fallback if WebGL fails, and an 8.5-second safety timeout if the entrance stalls.

The canvas follows viewport size with capped device pixel ratio (1.75). Reuse pillar geometry through instancing, batch stationary paving, cache stationary shadows, pause drawing in hidden tabs, and dispose geometry, materials, textures, shadow targets, renderer and instanced buffers on unmount. This is an original approximation, not extracted game artwork or a claim of pixel-exact reproduction. Runtime quality and GPU cost need review on the intended presentation computer.

September 26, 1080p video revision (supersedes authored entrance): user rejected the reconstruction and supplied `GENSHIN IMPACT _ CELESTIA DOOR _ LOADING SCREEN (1).mp4`. Verified 1920×1080, 17.04 seconds. Restore local byte-range video playback and remove the custom scene. Preserve all recorded UI and the complete 16:9 frame, with letterboxing when needed. Use a transparent accessible button over the recorded Start Game label. Provisional loop: 0.15–2.65 seconds with a dissolve at rewind; Start continues to the door flare at 15.7 seconds, including the existing loading sequence. Keep edit points in `intro-timing.ts` pending the user's cut instructions. Keep reduced-motion, playback failure, timeout and focus handoff behavior. The file remains untouched.

September 26 loop correction: inspected opening frames and found the cursor visible by 1.5 seconds and the recorded click by 2.1 seconds. Limit idle playback to 0.15–1.05 seconds at 0.5× speed, with a dissolve over the seek and normal speed restored on Start. Crop the bottom 8% in both video and dissolve layers to remove account/version text, and realign the Start hit target. The source file stays unchanged. This supersedes the earlier uncropped 2.65-second loop.

# Decisions and open questions

Updated September 24, 2026.

## Confirmed by the user

| Decision | Reason |
|---|---|
| Constellation scrapbook | Fits the recipient's interest in beautiful visuals, art, scrapbooks, and games |
| No puzzles | They may confuse her and are not needed |
| Together on a computer | This is the intended presentation setting |
| September 28 anniversary | Sets the release window |
| Up to $100 initial spending | Free preferred, limited spending acceptable for the gift |
| Backend learning first | Developer has more frontend experience and wants underlying application depth |
| AI remains desirable | Add if time permits; preserve it for later otherwise |
| Personal hand-drawn loaders | Connects the developer's work to the recipient's handmade anniversary art |
| Symbols remain undecided | Do not invent personal meanings as established facts |
| Engineering and gift polish both matter | Focus scope rather than assuming one goal can be ignored |

## Proposed defaults

These are implementation recommendations, not additional user commitments.

- Temporary folder name: Project Starlight.
- Short master spec plus focused Markdown feature files.
- One application, a managed database/storage service, and a local importer.
- Approximately five key memories per year to start.
- Initial owner session prepared on the computer before the reveal.
- No forced loading delays; reduced-motion alternative.
- AI limited initially to text-based memory search.
- A private backup keepsake/recording before presentation.

## Open items and when they matter

| Open item | Needed by | Can work proceed? |
|---|---|---|
| Five personal constellation symbols | Full-gift content stage | Yes, stable IDs and placeholder art |
| Presentation computer, browser, screen size | First visual experiment | Some work, but performance signoff must wait |
| Three starter memories and notes | First real-content slice | Yes, synthetic fixtures first |
| Final message and Year VI meaning | Full-gift content stage | Yes, placeholder route |
| Loading artwork style and files | Full-gift content stage | Yes, replaceable placeholder |
| Hosting/provider plans and current limits | Before provision/deploy | Yes, local app first |
| Actual anniversary start date for any day counter | Before displaying a day count | Omit the counter until known |
| AI provider and permitted personal data | Before AI activation | Entire gift can proceed |
| Public-demo content approval | Before publishing portfolio demo | Use synthetic content by default |

## Decision record format

For a meaningful change, add: date; question; choice; reason; downside accepted; affected specs; status. Keep it short. Change the owning spec as well so this log does not become a conflicting second source of requirements.

## Initial decision record

September 24 cross-computer setup: the user explicitly requested tracking photos and music to transfer the complete development experience through GitHub. Track `pictures/` and `music/`, overriding earlier ignored-media decisions. Keep dependencies, generated output, screenshots, logs, and local environment files ignored. `.env.example` includes the non-secret preview flag; copy it locally after cloning. Downside accepted: repository access now includes the supplied media and its Git history. Production media endpoints remain disabled.

September 24 soundtrack and glow: Year I selects its own Mondstadt track through a fixed server allowlist. The supplied MP3 is currently under ignored `music/sfx/`; the overview has no soundtrack. Leaving Year I stops and resets music; memory dialogs keep it playing. Future constellations must provide their own track mapping. All six emblems now have a persistent cyan-teal rim with layered bloom, with stronger hover/focus/visited states, matching the supplied game reference more closely.

September 24 icon replacement: replace original SVG emblems with Jean's six constellation PNG icons, sourced via Genshin.gg and checked against the user's reference. Preserve memory labels, ordering, and interaction behavior. Reason: the user explicitly requested the actual icon shapes. See [icon provenance](13-jean-icons.md). Supersedes the original-icon choice in the earlier menu refinement.

September 24 audio pass: add a shared Web Audio controller and independent effects volume beneath Cat B. Use four locally downloaded effects from the official Dream of Roving Stars web event. Hover reuses a quieter button clip; these are not verified matches for the desktop constellation menu. Keep source files ignored and serve only through the development adapter. Reason: traceable small assets and one reusable playback boundary; missing audio must not break navigation. Downside accepted: exact game fidelity remains unverified, and fresh clones need the local files. See [UI audio](12-ui-audio.md) for provenance and mappings. Visual transitions remain deferred.

September 24 menu refinement: user requested stronger fidelity to Genshin's right-side constellation UI. Compared an in-game Jean screenshot and implemented curved row offsets, distinct circular emblems, a subdued curved connector, bold cream titles, and glowing interaction states. Remove redundant row text and arrows. Preserve memory labels and accessible status announcements; no false lock state. Downside accepted: original icons and a substitute font approximate the game rather than reproduce its assets exactly. Status: visually checked at desktop/mobile sizes; all 14 browser checks and production build pass.

September 24 follow-up: user selected Cat B and requested Mondstadt OST autoplay with volume control under the cat. Replace the comparison buttons with a music popover; handle blocked autoplay explicitly and retain a separate play/pause control. Audio is streamed locally from ignored `music/mondstadt.mp3`; no track is bundled. Downside accepted: browser policy may require a gesture, and actual soundtrack validation waits for the file. Status: controls implemented, audio source pending.

September 24: all six Jean anchors open distinct memories per user request. Preserve existing IDs/positions; slots 4–6 await photos. Derive totals from the memory collection. Compare both supplied cat mascots as transparent generated cutouts using temporary A/B header controls. Final mascot selection is pending. Affected specs: constellation experience, content, mascot assets. Status: implemented for review.

September 23: replace the SVG/CSS visual baseline with Three.js at the user's explicit request. Year I uses the supplied Jean lion constellation and teal-green palette as its reference, with animated nebulae, depth-layered particles, luminous flares, and restrained pointer parallax. Keep React's existing memory flow and project star positions into accessible HTML controls. Remove bottom decorative copy and use the supplied Jean quote. Downside accepted: greater bundle size and GPU/lifecycle complexity; performance needs real-device review. The linework is authored from the reference and remains open to visual refinement. Affected specs: architecture, constellation experience, build plan. Status: implemented for review; supersedes the September 22 SVG renderer choice.

September 22: implement the first constellation with original SVG artwork and layered CSS, inspired by the user's requested Genshin constellation-page atmosphere. Reason: the current authored scene needs precise glowing lines, selectable stars, and gentle depth without a 3D camera. Downside accepted: this does not provide true volumetric space or camera travel. Three.js has not been benchmarked against this implementation; revisit after visual review if actual depth is needed. Affected specs: architecture, constellation experience, build plan. Status: implemented baseline, visual approval pending.

September 22: use the user's three supplied first-year pictures only in a loopback development preview. Originals and local configuration remain ignored by Git; a development-only allowlisted route serves them without shared caching. Production always refuses this endpoint. Reason: evaluate real photo proportions before building the private backend. Downside accepted: no hosted private access or persistent progress yet. Captions and constellation symbolism remain drafts. Affected specs: private access, content/media, build plan. Status: local implementation only.

September 17: choose a constellation scrapbook rather than the earlier AI-directed memory game. Reason: the recipient's preferences and the developer's stated goals support easy discovery without puzzle confusion. Consequence: AI navigation, reconstruction, and quest systems no longer define anniversary completion. Backend depth comes from protected content, safe importing, persistence, deployment, and failure handling.

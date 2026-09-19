# Decisions and open questions

Updated September 17, 2026.

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

September 17: choose a constellation scrapbook rather than the earlier AI-directed memory game. Reason: the recipient's preferences and the developer's stated goals support easy discovery without puzzle confusion. Consequence: AI navigation, reconstruction, and quest systems no longer define anniversary completion. Backend depth comes from protected content, safe importing, persistence, deployment, and failure handling.

# Project Starlight

Temporary name for a private fifth-anniversary constellation scrapbook.

This folder currently contains planning documents, not a working application. The intended gift date is September 28, 2026. Planning began September 17, 2026.

## Start here

Read [the master specification](doc/00-master-spec.md), then follow [the build plan](doc/08-build-plan.md). Build one small, complete experience at a time. The specs describe intended behavior; they do not claim that any feature is implemented or tested.

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

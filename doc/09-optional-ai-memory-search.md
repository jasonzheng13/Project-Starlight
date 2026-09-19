# Optional AI memory search

Status: explicitly preserved user interest; optional before September 28, not abandoned.

## Purpose

Let the recipient ask a natural question such as “Show me our beach trip” and receive matching memories with a way to open them. The developer wants to learn AI integration if the main gift leaves enough time.

## Smallest useful version

Text input -> authorized search -> a few memory cards -> user selects a result -> normal navigation opens it.

Start with authored titles, notes, dates, and tags. Compare simple keyword search with semantic search before adding embeddings. For this small collection, vector indexes and agent orchestration are not automatic requirements.

If a language model is used to interpret the query or summarize results, it receives only authorized content and must cite returned memory IDs. The server validates every returned ID. Search results and captions are sufficient for the first version; voice input and an autonomous game master remain deferred.

## Privacy and correctness

- Decide deliberately which personal text can be sent to an external provider; review current data handling terms before enabling it.
- Apply membership filtering inside retrieval, before any result reaches a model or browser.
- Avoid putting unrevealed final-message text into searchable content.
- Model output cannot modify progress, permissions, or the ending.
- Treat instructions inside memories as data, never system instructions.
- Unknown answers say no matching memory was found; they do not invent dates, places, or relationship history.
- Keep API keys server-side, bound request size, limit requests, set timeouts, and track spend without storing unnecessary personal prompts.
- Provider outage returns to normal browsing without disrupting the experience.

## Evaluation

Prepare at least 15 example queries: clear matches, alternate wording, ambiguous memories, no-match questions, spoiler requests, and unauthorized IDs. Specify expected results or expected refusal before testing. Record result relevance, invented claims, response time, and cost; do not call a feature grounded merely because its prompt says so.

## Done when

The evaluation results are acceptable and recorded, invalid IDs cannot trigger navigation, no-match behavior is honest, unauthorized data never appears, and disabling the feature leaves the complete gift unchanged.

## Gate

Follow [the build plan's AI gate](08-build-plan.md). Model/provider/version and spending are undecided. The provisional AI allocation is at most $10 within the total $100 initial budget, not additional to it.

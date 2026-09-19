# Private access and data

## User outcome

The couple can view their memories privately. The owner can prepare the session before the reveal so authentication does not interrupt the opening. A hidden URL alone is not access control.

## Minimal data model

| Record | Main fields and rules |
|---|---|
| Universe | ID, title, owner ID, timezone, final-message reference |
| Membership | Universe ID, authenticated user ID, role; unique pair |
| Constellation | ID, universe ID, year number 1–5, title, art reference; unique year per universe |
| Memory | ID, constellation ID, title, personal note, optional occurred date, display order, required-for-lighting flag, authored star position |
| Asset | ID, memory ID or constellation/universe association, private storage key, media type, dimensions, duration, variant, processing status |
| Progress | Member ID, memory ID, first-opened time; unique member/memory pair |

Keep unknown dates unknown rather than inventing precision. Derive constellation completion from required memory progress; do not create competing completion counters. Final-message content must remain protected like other private content.

All associations must remain inside the same universe. Enforce this through database constraints where practical and server validation. A valid memory ID is not proof that it belongs to the requesting user.

## Access behavior

- Initial gift can use one owner account with the session prepared on the presentation computer. A second invite-only member is optional.
- Confirm a valid session before returning world data or media access.
- Database row-level policies and storage policies enforce membership as an additional boundary.
- Privileged import credentials stay in a local environment file or server secret store, never the browser or source control.
- Private objects use authorized delivery or short-lived signed URLs. Treat those URLs as temporary credentials; do not log them.
- Expired sessions and media URLs lead to a recoverable state rather than a blank page.
- A public demo must use separate synthetic/approved data and have no credentials that can read private content.

## Failure and safety cases

Reject requests that reference another universe, forged member IDs, or mismatched assets. Media access must check authorization when issuing a URL. Existing signed URLs can remain usable until expiry; choose a bounded expiry and document that limitation.

Do not put sensitive media in the web app's public folder. Do not include private titles or images in public page previews. Keep personal records out of shared caches, logs, and preview deployments.

## Acceptance checks

- Unauthenticated requests receive no private world or memory data.
- User B cannot read User A's memory, create progress for it, or obtain its media URL, even with known IDs.
- A member of another universe cannot create cross-universe links.
- The server does not trust browser-supplied owner or role values.
- A signed-in owner can load the real content and recover from session expiry.
- The demo environment cannot read production data.

Dependency: establish these boundaries during the first real-data slice, before uploading the main private collection.

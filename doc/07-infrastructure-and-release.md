# Infrastructure and release

## What infrastructure means here

Application code decides what a memory is and when a constellation lights up. Infrastructure supplies the hosting, database, storage, secrets, and deployment systems that let the application run reliably.

This project can teach real infrastructure skills, but it is primarily a full-stack application with infrastructure responsibilities. It does not need to become a distributed systems project to be worthwhile.

## Minimum useful setup

| Piece | Work to do | Evidence of understanding |
|---|---|---|
| Hosting | Deploy web app with HTTPS and documented configuration | Reproduce deployment and roll back |
| Database | Version schema changes as migrations | Build a fresh test database consistently |
| Object storage | Private original/derived media paths and access policies | Unauthorized media checks pass |
| Secrets | Separate local and production credentials | No secrets in repository or client output |
| CI | Automated type checks, build, and key behavior tests on code changes | A failing change is detected before release |
| Logs | Record failures, request IDs, and useful timings | Diagnose a failed request without logging memories |
| Recovery | Back up data and keep a known-good release | Practice restoration or recovery with test data |

CI means continuous integration: automatically checking code when it changes. Database migrations are ordered files describing changes to the database. Infrastructure as code means defining infrastructure in versioned configuration rather than relying only on dashboard clicks.

## Environment rules

Local and preview use synthetic content by default. Production holds real private content. Public portfolio demo uses separate data and credentials. Where separate managed projects cost too much, omit a hosted preview rather than exposing real data through it.

Keep deployment instructions, variable names, migrations, and storage policies in the repository. Actual secret values remain outside it. Formal infrastructure provisioning tools are optional after the gift; a documented manual setup is acceptable initially, but must not be described as fully automated infrastructure as code.

## Budget

Total initial cap: $100, not a monthly allowance. Check current provider prices and limits before setup. No paid plan is selected by this spec.

Proposed allocation: up to $30 for necessary hosting/storage, up to $10 for optional AI experiments, and $60 reserve. A custom domain is optional and must fit within the total by adjusting these amounts. Free options come first; record billing dates and recurring obligations. Configure alerts and hard usage caps where providers support them. An alert alone does not stop charges.

Track actual and committed spending in a simple ledger before enabling paid services. Private video transfer may matter more than database size; test delivery using final-size assets.

## Release checklist

- Check access rules, type checking, build, and one complete end-to-end journey.
- Test real media, refresh/resume, expired access, slow requests, failed media, keyboard navigation, reduced motion, and the final message.
- Measure initial load and movement on the actual computer/browser.
- Confirm audio behavior and volume; preload deliberately through rehearsal, without assuming the cache will persist.
- Preserve a known-good deployment and document rollback steps.
- Prepare a private backup recording or static keepsake. It is a fallback, not a replacement for the interactive gift.
- Rehearse on September 27; avoid untested feature additions on presentation day.

## Keep out of the anniversary scope

Custom load balancing, Kubernetes, microservices, multi-region failover, and a permanent GPU service. There is no established need for them at this scale. Add infrastructure when it solves a measured problem or supports an explicitly chosen learning experiment after release.

## References

- [AWS explanation of infrastructure as code](https://aws.amazon.com/what-is/iac/)
- [C4 guidance on useful architecture diagrams](https://c4model.com/diagrams)

These explain concepts; they do not imply choosing AWS or any paid product.

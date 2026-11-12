# Shared contracts

These files are the Day 1 agreements that let all four people work without waiting for each other. They take precedence over any change document.

| File | Owner | Read by | Content |
| --- | --- | --- | --- |
| `cv.md` | P1 | P3, P4 | CV function signatures, formulas, depth boundaries, undertone and season policy, CSV enrichment, profile payload |
| `auth.md` | P2 | P3, P4 | Auth endpoints, JWT claims, error envelope, dev-only identity header |
| `products-api.md` | P3 | P4 | Product, shade, profile and import endpoints, P3's tables, CSV import format |

## Rule for changing a contract

1. The owner proposes the change in `openspec/team/daily-scrum.md`.
2. Every listed reader replies "ok" in the same file.
3. Only then does the owner edit the contract and tell the readers what changed.

## Open Day 1 decisions

Record the answer in `openspec/team/daily-scrum.md` and then update the contract.

- [ ] Undertone thresholds and labelled fixtures (`cv.md` section 4). This blocks `classify_undertone`.
- [ ] Season decision table (`cv.md` section 5).
- [ ] Minimum password length and rules (`auth.md`; proposal: at least 8 characters, at most 72 UTF-8 bytes).
- [ ] Tech stack: backend framework, database, frontend framework, mock tool.
- [ ] Sprint length and the exact calendar date for "Day 4".

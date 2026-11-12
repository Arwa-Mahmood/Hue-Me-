# Shared contracts - Sprint 1

These files are the kickoff agreements that let all four people work without waiting for each other. They take precedence over any change document. The requirements they implement come from the SRS (`docs/SRS.pdf`, Sprint 1 = US1-US10). Sprint 2 contracts are parked in `openspec/sprint-2/`.

| File | Owner | Read by | Content | SRS stories |
| --- | --- | --- | --- | --- |
| `cv.md` | P1 Arwa | P3 Ayesha, P4 Momina | CV function signatures, formulas, depth boundaries, undertone and season policy, selfie sampling, confidence, palette, explanation template, profile payload | US6-US10 |
| `auth.md` | P2 Eshaal | P3 Ayesha, P4 Momina | Auth endpoints, password rules, reset link, preferences, account deletion, JWT claims, error envelope, dev-only identity header, deployment | US1-US5 |
| `profile-api.md` | P3 Ayesha | P4 Momina | Profile, photo and correction endpoints, deletion hook, `profiles` table | US5-US10 |

## Rule for changing a contract

1. The owner proposes the change in `openspec/team/daily-scrum.md`.
2. Every listed reader replies "ok" in the same file.
3. Only then does the owner edit the contract and tell the readers what changed.

## Decided by the SRS (no vote needed)

- Tech stack: Next.js (React) frontend on Vercel; FastAPI (Python) backend and PostgreSQL on Railway; bcrypt + JWT with expiry; MediaPipe + OpenCV for the selfie; free tier only; no LLM or generative AI.
- Minimum password length: 8 characters (US1). The 72-byte maximum is a bcrypt limit.
- Password recovery: emailed reset link that expires after 1 hour (US3).
- Selfies are never stored (US6).
- Schedule: 7 weeks, 2 sprints.

## Open kickoff decisions

Record the answer in `openspec/team/daily-scrum.md` and then update the contract.

- [ ] Undertone thresholds and labelled fixtures (`cv.md` section 4). This blocks `classify_undertone`.
- [ ] Season decision table (`cv.md` section 5).
- [ ] Face landmark regions for skin sampling (`cv.md` section 6).
- [ ] Confidence thresholds (`cv.md` section 7).
- [ ] Wear/avoid palette and explanation template (`cv.md` section 8).
- [ ] Frontend mock tool (proposal: Mock Service Worker) and token storage (proposal: `localStorage`, needed for US2 "session persists across refresh").

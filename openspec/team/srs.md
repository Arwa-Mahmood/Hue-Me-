# Software Requirements Specification (Sprint 1 update)

Source: `docs/SRS.pdf` (Hue&Me - Personal Stylist & Color Analysis Web App; S. Eshaal Gardezi, Momina Ali, Arwa Mahmood, Ayesha Arif). That file is not edited. This page traces the Sprint 1 stories to the OpenSpec work and records any Sprint 1 updates.

Status: traceability filled in from the SRS. P1 writes the first update (changes, clarifications, results) once the CV work is complete and evidence is recorded; then all owners review and sign off here. Requirements text should link to, not duplicate, `openspec/changes/` and `openspec/contracts/`.

## Sprint 1 traceability (US1-US10)

| Story | Priority | Acceptance criteria (SRS) | Owner(s) | Contract | Test IDs |
| --- | --- | --- | --- | --- | --- |
| US1 Registration | High | valid email; password ≥ 8; email unique; JWT issued; error on duplicate | P2, P4 | `auth.md` | AU-01, AU-02, AU-03, FE-01, FE-03 |
| US2 Login / Logout | High | valid credentials → JWT; invalid → error; logout clears token; session persists across refresh | P2, P4 | `auth.md` | AU-04, AU-05, AU-12, FE-01, FE-10, FE-12 |
| US3 Password recovery | Medium | reset link sent; link expires after 1 hour; new password meets rules | P2, P4 | `auth.md` | AU-06 to AU-11, FE-02 |
| US4 Manage preferences | High | font size, theme, colour-blind mode saved; persist; apply immediately (UC18 adds high contrast) | P2, P4 | `auth.md` | AU-13, AU-14, FE-13 |
| US5 Delete account & data | High | confirmation dialog; all data deleted; account removed; redirect home | P2, P3, P4 | `auth.md`, `products-api.md` | AU-15, AU-16, PR-15, FE-14, IN-06 |
| US6 Selfie analysis | High | JPG/PNG; face via MediaPipe; LAB; ITA; undertone; image discarded | P1, P3, P4 | `cv.md` §8, `products-api.md` | CV-12 to CV-14, PR-16, PR-17, FE-15, IN-05 |
| US7 Manual entry | High | hex accepted; swatch grid; same output as photo; invalid hex → error | P1, P3, P4 | `cv.md` §10-11 | CV-01, CV-02, CV-15, PR-07, PR-09, FE-04, FE-16 |
| US8 Seasonal colour type | High | palette shown; undertone + depth; explanation; confidence indicator | P1, P3, P4 | `cv.md` §9-11 | CV-03 to CV-08, CV-16, CV-17, PR-07, PR-10, FE-04, FE-05 |
| US9 Wear / avoid colours | High | wear list hex + label; avoid list hex + label; accessible | P1, P4 | `cv.md` §10 | CV-18, FE-17 |
| US10 Correct detected tone | Medium | adjustment controls; palette recalculated; marked corrected | P1, P3, P4 | `cv.md` §10, `products-api.md` | CV-19, PR-18, FE-18 |

## Constraints applied in Sprint 1 (from the SRS)

- Stack: Next.js/React (Vercel), FastAPI + PostgreSQL (Railway), bcrypt + JWT, MediaPipe + OpenCV. Free tier only.
- No generative AI, LLM or custom model training; explanations are templates.
- Selfies are not stored; full data wipe on request (US5).
- Not a medical or dermatological tool: every explanation carries that statement.

## Work done in Sprint 1 that is not a Sprint 1 story

- `delta_e`, CSV enrichment, product/shade admin and CSV import: preparation for Sprint 2 matching (US11+). Lower priority than US1-US10.

## Review log

| Reviewer | Date | Comment | Approved |
| --- | --- | --- | --- |
| P1 | | | |
| P2 | | | |
| P3 | | | |
| P4 | | | |

## Sections to complete in the Sprint 1 update

1. Changes or clarifications to US1-US10 made during the sprint (for example the approved undertone, season, confidence and palette rules)
2. Open issues carried to Sprint 2
3. Results: link each test ID above to its row in `test-results.md`

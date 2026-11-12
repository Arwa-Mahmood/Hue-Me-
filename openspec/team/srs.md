# Software Requirements Specification (Sprint 1 update)

Source: `docs/SRS.pdf` (Hue&Me - Personal Stylist & Color Analysis Web App; S. Eshaal Gardezi, Momina Ali, Arwa Mahmood, Ayesha Arif). That file is not edited. This page traces the Sprint 1 stories to the OpenSpec work and records any Sprint 1 updates. Sprint 2 (US11+) is out of scope here; see `openspec/sprint-2/`.

Status: traceability filled in from the SRS. Arwa (P1) writes the first update (changes, clarifications, results) once the CV work is complete and evidence is recorded; then all owners review and sign off here. Requirements text should link to, not duplicate, `openspec/changes/` and `openspec/contracts/`.

## Sprint 1 traceability (US1-US10)

| Story | Priority | Acceptance criteria (SRS) | Owner(s) | Contract | Test IDs |
| --- | --- | --- | --- | --- | --- |
| US1 Registration | High | valid email; password ≥ 8; email unique; JWT issued; error on duplicate | Eshaal, Momina | `auth.md` | AU-01 to AU-03, FE-01, FE-02, IN-01 |
| US2 Login / Logout | High | valid credentials → JWT; invalid → error; logout clears token; session persists across refresh | Eshaal, Momina | `auth.md` | AU-04, AU-05, FE-01, FE-03, FE-04, IN-03 |
| US3 Password recovery | Medium | reset link sent; link expires after 1 hour; new password meets rules | Eshaal, Momina | `auth.md` | AU-06 to AU-10, FE-05 |
| US4 Manage preferences | High | font size, theme, colour-blind mode saved; persist; apply immediately (UC18 adds high contrast) | Eshaal, Momina | `auth.md` | AU-11, AU-12, FE-06 |
| US5 Delete account & data | High | confirmation dialog; all data deleted; account removed; redirect home | Eshaal, Ayesha, Momina | `auth.md`, `profile-api.md` | AU-13, AU-14, PR-09, FE-07, IN-05 |
| US6 Selfie analysis | High | JPG/PNG; face via MediaPipe; LAB; ITA; undertone; image discarded | Arwa, Ayesha, Momina | `cv.md` §6, `profile-api.md` | CV-13 to CV-15, PR-06, PR-07, FE-08, IN-04 |
| US7 Manual entry | High | hex accepted; swatch grid; same output as photo; invalid hex → error | Arwa, Ayesha, Momina | `cv.md` §8-9, `profile-api.md` | CV-01, CV-02, CV-16, PR-01 to PR-03, FE-09, FE-10, IN-01, IN-02 |
| US8 Seasonal colour type | High | palette shown; undertone + depth; explanation; confidence indicator | Arwa, Ayesha, Momina | `cv.md` §3-5, §7-9 | CV-03 to CV-10, PR-04, PR-05, FE-11, FE-12 |
| US9 Wear / avoid colours | High | wear list hex + label; avoid list hex + label; accessible | Arwa, Momina | `cv.md` §8 | CV-11, FE-13 |
| US10 Correct detected tone | Medium | adjustment controls; palette recalculated; marked corrected | Arwa, Ayesha, Momina | `cv.md` §8, `profile-api.md` | CV-12, PR-08, FE-14 |

## Constraints applied in Sprint 1 (from the SRS)

- Stack: Next.js/React (Vercel), FastAPI + PostgreSQL (Railway), bcrypt + JWT, MediaPipe + OpenCV. Free tier only.
- No generative AI, LLM or custom model training; explanations are templates.
- Selfies are not stored; full data wipe on request (US5).
- Not a medical or dermatological tool: every explanation carries that statement.

## Review log

| Reviewer | Date | Comment | Approved |
| --- | --- | --- | --- |
| Arwa (P1) | | | |
| Eshaal (P2) | | | |
| Ayesha (P3) | | | |
| Momina (P4) | | | |

## Sections to complete in the Sprint 1 update

1. Changes or clarifications to US1-US10 made during the sprint (for example the approved undertone, season, confidence and palette rules)
2. Open issues carried to Sprint 2
3. Results: link each test ID above to its row in `test-results.md`

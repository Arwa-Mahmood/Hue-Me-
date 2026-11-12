# Daily scrum minutes - Sprint 1

One file for everyone. Add a heading with the date for each scrum (newest last) and add your own entry under it. Do not edit other people's entries. Contract change proposals and replies also go here (see `openspec/contracts/README.md`).

Team: P1 Arwa (CV), P2 Eshaal (auth), P3 Ayesha (profile API), P4 Momina (frontend).

Entry template:

```
## YYYY-MM-DD

- **Arwa (P1)** Yesterday: ... | Today: ... | Blockers: ... | Contract changes proposed: ...
- **Eshaal (P2)** ...
- **Ayesha (P3)** ...
- **Momina (P4)** ...
```

## Kickoff decisions

Already fixed by the SRS (`docs/SRS.pdf`), recorded here so nobody re-opens them:

| Decision | Outcome | Source |
| --- | --- | --- |
| Tech stack | Next.js/React (Vercel), FastAPI + PostgreSQL (Railway), bcrypt + JWT, MediaPipe + OpenCV | SRS sections 2, 5.2, 5.3 |
| Password minimum | 8 characters (72-byte bcrypt maximum) | US1 |
| Password recovery | Emailed reset link, expires after 1 hour | US3 |
| Scope | Sprint 1 = US1-US10 only; Sprint 2 work parked in `openspec/sprint-2/` | SRS user stories |
| Owners | P1 Arwa, P2 Eshaal, P3 Ayesha, P4 Momina | Team |

Still to decide:

| Decision | Outcome | Agreed by (Arwa / Eshaal / Ayesha / Momina) |
| --- | --- | --- |
| Undertone thresholds and fixtures | pending | |
| Season decision table | pending | |
| Face landmark regions for selfie sampling | pending | |
| Confidence thresholds | pending | |
| Wear/avoid palette and explanation template | pending | |
| Frontend mock tool and token storage | pending | |

## Scrum log


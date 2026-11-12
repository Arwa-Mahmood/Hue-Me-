## Context

`openspec/contracts/products-api.md` fixes routes, payloads, tables and the CSV format. `contracts/cv.md` section 8 fixes the profile payload. This design covers integration seams and safety.

## Goals / Non-Goals

**Goals**
- Work fully independently until Day 4.
- Swap the dummy CV and the dev identity for the real ones with a one-line configuration or import change.

**Non-Goals**
- Anything in the proposal's Non-goals list.

## Decisions

- **Stack (proposed, confirm Day 1):** Python, FastAPI, PostgreSQL, SQLAlchemy or plain SQL, matching P2's choice so the compose file stays simple.
- **Layout:** `backend/products/app/` with `routes/`, `models`, `schemas`, `cv_adapter.py`, `identity.py`, `importer.py`; `tests/`; `scripts/import_csv.py`.
- **CV adapter:** `cv_adapter.py` is the only file that imports CV functions. Day 1 to Day 3 it contains a dummy that returns fixed, clearly fake values with the real signatures. On Day 4 it imports from `/cv`. Tests marked as using the dummy must not be reported as CV verification.
- **Identity:** `identity.py` returns `(user_id, role)`. With `AUTH_MODE=mock` and `ENVIRONMENT` in `development` or `test` it reads `X-Dev-User-Id` and optional `X-Dev-Role`. With `AUTH_MODE=jwt` it uses P2's validator. A missing or bad value is `401`; there is never a fallback identity. In any other environment `mock` mode refuses to start.
- **Normalisation:** hex stored as uppercase `#RRGGBB`; LAB computed by the server, never trusted from the client.
- **Delete:** deleting a product cascades to its shades.
- **Import:** parse and validate the whole file first, then insert in one transaction. A bad row means nothing is imported and every row error is reported. Existing `(product, shade_name)` pairs are skipped and counted.
- **Script and endpoint share one importer function**, so behaviour is identical.
- **Profile:** one row per `user_id`, `PUT` replaces it. Hair and eye colours are stored but never change the analysis.

## Risks / Trade-offs

- Dummy CV output could be mistaken for real: name it clearly and keep it in one file.
- Dev header left on in production: startup check plus a test (PR-14).
- Shared database with P2: each owner creates only their own tables.
- Category or brand spelling variance in imported CSV: exact category values only; brand is trimmed but otherwise preserved.

## Migration Plan

New tables created on first start. On Day 4: replace the dummy in `cv_adapter.py`, set `AUTH_MODE=jwt`, re-run all tests.

## Open Questions

- ORM or plain SQL, and the migration tool (agree with P2).
- Whether the product list stays public or needs login (proposal: public).
- Maximum CSV upload size (proposal: 2 MB).

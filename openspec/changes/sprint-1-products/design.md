## Context

`openspec/contracts/products-api.md` fixes routes, payloads, tables and the CSV format. `contracts/cv.md` section 11 fixes the profile payload. This design covers integration seams, privacy and safety.

## Goals / Non-Goals

**Goals**
- Work fully independently until Day 4.
- Swap the dummy CV and the dev identity for the real ones with a one-line configuration or import change.
- Never keep an uploaded selfie (US6).

**Non-Goals**
- Anything in the proposal's Non-goals list.

## Decisions

- **Stack (SRS):** Python 3.11+, FastAPI, PostgreSQL. Routers are mounted in P2's `backend/main.py`; ORM or plain SQL agreed with P2.
- **Layout:** `backend/products/app/` with `routes/` (`profile.py`, `products.py`, `admin.py`), `models`, `schemas`, `cv_adapter.py`, `identity.py`, `importer.py`, `deletion.py`; `tests/`; `scripts/import_csv.py`.
- **CV adapter:** `cv_adapter.py` is the only file that imports CV code. Day 1 to Day 3 it contains dummies for `analyze_skin`, `extract_skin_hex` and `hex_to_lab` that return fixed, clearly fake values with the real signatures and can raise each error type on demand. On Day 4 it imports from `/cv`. Tests marked as using the dummy must not be reported as CV verification.
- **Identity:** `identity.py` returns `(user_id, role)`. With `AUTH_MODE=mock` and `ENVIRONMENT` in `development` or `test` it reads `X-Dev-User-Id` and optional `X-Dev-Role`. With `AUTH_MODE=jwt` it uses P2's validator. A missing or bad value is `401`; there is never a fallback identity. In any other environment `mock` mode refuses to start.
- **Profile writes:** one row per `user_id`.
  - `PUT /profile`: `source = manual`, `corrected = false`, replaces the row.
  - `POST /profile/photo`: check size (`MAX_PHOTO_BYTES`) before reading fully, read into memory, call `extract_skin_hex`, then `analyze_skin`; `source = photo`, `corrected = false`; keep saved hair/eye.
  - `POST /profile/correction`: load the saved row (404 if none), call `analyze_skin` with the new or saved hex and the optional override, keep `source` and hair/eye, `corrected = true`.
  - Hair and eye colours are stored but never change the analysis.
- **Photo privacy:** use FastAPI `UploadFile`, read bytes once, pass them on, and drop the reference. Configure the upload so it is not spooled to disk (reject above the limit before spooling). Exclude this route's body from request logging and error reports.
- **Errors:** map `ValueError` / `PhotoError` from the adapter to `422 validation_error` with one detail (`skin_hex`, `undertone_override` or `file`).
- **Deletion hook:** `deletion.py` exposes `delete_user_data(user_id)` that deletes the `profiles` row in its own transaction; idempotent.
- **Normalisation:** hex stored as uppercase `#RRGGBB`; LAB computed by the server, never trusted from the client.
- **Catalogue (Sprint 2 prep):** deleting a product cascades to its shades. Import parses and validates the whole file first, then inserts in one transaction. A bad row means nothing is imported and every row error is reported. Existing `(product, shade_name)` pairs are skipped and counted. Script and endpoint share one importer function.

## Risks / Trade-offs

- Dummy CV output could be mistaken for real: name it clearly and keep it in one file.
- Dev header left on in production: startup check plus a test (PR-14).
- Upload spooled to a temporary file by the framework: limit size first and read in memory; test that no file appears (PR-17).
- Large images slow the free-tier server: 5 MB limit and P1 downscales before detection.
- Shared database with P2: each owner creates only their own tables; deletion goes through `delete_user_data` only.
- Category or brand spelling variance in imported CSV: exact category values only; brand is trimmed but otherwise preserved.

## Migration Plan

New tables created on first start. On Day 4: replace the dummies in `cv_adapter.py`, set `AUTH_MODE=jwt`, check P2 registered `delete_user_data`, re-run all tests.

## Open Questions

- ORM or plain SQL, and the migration tool (agree with P2).
- `MAX_PHOTO_BYTES` (proposal: 5 MB) and `MAX_CSV_BYTES` (proposal: 2 MB).
- Whether the product list stays public or needs login (proposal: public).

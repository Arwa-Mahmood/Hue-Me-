## Context

`openspec/contracts/profile-api.md` fixes routes, payloads and the `profiles` table. `contracts/cv.md` section 9 fixes the profile payload. This design covers integration seams, privacy and safety.

## Goals / Non-Goals

**Goals**
- Work fully independently until integration.
- Swap the dummy CV and the dev identity for the real ones with a one-line configuration or import change.
- Never keep an uploaded selfie (US6).

**Non-Goals**
- Anything in the proposal's Non-goals list.

## Decisions

- **Stack (SRS):** Python 3.11+, FastAPI, PostgreSQL. Routers are mounted in Eshaal's `backend/main.py`; ORM or plain SQL agreed with Eshaal.
- **Layout:** `backend/profile/app/` with `routes.py`, `models`, `schemas`, `cv_adapter.py`, `identity.py`, `deletion.py`; `tests/`.
- **CV adapter:** `cv_adapter.py` is the only file that imports CV code. Until integration it contains dummies for `analyze_skin` and `extract_skin_hex` that return fixed, clearly fake values with the real signatures and can raise each error type on demand. At integration it imports from `/cv`. Tests marked as using the dummy must not be reported as CV verification.
- **Identity:** `identity.py` returns the `user_id`. With `AUTH_MODE=mock` and `ENVIRONMENT` in `development` or `test` it reads `X-Dev-User-Id`. With `AUTH_MODE=jwt` it uses Eshaal's validator. A missing or bad value is `401`; there is never a fallback identity. In any other environment `mock` mode refuses to start.
- **Profile writes:** one row per `user_id`.
  - `PUT /profile`: `source = manual`, `corrected = false`, replaces the row.
  - `POST /profile/photo`: check size (`MAX_PHOTO_BYTES`) before reading fully, read into memory, call `extract_skin_hex`, then `analyze_skin`; `source = photo`, `corrected = false`; keep saved hair/eye.
  - `POST /profile/correction`: load the saved row (404 if none), call `analyze_skin` with the new or saved hex and the optional override, keep `source` and hair/eye, `corrected = true`.
  - Hair and eye colours are stored but never change the analysis.
- **Photo privacy:** use FastAPI `UploadFile`, read bytes once, pass them on, and drop the reference. Reject above the size limit before the framework spools to disk. Exclude this route's body from request logging and error reports.
- **Errors:** map `ValueError` / `PhotoError` from the adapter to `422 validation_error` with one detail (`skin_hex`, `undertone_override` or `file`).
- **Deletion hook:** `deletion.py` exposes `delete_user_data(user_id)` that deletes the `profiles` row in its own transaction; idempotent.
- **Normalisation:** hex stored as uppercase `#RRGGBB`; LAB computed by the server, never trusted from the client.

## Risks / Trade-offs

- Dummy CV output could be mistaken for real: name it clearly and keep it in one file.
- Dev header left on in production: startup check plus a test (PR-10).
- Upload spooled to a temporary file by the framework: limit size first and read in memory; test that no file appears (PR-07).
- Large images slow the free-tier server: 5 MB limit and Arwa downscales before detection.
- Shared database with Eshaal: each owner creates only their own tables; deletion goes through `delete_user_data` only.

## Migration Plan

New table created on first start. At integration: replace the dummies in `cv_adapter.py`, set `AUTH_MODE=jwt`, check Eshaal registered `delete_user_data`, re-run all tests.

## Open Questions

- ORM or plain SQL, and the migration tool (agree with Eshaal).
- `MAX_PHOTO_BYTES` (proposal: 5 MB).

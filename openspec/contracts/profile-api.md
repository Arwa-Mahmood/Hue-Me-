# Shared profile API contract - Sprint 1

- Owner: **P3 (Ayesha)**. Consumer: **P4 (Momina)** (frontend mock and real API). Analysis payload rules come from `contracts/cv.md`; errors and auth from `contracts/auth.md`.
- SRS stories: US6 selfie analysis, US7 manual entry, US8 seasonal colour type, US9 wear/avoid colours, US10 correct detected tone, US5 (data deletion hook). The product catalogue is Sprint 2 and lives in `openspec/sprint-2/products-catalog-contract.md`.
- Status: proposed at sprint kickoff; P4 builds the mock from this file, so any change needs P4's agreement.
- Base path: `/api/v1`. Mounted in the single FastAPI app (`backend/main.py`). All routes require an identified user (`401` otherwise).

## Profile and analysis

`Profile` is exactly the payload in `contracts/cv.md` section 9.

| Method and path | Body | Success | Story |
| --- | --- | --- | --- |
| `PUT /profile` | JSON `{skin_hex, hair_hex?, eye_hex?}` | `200` `Profile` | US7. Manual hex or swatch-grid entry. Saves with `source = manual`, `corrected = false`, replacing any earlier profile. |
| `POST /profile/photo` | multipart: `file` (JPEG or PNG, at most `MAX_PHOTO_BYTES`, proposal 5 MB) | `200` `Profile` | US6. Calls `extract_skin_hex` then `analyze_skin`. Saves with `source = photo`, `corrected = false`. Keeps any saved `hair_hex` / `eye_hex`. The image is discarded after the request. |
| `POST /profile/correction` | JSON `{skin_hex?, undertone_override?}` (at least one) | `200` `Profile` | US10. Re-analyses from the saved profile with the adjusted hex and/or undertone, keeps `source`, sets `corrected = true`. `404 not_found` if no profile is saved. |
| `GET /profile` | none | `200` `Profile` | US8, US9. Returns the saved result, including palette, explanation and confidence. `404 not_found` if none saved. |

Rules:

- All three write routes call P1's `analyze_skin` through `cv_adapter.py`; P3 does no colour maths.
- Undetermined depth, malformed hex, unknown `undertone_override` and every photo error return `422 validation_error` with one detail. `field` is `skin_hex`, `undertone_override` or `file`; `message` is user-readable (for photos it explains: no face found, more than one face, not enough visible skin, or unsupported format). Nothing is saved on a 422.
- A file over the size limit returns `422` with `field: file` before decoding.
- **Privacy (US6):** the uploaded bytes are read into memory, passed to `extract_skin_hex`, and dropped. They are never written to disk, the database, logs or error reports. Request logging excludes the body for this route.

## Account deletion hook (US5)

`delete_user_data(user_id: UUID) -> None`, importable from `/backend/profile`, deletes the user's `profiles` row (and any future per-user rows). It is idempotent. P2 calls it from `DELETE /auth/me` (see `contracts/auth.md`).

## Data tables owned by P3

- `profiles(user_id PRIMARY KEY, skin_hex, hair_hex, eye_hex, source, corrected, undertone_override, lab_l, lab_a, lab_b, ita_degrees, depth, undertone, season, confidence, explanation, palette JSONB, rule_versions JSONB, updated_at)`. No foreign key to `users` in Sprint 1, because `users` belongs to P2's schema; `user_id` is a UUID. Rows are removed through `delete_user_data`. No image data is stored.

## Environment variables (names only)

`MAX_PHOTO_BYTES`, plus the shared ones in `contracts/auth.md`.

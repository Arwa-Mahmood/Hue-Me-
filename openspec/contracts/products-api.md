# Shared products and profile API contract - Sprint 1

- Owner: **P3**. Consumer: **P4** (frontend mock and real API). Analysis payload rules come from `contracts/cv.md`; errors and auth from `contracts/auth.md`.
- SRS stories: US6 selfie analysis, US7 manual entry, US8 seasonal colour type, US9 wear/avoid colours, US10 correct detected tone, US5 (data deletion hook). The product catalogue section prepares Sprint 2 (US11+) and is lower priority than the profile endpoints.
- Status: proposed on Day 1; P4 builds the mock from this file, so any change needs P4's agreement.
- Base path: `/api/v1`. Mounted in the single FastAPI app (`backend/main.py`). Profile routes require an identified user (`401` otherwise). Admin routes require `role = admin` (`403 forbidden` otherwise, `401` if unauthenticated).

## Profile and analysis (Sprint 1 stories)

`Profile` is exactly the payload in `contracts/cv.md` section 11.

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

`delete_user_data(user_id: UUID) -> None`, importable from `/backend/products`, deletes the user's `profiles` row (and any future per-user rows). It is idempotent. P2 calls it from `DELETE /auth/me` (see `contracts/auth.md`).

## Product catalogue (Sprint 2 preparation, lower priority)

`Product`:

```json
{ "id": "uuid", "brand": "Maybelline", "product_name": "Fit Me", "category": "foundation", "shades": [ "Shade" ] }
```

`Shade`:

```json
{ "id": "uuid", "product_id": "uuid", "shade_name": "120 Classic Ivory", "hex": "#F3D2B3",
  "lab": { "l": 0.0, "a": 0.0, "b": 0.0 }, "buy_link": "https://example.com/p" }
```

- `category` is exactly `foundation`, `concealer`, `lipstick` or `blush`.
- `hex` is normalized to uppercase `#RRGGBB`. `lab` is computed by the server through P1's `hex_to_lab`, never sent by the client.
- `buy_link` is an `http` or `https` URL.
- List endpoints return `{ "items": [...], "total": n, "limit": n, "offset": n }`.

| Method and path | Purpose |
| --- | --- |
| `GET /products?category=&brand=&q=&limit=&offset=` | List products with their shades. Public. |
| `GET /products/{id}` | One product with shades. `404 not_found`. |
| `POST /admin/products` | Create. Body `{brand, product_name, category}`. `201` `Product`. |
| `PUT /admin/products/{id}` | Edit product fields. |
| `DELETE /admin/products/{id}` | Remove the product and its shades. `204`. |
| `POST /admin/products/{id}/shades` | Add a shade. Body `{shade_name, hex, buy_link}`. `201` `Shade`. |
| `PUT /admin/shades/{id}` | Edit a shade. Recomputes LAB if `hex` changes. |
| `DELETE /admin/shades/{id}` | Remove a shade. `204`. |
| `POST /admin/import` | Multipart CSV upload (`file`). Response `{ "products_created": n, "shades_created": n, "shades_skipped": n }`. All-or-nothing: any invalid row returns `422` listing each row error and imports nothing. |

## Data tables owned by P3

- `profiles(user_id PRIMARY KEY, skin_hex, hair_hex, eye_hex, source, corrected, undertone_override, lab_l, lab_a, lab_b, ita_degrees, depth, undertone, season, confidence, explanation, palette JSONB, rule_versions JSONB, updated_at)`. No foreign key to `users` in Sprint 1, because `users` belongs to P2's schema; `user_id` is a UUID. Rows are removed through `delete_user_data`. No image data is stored.
- `products(id, brand, product_name, category, created_at, updated_at)`; unique on `(brand, product_name, category)`.
- `shades(id, product_id -> products.id ON DELETE CASCADE, shade_name, hex, lab_l, lab_a, lab_b, buy_link, created_at, updated_at)`; unique on `(product_id, shade_name)`.

## CSV import format (shared with P1)

Header: `brand,product_name,category,shade_name,hex,buy_link`. The import also accepts the P1-enriched file that has `lab_l,lab_a,lab_b` appended. The server recomputes LAB itself and compares: a mismatch greater than `0.05` per component is reported as a warning, not an error. One row is one shade; rows with the same `(brand, product_name, category)` belong to one product. Re-importing an existing `(product, shade_name)` is skipped and counted in `shades_skipped`.

## Environment variables (names only)

`MAX_PHOTO_BYTES`, `MAX_CSV_BYTES`, plus the shared ones in `contracts/auth.md`.

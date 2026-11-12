# Shared products and profile API contract - Sprint 1

- Owner: **P3**. Consumer: **P4** (frontend mock and real API). CV payload rules come from `contracts/cv.md`; errors and auth from `contracts/auth.md`.
- Status: proposed on Day 1; P4 builds the mock from this file, so any change needs P4's agreement.
- Base path: `/api/v1`. Admin routes require `role = admin` (`403 forbidden` otherwise, `401` if unauthenticated).

## Types

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

## User endpoints

| Method and path | Purpose |
| --- | --- |
| `GET /products?category=&brand=&q=&limit=&offset=` | List products with their shades. Public. |
| `GET /products/{id}` | One product with shades. `404 not_found`. |
| `PUT /profile` | Save the caller's colours. Body `{skin_hex, hair_hex?, eye_hex?}`. Response is the profile payload in `contracts/cv.md` section 8. |
| `GET /profile` | Return the saved profile in the same shape. `404 not_found` if none saved. |

`PUT /profile` calls P1's functions. If analysis is `undetermined`, return `422` with code `validation_error` and a detail on field `skin_hex` explaining the undetermined depth.

## Admin endpoints

| Method and path | Purpose |
| --- | --- |
| `POST /admin/products` | Create. Body `{brand, product_name, category}`. `201` `Product`. |
| `PUT /admin/products/{id}` | Edit product fields. |
| `DELETE /admin/products/{id}` | Remove the product and its shades. `204`. |
| `POST /admin/products/{id}/shades` | Add a shade. Body `{shade_name, hex, buy_link}`. `201` `Shade`. |
| `PUT /admin/shades/{id}` | Edit a shade. Recomputes LAB if `hex` changes. |
| `DELETE /admin/shades/{id}` | Remove a shade. `204`. |
| `POST /admin/import` | Multipart CSV upload (`file`). Response `{ "products_created": n, "shades_created": n, "shades_skipped": n }`. All-or-nothing: any invalid row returns `422` listing each row error and imports nothing. |

## Data tables owned by P3

- `products(id, brand, product_name, category, created_at, updated_at)`; unique on `(brand, product_name, category)`.
- `shades(id, product_id -> products.id ON DELETE CASCADE, shade_name, hex, lab_l, lab_a, lab_b, buy_link, created_at, updated_at)`; unique on `(product_id, shade_name)`.
- `profiles(user_id PRIMARY KEY, skin_hex, hair_hex, eye_hex, lab_l, lab_a, lab_b, ita_degrees, depth, undertone, season, updated_at)`. No foreign key to `users` in Sprint 1, because `users` belongs to P2's schema; `user_id` is a UUID.

## CSV import format (shared with P1)

Header: `brand,product_name,category,shade_name,hex,buy_link`. The import also accepts the P1-enriched file that has `lab_l,lab_a,lab_b` appended. The server recomputes LAB itself and compares: a mismatch greater than `0.05` per component is reported as a warning, not an error. One row is one shade; rows with the same `(brand, product_name, category)` belong to one product. Re-importing an existing `(product, shade_name)` is skipped and counted in `shades_skipped`.

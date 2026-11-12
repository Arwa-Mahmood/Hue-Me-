# Product catalogue contract for Sprint 2 (parked from Sprint 1)

Owner: P3 (Ayesha). Consumer: P4 (Momina). Moved out of `contracts/products-api.md` so Sprint 1 covers only US1-US10. Admin routes need an admin account (see `README.md` in this folder).

## Product catalogue

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

## Tables

- `products(id, brand, product_name, category, created_at, updated_at)`; unique on `(brand, product_name, category)`.
- `shades(id, product_id -> products.id ON DELETE CASCADE, shade_name, hex, lab_l, lab_a, lab_b, buy_link, created_at, updated_at)`; unique on `(product_id, shade_name)`.

## CSV import format (shared with P1)

Header: `brand,product_name,category,shade_name,hex,buy_link`. The import also accepts the P1-enriched file that has `lab_l,lab_a,lab_b` appended. The server recomputes LAB itself and compares: a mismatch greater than `0.05` per component is reported as a warning, not an error. One row is one shade; rows with the same `(brand, product_name, category)` belong to one product. Re-importing an existing `(product, shade_name)` is skipped and counted in `shades_skipped`.

Environment: `MAX_CSV_BYTES` (proposal 2 MB).

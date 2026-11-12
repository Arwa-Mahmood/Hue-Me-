## Why

The app needs a product and shade catalogue that an admin can maintain, and a place to store each user's colours and analysis. This work can proceed without auth (a dev header stands in) and without the CV logic (a dummy function stands in).

## What Changes

- **Owner:** P3. **May write to:** `/backend/products` only (plus shared team documents).
- Admin endpoints to add, edit and remove products and shades.
- Own tables: `products`, `shades` (brand, category, shade, hex, LAB, buy link) and `profiles`.
- Profile endpoint that saves skin, hair and eye colours and the undertone/season result, by calling P1's functions.
- Bulk import endpoint and script that loads the shared shade CSV.
- A fake user ID header until auth is ready, then P2's JWT validator on Day 4.
- Test cases and results.

Interface: `openspec/contracts/products-api.md`; analysis payload: `openspec/contracts/cv.md` section 8.

## Capabilities

### New Capabilities
- `product-catalog`: products, shades, admin management, CSV import, public listing.
- `user-profile`: saving and reading a user's colours and analysis.

### Modified Capabilities
None.

## Non-goals

- No signup, login or password logic (P2).
- No colour maths in this folder; call P1's functions.
- No shade matching or recommendations (Sprint 2).
- No frontend code.

## Impact

- P4 builds the mock from `products-api.md` and switches to this API on Day 4.
- P1's enriched CSV and the shared shade data feed the importer.
- `profiles.user_id` has no foreign key to `users` in Sprint 1, so P3 and P2 stay independent.
- The dev header must be impossible to use in a deployed environment.

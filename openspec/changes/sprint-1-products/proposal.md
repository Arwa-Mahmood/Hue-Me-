## Why

Users need to submit their skin colour (selfie, hex or swatch), get their colour type with palette and explanation, correct it if it looks wrong, and have it saved. The SRS Sprint 1 stories US6-US10 all go through the profile API. The work can proceed without auth (a dev header stands in) and without the CV logic (dummy functions stand in). A product and shade catalogue is also prepared now so Sprint 2 matching has data.

## What Changes

- **Owner:** P3. **May write to:** `/backend/products` only (plus shared team documents).
- **SRS stories:** US6 selfie upload, US7 manual entry, US8 colour type, US9 palette, US10 correction (endpoints), US5 data deletion hook.
- `PUT /profile` (manual hex or swatch), `POST /profile/photo` (selfie, image discarded), `POST /profile/correction` and `GET /profile`, all calling P1's `analyze_skin` and `extract_skin_hex`.
- Own table `profiles` storing the colours, source, corrected flag and full analysis.
- `delete_user_data(user_id)` for P2's account deletion.
- A fake user ID header until auth is ready, then P2's JWT validator on Day 4.
- **Sprint 2 preparation (lower priority):** admin endpoints to add, edit and remove products and shades; tables `products`, `shades`; bulk import endpoint and script that loads the shared shade CSV.
- Test cases and results.

Interface: `openspec/contracts/products-api.md`; analysis payload: `openspec/contracts/cv.md` section 11.

## Capabilities

### New Capabilities
- `user-profile`: saving and reading a user's colours and analysis from manual, swatch or photo input, correcting it, and deleting it.
- `product-catalog`: products, shades, admin management, CSV import, public listing (Sprint 2 preparation).

### Modified Capabilities
None.

## Non-goals

- No signup, login, password, preferences or account logic (P2).
- No colour maths or image processing in this folder; call P1's functions.
- No storage of selfies, crops or image metadata.
- No analysis history (only the latest profile is kept in Sprint 1).
- No shade matching or recommendations (Sprint 2).
- No frontend code.

## Impact

- P4 builds the mock from `products-api.md` and switches to this API on Day 4.
- P2 calls `delete_user_data` from `DELETE /auth/me`.
- P1's enriched CSV and the shared shade data feed the importer.
- `profiles.user_id` has no foreign key to `users` in Sprint 1, so P3 and P2 stay independent.
- The dev header must be impossible to use in a deployed environment.

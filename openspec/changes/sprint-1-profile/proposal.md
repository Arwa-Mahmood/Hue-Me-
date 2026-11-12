## Why

Users need to submit their skin colour (selfie, hex or swatch), get their colour type with palette and explanation, correct it if it looks wrong, and have it saved. SRS Sprint 1 stories US6-US10 all go through the profile API, and US5 needs the profile deleted with the account. The work can proceed without auth (a dev header stands in) and without the CV logic (dummy functions stand in).

## What Changes

- **Owner:** P3 Ayesha. **May write to:** `/backend/profile` only (plus shared team documents).
- **SRS stories:** US6 selfie upload, US7 manual entry, US8 colour type, US9 palette, US10 correction (endpoints), US5 data deletion hook.
- `PUT /profile` (manual hex or swatch), `POST /profile/photo` (selfie, image discarded), `POST /profile/correction` and `GET /profile`, all calling Arwa's `analyze_skin` and `extract_skin_hex`.
- Own table `profiles` storing the colours, source, corrected flag and full analysis.
- `delete_user_data(user_id)` for Eshaal's account deletion.
- A fake user ID header until auth is ready, then Eshaal's JWT validator at integration.
- Test cases and results.

Interface: `openspec/contracts/profile-api.md`; analysis payload: `openspec/contracts/cv.md` section 9.

## Capabilities

### New Capabilities
- `user-profile`: saving and reading a user's colours and analysis from manual, swatch or photo input, correcting it, and deleting it.

### Modified Capabilities
None.

## Non-goals

- Anything in Sprint 2: the product catalogue, admin endpoints and CSV import are parked in `openspec/sprint-2/`.
- No signup, login, password, preferences or account logic (Eshaal).
- No colour maths or image processing in this folder; call Arwa's functions.
- No storage of selfies, crops or image metadata.
- No analysis history (only the latest profile is kept in Sprint 1).
- No frontend code.

## Impact

- Momina builds the mock from `profile-api.md` and switches to this API at integration.
- Eshaal calls `delete_user_data` from `DELETE /auth/me`.
- `profiles.user_id` has no foreign key to `users` in Sprint 1, so Ayesha and Eshaal stay independent.
- The dev header must be impossible to use in a deployed environment.

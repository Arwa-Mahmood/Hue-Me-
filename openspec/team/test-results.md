# Test cases and results

Rule: a result is recorded only after the test was actually run. Anything else stays `Not run`. Never fill in expected values as if they were results.

Row format: ID | Story | Case | Expected | Observed | Result (Pass/Fail/Not run). Also record date and commit for every run.

## P1 - CV (`/cv`)

Environment: ____ (Python version, OS, MediaPipe and OpenCV versions)

| ID | Story | Case | Expected | Observed | Result |
| --- | --- | --- | --- | --- | --- |
| CV-01 | US7 | `hex_to_lab` black, white, red | within 0.05 of `cv.md` section 2 | | Not run |
| CV-02 | US7 | `hex_to_lab` rejects short, alpha, whitespace, non-hex | `ValueError` | | Not run |
| CV-03 | US8 | ITA formula and negative `b` | `cv.md` section 3 fixtures | | Not run |
| CV-04 | US8 | ITA `b = 0` cases | 90 / -90 / `None` | | Not run |
| CV-05 | US8 | Depth boundaries (exact and either side) | `cv.md` section 3 table | | Not run |
| CV-06 | US8 | Undertone fixtures (all four labels) | team-approved fixtures | | Not run |
| CV-07 | US8 | All 24 season combinations | approved table | | Not run |
| CV-08 | US8 | `map_season` / `analyze_skin` with `undetermined` | `ValueError` | | Not run |
| CV-09 | prep | `delta_e` identity, symmetry, known pair | `5.0` for the contract pair | | Not run |
| CV-10 | prep | CSV: valid file, extra columns, determinism | LAB columns appended, same bytes twice | | Not run |
| CV-11 | prep | CSV: bad rows and malformed headers | all errors reported, no output written | | Not run |
| CV-12 | US6 | `extract_skin_hex` on a one-face fixture | uppercase `#RRGGBB`, `pixel_count >= 500` | | Not run |
| CV-13 | US6 | No face, two faces, unsupported format, too little skin | `PhotoError` with the matching `code` | | Not run |
| CV-14 | US6 | Same bytes twice; no file written during the call | identical result; temp directory unchanged | | Not run |
| CV-15 | US7 | `analyze_skin(hex)` equals analysis of the hex returned from a photo | identical `Analysis` | | Not run |
| CV-16 | US8 | Confidence at and either side of the `1.0` and `3.0` margins | approved rule | | Not run |
| CV-17 | US8 | Explanation template filled, disclaimer present, override note | matches `cv.md` section 10 | | Not run |
| CV-18 | US9 | Palette: 4 seasons, every entry hex + name, no colour in both lists | complete | | Not run |
| CV-19 | US10 | `undertone_override` changes undertone/season, sets `corrected`; invalid override | as contract / `ValueError` | | Not run |

## P2 - Auth (`/backend/auth`)

Environment: ____

| ID | Story | Case | Expected | Observed | Result |
| --- | --- | --- | --- | --- | --- |
| AU-01 | US1 | Signup valid | 201, role `user`, JWT issued | | Not run |
| AU-02 | US1 | Signup duplicate email, bad email, password < 8 chars, > 72 bytes | 409 / 422 / 422 / 422 | | Not run |
| AU-03 | US1 | Signup with `role: admin` in body | role still `user` | | Not run |
| AU-04 | US2 | Login valid / wrong password / unknown email | 200 / 401 / 401 same message | | Not run |
| AU-05 | US2 | Admin login using configured credentials | 200, role `admin` | | Not run |
| AU-06 | US3 | Forgot password known and unknown email | identical 202 response; link sent only for known | | Not run |
| AU-07 | US3 | Reset with valid link token | 200, old password fails, new works | | Not run |
| AU-08 | US3 | Reset with wrong, expired (> 1 hour), reused or superseded token | 400 `invalid_reset_token` | | Not run |
| AU-09 | US3 | Too many reset requests for one email | 429 | | Not run |
| AU-10 | US3 | Admin forgot-password and reset | works | | Not run |
| AU-11 | US3 | Token issued before reset | 401 after reset | | Not run |
| AU-12 | US2 | `/auth/me` valid, missing, expired, tampered token | 200 / 401 | | Not run |
| AU-13 | US4 | Preferences: defaults, save, read back | defaults, then saved values | | Not run |
| AU-14 | US4 | Preferences: unknown value, no token | 422 / 401 | | Not run |
| AU-15 | US5 | Delete account: wrong password, success, then login and old token | 401 / 204 / 401 / 401 | | Not run |
| AU-16 | US5 | Delete admin account; hook failure | 403; 500 and user kept | | Not run |

## P3 - Profile and products (`/backend/products`)

Environment: ____ (note whether the CV dummy or P1's real functions were used)

| ID | Story | Case | Expected | Observed | Result |
| --- | --- | --- | --- | --- | --- |
| PR-07 | US7 | `PUT /profile` valid | payload per `cv.md` section 11, `source = manual` | | Not run |
| PR-08 | US7 | `PUT /profile` hair/eye optional; do not change analysis | same analysis | | Not run |
| PR-09 | US7 | `PUT /profile` undetermined depth or bad hex | 422, nothing saved | | Not run |
| PR-10 | US8 | `GET /profile` with and without saved profile | 200 / 404 | | Not run |
| PR-11 | US8 | Profile of user A not visible to user B | isolated | | Not run |
| PR-14 | - | Dev header disabled outside development/test | 401 | | Not run |
| PR-15 | US5 | `delete_user_data` removes the profile; second call is harmless | row gone; no error | | Not run |
| PR-16 | US6 | `POST /profile/photo` valid JPEG and PNG | 200, `source = photo`, hair/eye kept | | Not run |
| PR-17 | US6 | Photo: no face, two faces, too large, wrong type; no image saved anywhere | 422 with `field: file`; no file/DB/log copy | | Not run |
| PR-18 | US10 | `POST /profile/correction` with hex, with override, with no profile | `corrected = true`, source kept / 404 | | Not run |
| PR-01 | prep | Admin creates, edits, deletes product | 201 / 200 / 204 | | Not run |
| PR-02 | prep | Admin adds, edits, deletes shade; LAB recomputed on hex change | as contract | | Not run |
| PR-03 | prep | Non-admin or no identity calls admin route | 403 / 401 | | Not run |
| PR-04 | prep | Duplicate product or shade, invalid hex, invalid category, bad link | 409 / 422 | | Not run |
| PR-05 | prep | Delete product removes its shades | shades gone | | Not run |
| PR-06 | prep | List filters and pagination | correct items and `total` | | Not run |
| PR-12 | prep | CSV import valid and re-import | counts correct, no duplicates | | Not run |
| PR-13 | prep | CSV import with a bad row | 422, nothing imported | | Not run |

## P4 - Frontend (`/frontend`)

Environment: ____ (browser, device sizes)

| ID | Story | Case | Expected | Observed | Result |
| --- | --- | --- | --- | --- | --- |
| FE-01 | US1, US2 | Signup (lands signed in), login, logout | works on mock; logout clears token | | Not run |
| FE-02 | US3 | Forgot password, open reset link, set new password; expired link | works on mock; error shown | | Not run |
| FE-03 | US1 | Form validation messages (email, password ≥ 8) | shown per field | | Not run |
| FE-04 | US7, US8 | Manual hex input and result screen | season, undertone, depth, confidence, explanation, palette | | Not run |
| FE-05 | US8 | Undetermined result (422) | friendly message, no season | | Not run |
| FE-09 | - | User cannot open admin screens | redirected | | Not run |
| FE-10 | US2 | Expired token handling | back to login | | Not run |
| FE-11 | all | Same flows against the real API (Day 4+) | works | | Not run |
| FE-12 | US2 | Reload the page while signed in | still signed in | | Not run |
| FE-13 | US4 | Change font size, theme, colour-blind mode, high contrast; reload; sign in elsewhere | applies immediately; persists | | Not run |
| FE-14 | US5 | Delete account: cancel, then confirm | nothing happens / signed out, redirected home | | Not run |
| FE-15 | US6 | Upload JPG and PNG; no-face and too-large errors | result shown / clear messages | | Not run |
| FE-16 | US7 | Pick a swatch from the grid | same result as typing that hex | | Not run |
| FE-17 | US9 | Wear and avoid lists | every swatch has hex and text label | | Not run |
| FE-18 | US10 | Adjust tone and undertone | palette updates, "corrected" shown | | Not run |
| FE-06 | prep | Product browse with filters and buy link | works | | Not run |
| FE-07 | prep | Admin product and shade add, edit, delete | works | | Not run |
| FE-08 | prep | Admin CSV import success and error list | works | | Not run |

## Integration (Day 4+)

| ID | Story | Case | Expected | Observed | Result |
| --- | --- | --- | --- | --- | --- |
| IN-01 | US1, US7, US8 | Signup, enter hex, see result end to end | works | | Not run |
| IN-02 | prep | Admin login, import CSV produced by P1's script | products visible to user | | Not run |
| IN-03 | US7 | P3 uses P1's real functions (no dummy) | results match `cv.md` fixtures | | Not run |
| IN-04 | - | P3 uses P2's JWT validator (no dev header) | works | | Not run |
| IN-05 | US6 | Upload a selfie on the deployed app | result shown; no image on server disk, DB or logs | | Not run |
| IN-06 | US5 | Delete account with a saved profile and preferences | user, preferences, reset tokens and profile all gone | | Not run |

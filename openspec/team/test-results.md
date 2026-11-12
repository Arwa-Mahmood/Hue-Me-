# Test cases and results

Rule: a result is recorded only after the test was actually run. Anything else stays `Not run`. Never fill in expected values as if they were results.

Row format: ID | Case | Command or steps | Expected | Observed | Result (Pass/Fail/Not run) | Date | Version or commit

## P1 - CV (`/cv`)

Environment: ____ (Python version, OS)

| ID | Case | Expected | Observed | Result |
| --- | --- | --- | --- | --- |
| CV-01 | `hex_to_lab` black, white, red | within 0.05 of `cv.md` section 2 | | Not run |
| CV-02 | `hex_to_lab` rejects short, alpha, whitespace, non-hex | `ValueError` | | Not run |
| CV-03 | ITA formula and negative `b` | `cv.md` section 3 fixtures | | Not run |
| CV-04 | ITA `b = 0` cases | 90 / -90 / `None` | | Not run |
| CV-05 | Depth boundaries (exact and either side) | `cv.md` section 3 table | | Not run |
| CV-06 | Undertone fixtures (all four labels) | team-approved fixtures | | Not run |
| CV-07 | All 24 season combinations | approved table | | Not run |
| CV-08 | `map_season` with `undetermined` | `ValueError` | | Not run |
| CV-09 | `delta_e` identity, symmetry, known pair | `5.0` for the contract pair | | Not run |
| CV-10 | CSV: valid file, extra columns, determinism | LAB columns appended, same bytes twice | | Not run |
| CV-11 | CSV: bad rows and malformed headers | all errors reported, no output written | | Not run |

## P2 - Auth (`/backend/auth`)

Environment: ____

| ID | Case | Expected | Observed | Result |
| --- | --- | --- | --- | --- |
| AU-01 | Signup valid | 201, role `user` | | Not run |
| AU-02 | Signup duplicate email, bad email, weak password | 409 / 422 | | Not run |
| AU-03 | Signup with `role: admin` in body | role still `user` | | Not run |
| AU-04 | Login valid / wrong password / unknown email | 200 / 401 / 401 same message | | Not run |
| AU-05 | Admin login using configured credentials | 200, role `admin` | | Not run |
| AU-06 | Forgot password known and unknown email | identical 202 response | | Not run |
| AU-07 | Reset with valid OTP | 200, old password fails, new works | | Not run |
| AU-08 | Reset with wrong, expired, reused OTP | 400 | | Not run |
| AU-09 | Too many OTP guesses or requests | 429 | | Not run |
| AU-10 | Admin forgot-password and reset | works | | Not run |
| AU-11 | Token issued before reset | 401 after reset | | Not run |
| AU-12 | `/auth/me` valid, missing, expired, tampered token | 200 / 401 | | Not run |

## P3 - Products (`/backend/products`)

Environment: ____

| ID | Case | Expected | Observed | Result |
| --- | --- | --- | --- | --- |
| PR-01 | Admin creates, edits, deletes product | 201 / 200 / 204 | | Not run |
| PR-02 | Admin adds, edits, deletes shade; LAB recomputed on hex change | as contract | | Not run |
| PR-03 | Non-admin or no identity calls admin route | 403 / 401 | | Not run |
| PR-04 | Duplicate product or shade, invalid hex, invalid category, bad link | 409 / 422 | | Not run |
| PR-05 | Delete product removes its shades | shades gone | | Not run |
| PR-06 | List filters and pagination | correct items and `total` | | Not run |
| PR-07 | `PUT /profile` valid | payload per `cv.md` section 8 | | Not run |
| PR-08 | `PUT /profile` hair/eye optional; do not change analysis | same analysis | | Not run |
| PR-09 | `PUT /profile` undetermined depth or bad hex | 422 | | Not run |
| PR-10 | `GET /profile` with and without saved profile | 200 / 404 | | Not run |
| PR-11 | Profile of user A not visible to user B | isolated | | Not run |
| PR-12 | CSV import valid and re-import | counts correct, no duplicates | | Not run |
| PR-13 | CSV import with a bad row | 422, nothing imported | | Not run |
| PR-14 | Dev header disabled outside development/test | 401 | | Not run |

## P4 - Frontend (`/frontend`)

Environment: ____ (browser, device sizes)

| ID | Case | Expected | Observed | Result |
| --- | --- | --- | --- | --- |
| FE-01 | Signup, login, logout flow | works on mock | | Not run |
| FE-02 | Forgot password and reset with OTP | works on mock | | Not run |
| FE-03 | Form validation messages | shown per field | | Not run |
| FE-04 | Colour input and result screen | shows season, undertone, depth, LAB | | Not run |
| FE-05 | Undetermined result (422) | friendly message, no season | | Not run |
| FE-06 | Product browse with filters and buy link | works | | Not run |
| FE-07 | Admin product and shade add, edit, delete | works | | Not run |
| FE-08 | Admin CSV import success and error list | works | | Not run |
| FE-09 | User cannot open admin screens | redirected | | Not run |
| FE-10 | Expired token handling | back to login | | Not run |
| FE-11 | Same flows against the real API (Day 4+) | works | | Not run |

## Integration (Day 4+)

| ID | Case | Expected | Observed | Result |
| --- | --- | --- | --- | --- |
| IN-01 | Signup, login, save profile, see result end to end | works | | Not run |
| IN-02 | Admin login, import CSV produced by P1's script | products visible to user | | Not run |
| IN-03 | P3 uses P1's real functions (no dummy) | results match `cv.md` fixtures | | Not run |
| IN-04 | P3 uses P2's JWT validator (no dev header) | works | | Not run |

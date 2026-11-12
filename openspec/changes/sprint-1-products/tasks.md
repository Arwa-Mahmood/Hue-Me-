## 1. Day 1: contract and skeleton

- [ ] 1.1 [P3][Day 1] Walk P4 through `openspec/contracts/products-api.md` and record their "ok" in `team/daily-scrum.md`
- [ ] 1.2 [P3][Day 1] Create the `/backend/products` skeleton and mount its routers in `backend/main.py` with P2
- [ ] 1.3 [P3][Day 1] Create the `profiles` table (then `products`, `shades` for section 6)
- [ ] 1.4 [P3][Day 1] Use the standard error envelope from `backend/main.py` (same as `auth.md`)

## 2. Seams for independence

- [ ] 2.1 [P3][Day 1] Write `cv_adapter.py` with clearly-marked dummies for `analyze_skin`, `extract_skin_hex` and `hex_to_lab` using the real signatures from `cv.md`
- [ ] 2.2 [P3][Day 1] Write `identity.py` with the dev header (`X-Dev-User-Id`, `X-Dev-Role`) and startup check that blocks mock mode outside development or test
- [ ] 2.3 [P3][Day 2] Admin-only dependency returning 401 / 403 correctly

## 3. Profile endpoints (Sprint 1 stories)

- [ ] 3.1 [P3][Day 2][US7] `PUT /profile` with analysis payload per `cv.md` section 11, `source = manual`
- [ ] 3.2 [P3][Day 2][US8][US9] `GET /profile` returning confidence, explanation and palette
- [ ] 3.3 [P3][Day 2][US7] 422 on invalid hex and on `undetermined` depth; nothing saved
- [ ] 3.4 [P3][Day 3][US6] `POST /profile/photo` with size limit, in-memory read, no disk spooling, no body logging
- [ ] 3.5 [P3][Day 3][US6] Map each photo error to a 422 with `field: file` and a clear message
- [ ] 3.6 [P3][Day 3][US10] `POST /profile/correction` keeping `source`, setting `corrected = true`, 404 without a profile
- [ ] 3.7 [P3][Day 3][US5] `delete_user_data(user_id)` and hand the import line to P2

## 4. Integration (Day 4)

- [ ] 4.1 [P3][Day 4] Replace the dummies in `cv_adapter.py` with P1's functions and re-run tests
- [ ] 4.2 [P3][Day 4] Switch to `AUTH_MODE=jwt` using P2's validator and re-run tests
- [ ] 4.3 [P3][Day 4][US5] Check with P2 that `DELETE /auth/me` removes the profile
- [ ] 4.4 [P3][Day 4] Tell P4 when the real API is reachable

## 5. Tests (Sprint 1 stories)

- [ ] 5.1 [P3][Day 3][US7] pytest: profile save, read, replace, hair and eye independence, 422 cases
- [ ] 5.2 [P3][Day 3][US8] pytest: isolation between users, 404 without a profile
- [ ] 5.3 [P3][Day 3][US6] pytest: photo JPEG and PNG, no face, two faces, too large, wrong type, nothing written to disk
- [ ] 5.4 [P3][Day 3][US10] pytest: correction with hex, with override, without a saved profile
- [ ] 5.5 [P3][Day 3][US5] pytest: `delete_user_data` removes the row and is idempotent
- [ ] 5.6 [P3][Day 3] pytest: dev header disabled outside development or test

## 6. Product catalogue (Sprint 2 preparation, after sections 1-5)

- [ ] 6.1 [P3][Day 3] Admin product create, edit, delete
- [ ] 6.2 [P3][Day 3] Admin shade add, edit, delete with server-side LAB
- [ ] 6.3 [P3][Day 3] Validation: category, hex, buy link, duplicates
- [ ] 6.4 [P3][Day 3] Public `GET /products` with filters and pagination, and `GET /products/{id}`
- [ ] 6.5 [P3][Day 4] Importer function with all-or-nothing validation, `POST /admin/import`, `scripts/import_csv.py`
- [ ] 6.6 [P3][Day 4] Test with a P1-enriched CSV when available, otherwise a hand-made sample
- [ ] 6.7 [P3][Day 4] pytest: product and shade create, edit, delete, cascade; 401 and 403 on admin routes; validation and duplicates; list filters and pagination; import valid, re-import, bad row, header-only file

## 7. Test cases and results

- [ ] 7.1 [P3][Day 3] Run everything and fill the P3 table in `team/test-results.md` with real results, noting dummy versus real CV
- [ ] 7.2 [P3][Day 5] Re-run after integration and on Railway, update results (including IN-05)

## 8. Shared documents

- [ ] 8.1 [P3][Day 4] Write the P3 sections of `team/user-manual.md` (correcting your result, admin guide)
- [ ] 8.2 [P3][Day 4] Review the SRS update
- [ ] 8.3 [P3][Day 1-5] Add your own Trello cards (tagged US5-US10) and `team/daily-scrum.md` entries

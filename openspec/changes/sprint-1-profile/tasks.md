## 1. Contract and skeleton

- [ ] 1.1 [P3] Walk Momina through `openspec/contracts/profile-api.md` and record her "ok" in `team/daily-scrum.md`
- [ ] 1.2 [P3] Create the `/backend/profile` skeleton and mount its router in `backend/main.py` with Eshaal
- [ ] 1.3 [P3] Create the `profiles` table
- [ ] 1.4 [P3] Use the standard error envelope from `backend/main.py` (same as `auth.md`)

## 2. Seams for independence

- [ ] 2.1 [P3] Write `cv_adapter.py` with clearly-marked dummies for `analyze_skin` and `extract_skin_hex` using the real signatures from `cv.md`
- [ ] 2.2 [P3] Write `identity.py` with the dev header (`X-Dev-User-Id`) and startup check that blocks mock mode outside development or test

## 3. Profile endpoints

- [ ] 3.1 [P3][US7] `PUT /profile` with analysis payload per `cv.md` section 9, `source = manual`
- [ ] 3.2 [P3][US8][US9] `GET /profile` returning confidence, explanation and palette
- [ ] 3.3 [P3][US7] 422 on invalid hex and on `undetermined` depth; nothing saved
- [ ] 3.4 [P3][US6] `POST /profile/photo` with size limit, in-memory read, no disk spooling, no body logging
- [ ] 3.5 [P3][US6] Map each photo error to a 422 with `field: file` and a clear message
- [ ] 3.6 [P3][US10] `POST /profile/correction` keeping `source`, setting `corrected = true`, 404 without a profile
- [ ] 3.7 [P3][US5] `delete_user_data(user_id)` and hand the import line to Eshaal

## 4. Integration

- [ ] 4.1 [P3] Replace the dummies in `cv_adapter.py` with Arwa's functions and re-run tests
- [ ] 4.2 [P3] Switch to `AUTH_MODE=jwt` using Eshaal's validator and re-run tests
- [ ] 4.3 [P3][US5] Check with Eshaal that `DELETE /auth/me` removes the profile
- [ ] 4.4 [P3] Tell Momina when the real API is reachable

## 5. Tests

- [ ] 5.1 [P3][US7] pytest: profile save, read, replace, hair and eye independence, 422 cases
- [ ] 5.2 [P3][US8] pytest: isolation between users, 404 without a profile
- [ ] 5.3 [P3][US6] pytest: photo JPEG and PNG, no face, two faces, too large, wrong type, nothing written to disk
- [ ] 5.4 [P3][US10] pytest: correction with hex, with override, without a saved profile
- [ ] 5.5 [P3][US5] pytest: `delete_user_data` removes the row and is idempotent
- [ ] 5.6 [P3] pytest: dev header disabled outside development or test

## 6. Test cases and results

- [ ] 6.1 [P3] Run everything and fill the P3 table (PR-01 to PR-10) in `team/test-results.md` with real results, noting dummy versus real CV
- [ ] 6.2 [P3] Re-run after integration and on Railway, update results, and run IN-02 and IN-04 with the team

## 7. Shared documents

- [ ] 7.1 [P3] Write Ayesha's section of `team/user-manual.md` (correcting your result)
- [ ] 7.2 [P3] Review the SRS update
- [ ] 7.3 [P3] Add your own Trello cards (tagged US5-US10) and `team/daily-scrum.md` entries

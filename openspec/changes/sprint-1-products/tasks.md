## 1. Day 1: contract and skeleton

- [ ] 1.1 [P3][Day 1] Walk P4 through `openspec/contracts/products-api.md` and record their "ok" in `team/daily-scrum.md`
- [ ] 1.2 [P3][Day 1] Create the `/backend/products` skeleton and add the service to docker-compose with P2
- [ ] 1.3 [P3][Day 1] Create tables `products`, `shades`, `profiles`
- [ ] 1.4 [P3][Day 1] Implement the standard error envelope (same as `auth.md`)

## 2. Seams for independence

- [ ] 2.1 [P3][Day 1] Write `cv_adapter.py` with a clearly-marked dummy using the real signatures from `cv.md`
- [ ] 2.2 [P3][Day 1] Write `identity.py` with the dev header (`X-Dev-User-Id`, `X-Dev-Role`) and startup check that blocks mock mode outside development or test
- [ ] 2.3 [P3][Day 2] Admin-only dependency returning 401 / 403 correctly

## 3. Catalogue endpoints

- [ ] 3.1 [P3][Day 2] Admin product create, edit, delete
- [ ] 3.2 [P3][Day 2] Admin shade add, edit, delete with server-side LAB
- [ ] 3.3 [P3][Day 2] Validation: category, hex, buy link, duplicates
- [ ] 3.4 [P3][Day 2] Public `GET /products` with filters and pagination, and `GET /products/{id}`

## 4. Profile endpoint

- [ ] 4.1 [P3][Day 3] `PUT /profile` with analysis payload per `cv.md` section 8
- [ ] 4.2 [P3][Day 3] `GET /profile`
- [ ] 4.3 [P3][Day 3] 422 on invalid hex and on `undetermined` depth

## 5. Bulk import

- [ ] 5.1 [P3][Day 3] Importer function with all-or-nothing validation
- [ ] 5.2 [P3][Day 3] `POST /admin/import` endpoint
- [ ] 5.3 [P3][Day 3] `scripts/import_csv.py` using the same importer
- [ ] 5.4 [P3][Day 3] Test with a P1-enriched CSV when available, otherwise a hand-made sample

## 6. Integration (Day 4)

- [ ] 6.1 [P3][Day 4] Replace the dummy in `cv_adapter.py` with P1's functions and re-run tests
- [ ] 6.2 [P3][Day 4] Switch to `AUTH_MODE=jwt` using P2's validator and re-run tests
- [ ] 6.3 [P3][Day 4] Tell P4 when the real API is reachable

## 7. Tests

- [ ] 7.1 [P3][Day 3] pytest: product and shade create, edit, delete, cascade
- [ ] 7.2 [P3][Day 3] pytest: 401 and 403 on admin routes
- [ ] 7.3 [P3][Day 3] pytest: validation and duplicate errors
- [ ] 7.4 [P3][Day 3] pytest: list filters and pagination
- [ ] 7.5 [P3][Day 3] pytest: profile save, read, replace, isolation between users, hair and eye independence, 422 cases
- [ ] 7.6 [P3][Day 3] pytest: import valid, re-import, bad row, header-only file
- [ ] 7.7 [P3][Day 3] pytest: dev header disabled outside development or test

## 8. Test cases and results

- [ ] 8.1 [P3][Day 3] Run everything and fill the P3 table in `team/test-results.md` with real results, noting dummy versus real CV
- [ ] 8.2 [P3][Day 5] Re-run after integration and update results

## 9. Shared documents

- [ ] 9.1 [P3][Day 4] Write the P3 sections of `team/user-manual.md`
- [ ] 9.2 [P3][Day 4] Review the SRS
- [ ] 9.3 [P3][Day 1-5] Add your own Trello cards and `team/daily-scrum.md` entries

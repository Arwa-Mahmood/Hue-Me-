## 1. Day 1: agree the contract

- [ ] 1.1 [P1][Day 1] Walk P2, P3 and P4 through `openspec/contracts/cv.md` and record their "ok" in `team/daily-scrum.md`
- [ ] 1.2 [P1][Day 1][US8] Draft undertone thresholds, comparison rules and labelled fixtures for all four labels
- [ ] 1.3 [P1][Day 1][US8] Get the team to approve the undertone rule and the 24-cell season table; replace the pending identifiers in `cv.md`
- [ ] 1.4 [P1][Day 1][US8][US9] Get the team to approve the confidence thresholds, wear/avoid palette and explanation template
- [ ] 1.5 [P1][Day 1][US6] Propose the cheek and forehead landmark indices and the minimum pixel count; get approval
- [ ] 1.6 [P1][Day 1] Create the `/cv` package skeleton and `tests/` with pytest running

## 2. Core colour functions

- [ ] 2.1 [P1][Day 1] Implement `Lab`, `ItaResult`, `Depth` types
- [ ] 2.2 [P1][Day 1][US7] Implement `hex_to_lab(hex)` with strict hex validation
- [ ] 2.3 [P1][Day 1][US8] Implement `calculate_ita(lab)` with depth boundaries and `b = 0` handling
- [ ] 2.4 [P1][Day 2][US8] Implement `classify_undertone(lab)` after approval
- [ ] 2.5 [P1][Day 2][US8] Implement `map_season(undertone, depth)` including the `undetermined` rejection
- [ ] 2.6 [P1][Day 2] Implement `delta_e(lab1, lab2)` (CIE76) for Sprint 2

## 3. Analysis for the profile payload

- [ ] 3.1 [P1][Day 2] Implement `Analysis`, `Palette`, `NamedColour` types and `cv/rules.py` with versioned rule data
- [ ] 3.2 [P1][Day 2][US8] Implement the confidence indicator
- [ ] 3.3 [P1][Day 2][US9] Implement the approved wear/avoid palette lookup
- [ ] 3.4 [P1][Day 2][US8] Implement the explanation template with the disclaimer
- [ ] 3.5 [P1][Day 2][US7][US10] Implement `analyze_skin(skin_hex, undertone_override=None)`
- [ ] 3.6 [P1][Day 2] Export the public functions from `cv/__init__.py` and give P3 the import line

## 4. Selfie skin sampling

- [ ] 4.1 [P1][Day 2][US6] Collect consented or openly licensed test images and record source and licence in `tests/fixtures/README.md`
- [ ] 4.2 [P1][Day 2][US6] Implement image decoding, format check and downscaling with OpenCV
- [ ] 4.3 [P1][Day 3][US6] Implement face detection with MediaPipe Face Mesh (exactly one face)
- [ ] 4.4 [P1][Day 3][US6] Implement cheek/forehead masks and median sampling to a hex; `PhotoError` codes
- [ ] 4.5 [P1][Day 3][US6] Check that nothing is written to disk or logged during a call

## 5. Bulk CSV script (Sprint 2 preparation)

- [ ] 5.1 [P1][Day 3] Implement `cv/bulk.py` per `cv.md` section 7 (validation, append `lab_l,lab_a,lab_b`, atomic write)
- [ ] 5.2 [P1][Day 3] Write the usage in a short `cv/README.md` including the Windows command
- [ ] 5.3 [P1][Day 3] Run it on a sample CSV and give P3 the output file

## 6. Tests

- [ ] 6.1 [P1][Day 2][US7] Unit tests: known hex values (black, white, red) within tolerance
- [ ] 6.2 [P1][Day 2][US7] Unit tests: invalid hex forms are rejected
- [ ] 6.3 [P1][Day 2][US8] Unit tests: ITA formula, negative `b`, exact boundaries and values just either side, `b = 0` cases
- [ ] 6.4 [P1][Day 2][US8] Unit tests: approved undertone fixtures
- [ ] 6.5 [P1][Day 2][US8] Unit tests: all 24 season combinations and the `undetermined` error
- [ ] 6.6 [P1][Day 2] Unit tests: `delta_e` identity, symmetry, known pair, invalid input
- [ ] 6.7 [P1][Day 2][US8] Unit tests: confidence boundaries, explanation text and disclaimer
- [ ] 6.8 [P1][Day 2][US9] Unit tests: palette complete, every entry hex + name, no colour in both lists
- [ ] 6.9 [P1][Day 2][US10] Unit tests: undertone override and invalid override
- [ ] 6.10 [P1][Day 3][US6] Unit tests: one face, no face, two faces, unsupported format, too little skin, repeat determinism, no files written
- [ ] 6.11 [P1][Day 3][US7] Unit test: photo hex and the same hex typed manually give the same `Analysis`
- [ ] 6.12 [P1][Day 3] Unit tests: CSV valid, extra columns, deterministic output, bad rows, bad headers, existing destination kept, write failure

## 7. Test cases and results

- [ ] 7.1 [P1][Day 3] Run the full suite and fill the P1 table in `team/test-results.md` with real results
- [ ] 7.2 [P1][Day 4] Support P3's integration; re-run tests after any rule change

## 8. After CV is done

- [ ] 8.1 [P1][Day 4] Write the Sprint 1 update in `team/srs.md` (approved rules, changes to US1-US10, open issues)
- [ ] 8.2 [P1][Day 4] Collect review from P2, P3 and P4 and log it in `team/srs.md`
- [ ] 8.3 [P1][Day 4] Write the P1 sections of `team/user-manual.md` (finding your colours, understanding your result)
- [ ] 8.4 [P1][Day 4] If finished first, start the early-finisher shade data task in `team/shade-data.md`
- [ ] 8.5 [P1][Day 1-5] Add your own cards to Trello (tagged US6-US10) and your entries to `team/daily-scrum.md`

## 1. Day 1: agree the contract

- [ ] 1.1 [P1][Day 1] Walk P2, P3 and P4 through `openspec/contracts/cv.md` and record their "ok" in `team/daily-scrum.md`
- [ ] 1.2 [P1][Day 1] Draft undertone thresholds, comparison rules and labelled fixtures for all four labels
- [ ] 1.3 [P1][Day 1] Get the team to approve the undertone rule and the 24-cell season table; replace the pending identifiers in `cv.md`
- [ ] 1.4 [P1][Day 1] Create the `/cv` package skeleton and `tests/` with pytest running

## 2. Core functions

- [ ] 2.1 [P1][Day 1] Implement `Lab`, `ItaResult`, `Depth` types
- [ ] 2.2 [P1][Day 1] Implement `hex_to_lab(hex)` with strict hex validation
- [ ] 2.3 [P1][Day 1] Implement `calculate_ita(lab)` with depth boundaries and `b = 0` handling
- [ ] 2.4 [P1][Day 2] Implement `classify_undertone(lab)` after approval
- [ ] 2.5 [P1][Day 2] Implement `map_season(undertone, depth)` including the `undetermined` rejection
- [ ] 2.6 [P1][Day 2] Implement `delta_e(lab1, lab2)` (CIE76)
- [ ] 2.7 [P1][Day 2] Export the five functions from `cv/__init__.py` and give P3 the import line

## 3. Bulk CSV script

- [ ] 3.1 [P1][Day 2] Implement `cv/bulk.py` per `cv.md` section 7 (validation, append `lab_l,lab_a,lab_b`, atomic write)
- [ ] 3.2 [P1][Day 3] Write the usage in a short `cv/README.md` including the Windows command
- [ ] 3.3 [P1][Day 3] Run it on a sample CSV and give P3 the output file

## 4. Tests

- [ ] 4.1 [P1][Day 2] Unit tests: known hex values (black, white, red) within tolerance
- [ ] 4.2 [P1][Day 2] Unit tests: invalid hex forms are rejected
- [ ] 4.3 [P1][Day 2] Unit tests: ITA formula, negative `b`, exact boundaries and values just either side, `b = 0` cases
- [ ] 4.4 [P1][Day 2] Unit tests: approved undertone fixtures
- [ ] 4.5 [P1][Day 2] Unit tests: all 24 season combinations and the `undetermined` error
- [ ] 4.6 [P1][Day 2] Unit tests: `delta_e` identity, symmetry, known pair, invalid input
- [ ] 4.7 [P1][Day 3] Unit tests: CSV valid, extra columns, deterministic output, bad rows, bad headers, existing destination kept, write failure

## 5. Test cases and results

- [ ] 5.1 [P1][Day 3] Run the full suite and fill the P1 table in `team/test-results.md` with real results
- [ ] 5.2 [P1][Day 4] Support P3's integration; re-run tests after any rule change

## 6. After CV is done

- [ ] 6.1 [P1][Day 4] Write the first updated SRS in `team/srs.md`
- [ ] 6.2 [P1][Day 4] Collect review from P2, P3 and P4 and log it in the SRS
- [ ] 6.3 [P1][Day 4] Write the P1 section of `team/user-manual.md`
- [ ] 6.4 [P1][Day 4] Start the early-finisher shade data task in `team/shade-data.md`
- [ ] 6.5 [P1][Day 1-5] Add your own cards to Trello and your entries to `team/daily-scrum.md`

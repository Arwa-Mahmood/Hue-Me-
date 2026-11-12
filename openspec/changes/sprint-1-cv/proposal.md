## Why

Every other part of Hue Me depends on turning a hex colour into a depth, undertone and season. This logic is a set of pure functions (hex in, values out), so it needs no database, login or UI. That lets P1 build it on Day 1 with no dependencies, and gives P3 and P4 a fixed contract to code against.

## What Changes

- **Owner:** P1. **May write to:** `/cv` only (plus shared team documents).
- Add five pure Python functions in `/cv`: `hex_to_lab`, `calculate_ita`, `classify_undertone`, `map_season`, `delta_e`.
- Add a bulk CSV script that appends LAB values to a shade CSV.
- Add unit tests with known hex values and expected outputs, then record test cases and results.
- Draft undertone thresholds and the season table for the team to approve on Day 1.
- After CV work is done, write the first updated SRS, then work on the shared shade data (early finisher).

The authoritative interface is `openspec/contracts/cv.md`.

## Capabilities

### New Capabilities
- `color-analysis`: hex to LAB, ITA and depth, undertone, season, CIE76 distance, and CSV LAB enrichment.

### Modified Capabilities
None.

## Non-goals

- No database, authentication, web framework or UI code in `/cv`.
- No product matching or recommendation (Sprint 2); only the `delta_e` primitive.
- No CIE94 or CIEDE2000.
- No claim of medical or scientific accuracy for undertone or season.

## Impact

- P3 imports these functions at integration (Day 4) and uses a dummy until then.
- P4 shows the output values and relies on the enum spellings in the contract.
- The undertone thresholds and season table block acceptance until the team approves them.

## Why

Most Sprint 1 stories depend on turning a skin colour into a depth, undertone, season, palette and explanation. The SRS requires two inputs for that colour: a selfie analysed with MediaPipe and OpenCV (US6) and a manual hex or swatch (US7), with the same output either way. The analysis is a set of rule-based functions (hex in, values out) and needs no database, login or UI. That lets P1 build it on Day 1 with no dependencies, and gives P3 and P4 a fixed contract to code against.

## What Changes

- **Owner:** P1. **May write to:** `/cv` only (plus shared team documents).
- **SRS stories:** US6 selfie analysis, US7 manual entry, US8 seasonal colour type, US9 wear/avoid colours, US10 corrected tone (analysis logic only).
- Five pure Python primitives in `/cv`: `hex_to_lab`, `calculate_ita`, `classify_undertone`, `map_season`, `delta_e`.
- `analyze_skin(skin_hex, undertone_override=None)`: one call returning LAB, ITA, depth, undertone, season, confidence, template explanation and wear/avoid palette.
- `extract_skin_hex(image_bytes)`: detects one face with MediaPipe Face Mesh, samples cheek and forehead skin with OpenCV, returns a hex; never stores the image.
- Draft the undertone thresholds, season table, face regions, confidence thresholds, palette and explanation template for the team to approve on Day 1.
- A bulk CSV script that appends LAB values to a shade CSV (Sprint 2 preparation).
- Unit tests with known values and test images, then record test cases and results.
- After CV work is done, write the Sprint 1 SRS update, then work on the shared shade data (early finisher).

The authoritative interface is `openspec/contracts/cv.md`.

## Capabilities

### New Capabilities
- `color-analysis`: hex to LAB, ITA and depth, undertone, season, confidence, palette, explanation, undertone override, selfie skin sampling, CIE76 distance, and CSV LAB enrichment.

### Modified Capabilities
None.

## Non-goals

- No database, authentication, web framework or UI code in `/cv`.
- No generative AI, LLM text or custom-trained model; MediaPipe is used pre-trained and explanations are templates.
- No face-shape detection or glasses recommendation, no lipstick/outfit preview, no shade matching (all later sprints); only the `delta_e` primitive.
- No CIE94 or CIEDE2000.
- No storage of images, crops or pixel data anywhere.
- No claim of medical, dermatological or scientific accuracy for undertone, season or confidence.

## Impact

- P3 imports `analyze_skin`, `extract_skin_hex` and `hex_to_lab` at integration (Day 4) and uses dummies until then.
- P4 shows the output values and relies on the enum spellings, palette shape and confidence values in the contract.
- The undertone thresholds, season table, face regions, confidence thresholds and palette block acceptance until the team approves them.
- The backend image needs MediaPipe, `opencv-python-headless` and NumPy.

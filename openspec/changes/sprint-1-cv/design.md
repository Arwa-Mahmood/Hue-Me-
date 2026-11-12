## Context

`openspec/contracts/cv.md` already fixes the formulas, types, error behaviour, photo pipeline and payload. This design only covers how Arwa organises the code and what is still open.

## Goals / Non-Goals

**Goals**
- Pure, deterministic colour functions with no I/O, so they are trivial to test and to import from the backend.
- One photo function that turns a selfie into a hex and forgets the image, so photo and manual input share one analysis path (US6, US7).

**Non-Goals**
- Anything in the proposal's Non-goals list.

## Decisions

- **Layout (proposed):**
  - `cv/types.py`: `Lab`, `ItaResult`, `Depth`, `Analysis`, `Palette`, `NamedColour`, `SkinSample` (frozen dataclasses and enums)
  - `cv/color.py`: `hex_to_lab`
  - `cv/ita.py`: `calculate_ita`
  - `cv/season.py`: `classify_undertone`, `map_season`
  - `cv/rules.py`: versioned rule data (undertone thresholds, season table, confidence thresholds, palette, explanation template, face-region landmark indices)
  - `cv/analysis.py`: `analyze_skin`, confidence and explanation
  - `cv/photo.py`: `extract_skin_hex`, `PhotoError` (the only module importing MediaPipe, OpenCV, NumPy)
  - `cv/__init__.py`: re-exports the public functions and types; imports `photo` lazily so the colour core works without the CV libraries installed
  - `tests/` and `tests/fixtures/` (test images with a source/licence README)
- **Dependencies:** the colour core uses only the standard library (`math`, `dataclasses`, `enum`). `cv/photo.py` uses `mediapipe`, `opencv-python-headless` and `numpy` as the SRS requires. `pytest` for tests.
- **Photo pipeline:** decode with `cv2.imdecode`, check the format from the decoded content, downscale to 1600 px on the long side, run Face Mesh in static mode, build cheek and forehead masks from fixed landmark indices, take the per-channel median, return a hex. Everything stays in memory; no temporary files.
- **Rules as data:** every kickoff rule is plain data with a version identifier in `cv/rules.py`, so approved values change in one place together with the tests.
- **Explanation:** a Python format string from `cv/rules.py`; no generated text.

## Risks / Trade-offs

- **Undertone thresholds are not scientifically established.** Mitigation: label them as a team heuristic, store the version, and keep fixtures as agreed examples. Risk is a late change; the data-driven layout limits the cost.
- **Season table, palette and confidence are drafts.** Same mitigation.
- **Lighting and camera white balance shift the selfie colour.** Mitigation: median sampling, guidance text on the upload screen (Momina), and the US10 correction flow. Documented as a limitation.
- **Test images and consent.** Use only consented or openly licensed faces; record source and licence; never commit user uploads.
- **MediaPipe version drift** could change landmarks slightly. Mitigation: pin the version in `backend/requirements.txt` and record it with test results.
- **Exact-zero ITA cases** are conventions, documented in the contract and tested with constructed Lab values.
- **Ayesha starts before the rules are approved.** Mitigation: she uses dummies with the same signatures; the signatures never depend on the rule values.

## Migration Plan

New code, nothing to migrate. Once approved, replace the `-pending` / `-draft` identifiers in `cv.md` with the final ones.

## Open Questions

- Undertone thresholds and fixtures (blocking).
- Season table cells, palette entries and explanation wording.
- Face-region landmark indices and the 500-pixel minimum.
- Confidence margins.
- Source of consented or openly licensed test selfies.

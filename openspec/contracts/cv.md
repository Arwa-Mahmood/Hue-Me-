# Shared CV contract — Sprint 1

- Owner: **P1**. Consumers: **P3** (backend integration) and **P4** (frontend).
- SRS stories: US6 skin tone from a selfie, US7 manual entry (same output as photo), US8 seasonal colour type with explanation and confidence, US9 colours to wear and avoid, US10 corrected tone. `delta_e` and the CSV CLI prepare Sprint 2 (US11+).
- Status: planning only; no implementation or executed evidence. Fixed requirements below are authoritative for consumers. Sections explicitly marked **PROPOSED / Day 1 approval required** are not accepted rules.
- Location of future implementation: `/cv`. No database, authentication, web framework, or UI dependency is permitted anywhere in `/cv`. The colour core and CSV CLI use only the standard library; only the photo module (section 9) may import MediaPipe, OpenCV (`opencv-python-headless`) and NumPy, as the SRS requires.
- No generative AI, LLM, diffusion model or custom-trained model is used. All logic is rule-based and deterministic; explanation text comes from fixed templates.
- Precedence: this file is the shared interface source of truth. P1 must reconcile the change proposal, design, requirements, tests, and consumer expectations with it before accepting a revision. Changes affecting consumers require P3 and P4 review.

## 1. Public surface and shared types

Seven public Python functions are in scope. The first five are pure numerical primitives; `analyze_skin` composes them for the backend; `extract_skin_hex` is the photo entry point.

| Function | Return | Contract |
| --- | --- | --- |
| `hex_to_lab(hex)` | `Lab` | Validate hexadecimal sRGB, convert to reference Lab. |
| `calculate_ita(lab)` | `ItaResult` | Compute the standard ITA ratio formula and depth. |
| `classify_undertone(lab)` | `warm`, `cool`, `neutral`, or `olive` | Apply the team-accepted, versioned heuristic; approval is blocking. |
| `map_season(undertone, depth)` | `Spring`, `Summer`, `Autumn`, or `Winter` | Apply the team-accepted decision table; reject `undetermined`. |
| `delta_e(lab1, lab2)` | nonnegative float | CIE76 distance, ready for Sprint 2 consumers. |
| `analyze_skin(skin_hex, undertone_override=None)` | `Analysis` | US7/US8/US9/US10. One call that returns everything the profile payload needs (section 10). |
| `extract_skin_hex(image_bytes)` | `SkinSample` | US6. Detect one face with MediaPipe and return the sampled skin colour as hex (section 9). |

Shared value types are not additional analysis functions:

- `Lab`: immutable value with finite floating-point fields `l`, `a`, `b`; serialize exactly as `{ "l": ..., "a": ..., "b": ... }`. No mutation of arguments or shared state. Pure numerical functions accept finite synthetic Lab values for math tests; physical color-gamut checks are not added to those functions.
- `Depth`: enum with wire values `very_light`, `light`, `intermediate`, `tan`, `brown`, `dark`, `undetermined`.
- `ItaResult`: immutable value with `angle_degrees: float | None` and `depth: Depth`. `None` means only the defined ITA indeterminate case, not missing or invalid input.
- `Analysis`: immutable value with `skin_hex` (normalized), `lab`, `ita` (`ItaResult`), `undertone`, `season`, `confidence` (`high` | `medium` | `low`), `explanation` (string), `palette` (`Palette`), `corrected` (bool, true when `undertone_override` was used) and `rule_versions` (mapping of rule name to version identifier).
- `Palette`: immutable value with `wear` and `avoid`, each an ordered tuple of `NamedColour(hex, name)` where `hex` is uppercase `#RRGGBB` and `name` is a nonempty text label (US9: every swatch has a text label).
- `SkinSample`: immutable value with `skin_hex` (uppercase `#RRGGBB`) and `pixel_count` (int, number of sampled skin pixels).
- Undertone wire values are lowercase; season wire values use the capitalization in the function table.
- Invalid argument types/values, nonfinite Lab components, unknown enum values, malformed hex, and an undetermined season request raise an explicit `ValueError` with an actionable message. Do not silently coerce invalid input, return a default season, or emit NaN/Infinity.
- Functions are deterministic for the same inputs and accepted rule version. They perform no file, network, database or user-state access (the photo module only loads MediaPipe's bundled local model). Rule versions are immutable implementation configuration, not extra arguments or extra public analysis functions.

## 2. Hexadecimal and Lab reference

- Accept only a string matching `#RRGGBB` or `RRGGBB`, case-insensitively for the six hexadecimal digits. Normalize for boundary output to uppercase `#RRGGBB`.
- Reject shorthand (`#RGB`), alpha (`#RRGGBBAA`/`RRGGBBAA`), surrounding whitespace, missing digits, non-hex characters, multiple `#` characters, and nonstrings. Do not guess or truncate.
- Color space: IEC sRGB, D65 reference white, CIE 1931 **2-degree** standard observer; Lab is not D50, display-profile dependent, or HSV/HSL.
- Decode sRGB gamma using `c / 12.92` for `c <= 0.04045`, otherwise `((c + 0.055) / 1.055) ** 2.4`, where `c` is a channel divided by 255.
- Linear RGB to XYZ uses rows `(0.4124564, 0.3575761, 0.1804375)`, `(0.2126729, 0.7151522, 0.0721750)`, `(0.0193339, 0.1191920, 0.9503041)`. D65 reference white on the same unit scale is `(0.95047, 1.00000, 1.08883)`.
- For normalized XYZ coordinates use `f(t) = t ** (1/3)` above `(6/29) ** 3`, otherwise `t / (3 * (6/29) ** 2) + 4/29`. Then `l = 116*f(Y/Yn)-16`, `a = 500*(f(X/Xn)-f(Y/Yn))`, `b = 200*(f(Y/Yn)-f(Z/Zn))`.
- Keep full floating-point precision through conversion, ITA, thresholds, and distance. Presentation rounding must not affect classification. No artificial near-zero snapping is specified.

Planned reference unit cases (absolute tolerance **0.05 per Lab component**):

| Input | Expected approximate `(l, a, b)` |
| --- | --- |
| `#000000` | `(0.0000, 0.0000, 0.0000)` |
| `#FFFFFF` | `(100.0000, 0.0000, 0.0000)` |
| `#FF0000` | `(53.2408, 80.0925, 67.2032)` |

These are reference targets, not reported test results. Exact `b = 0` ITA tests use constructed Lab values rather than assuming a computed near-zero value is exactly zero.

## 3. ITA formula, singularities, and depth

For finite Lab and `b != 0`:

`angle_degrees = degrees(atan((l - 50) / b))`

Use the ratio formula, **not `atan2`**. Negative `b` is valid and must retain its sign; do not replace it with an absolute value or reject it. Finite extreme inputs must not produce a nonfinite result through avoidable intermediate overflow. Angles lie in the inclusive range `[-90, 90]` degrees.

Exact-zero policy, treating positive and negative floating-point zero alike:

| Condition | `angle_degrees` | `depth` |
| --- | --- | --- |
| `b == 0`, `l > 50` | `90.0` | `very_light` |
| `b == 0`, `l < 50` | `-90.0` | `dark` |
| `b == 0`, `l == 50` | `None` | `undetermined` |

The first two are explicit positive-`b` one-sided limiting conventions for the zero denominator; a two-sided limit does not exist because approaching through negative `b` reverses the sign. Do not substitute an epsilon denominator, infer a season, or reinterpret the `0/0` case as angle zero. Nonfinite components are invalid, not `undetermined`.

Apply comparisons to the unrounded angle in this order:

| Angle interval | Depth | Exact lower boundary |
| --- | --- | --- |
| `angle > 55` | `very_light` | `55` belongs to `light` |
| `41 < angle <= 55` | `light` | `41` belongs to `intermediate` |
| `28 < angle <= 41` | `intermediate` | `28` belongs to `tan` |
| `10 < angle <= 28` | `tan` | `10` belongs to `brown` |
| `-30 < angle <= 10` | `brown` | `-30` belongs to `dark` |
| `angle <= -30` | `dark` | Includes `-90` |

Planned math fixtures include `(l,b)=(60,10) -> 45/light`, `(40,10) -> -45/dark`, `(50,10) -> 0/brown`, `(60,-10) -> -45/dark`, `(40,-10) -> 45/light`, `(50,-10) -> 0/brown`, and every exact-zero case above. `a` does not affect ITA but must remain finite. Unit coverage must exercise exact boundary comparisons and values just above/below every threshold, without presentation rounding or a test tolerance changing the inequalities.

## 4. Undertone policy — PROPOSED / Day 1 approval required

No validated or predetermined undertone thresholds exist for this project. No numeric thresholds or scientifically established cosmetic labels are asserted by this contract.

**Blocking acceptance choice:** P1 drafts a finite-Lab heuristic, explicit thresholds/comparison inclusivity, tie/overlap precedence, and labelled fixtures covering all four outputs and each proposed boundary. The full team reviews and accepts the rule and fixture labels on Day 1 before implementation or acceptance of `classify_undertone` and end-to-end season analysis.

Proposed configuration identifier: `undertone-v1-pending` (not an accepted/releasable version). The approved immutable policy and fixture set must replace that pending status and be recorded here. Pending rules must not be disguised as executable defaults, placeholder thresholds, or passing tests. Fixtures are team-agreed acceptance examples, not clinical or cosmetic validation. The method must not claim medical accuracy, skin-health conclusions, or scientifically proven cosmetic suitability.

Fixture acceptance record to complete on Day 1: numeric Lab inputs, expected label, rationale, threshold-side cases, reviewer approval, and final policy version. All four labels must be represented; labels remain unapproved until review.

## 5. Season decision table — PROPOSED / Day 1 approval required

Proposed identifier: `season-v1-draft`. This is a complete **24-combination draft**, not scientific truth, not a validated color-analysis system, and not yet an accepted implementation default. P1 proposes it; all owners must agree on Day 1 or revise every affected cell and corresponding tests together.

| Undertone / depth | `very_light` | `light` | `intermediate` | `tan` | `brown` | `dark` |
| --- | --- | --- | --- | --- | --- | --- |
| `warm` | Spring | Spring | Spring | Autumn | Autumn | Autumn |
| `cool` | Summer | Summer | Summer | Winter | Winter | Winter |
| `neutral` | Spring | Spring | Summer | Autumn | Winter | Winter |
| `olive` | Summer | Summer | Autumn | Autumn | Autumn | Winter |

`map_season(any_valid_undertone, undetermined)` must raise `ValueError` with an explicit undetermined-depth message. Unknown undertones/depths also fail explicitly. There is no fallback season and no seventh table column assigning one to `undetermined`.

## 6. CIE76 distance

`delta_e(lab1, lab2) = sqrt((l1-l2)^2 + (a1-a2)^2 + (b1-b2)^2)`.

Use a numerically stable Euclidean norm as needed. The result is nonnegative, symmetric, and zero for identical values. Reject nonfinite inputs and a distance that cannot be represented as a finite float. Do not implement CIE94, CIEDE2000, palette ranking, matching, or a recommendation service in this sprint.

Planned evidence: identity; symmetry; `(50,0,0)` versus `(53,4,0)` equals `5.0` within `1e-12`; invalid inputs. Sprint 2 receives this primitive and contract, not a completed matching feature. (SRS DR2: Sprint 2 treats `delta_e <= 3.0` as a "close match".)

## 7. CSV enrichment boundary

A future CLI entrypoint will wrap `hex_to_lab`; **no CLI implementation exists or is added by this planning change**. P1 will implement and document a Windows-compatible invocation during implementation. This is I/O orchestration, not an additional public function. It supports the Sprint 2 shade database.

Canonical required input columns, in order: `brand,product_name,category,shade_name,hex,buy_link`.

- Every required field must be present and nonempty. Categories are exactly `foundation`, `concealer`, `lipstick`, `blush`; reject other spellings/case rather than silently rewriting them. `buy_link` is preserved text; do not fetch URLs or require network access.
- Preserve all input rows, row order, original column order, original field values (including the source `hex` spelling), and any additional source columns. The six canonical columns must occupy the leading positions in the stated order. Do not normalize or overwrite the source CSV hex; normalization applies at analysis/profile boundaries.
- Append exactly `lab_l,lab_a,lab_b`. Reject an input header already containing any of those output columns, duplicate headers, malformed row widths/CSV, or missing/out-of-order canonical columns. Do not overwrite or duplicate a source column.
- Use UTF-8 CSV, standard quoted-field escaping, newline-safe handling on Windows, and a stable locale-independent float serialization. Source preservation is at parsed field level, not byte-for-byte preservation of quoting or line endings. Repeated successful runs on identical input under the same implementation must produce identical output bytes, without timestamps or random ordering.
- Validate the complete batch before publishing an output. Report all identifiable row errors in deterministic input order with record number, field, and reason; the header is record 1 and the first data record is 2, including when a quoted field contains a newline. For unrecoverable CSV syntax, report the parse location/reason without inventing subsequent records.
- On any validation/conversion/write failure, exit nonzero and publish no partial result; leave an existing destination unchanged. Write via a temporary sibling followed by atomic replacement only after success; remove temporary output on failure. Reject identical input/output paths before writing. Diagnostics go to stderr; do not silently skip rows. A valid header-only input may produce an output header with the three appended columns.
- Batch acceptance evidence includes every allowed category, extra source columns and quoted text, normalization without source mutation, deterministic repeat runs, multiple bad rows, malformed headers/CSV, preexisting destination preservation, and simulated write failure.

## 8. Selfie skin sampling (US6) — landmark regions PROPOSED / Day 1 approval required

`extract_skin_hex(image_bytes: bytes) -> SkinSample` lives in `cv/photo.py`. It is the only module in `/cv` allowed to import MediaPipe, OpenCV and NumPy.

- **Input:** the raw bytes of one JPEG or PNG image, held in memory. Other formats (detected from the decoded content, not the file name) raise `PhotoError("unsupported_format")`. The upload size limit is enforced by P3 before calling (section 11).
- **Decode:** OpenCV `imdecode` to an 8-bit image, converted to RGB order. Images larger than 1600 px on the long side are downscaled with area interpolation before detection, so results do not depend on camera resolution beyond that.
- **Face:** MediaPipe Face Mesh (pre-trained, 468 landmarks, static image mode). Exactly one face is required: none raises `PhotoError("no_face")`, more than one raises `PhotoError("multiple_faces")`. No custom model is trained.
- **Skin regions:** polygons on the left cheek, right cheek and forehead built from fixed landmark indices. The index lists are proposed by P1 as `regions-v1-pending` and recorded here once approved. Eyes, brows, lips, nostrils and hairline are excluded by construction.
- **Colour:** take the **per-channel median** of all sRGB pixels inside the regions (robust to highlights and shadows), round each channel to an integer, and format it as uppercase `#RRGGBB`. Fewer than **500** sampled pixels raises `PhotoError("insufficient_skin")`.
- **Same path as manual entry (US7):** the photo result is only a hex. The backend passes it to `analyze_skin`, so photo and manual input share one analysis and one output shape.
- **Privacy:** the function never writes the image or any crop to disk, the database, logs or exceptions, and keeps no reference after returning. Error messages do not include pixel data.
- **Errors:** `PhotoError` is a subclass of `ValueError` with a `code` attribute in {`unsupported_format`, `no_face`, `multiple_faces`, `insufficient_skin`} and a user-readable message.
- **Determinism:** identical bytes give an identical `SkinSample` under the same MediaPipe, OpenCV and rule versions. Lighting, make-up and camera white balance affect the result; that is a documented limitation, not a defect, and US10 correction exists for it.
- **Test images:** use only images the team has the right to commit (team members' own photos with consent, or openly licensed faces); record the source and licence in `cv/tests/fixtures/README.md`. Synthetic images (no face, two faces, a flat colour) cover the error paths.

## 9. Confidence indicator (US8) — PROPOSED / Day 1 approval required

Proposed identifier: `confidence-v1-pending`. The indicator says how close the result is to a rule boundary. It is **not** a probability and not a claim of accuracy.

- Depth margin `m_d` = smallest absolute difference between the unrounded ITA angle and the depth boundaries `55, 41, 28, 10, -30`.
- Undertone margin `m_u` = distance from the Lab value to the nearest undertone threshold of the approved rule (section 4), in that rule's units. Its thresholds `U_low` and `U_high` are fixed together with the undertone rule.
- Draft rule: `low` if `m_d < 1.0` or `m_u < U_low`; `high` if `m_d >= 3.0` and `m_u >= U_high`; otherwise `medium`.
- With `undertone_override`, `m_u` is ignored and confidence is based on `m_d` only.
- Exact boundary handling follows the inequalities above; tests cover values on and just either side of `1.0` and `3.0`.

## 10. Analysis, palette and explanation (US7, US8, US9, US10)

`analyze_skin(skin_hex, undertone_override=None) -> Analysis`:

1. Normalize and convert `skin_hex` with `hex_to_lab`.
2. Compute ITA and depth with `calculate_ita`. If depth is `undetermined`, raise `ValueError` with an explicit undetermined-depth message (no season, no palette).
3. Undertone = `undertone_override` if given (must be one of the four wire values, else `ValueError`), otherwise `classify_undertone(lab)`. `corrected` is true only when an override is given.
4. Season = `map_season(undertone, depth)`.
5. Confidence per section 9; palette per the table below; explanation per the template below.
6. `rule_versions` lists the identifiers of the undertone, season, confidence, palette and explanation rules used.

The same `skin_hex` and override always give the same `Analysis`. Hex input from manual entry (US7), from the swatch grid, from a photo (US6) or from a correction (US10) follows exactly this path.

### Palette — PROPOSED / Day 1 approval required

Proposed identifier: `palette-v1-draft`. Styling guidance only, not a scientific claim. P1 drafts; the team approves or edits every cell together with the tests. Each entry is `name hex`.

| Season | Wear | Avoid |
| --- | --- | --- |
| Spring | Coral `#FF7F50`, Peach `#FFCBA4`, Warm ivory `#FFF8E7`, Golden yellow `#FFC000`, Turquoise `#40E0D0`, Camel `#C19A6B` | Black `#000000`, Charcoal `#36454F`, Burgundy `#800020`, Icy blue `#D6ECEF` |
| Summer | Powder blue `#B0E0E6`, Lavender `#E6E6FA`, Dusty rose `#DCAE96`, Soft navy `#3B4B6B`, Mauve `#E0B0FF`, Cool grey `#8C92AC` | Orange `#FFA500`, Mustard `#FFDB58`, Black `#000000`, Rust `#B7410E` |
| Autumn | Olive `#808000`, Rust `#B7410E`, Mustard `#FFDB58`, Terracotta `#E2725B`, Forest green `#228B22`, Chocolate `#7B3F00` | Icy pink `#F8C8DC`, Fuchsia `#FF00FF`, Pure white `#FFFFFF`, Cool grey `#8C92AC` |
| Winter | Pure white `#FFFFFF`, Black `#000000`, Royal blue `#4169E1`, Emerald `#50C878`, Fuchsia `#FF00FF`, Ruby `#9B111E` | Orange `#FFA500`, Camel `#C19A6B`, Mustard `#FFDB58`, Peach `#FFCBA4` |

Every entry must have both a hex and a nonempty name; a colour must not appear in both lists of the same season. Order is preserved on the wire.

### Explanation — template, PROPOSED / Day 1 approval required

Proposed identifier: `explanation-v1-draft`. Text is filled from a fixed template; no LLM or generated text. Numbers are rounded for display only (one decimal place for ITA).

> Your skin colour {skin_hex} has an ITA angle of {ita:.1f}°, which falls in the {depth_label} depth range. Your undertone is {undertone}{override_note}. With a {undertone} undertone and {depth_label} depth, your colour type is {season}. This is a styling guide, not a medical or dermatological assessment.

- `{depth_label}` replaces `_` with a space (`very light`). `{override_note}` is ` (set by you)` when `corrected` is true, otherwise empty.
- The final sentence is always present (SRS DR4).

## 11. Backend and frontend integration boundary

P3 implements HTTP handling outside `/cv` and calls only `analyze_skin` and `extract_skin_hex` (plus `hex_to_lab` for shades). This section defines the shared profile payload, not an endpoint path or persistence implementation.

- Analyze only `skin_hex`. `hair_hex` and `eye_hex` are optional, normalized with the same hex rules when supplied, and stored by the backend if present. Missing values serialize as `null`. They do **not** influence any analysis output.
- `source` records how the skin colour was obtained: `manual` (hex field or swatch grid, US7) or `photo` (US6). A correction (US10) keeps the earlier `source` and sets `corrected: true`.
- Successful response fields are exactly:

```json
{
  "skin_hex": "#RRGGBB",
  "hair_hex": null,
  "eye_hex": null,
  "source": "manual",
  "corrected": false,
  "lab": { "l": 0.0, "a": 0.0, "b": 0.0 },
  "ita_degrees": 0.0,
  "depth": "brown",
  "undertone": "neutral",
  "season": "Summer",
  "confidence": "medium",
  "explanation": "Template text from section 10.",
  "palette": {
    "wear": [ { "hex": "#RRGGBB", "name": "Powder blue" } ],
    "avoid": [ { "hex": "#RRGGBB", "name": "Orange" } ]
  },
  "rule_versions": { "undertone": "...", "season": "...", "confidence": "...", "palette": "...", "explanation": "..." },
  "updated_at": "2026-01-01T00:00:00Z"
}
```

This is a **shape illustration only**: `#RRGGBB` is a schema placeholder, not a valid input or a computed test fixture; numbers and labels do not assert a consistent analysis result. `lab` fields are finite floats; the nested `angle_degrees` name is translated to top-level `ita_degrees`, not returned as an `ItaResult` object.

- `depth = undetermined` cannot yield a successful response. P3 must return **HTTP 422** with an explicit undetermined-depth reason, not a guessed season or a 200 with a null season. Invalid hex, unknown `undertone_override` and every `PhotoError` also map to 422 validation errors (`field` is `skin_hex`, `undertone_override` or `file`).
- Frontend consumes the names, normalization, enum values and 422 behaviour above. It must not recalculate season, palette, confidence or explanation. Changing optional hair/eye inputs alone must not change analysis outputs.

## 12. Acceptance, ownership, and evidence

1. P1 owns CV implementation, photo module, CLI, unit tests, and evidence collection; P3 and P4 review the shared contract. All owners review the Day 1 heuristic, table, region, confidence, palette and template choices.
2. Day 1 approval is **pending** for undertone rules/fixtures, the season table, face regions, confidence thresholds, palette and explanation template. No implementation completion or rule acceptance is claimed.
3. Planned unit evidence covers known Lab references, strict hex validation, immutable values, ITA ratio and exact boundaries/singularities/negative `b`, nonfinite rejection, all 24 accepted season combinations, undetermined rejection, accepted undertone fixtures, CIE76 properties, confidence boundaries, palette completeness (4 seasons, hex + name on every entry), explanation text, override handling, and photo cases (one face, no face, two faces, unsupported format, too little skin, deterministic repeat, nothing written to disk).
4. Planned integration evidence covers CSV determinism/all-or-nothing errors and P3's profile mapping, photo upload, 422 behaviour, correction and hair/eye independence. P3 owns HTTP-side execution; CV tests need no server/DB/auth/UI.
5. Record the actual command, environment, rule/fixture versions, expected/observed behavior, pass/fail counts, and failures only after execution. Current result: **Not run — planning documents only**.
6. After CV completion and evidence review, P1 updates the Sprint 1 section of the SRS (`team/srs.md`, source `docs/SRS.pdf`), obtains review from **all owners**, and only then takes the early-finisher shared-shade-data research task. Research is for a shared dataset (source, licensing, provenance, categories, schema fit, coverage, quality), not a private substitute or a new CV feature.

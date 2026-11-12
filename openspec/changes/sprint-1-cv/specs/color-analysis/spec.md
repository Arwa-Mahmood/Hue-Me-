## ADDED Requirements

### Requirement: Hex to LAB conversion
The system SHALL convert a hex colour string (`#RRGGBB` or `RRGGBB`) to a CIELAB `Lab` value using sRGB, D65 and the 2-degree observer, and SHALL reject any other input with a `ValueError`.

#### Scenario: Known colour converts within tolerance
- **WHEN** `hex_to_lab("#FFFFFF")` is called
- **THEN** the result is within 0.05 of `(100, 0, 0)` on every component

#### Scenario: Lowercase and missing hash are accepted
- **WHEN** `hex_to_lab("ff0000")` is called
- **THEN** the result equals `hex_to_lab("#FF0000")`

#### Scenario: Malformed hex is rejected
- **WHEN** `hex_to_lab` is called with `#FFF`, `#FF000080`, ` #FF0000`, `#GG0000` or a non-string
- **THEN** a `ValueError` with an actionable message is raised

### Requirement: ITA angle and depth
The system SHALL compute the ITA angle as `degrees(atan((l - 50) / b))` and SHALL classify depth as `very_light`, `light`, `intermediate`, `tan`, `brown` or `dark` using the boundaries in the contract, with exact boundary values belonging to the lower category as stated there.

#### Scenario: Normal ITA
- **WHEN** `calculate_ita` receives `l = 60`, `b = 10`
- **THEN** the angle is 45 degrees and the depth is `light`

#### Scenario: Negative b keeps its sign
- **WHEN** `calculate_ita` receives `l = 60`, `b = -10`
- **THEN** the angle is -45 degrees and the depth is `dark`

#### Scenario: Exact boundary
- **WHEN** the angle is exactly 55 degrees
- **THEN** the depth is `light`

#### Scenario: Zero b
- **WHEN** `b = 0` and `l = 50`
- **THEN** the angle is `None` and the depth is `undetermined`

### Requirement: Undertone classification
The system SHALL classify a Lab value as `warm`, `cool`, `neutral` or `olive` using the team-approved, versioned rule, and SHALL NOT claim medical or scientific accuracy for the result.

#### Scenario: Approved fixtures
- **WHEN** `classify_undertone` is called with each approved fixture
- **THEN** it returns the label the team recorded for that fixture

#### Scenario: Rule not approved
- **WHEN** the undertone rule has not been approved by the team
- **THEN** `classify_undertone` is not accepted as complete

### Requirement: Season mapping
The system SHALL map each valid undertone and each depth other than `undetermined` to exactly one of `Spring`, `Summer`, `Autumn` or `Winter` using the team-approved table, and SHALL raise `ValueError` for `undetermined` depth or unknown values.

#### Scenario: Every combination maps
- **WHEN** `map_season` is called for each of the 4 undertones and 6 depths
- **THEN** each call returns one season from the approved table

#### Scenario: Undetermined depth
- **WHEN** `map_season("warm", Depth.undetermined)` is called
- **THEN** a `ValueError` is raised and no season is returned

### Requirement: Purity
The colour functions SHALL be deterministic and SHALL NOT perform I/O or depend on a database, authentication, web framework, UI, generative AI or LLM. Only the photo module MAY depend on MediaPipe, OpenCV and NumPy.

#### Scenario: Repeated call
- **WHEN** the same input is passed twice
- **THEN** the outputs are equal

#### Scenario: Core without CV libraries
- **WHEN** MediaPipe and OpenCV are not installed
- **THEN** `hex_to_lab` and `analyze_skin` still import and run

### Requirement: Complete analysis
The system SHALL provide `analyze_skin(skin_hex, undertone_override=None)` that returns LAB, ITA, depth, undertone, season, confidence, explanation, palette, a `corrected` flag and rule versions, and SHALL be the single analysis path for manual, swatch, photo and corrected input (US7, US8).

#### Scenario: Manual hex
- **WHEN** `analyze_skin` is called with a valid skin hex whose depth is not `undetermined`
- **THEN** every field of `Analysis` is filled and `corrected` is false

#### Scenario: Undetermined depth
- **WHEN** the skin hex gives depth `undetermined`
- **THEN** a `ValueError` is raised and no season, palette or explanation is returned

### Requirement: Confidence indicator
The system SHALL report confidence as `high`, `medium` or `low` from the margin to the nearest depth and undertone boundaries using the team-approved, versioned rule, and SHALL NOT present it as a probability (US8).

#### Scenario: Near a depth boundary
- **WHEN** the ITA angle is within 1.0 degree of a depth boundary
- **THEN** confidence is `low`

#### Scenario: Far from all boundaries
- **WHEN** the depth margin and undertone margin are both at or above the approved high thresholds
- **THEN** confidence is `high`

### Requirement: Template explanation
The system SHALL explain how the season was derived using the approved fixed template, including the ITA angle, depth, undertone and season, and SHALL always end with the statement that the result is a styling guide, not a medical or dermatological assessment (US8).

#### Scenario: Explanation filled
- **WHEN** an analysis succeeds
- **THEN** the explanation names the depth, undertone and season of that analysis and contains the disclaimer

#### Scenario: Override noted
- **WHEN** an undertone override was used
- **THEN** the explanation says the undertone was set by the user

### Requirement: Wear and avoid palette
The system SHALL return, for each season, the approved ordered lists of colours to wear and to avoid, where every entry has an uppercase hex and a nonempty text label (US9).

#### Scenario: Labels present
- **WHEN** a palette is returned for any of the four seasons
- **THEN** every wear and avoid entry has both a hex and a name

#### Scenario: No contradiction
- **WHEN** the palettes are checked
- **THEN** no colour appears in both the wear and avoid list of the same season

### Requirement: Corrected tone
The system SHALL accept an optional undertone override, SHALL recompute the season, confidence, palette and explanation from it, and SHALL mark the analysis as corrected (US10).

#### Scenario: Override applied
- **WHEN** `analyze_skin` is called with `undertone_override = "cool"`
- **THEN** the undertone is `cool`, the season comes from the approved table for `cool` and the depth, and `corrected` is true

#### Scenario: Invalid override
- **WHEN** the override is not one of the four undertone values
- **THEN** a `ValueError` is raised

### Requirement: Selfie skin sampling
The system SHALL accept a JPEG or PNG image as bytes, SHALL detect exactly one face with MediaPipe Face Mesh, SHALL sample skin from the approved cheek and forehead regions using OpenCV, SHALL return the median skin colour as an uppercase hex, and SHALL NOT store the image anywhere (US6).

#### Scenario: One face
- **WHEN** `extract_skin_hex` receives a clear selfie with one face
- **THEN** it returns a `SkinSample` with an uppercase `#RRGGBB` and at least the minimum pixel count

#### Scenario: No face or several faces
- **WHEN** the image contains no face or more than one face
- **THEN** a `PhotoError` with code `no_face` or `multiple_faces` is raised

#### Scenario: Unsupported file
- **WHEN** the bytes are not a decodable JPEG or PNG
- **THEN** a `PhotoError` with code `unsupported_format` is raised

#### Scenario: Image discarded
- **WHEN** `extract_skin_hex` runs
- **THEN** no file is created and the image is not logged or kept after the call

#### Scenario: Same output as manual entry
- **WHEN** the hex returned from a photo is passed to `analyze_skin`, and the same hex is typed manually
- **THEN** both analyses are identical

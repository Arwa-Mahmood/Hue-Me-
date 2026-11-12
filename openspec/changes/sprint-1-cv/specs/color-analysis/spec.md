## ADDED Requirements

Numeric formulas, thresholds, tables and error rules are defined in `openspec/contracts/cv.md`. This spec states the required behaviour and must not contradict it.

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
- **WHEN** the undertone rule has not been approved on Day 1
- **THEN** `classify_undertone` is not accepted as complete

### Requirement: Season mapping
The system SHALL map each valid undertone and each depth other than `undetermined` to exactly one of `Spring`, `Summer`, `Autumn` or `Winter` using the team-approved table, and SHALL raise `ValueError` for `undetermined` depth or unknown values.

#### Scenario: Every combination maps
- **WHEN** `map_season` is called for each of the 4 undertones and 6 depths
- **THEN** each call returns one season from the approved table

#### Scenario: Undetermined depth
- **WHEN** `map_season("warm", Depth.undetermined)` is called
- **THEN** a `ValueError` is raised and no season is returned

### Requirement: Colour distance
The system SHALL provide `delta_e(lab1, lab2)` as the CIE76 Euclidean distance, which is nonnegative, symmetric and zero for identical values.

#### Scenario: Known pair
- **WHEN** `delta_e` is called with `(50, 0, 0)` and `(53, 4, 0)`
- **THEN** the result is 5.0 within 1e-12

#### Scenario: Non-finite input
- **WHEN** either Lab contains NaN or infinity
- **THEN** a `ValueError` is raised

### Requirement: Purity
The functions SHALL be deterministic and SHALL NOT perform I/O or depend on a database, authentication, web framework or UI.

#### Scenario: Repeated call
- **WHEN** the same input is passed twice
- **THEN** the outputs are equal

### Requirement: CSV LAB enrichment
The system SHALL provide a script that reads a CSV with columns `brand,product_name,category,shade_name,hex,buy_link`, appends `lab_l,lab_a,lab_b`, preserves all source data, and publishes output only if every row is valid.

#### Scenario: Valid file
- **WHEN** the script runs on a valid CSV
- **THEN** the output has the original columns and rows in order plus the three LAB columns

#### Scenario: Deterministic
- **WHEN** the script runs twice on the same input
- **THEN** both outputs are byte-identical

#### Scenario: Bad rows
- **WHEN** the input has several invalid rows
- **THEN** the script exits nonzero, reports every bad row with record number and reason, and writes no output

#### Scenario: Existing destination preserved
- **WHEN** the run fails and the output path already exists
- **THEN** the existing file is unchanged

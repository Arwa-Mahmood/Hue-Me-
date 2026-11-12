## ADDED Requirements

The payload is defined in `openspec/contracts/cv.md` section 8.

### Requirement: Save colour profile
The system SHALL let an identified user save `skin_hex` and optional `hair_hex` and `eye_hex`, SHALL compute LAB, ITA, depth, undertone and season from `skin_hex` using P1's functions, and SHALL store the result for that user.

#### Scenario: Successful save
- **WHEN** a user puts a valid `skin_hex`
- **THEN** the response contains the normalised hexes, `lab`, `ita_degrees`, `depth`, `undertone` and `season`

#### Scenario: Save replaces earlier profile
- **WHEN** the same user saves again
- **THEN** only the newest profile is kept

#### Scenario: Hair and eye do not affect analysis
- **WHEN** only `hair_hex` or `eye_hex` changes
- **THEN** `lab`, `depth`, `undertone` and `season` are unchanged

#### Scenario: Missing optional colours
- **WHEN** hair or eye colour is not supplied
- **THEN** those fields are `null`

### Requirement: Invalid or undetermined analysis
The system SHALL return 422 for a malformed hex and for an undetermined depth, and SHALL NOT guess a season.

#### Scenario: Malformed hex
- **WHEN** `skin_hex` is `#FFF`
- **THEN** the response is 422 with a detail on `skin_hex`

#### Scenario: Undetermined depth
- **WHEN** analysis yields `undetermined`
- **THEN** the response is 422 explaining the undetermined depth and nothing is stored

### Requirement: Read own profile
The system SHALL return only the caller's own profile and 404 when none exists.

#### Scenario: Saved profile
- **WHEN** a user who saved a profile calls `GET /profile`
- **THEN** the same payload is returned

#### Scenario: No profile
- **WHEN** a user with no profile calls `GET /profile`
- **THEN** the response is 404

#### Scenario: Isolation
- **WHEN** user B calls `GET /profile`
- **THEN** user A's data is never returned

### Requirement: Identity required
The system SHALL require an identified user for profile endpoints.

#### Scenario: No identity
- **WHEN** no valid identity is supplied
- **THEN** the response is 401

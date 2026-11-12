## ADDED Requirements

### Requirement: Save colour profile from manual entry
The system SHALL let an identified user save `skin_hex` (typed or chosen from the swatch grid) and optional `hair_hex` and `eye_hex`, SHALL analyse `skin_hex` using the CV module's `analyze_skin`, and SHALL store the result for that user with `source = manual` (US7).

#### Scenario: Successful save
- **WHEN** a user puts a valid `skin_hex`
- **THEN** the response contains the normalised hexes, `source`, `corrected`, `lab`, `ita_degrees`, `depth`, `undertone`, `season`, `confidence`, `explanation` and `palette`

#### Scenario: Save replaces earlier profile
- **WHEN** the same user saves again
- **THEN** only the newest profile is kept

#### Scenario: Hair and eye do not affect analysis
- **WHEN** only `hair_hex` or `eye_hex` changes
- **THEN** `lab`, `depth`, `undertone`, `season`, `confidence` and `palette` are unchanged

#### Scenario: Missing optional colours
- **WHEN** hair or eye colour is not supplied
- **THEN** those fields are `null`

### Requirement: Analyse a selfie without keeping it
The system SHALL accept a JPEG or PNG selfie up to the configured size, SHALL obtain the skin hex with the CV module's `extract_skin_hex`, SHALL analyse and save it with `source = photo`, and SHALL NOT write the image to disk, the database, logs or error reports (US6).

#### Scenario: Valid selfie
- **WHEN** a user uploads a clear JPEG or PNG selfie with one face
- **THEN** the response is 200 with the profile payload and `source = photo`

#### Scenario: Photo problems
- **WHEN** the image has no face, several faces, too little visible skin, an unsupported format, or exceeds the size limit
- **THEN** the response is 422 with a detail on `file` explaining the problem and nothing is saved

#### Scenario: Image discarded
- **WHEN** any photo request finishes, successfully or not
- **THEN** no copy of the image exists on disk, in the database or in the logs

#### Scenario: Same result as manual entry
- **WHEN** a user saves by photo and then saves the returned `skin_hex` manually
- **THEN** both analyses are identical apart from `source`

### Requirement: Correct the detected tone
The system SHALL let a user with a saved profile submit an adjusted `skin_hex` and/or an `undertone_override`, SHALL recalculate the season, confidence, palette and explanation, SHALL keep `source`, and SHALL mark the profile `corrected = true` (US10).

#### Scenario: Undertone corrected
- **WHEN** a user posts `undertone_override = "warm"`
- **THEN** the profile shows undertone `warm`, a season from the approved table, an updated palette and `corrected = true`

#### Scenario: No saved profile
- **WHEN** a user without a profile posts a correction
- **THEN** the response is 404

### Requirement: Invalid or undetermined analysis
The system SHALL return 422 for a malformed hex, an unknown undertone override and an undetermined depth, and SHALL NOT guess a season.

#### Scenario: Malformed hex
- **WHEN** `skin_hex` is `#FFF`
- **THEN** the response is 422 with a detail on `skin_hex`

#### Scenario: Undetermined depth
- **WHEN** analysis yields `undetermined`
- **THEN** the response is 422 explaining the undetermined depth and nothing is stored

### Requirement: Read own profile
The system SHALL return only the caller's own profile, including palette, explanation and confidence (US8, US9), and 404 when none exists.

#### Scenario: Saved profile
- **WHEN** a user who saved a profile calls `GET /profile`
- **THEN** the same payload is returned

#### Scenario: No profile
- **WHEN** a user with no profile calls `GET /profile`
- **THEN** the response is 404

#### Scenario: Isolation
- **WHEN** user B calls `GET /profile`
- **THEN** user A's data is never returned

### Requirement: Delete user data
The system SHALL provide `delete_user_data(user_id)` that removes every row the profile service holds for that user and SHALL be safe to call more than once (US5).

#### Scenario: Profile removed
- **WHEN** `delete_user_data` is called for a user with a profile
- **THEN** the profile no longer exists

#### Scenario: Repeat call
- **WHEN** it is called again for the same user
- **THEN** it completes without error

### Requirement: Identity required
The system SHALL require an identified user for profile endpoints.

#### Scenario: No identity
- **WHEN** no valid identity is supplied
- **THEN** the response is 401

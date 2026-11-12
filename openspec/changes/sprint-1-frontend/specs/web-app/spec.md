## ADDED Requirements

Request and response shapes come from `openspec/contracts/auth.md`, `products-api.md` and `cv.md`.

### Requirement: Account screens
The app SHALL provide signup, login, forgot-password and reset-password screens that show field-level validation and server error messages.

#### Scenario: Signup success
- **WHEN** a visitor submits a valid signup form
- **THEN** the app confirms the account and continues to login or the signed-in area

#### Scenario: Server validation error
- **WHEN** the API returns 422 with field details
- **THEN** each message is shown next to its field

#### Scenario: Reset with OTP
- **WHEN** the user enters the emailed code and a new password
- **THEN** the app shows success and returns to login, or shows the error for a bad or expired code

#### Scenario: Forgot-password message
- **WHEN** a reset is requested for any email
- **THEN** the app shows the same neutral confirmation

### Requirement: Colour profile and result
The app SHALL let a signed-in user enter a skin colour (required) and hair and eye colours (optional) and SHALL display the season, undertone, depth and LAB returned by the API without recalculating them.

#### Scenario: Result shown
- **WHEN** the API returns a profile payload
- **THEN** the app shows the season, undertone, depth, LAB and a swatch of the skin colour

#### Scenario: Undetermined result
- **WHEN** the API returns 422 explaining an undetermined depth
- **THEN** the app shows a friendly message and no season

#### Scenario: Invalid hex
- **WHEN** the user enters a malformed hex
- **THEN** the app shows an error before or after submission and does not display a result

### Requirement: Product browsing
The app SHALL list products and shades with category and brand filters, swatches and buy links.

#### Scenario: Filter
- **WHEN** the user selects a category
- **THEN** only products in that category are shown

#### Scenario: Buy link
- **WHEN** the user opens a shade's buy link
- **THEN** it opens the product page in a new tab

### Requirement: Admin screens
The app SHALL provide admin screens to add, edit and delete products and shades and to import a CSV, showing every row error returned for a failed import.

#### Scenario: Admin edits a product
- **WHEN** an admin saves changes to a product
- **THEN** the list shows the updated values

#### Scenario: Import errors shown
- **WHEN** the API rejects a CSV with row errors
- **THEN** the app lists each row number and reason and states that nothing was imported

#### Scenario: Non-admin blocked
- **WHEN** a signed-in non-admin opens an admin URL
- **THEN** the app redirects away from the admin screens

### Requirement: Session handling
The app SHALL clear the session and show login when the API returns 401.

#### Scenario: Expired token
- **WHEN** a request returns 401
- **THEN** the session is cleared and the login screen is shown

### Requirement: Mock to real API switch
The app SHALL read the API base address from configuration and SHALL work against a mock API built from the contracts until Day 4 and against the real API afterwards without screen code changes.

#### Scenario: Mock mode
- **WHEN** the base address points to the mock
- **THEN** all user and admin flows work, including error responses

#### Scenario: Real mode
- **WHEN** the base address points to the real services
- **THEN** the same flows work without code changes to the screens

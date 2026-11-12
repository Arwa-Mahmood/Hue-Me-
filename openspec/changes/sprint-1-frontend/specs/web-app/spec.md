## ADDED Requirements

### Requirement: Account screens
The app SHALL provide signup, login, logout, forgot-password and reset-password screens that show field-level validation and server error messages (US1, US2, US3).

#### Scenario: Signup success
- **WHEN** a visitor submits a valid signup form
- **THEN** the app stores the returned token and opens the signed-in dashboard

#### Scenario: Password rule shown
- **WHEN** the password has fewer than 8 characters
- **THEN** the app shows the requirement next to the password field

#### Scenario: Server validation error
- **WHEN** the API returns 422 with field details
- **THEN** each message is shown next to its field

#### Scenario: Forgot-password message
- **WHEN** a reset is requested for any email
- **THEN** the app shows the same neutral confirmation

#### Scenario: Reset from link
- **WHEN** the user opens the emailed link and enters a valid new password
- **THEN** the app shows success and returns to login

#### Scenario: Expired link
- **WHEN** the API returns 400 `invalid_reset_token`
- **THEN** the app explains the link is invalid or expired and offers to send a new one

### Requirement: Session handling
The app SHALL keep the session across page reloads, SHALL clear it on logout, and SHALL clear it and show login when the API returns 401 (US2).

#### Scenario: Reload
- **WHEN** a signed-in user reloads the page
- **THEN** they are still signed in

#### Scenario: Logout
- **WHEN** the user logs out
- **THEN** the token is removed and signed-in screens are no longer reachable

#### Scenario: Expired token
- **WHEN** a request returns 401
- **THEN** the session is cleared and the login screen is shown

### Requirement: Accessibility settings
The app SHALL let users change font size, day/night theme, colour-blind mode and high contrast, SHALL apply each change to the whole app immediately, and SHALL persist the settings, saving them to the account when signed in (US4).

#### Scenario: Immediate change
- **WHEN** the user selects a larger font size or the night theme
- **THEN** every screen updates without a reload

#### Scenario: Persisted
- **WHEN** a signed-in user changes settings and later signs in on another browser
- **THEN** the same settings are applied

#### Scenario: Text with every swatch
- **WHEN** any colour swatch is shown
- **THEN** its hex and a text name are shown next to it

### Requirement: Delete account
The app SHALL let a signed-in user delete their account after a confirmation dialog, then sign out and return to the home page (US5).

#### Scenario: Cancel
- **WHEN** the user cancels the confirmation dialog
- **THEN** nothing is deleted

#### Scenario: Confirm
- **WHEN** the user confirms with their password and the API returns 204
- **THEN** the session is cleared and the home page is shown

### Requirement: Selfie upload
The app SHALL let a signed-in user upload a JPG or PNG selfie, SHALL state that the photo is not stored, and SHALL show a clear message for every photo error returned by the API (US6).

#### Scenario: Successful upload
- **WHEN** the user uploads a valid selfie
- **THEN** the result screen shows the returned analysis

#### Scenario: No face
- **WHEN** the API returns 422 for the `file` field
- **THEN** the app shows the message and lets the user try another photo or enter a colour manually

### Requirement: Manual colour entry
The app SHALL let a signed-in user enter a skin colour as a hex code or by picking from a labelled swatch grid, with optional hair and eye colours, and SHALL send both through the same API call (US7).

#### Scenario: Swatch grid
- **WHEN** the user picks a swatch
- **THEN** the result is the same as typing that swatch's hex

#### Scenario: Invalid hex
- **WHEN** the user enters a malformed hex
- **THEN** the app shows an error and does not display a result

### Requirement: Colour result
The app SHALL display the season, undertone, depth, LAB, confidence, explanation and wear/avoid palette returned by the API without recalculating them (US8, US9).

#### Scenario: Result shown
- **WHEN** the API returns a profile payload
- **THEN** the app shows every field above, a swatch of the skin colour, and the wear and avoid lists with hex and names

#### Scenario: Confidence readable without colour
- **WHEN** confidence is shown
- **THEN** it is shown as text, not only as a colour

#### Scenario: Undetermined result
- **WHEN** the API returns 422 explaining an undetermined depth
- **THEN** the app shows a friendly message and no season

### Requirement: Correct detected tone
The app SHALL offer controls to change the undertone or adjust the skin colour, SHALL send them to the correction endpoint, and SHALL show the recalculated result marked as corrected (US10).

#### Scenario: Correction applied
- **WHEN** the user changes the undertone and submits
- **THEN** the new palette is shown with a "corrected" label

### Requirement: Mock to real API switch and deployment
The app SHALL read the API base address from `NEXT_PUBLIC_API_BASE_URL`, SHALL work against a mock API built from the contracts until integration and against the real API afterwards without screen code changes, and SHALL be deployed on Vercel's free tier.

#### Scenario: Mock mode
- **WHEN** the base address points to the mock
- **THEN** all user flows work, including error responses

#### Scenario: Real mode
- **WHEN** the deployed Vercel app points to the Railway API
- **THEN** the same flows work without code changes to the screens

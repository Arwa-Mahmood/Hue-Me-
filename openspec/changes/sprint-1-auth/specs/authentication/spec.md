## ADDED Requirements

### Requirement: Signup
The system SHALL let a visitor create an account with name, email and password (US1), SHALL require a password of at least 8 characters and at most 72 UTF-8 bytes, SHALL store only a bcrypt hash of the password, SHALL always assign the role `user`, and SHALL issue a JWT on success.

#### Scenario: Successful signup
- **WHEN** a visitor posts a valid name, new email and acceptable password
- **THEN** the response is 201 with an access token and the public user, and no password data

#### Scenario: Duplicate email
- **WHEN** the email already exists
- **THEN** the response is 409 `email_taken`

#### Scenario: Weak password
- **WHEN** the password has fewer than 8 characters
- **THEN** the response is 422 with a detail on `password` stating the requirement

#### Scenario: Role cannot be chosen
- **WHEN** the request body includes `role: "admin"`
- **THEN** the created account has role `user`

#### Scenario: Password too long for bcrypt
- **WHEN** the password exceeds 72 UTF-8 bytes
- **THEN** the response is 422 and nothing is truncated or stored

### Requirement: Login
The system SHALL authenticate email and password and return a signed JWT access token with an expiry, the user's id and role (US2).

#### Scenario: Valid login
- **WHEN** correct credentials are posted
- **THEN** the response is 200 with `access_token`, `token_type` `bearer`, `expires_in` and the user

#### Scenario: Invalid credentials
- **WHEN** the password is wrong or the email is unknown
- **THEN** the response is 401 with the same message in both cases

### Requirement: Token validation
The system SHALL reject missing, malformed, expired, wrongly signed or revoked tokens and SHALL expose a reusable validator for other backend code.

#### Scenario: Current user
- **WHEN** `GET /auth/me` is called with a valid token
- **THEN** the response is 200 with that user

#### Scenario: Bad token
- **WHEN** the token is expired or tampered with
- **THEN** the response is 401

### Requirement: Forgot password by reset link
The system SHALL email a single-use reset link that expires 1 hour after it is issued (US3), SHALL respond identically whether or not the account exists, SHALL store only a hash of the link token, and SHALL limit requests per email.

#### Scenario: Known and unknown email look the same
- **WHEN** forgot-password is requested for a registered and an unregistered email
- **THEN** both responses are 202 with the same message

#### Scenario: Token stored hashed
- **WHEN** a reset link is issued
- **THEN** only a hash of its token is stored

#### Scenario: Request limit
- **WHEN** too many links are requested for one email in the limit window
- **THEN** the response is 429

### Requirement: Password reset
The system SHALL set a new password only when a valid, unexpired, unused, latest reset token is supplied with a new password that meets the password rules, and SHALL then invalidate the token and all earlier access tokens.

#### Scenario: Successful reset
- **WHEN** a valid token and an acceptable new password are posted
- **THEN** the response is 200, the old password stops working and the new one works

#### Scenario: Expired link
- **WHEN** the token was issued more than 1 hour ago
- **THEN** the response is 400 `invalid_reset_token` and the password is unchanged

#### Scenario: Invalid, used or superseded link
- **WHEN** the token is wrong, already used, or a newer link was issued
- **THEN** the response is 400 `invalid_reset_token` and the password is unchanged

#### Scenario: Old token revoked
- **WHEN** an access token was issued before the reset
- **THEN** it is rejected with 401 afterwards

### Requirement: Preferences
The system SHALL let a signed-in user read and save font size, theme, colour-blind mode and high-contrast preferences (US4), SHALL return defaults when nothing is saved, and SHALL reject values outside the contract.

#### Scenario: Defaults
- **WHEN** a user who never saved preferences calls `GET /me/preferences`
- **THEN** the response is 200 with the contract defaults

#### Scenario: Save and persist
- **WHEN** a user saves preferences and later signs in again
- **THEN** `GET /me/preferences` returns the saved values

#### Scenario: Invalid value
- **WHEN** a preference value is not in the allowed list
- **THEN** the response is 422 and nothing is saved

### Requirement: Delete account and data
The system SHALL let a signed-in user delete their account after confirming their password (US5) and SHALL delete all of that user's data including the profile held by the profile service.

#### Scenario: Successful deletion
- **WHEN** a user calls `DELETE /auth/me` with the correct password
- **THEN** the response is 204, the user, preferences, reset tokens and profile are gone, and the old token and credentials are rejected

#### Scenario: Wrong password
- **WHEN** the password is wrong
- **THEN** the response is 401 and nothing is deleted

#### Scenario: Partial failure
- **WHEN** deleting the profile data fails
- **THEN** the response is 500 and the user account remains so the user can retry

### Requirement: Shared repository, backend app and deployment
The project SHALL provide a Git repository layout, `.gitignore`, `.env.example`, a single FastAPI app that mounts the auth and profile routers, a docker-compose file for local development, and a free-tier Railway deployment of the backend and PostgreSQL.

#### Scenario: Fresh clone
- **WHEN** a team member clones the repo and runs `docker compose up`
- **THEN** the database and backend start and Swagger is reachable

#### Scenario: Deployed backend
- **WHEN** the Railway deployment is running
- **THEN** the API answers under `/api/v1` and accepts requests only from the origins in `CORS_ORIGINS`

#### Scenario: No secrets committed
- **WHEN** the repository is inspected
- **THEN** it contains `.env.example` with names only and no real secret values

## ADDED Requirements

Endpoints, claims and error shapes are defined in `openspec/contracts/auth.md`.

### Requirement: Signup
The system SHALL let a visitor create an account with name, email and password, SHALL store only a bcrypt hash of the password, and SHALL always assign the role `user`.

#### Scenario: Successful signup
- **WHEN** a visitor posts a valid name, new email and acceptable password
- **THEN** the response is 201 with the public user and no password data

#### Scenario: Duplicate email
- **WHEN** the email already exists
- **THEN** the response is 409 `email_taken`

#### Scenario: Role cannot be chosen
- **WHEN** the request body includes `role: "admin"`
- **THEN** the created account has role `user`

#### Scenario: Password too long for bcrypt
- **WHEN** the password exceeds 72 UTF-8 bytes
- **THEN** the response is 422 and nothing is truncated or stored

### Requirement: Login
The system SHALL authenticate email and password and return a signed JWT access token with the user's id and role.

#### Scenario: Valid login
- **WHEN** correct credentials are posted
- **THEN** the response is 200 with `access_token`, `token_type` `bearer` and the user

#### Scenario: Invalid credentials
- **WHEN** the password is wrong or the email is unknown
- **THEN** the response is 401 with the same message in both cases

### Requirement: Token validation
The system SHALL reject missing, malformed, expired, wrongly signed or revoked tokens and SHALL expose a reusable validator for other backend services.

#### Scenario: Current user
- **WHEN** `GET /auth/me` is called with a valid token
- **THEN** the response is 200 with that user

#### Scenario: Bad token
- **WHEN** the token is expired or tampered with
- **THEN** the response is 401

### Requirement: Forgot password by OTP
The system SHALL email a single-use, expiring one-time code on a password reset request and SHALL respond identically whether or not the account exists.

#### Scenario: Known and unknown email look the same
- **WHEN** forgot-password is requested for a registered and an unregistered email
- **THEN** both responses are 202 with the same message

#### Scenario: Code stored hashed
- **WHEN** an OTP is issued
- **THEN** only a hash of the code is stored

#### Scenario: Request limit
- **WHEN** too many codes are requested for one email in the limit window
- **THEN** the response is 429

### Requirement: Password reset
The system SHALL set a new password only when a valid, unexpired, unused OTP for that email is supplied, and SHALL then invalidate the code and all earlier tokens.

#### Scenario: Successful reset
- **WHEN** the correct OTP and an acceptable new password are posted
- **THEN** the response is 200, the old password stops working and the new one works

#### Scenario: Invalid OTP
- **WHEN** the OTP is wrong, expired or already used
- **THEN** the response is 400 `invalid_otp` and the password is unchanged

#### Scenario: Guess limit
- **WHEN** the number of wrong guesses for a code reaches the limit
- **THEN** that code can no longer be used

#### Scenario: Old token revoked
- **WHEN** a token was issued before the reset
- **THEN** it is rejected with 401 afterwards

### Requirement: Fixed admin account
The system SHALL provide one admin account whose email and initial password come from environment variables, SHALL NOT store those values in the repository, and SHALL let that account use forgot-password and reset.

#### Scenario: Admin login
- **WHEN** the admin logs in with the configured credentials
- **THEN** the token has role `admin`

#### Scenario: Admin password reset
- **WHEN** the admin completes forgot-password and reset
- **THEN** the new password works and the old one does not

#### Scenario: Restart does not overwrite
- **WHEN** the service restarts after the admin changed their password
- **THEN** the changed password remains in effect

### Requirement: Shared repository setup
The project SHALL provide a Git repository layout, `.gitignore`, `.env.example` and a docker-compose file that starts the database and auth service.

#### Scenario: Fresh clone
- **WHEN** a team member clones the repo and runs `docker compose up`
- **THEN** the database and auth service start and Swagger is reachable

#### Scenario: No secrets committed
- **WHEN** the repository is inspected
- **THEN** it contains `.env.example` with names only and no real secret values

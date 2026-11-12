## 1. Day 1: repo, compose and contract

- [ ] 1.1 [P2][Day 1] Set up the Git repo skeleton: folders `/cv`, `/backend/auth`, `/backend/products`, `/frontend`, root `README.md`, `.gitignore`, `.env.example`
- [ ] 1.2 [P2][Day 1] Create `docker-compose.yml` with the database and the auth service, placeholders for products and frontend
- [ ] 1.3 [P2][Day 1] Confirm everyone can clone and run `docker compose up`
- [ ] 1.4 [P2][Day 1] Walk P3 and P4 through `openspec/contracts/auth.md` and record their "ok" in `team/daily-scrum.md`
- [ ] 1.5 [P2][Day 1] Agree password rules and migration tool with the team

## 2. Data and security foundation

- [ ] 2.1 [P2][Day 1] Create the `users` and `otp` tables
- [ ] 2.2 [P2][Day 1] Implement bcrypt hashing with the 72-byte limit check
- [ ] 2.3 [P2][Day 2] Implement JWT creation and validation with the `tv` claim
- [ ] 2.4 [P2][Day 2] Implement the standard error envelope

## 3. Endpoints

- [ ] 3.1 [P2][Day 2] `POST /auth/signup`
- [ ] 3.2 [P2][Day 2] `POST /auth/login`
- [ ] 3.3 [P2][Day 2] `GET /auth/me`
- [ ] 3.4 [P2][Day 3] Mail sender (console mode, then SMTP)
- [ ] 3.5 [P2][Day 3] `POST /auth/forgot-password` with identical responses and rate limits
- [ ] 3.6 [P2][Day 3] `POST /auth/reset-password` with expiry, single use, attempt limit, token version bump
- [ ] 3.7 [P2][Day 2] Seed the admin account from `ADMIN_EMAIL` and `ADMIN_PASSWORD` at startup without overwriting an existing one
- [ ] 3.8 [P2][Day 3] Confirm the admin can log in and use forgot-password and reset

## 4. Hand-off

- [ ] 4.1 [P2][Day 3] Expose `decode_access_token(token)` for P3 and document the import
- [ ] 4.2 [P2][Day 4] Help P3 switch from `AUTH_MODE=mock` to `AUTH_MODE=jwt`
- [ ] 4.3 [P2][Day 4] Tell P4 when the real auth API is reachable

## 5. Tests

- [ ] 5.1 [P2][Day 3] pytest: signup success, duplicate email, invalid email, weak or over-long password
- [ ] 5.2 [P2][Day 3] pytest: signup cannot set role
- [ ] 5.3 [P2][Day 3] pytest: login success, wrong password, unknown email give the same error
- [ ] 5.4 [P2][Day 3] pytest: admin login and admin password reset
- [ ] 5.5 [P2][Day 3] pytest: OTP valid, wrong, expired, reused, replaced by newer, guess limit, request limit
- [ ] 5.6 [P2][Day 3] pytest: old token rejected after reset
- [ ] 5.7 [P2][Day 3] pytest: `/auth/me` with valid, missing, expired, tampered tokens
- [ ] 5.8 [P2][Day 3] Swagger walkthrough of every endpoint

## 6. Test cases and results

- [ ] 6.1 [P2][Day 3] Run everything and fill the P2 table in `team/test-results.md` with real results
- [ ] 6.2 [P2][Day 5] Re-run after integration and update results

## 7. Shared documents

- [ ] 7.1 [P2][Day 4] Write the P2 sections of `team/user-manual.md`
- [ ] 7.2 [P2][Day 4] Review the SRS
- [ ] 7.3 [P2][Day 1-5] Add your own Trello cards and `team/daily-scrum.md` entries

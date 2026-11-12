## 1. Day 1: repo, backend app, compose and contract

- [ ] 1.1 [P2][Day 1] Set up the Git repo skeleton: folders `/cv`, `/backend/auth`, `/backend/products`, `/frontend`, root `README.md`, `.gitignore`, `.env.example`
- [ ] 1.2 [P2][Day 1] Create `backend/main.py` (FastAPI app, error envelope handlers, CORS, mounts auth and products routers under `/api/v1`)
- [ ] 1.3 [P2][Day 1] Create `docker-compose.yml` with PostgreSQL and the backend, placeholder for the Next.js frontend
- [ ] 1.4 [P2][Day 1] Confirm everyone can clone and run `docker compose up`
- [ ] 1.5 [P2][Day 1] Walk P3 and P4 through `openspec/contracts/auth.md` and record their "ok" in `team/daily-scrum.md`
- [ ] 1.6 [P2][Day 1] Agree the migration tool with P3

## 2. Data and security foundation

- [ ] 2.1 [P2][Day 1] Create the `users`, `password_resets` and `preferences` tables
- [ ] 2.2 [P2][Day 1][US1] Implement bcrypt hashing with the 8-character minimum and 72-byte maximum
- [ ] 2.3 [P2][Day 2][US2] Implement JWT creation (with expiry) and validation with the `tv` claim
- [ ] 2.4 [P2][Day 2] Implement the standard error envelope

## 3. Account endpoints

- [ ] 3.1 [P2][Day 2][US1] `POST /auth/signup` returning a `Session`
- [ ] 3.2 [P2][Day 2][US2] `POST /auth/login`
- [ ] 3.3 [P2][Day 2][US2] `GET /auth/me`
- [ ] 3.4 [P2][Day 3][US3] Mail sender (console mode, then SMTP)
- [ ] 3.5 [P2][Day 3][US3] `POST /auth/forgot-password` sending a reset link, identical responses and rate limits
- [ ] 3.6 [P2][Day 3][US3] `POST /auth/reset-password` with 1-hour expiry, single use, newer link invalidates older, token version bump
- [ ] 3.7 [P2][Day 2] Seed the admin account from `ADMIN_EMAIL` and `ADMIN_PASSWORD` at startup without overwriting an existing one
- [ ] 3.8 [P2][Day 3] Confirm the admin can log in and use forgot-password and reset

## 4. Preferences and account deletion

- [ ] 4.1 [P2][Day 2][US4] `GET /me/preferences` with defaults and `PUT /me/preferences` with validation
- [ ] 4.2 [P2][Day 3][US5] `DELETE /auth/me` with password check, admin protection, P3 hook first, then user rows
- [ ] 4.3 [P2][Day 3][US5] No-op stand-in for `delete_user_data` until Day 4

## 5. Hand-off and deployment

- [ ] 5.1 [P2][Day 3] Expose `decode_access_token(token)` for P3 and document the import
- [ ] 5.2 [P2][Day 4] Help P3 switch from `AUTH_MODE=mock` to `AUTH_MODE=jwt`
- [ ] 5.3 [P2][Day 4][US5] Register P3's `delete_user_data` in `backend/main.py`
- [ ] 5.4 [P2][Day 4] Deploy the backend and PostgreSQL to Railway (free tier), set variables, check memory with MediaPipe loaded
- [ ] 5.5 [P2][Day 4] Tell P4 the Railway API URL and add the Vercel URL to `CORS_ORIGINS`

## 6. Tests

- [ ] 6.1 [P2][Day 3][US1] pytest: signup success with JWT, duplicate email, invalid email, password under 8 characters or over 72 bytes
- [ ] 6.2 [P2][Day 3][US1] pytest: signup cannot set role
- [ ] 6.3 [P2][Day 3][US2] pytest: login success, wrong password, unknown email give the same error
- [ ] 6.4 [P2][Day 3][US3] pytest: admin login and admin password reset
- [ ] 6.5 [P2][Day 3][US3] pytest: reset link valid, wrong, expired after 1 hour, reused, superseded by newer, request limit
- [ ] 6.6 [P2][Day 3][US3] pytest: old token rejected after reset
- [ ] 6.7 [P2][Day 3][US2] pytest: `/auth/me` with valid, missing, expired, tampered tokens
- [ ] 6.8 [P2][Day 3][US4] pytest: preferences defaults, save, read, invalid values, unauthenticated
- [ ] 6.9 [P2][Day 3][US5] pytest: delete account wrong password, success, token and login rejected afterwards, admin refused, hook failure keeps the user
- [ ] 6.10 [P2][Day 3] Swagger walkthrough of every endpoint

## 7. Test cases and results

- [ ] 7.1 [P2][Day 3] Run everything and fill the P2 table in `team/test-results.md` with real results
- [ ] 7.2 [P2][Day 5] Re-run after integration and on Railway, update results (including IN-06)

## 8. Shared documents

- [ ] 8.1 [P2][Day 4] Write the P2 sections of `team/user-manual.md` (accounts, settings, reset, delete, developer setup)
- [ ] 8.2 [P2][Day 4] Review the SRS update
- [ ] 8.3 [P2][Day 1-5] Add your own Trello cards (tagged US1-US5) and `team/daily-scrum.md` entries

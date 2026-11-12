## 1. Setup and contract

- [ ] 1.1 [P2] Set up the Git repo skeleton: folders `/cv`, `/backend/auth`, `/backend/profile`, `/frontend`, root `README.md`, `.gitignore`, `.env.example`
- [ ] 1.2 [P2] Create `backend/main.py` (FastAPI app, error envelope handlers, CORS, mounts auth and profile routers under `/api/v1`)
- [ ] 1.3 [P2] Create `docker-compose.yml` with PostgreSQL and the backend, placeholder for the Next.js frontend
- [ ] 1.4 [P2] Confirm everyone can clone and run `docker compose up`
- [ ] 1.5 [P2] Walk Ayesha and Momina through `openspec/contracts/auth.md` and record their "ok" in `team/daily-scrum.md`
- [ ] 1.6 [P2] Agree the migration tool with Ayesha

## 2. Data and security foundation

- [ ] 2.1 [P2] Create the `users`, `password_resets` and `preferences` tables
- [ ] 2.2 [P2][US1] Implement bcrypt hashing with the 8-character minimum and 72-byte maximum
- [ ] 2.3 [P2][US2] Implement JWT creation (with expiry) and validation with the `tv` claim
- [ ] 2.4 [P2] Implement the standard error envelope

## 3. Account endpoints

- [ ] 3.1 [P2][US1] `POST /auth/signup` returning a `Session`
- [ ] 3.2 [P2][US2] `POST /auth/login`
- [ ] 3.3 [P2][US2] `GET /auth/me`
- [ ] 3.4 [P2][US3] Mail sender (console mode, then SMTP)
- [ ] 3.5 [P2][US3] `POST /auth/forgot-password` sending a reset link, identical responses and rate limits
- [ ] 3.6 [P2][US3] `POST /auth/reset-password` with 1-hour expiry, single use, newer link invalidates older, token version bump

## 4. Preferences and account deletion

- [ ] 4.1 [P2][US4] `GET /me/preferences` with defaults and `PUT /me/preferences` with validation
- [ ] 4.2 [P2][US5] `DELETE /auth/me` with password check, profile hook first, then user rows
- [ ] 4.3 [P2][US5] No-op stand-in for `delete_user_data` until integration

## 5. Integration and deployment

- [ ] 5.1 [P2] Expose `decode_access_token(token)` for Ayesha and document the import
- [ ] 5.2 [P2] Help Ayesha switch from `AUTH_MODE=mock` to `AUTH_MODE=jwt`
- [ ] 5.3 [P2][US5] Register Ayesha's `delete_user_data` in `backend/main.py`
- [ ] 5.4 [P2] Deploy the backend and PostgreSQL to Railway (free tier), set variables, check memory with MediaPipe loaded
- [ ] 5.5 [P2] Give Momina the Railway API URL and add the Vercel URL to `CORS_ORIGINS`

## 6. Tests

- [ ] 6.1 [P2][US1] pytest: signup success with JWT, duplicate email, invalid email, password under 8 characters or over 72 bytes
- [ ] 6.2 [P2][US1] pytest: signup cannot set role
- [ ] 6.3 [P2][US2] pytest: login success, wrong password, unknown email give the same error
- [ ] 6.4 [P2][US2] pytest: `/auth/me` with valid, missing, expired, tampered tokens
- [ ] 6.5 [P2][US3] pytest: reset link valid, wrong, expired after 1 hour, reused, superseded by newer, request limit
- [ ] 6.6 [P2][US3] pytest: old access token rejected after reset
- [ ] 6.7 [P2][US4] pytest: preferences defaults, save, read, invalid values, unauthenticated
- [ ] 6.8 [P2][US5] pytest: delete account wrong password, success, token and login rejected afterwards, hook failure keeps the user
- [ ] 6.9 [P2] Swagger walkthrough of every endpoint

## 7. Test cases and results

- [ ] 7.1 [P2] Run everything and fill the P2 table (AU-01 to AU-14) in `team/test-results.md` with real results
- [ ] 7.2 [P2] Re-run after integration and on Railway, update results, and run IN-03 and IN-05 with the team

## 8. Shared documents

- [ ] 8.1 [P2] Write Eshaal's sections of `team/user-manual.md` (accounts, settings, reset, delete, developer setup)
- [ ] 8.2 [P2] Review the SRS update
- [ ] 8.3 [P2] Add your own Trello cards (tagged US1-US5) and `team/daily-scrum.md` entries

## Why

Users need accounts to save their colour analysis, control their accessibility settings and remove their data (SRS US1-US5). Auth is self-contained: it needs nothing from the CV or profile work, and the others need only the agreed contract.

## What Changes

- **Owner:** P2 Eshaal. **May write to:** `/backend/auth`, `backend/main.py` and repo-level setup files (root `.gitignore`, `docker-compose.yml`, `.env.example`, `README.md`, Railway configuration).
- **SRS stories:** US1 registration, US2 login/logout, US3 password recovery, US4 preferences, US5 delete account and data.
- Signup (issues a JWT straight away) and login with bcrypt password hashes and JWT access tokens with expiry. Passwords at least 8 characters.
- Forgot password with an emailed reset link that expires after 1 hour, and password reset.
- Accessibility preferences (font size, day/night theme, colour-blind mode, high contrast) saved per user.
- Delete account and all data, including Ayesha's profile data through `delete_user_data`.
- Own tables: `users`, `password_resets`, `preferences`.
- Git repo skeleton, the single FastAPI app `backend/main.py` and docker-compose that all four people use; deployment of the backend and PostgreSQL to Railway's free tier.
- Test in Swagger and pytest; record test cases and results.

The authoritative interface is `openspec/contracts/auth.md`.

## Capabilities

### New Capabilities
- `authentication`: signup, login, token validation, password reset by link, preferences, account deletion, shared backend app and deployment.

### Modified Capabilities
None.

## Non-goals

- Anything in Sprint 2: the admin account, admin role checks and user management are parked in `openspec/sprint-2/`.
- No profile, CV or product code.
- No refresh tokens, social login, Firebase Auth, email verification or multi-factor auth.
- No change to Ayesha's tables. Her data is deleted only through her `delete_user_data`.
- No real email provider credentials in the repo; local console output is enough in development.
- No paid hosting or email service.

## Impact

- Ayesha imports Eshaal's token validator at integration and uses a dev header before then; she supplies `delete_user_data` for US5.
- Momina builds signup, login, reset, settings and delete-account screens against `auth.md`.
- All four people depend on the repo, `backend/main.py` and docker-compose being ready first.
- Secrets live only in environment variables (locally `.env`, on Railway its variables UI); the repo holds `.env.example` with names only.

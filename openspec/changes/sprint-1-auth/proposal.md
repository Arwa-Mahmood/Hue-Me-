## Why

Users need accounts to save their colour analysis, control their accessibility settings and remove their data, and an admin needs to manage products. Auth is self-contained: it needs nothing from the CV or product work, and P3 and P4 need only the agreed contract.

## What Changes

- **Owner:** P2. **May write to:** `/backend/auth`, `backend/main.py` and repo-level setup files (root `.gitignore`, `docker-compose.yml`, `.env.example`, `README.md`, Railway configuration).
- **SRS stories:** US1 registration, US2 login/logout, US3 password recovery, US4 preferences, US5 delete account and data.
- Signup (issues a JWT straight away) and login with bcrypt password hashes and JWT access tokens with expiry. Passwords at least 8 characters.
- Forgot password with an emailed reset link that expires after 1 hour, and password reset.
- Accessibility preferences (font size, day/night theme, colour-blind mode, high contrast) saved per user.
- Delete account and all data, including P3's profile through `delete_user_data`.
- A fixed admin account configured by environment variables, with forgot-password still working.
- Own tables: `users`, `password_resets`, `preferences`.
- Day 1: create the Git repo skeleton, the single FastAPI app `backend/main.py` and docker-compose that all four people use. Day 4: deploy the backend and PostgreSQL to Railway's free tier.
- Test in Swagger and pytest; record test cases and results.

The authoritative interface is `openspec/contracts/auth.md`.

## Capabilities

### New Capabilities
- `authentication`: signup, login, token validation, password reset by link, fixed admin account, preferences, account deletion, shared backend app and deployment.

### Modified Capabilities
None.

## Non-goals

- No product, profile, shade or CV code.
- No refresh tokens, social login, Firebase Auth, email verification or multi-factor auth in Sprint 1.
- No admin user management (SRS UC17); not a Sprint 1 story.
- No change to P3's tables. P3's data is deleted only through P3's `delete_user_data`.
- No real email provider credentials in the repo; local console output is enough in development.
- No paid hosting or email service.

## Impact

- P3 imports P2's token validator on Day 4 and uses a dev header before then; P3 supplies `delete_user_data` for US5.
- P4 builds signup, login, reset, settings and delete-account screens against `auth.md`.
- All four people depend on the Day 1 repo, `backend/main.py` and docker-compose.
- Admin credentials and secrets live only in environment variables (locally `.env`, on Railway its variables UI); the repo holds `.env.example` with names only.

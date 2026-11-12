## Why

Users need accounts to save their colour profile, and an admin needs to manage products. Auth is self-contained: it needs nothing from the CV or product work, and P3 and P4 need only the agreed contract.

## What Changes

- **Owner:** P2. **May write to:** `/backend/auth` plus repo-level setup files (root `.gitignore`, `docker-compose.yml`, `.env.example`, `README.md`).
- Signup and login with bcrypt password hashes and JWT access tokens.
- Forgot password with a one-time code (OTP) sent by email, and password reset.
- A fixed admin account configured by environment variables, with forgot-password still working.
- Own tables: `users`, `otp`.
- Day 1: create the Git repo skeleton and docker-compose that all four people use.
- Test in Swagger and pytest; record test cases and results.

The authoritative interface is `openspec/contracts/auth.md`.

## Capabilities

### New Capabilities
- `authentication`: signup, login, token validation, password reset by OTP, fixed admin account.

### Modified Capabilities
None.

## Non-goals

- No product, profile, shade or CV code.
- No refresh tokens, social login, email verification or multi-factor auth in Sprint 1.
- No change to P3's tables. P3 does not read `users` in Sprint 1.
- No real email provider credentials in the repo; local console or mail-capture output is enough.

## Impact

- P3 imports P2's token validator on Day 4 and uses a dev header before then.
- P4 builds login, signup and reset screens against `auth.md`.
- All four people depend on the Day 1 repo and docker-compose.
- Admin credentials live only in environment variables; the repo holds `.env.example` with names only.

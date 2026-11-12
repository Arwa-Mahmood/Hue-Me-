## Context

`openspec/contracts/auth.md` fixes endpoints, password rules, token claims, reset-link behaviour, preferences, the deletion hook, the error envelope and environment variable names. This design covers the data model, security choices, the shared backend app and deployment.

## Goals / Non-Goals

**Goals**
- Safe credential handling: hashed passwords, hashed reset tokens, no secrets in Git.
- A small importable token validator for P3.
- A working `docker compose up` on Day 1 for everyone, and a free-tier Railway deployment on Day 4.
- A complete data wipe on account deletion (US5).

**Non-Goals**
- Anything in the proposal's Non-goals list.

## Decisions

- **Stack (SRS):** Python 3.11+, FastAPI, PostgreSQL, `bcrypt`, `PyJWT`.
- **One backend app:** `backend/main.py` creates the FastAPI app, installs the shared error-envelope handlers and CORS (`CORS_ORIGINS`), and mounts `backend/auth` and `backend/products` routers under `/api/v1`. One process keeps Railway's free tier simple and lets P3 import `decode_access_token` and P2 call `delete_user_data` directly.
- **Layout:** `backend/auth/` with `app/` (routes, models, security, mail, preferences, deletion), `tests/`; `backend/main.py`; `backend/requirements.txt`; `backend/Dockerfile`.
- **`users`:** `id` UUID, `email` (unique, stored lowercase), `name`, `password_hash`, `role` (`user`|`admin`), `token_version` int, `created_at`, `updated_at`.
- **`password_resets`:** `id`, `user_id -> users.id ON DELETE CASCADE`, `token_hash` (SHA-256 of the high-entropy token), `expires_at`, `used_at` null, `created_at`.
- **`preferences`:** `user_id PRIMARY KEY -> users.id ON DELETE CASCADE`, `font_size`, `theme`, `colour_blind_mode`, `high_contrast`, `updated_at`. No row means defaults.
- **Passwords:** bcrypt. At least 8 characters (US1). Reject passwords over 72 UTF-8 bytes rather than truncating.
- **Signup:** creates the user and returns a `Session` (JWT plus user) so the frontend can go straight to the dashboard (SRS UC1).
- **Reset link:** `secrets.token_urlsafe(32)`, stored only as a hash, valid for `RESET_TOKEN_TTL_MINUTES` (60, from US3), single use, a new link invalidates earlier ones, limited requests per email per hour. Token consumption, password update and `token_version` increment happen in one transaction.
- **Forgot-password response** is identical for known and unknown emails, to avoid revealing which accounts exist.
- **Admin:** at startup, if no user with `ADMIN_EMAIL` exists, create it with role `admin` and a bcrypt hash of `ADMIN_PASSWORD`. Never overwrite an existing admin password on restart. The admin uses the same login and reset flow. The admin account cannot be deleted through `DELETE /auth/me`.
- **Account deletion:** re-check the password, call the registered `delete_user_data(user_id)` (P3), then delete the `users` row (cascades to `preferences` and `password_resets`). If P3's step fails, return 500 and keep the user so they can retry. Until Day 4 the registered function is a no-op stand-in.
- **JWT:** HS256, `JWT_SECRET` from environment, expiry `JWT_EXPIRES_MINUTES`, claims per contract. A `tv` mismatch or a missing user is rejected, which makes reset and deletion revoke old tokens.
- **Mail:** `MAIL_MODE=console` prints the reset link to the server log in development; `smtp` sends through configured SMTP (a free-tier provider). Do not log reset links when `ENVIRONMENT` is not development or test.
- **Repo and compose (Day 1):** `docker-compose.yml` with `db` (PostgreSQL) and `backend` (the single FastAPI app), and a placeholder for `frontend` (Next.js dev server) that P4 enables. Only `.env.example` is committed. Root `.gitignore` ignores `.env`, virtualenvs, `node_modules`, `.next`, caches.
- **Railway (Day 4):** deploy `backend/Dockerfile` with Railway PostgreSQL; set variables in Railway; `ENVIRONMENT=production`, `AUTH_MODE=jwt`. The image uses `opencv-python-headless` for P1's photo module.

## Risks / Trade-offs

- Reset-token guessing: 32 random bytes make guessing impractical; request limits and 1-hour expiry add margin.
- Hardcoded-admin requirement versus secrets in Git: resolved by environment-seeded admin; the credential is "fixed" but never committed.
- Shared database: each owner creates only their own tables; P2 does not touch `products`, `shades` or `profiles`.
- Partial deletion across owners: P3 data is deleted first and the user row last, so a failure leaves a retryable account rather than orphaned personal data.
- Railway free tier memory with MediaPipe loaded: measure on Day 4; fall back to lazy-loading the model on the first photo request.
- Migration clashes: each owner manages their own tables independently.

## Migration Plan

New service. Create tables on first start; there is no earlier data.

## Open Questions

- Migration tool (Alembic or plain SQL scripts).
- SMTP provider for the deployed demo (free tier).
- `JWT_EXPIRES_MINUTES` value (proposal: 60).

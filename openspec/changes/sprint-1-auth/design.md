## Context

`openspec/contracts/auth.md` fixes endpoints, token claims, error envelope and environment variable names. This design covers the data model, security choices and the Day 1 repo setup.

## Goals / Non-Goals

**Goals**
- Safe credential handling: hashed passwords, hashed OTPs, no secrets in Git.
- A small importable token validator for P3.
- A working `docker compose up` on Day 1 for everyone.

**Non-Goals**
- Anything in the proposal's Non-goals list.

## Decisions

- **Stack (proposed, confirm Day 1):** Python, FastAPI, PostgreSQL, `bcrypt`, `PyJWT`.
- **Layout:** `backend/auth/` with `app/` (routes, models, security, mail), `tests/`, `requirements.txt`, `Dockerfile`.
- **`users`:** `id` UUID, `email` (unique, stored lowercase), `name`, `password_hash`, `role` (`user`|`admin`), `token_version` int, `created_at`, `updated_at`.
- **`otp`:** `id`, `user_id`, `code_hash`, `purpose` (`password_reset`), `expires_at`, `used_at` null, `attempts` int, `created_at`.
- **Passwords:** bcrypt. Reject passwords over 72 UTF-8 bytes rather than truncating. Minimum length decided Day 1 (proposal: 8).
- **OTP:** 6 digits from a secure random source, stored only as a hash, valid for `OTP_TTL_MINUTES` (proposal: 10), single use, a new code invalidates earlier ones, limited guesses (proposal: 5) and limited requests per email per hour. Consumption and password update happen in one transaction.
- **Forgot-password response** is identical for known and unknown emails, to avoid revealing which accounts exist.
- **Admin:** at startup, if no user with `ADMIN_EMAIL` exists, create it with role `admin` and a bcrypt hash of `ADMIN_PASSWORD`. Never overwrite an existing admin password on restart. The admin uses the same login and reset flow, so a reset really changes the stored password.
- **JWT:** HS256, `JWT_SECRET` from environment, claims per contract. `tv` mismatch with the user's current `token_version` is rejected, which makes password reset revoke old tokens.
- **Mail:** `MAIL_MODE=console` prints the code to the server log for development; `smtp` sends through configured SMTP. Do not log OTPs when `ENVIRONMENT` is not development or test.
- **Repo and compose (Day 1):** `docker-compose.yml` with `db` (PostgreSQL), `auth`, and placeholders for `products` and `frontend` that P3 and P4 enable. Each service reads its own `.env`; only `.env.example` is committed. Root `.gitignore` ignores `.env`, virtualenvs, `node_modules`, caches.

## Risks / Trade-offs

- OTP brute force: mitigated by attempt and request limits plus short expiry.
- Hardcoded-admin requirement versus secrets in Git: resolved by environment-seeded admin; the credential is "fixed" but never committed.
- Shared database: each owner creates only their own tables; P2 does not touch `products`, `shades` or `profiles`.
- P3 and P2 schema migrations may clash if one tool owns the whole database. Proposal: each service manages its own tables independently.

## Migration Plan

New service. Create tables on first start; there is no earlier data.

## Open Questions

- Password rules (Day 1).
- Migration tool (Alembic or plain SQL scripts).
- Whether OTP mail goes to a local mail catcher or the console in shared development.

# Shared auth contract - Sprint 1

- Owner: **P2**. Consumers: **P3** (token validation and account-deletion hook on Day 4) and **P4** (frontend).
- SRS stories: US1 registration, US2 login/logout, US3 password recovery, US4 preferences, US5 delete account and data.
- Status: proposed on Day 1; becomes authoritative once P2, P3 and P4 sign off in `openspec/team/daily-scrum.md`.
- Base path: `/api/v1`. All bodies are JSON. Field names are `snake_case`.
- Stack (SRS): FastAPI, PostgreSQL, bcrypt, JWT with expiry. Firebase Auth is not used.

## Types

`User` (public, never includes password hash or reset-token data):

```json
{ "id": "uuid", "email": "a@b.com", "name": "Aya", "role": "user" }
```

- `id`: UUID string. `role`: `user` or `admin`. Role is never accepted from a client request.

`Session` (returned by signup and login):

```json
{ "access_token": "jwt", "token_type": "bearer", "expires_in": 3600, "user": { "...": "User" } }
```

`Preferences` (US4):

```json
{ "font_size": "medium", "theme": "light", "colour_blind_mode": "none", "high_contrast": false }
```

| Field | Allowed values | Default |
| --- | --- | --- |
| `font_size` | `small`, `medium`, `large`, `x_large` | `medium` |
| `theme` | `light` (day), `dark` (night) | `light` |
| `colour_blind_mode` | `none`, `protanopia`, `deuteranopia`, `tritanopia` | `none` |
| `high_contrast` | `true`, `false` | `false` |

## Password rules (US1, US3)

- At least **8 characters** (SRS US1).
- At most **72 UTF-8 bytes** (bcrypt limit); longer passwords are rejected, never truncated.
- Any further rule (for example "one digit") is added only by the contract-change rule.

## Endpoints

| Method and path | Request body | Success | Notes |
| --- | --- | --- | --- |
| `POST /auth/signup` | `{name, email, password}` | `201` `Session` | US1. Always creates `role = user` and issues a JWT. Duplicate email: `409 email_taken`. Bad email or weak password: `422`. |
| `POST /auth/login` | `{email, password}` | `200` `Session` | US2. Works for the admin account too. Bad credentials: `401 invalid_credentials`, same message for unknown email and wrong password. |
| `POST /auth/forgot-password` | `{email}` | `202` `{message}` | US3. Always the same response, whether or not the account exists. Message: `If the account exists, a reset link has been sent.` Too many requests: `429`. |
| `POST /auth/reset-password` | `{token, new_password}` | `200` `{message: "Password reset successful."}` | US3. Bad, expired or used token: `400 invalid_reset_token`. Weak password: `422`. |
| `GET /auth/me` | none, bearer token | `200` `User` | Missing or invalid token: `401`. |
| `DELETE /auth/me` | `{password}`, bearer token | `204` | US5. Deletes the account and **all** of the user's data, including P3's profile. Wrong password: `401 invalid_credentials`. The seeded admin account cannot be deleted: `403 forbidden`. |
| `GET /me/preferences` | none, bearer token | `200` `Preferences` | US4. Returns defaults if nothing is saved. |
| `PUT /me/preferences` | full `Preferences` | `200` `Preferences` | US4. Unknown value: `422`. |

Logout (US2) is client-side: the frontend discards the token. There is no logout endpoint in Sprint 1.

## Reset link (US3)

- The email contains a link `{FRONTEND_BASE_URL}/reset-password?token=<token>`.
- `token` is at least 32 random bytes from a secure source, URL-safe encoded, stored only as a hash.
- The link **expires 1 hour** after it is issued (SRS US3; `RESET_TOKEN_TTL_MINUTES=60`), is single use, and a newer link invalidates older ones for the same user.
- Requests are rate limited per email per hour (`429 rate_limited`).

## Token

- JWT, HS256 (secret from `JWT_SECRET`), expiry `JWT_EXPIRES_MINUTES`, no refresh token in Sprint 1.
- Claims: `sub` = user UUID, `role` = `user` | `admin`, `iat`, `exp`, `tv` (token version).
- A password reset increments the user's token version, so older tokens stop validating. A deleted user's tokens stop validating.
- P2 provides one importable validator (`/backend/auth`, function `decode_access_token(token) -> {sub, role}`) so P3 does not reimplement JWT checks on Day 4.
- A missing, malformed, expired or wrongly signed token never falls back to a dev identity.

## Account deletion hook (US5)

- P3 provides `delete_user_data(user_id: UUID) -> None` in `/backend/products` (removes the profile and any other P3 rows for that user; idempotent).
- `backend/main.py` (owned by P2) registers P3's function with P2's deletion service at startup. Until Day 4 P2 uses a no-op stand-in.
- Order: P3 data first, then P2's rows (`preferences`, `password_resets`, `users`). If any step fails the response is `500` and the `users` row is kept so the user can retry.

## Error envelope (all services)

```json
{ "error": { "code": "validation_error", "message": "Human readable text", "details": [ { "field": "email", "message": "Invalid email" } ] } }
```

| Status | `code` |
| --- | --- |
| 400 | `invalid_reset_token`, `bad_request` |
| 401 | `invalid_credentials`, `not_authenticated` |
| 403 | `forbidden` |
| 404 | `not_found` |
| 409 | `email_taken`, `conflict` |
| 422 | `validation_error` |
| 429 | `rate_limited` |
| 500 | `internal_error` |

`details` may be an empty list.

## Dev-only identity (owned by P3)

Until auth is integrated, P3 reads `X-Dev-User-Id: <uuid>` and optional `X-Dev-Role: admin`. This is active only when `AUTH_MODE=mock` and `ENVIRONMENT` is `development` or `test`. Any other configuration disables it. On Day 4 P3 switches to `AUTH_MODE=jwt`.

## Deployment

- One FastAPI app (`backend/main.py`, owned by P2) mounts the auth and products routers and runs on Railway's free tier with Railway PostgreSQL. Local development uses docker-compose.
- CORS allows only the origins in `CORS_ORIGINS` (the Vercel frontend URL and `http://localhost:3000`).

## Environment variables (names only; no values are committed)

`DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_MINUTES`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `RESET_TOKEN_TTL_MINUTES`, `FRONTEND_BASE_URL`, `MAIL_MODE` (`console` | `smtp`), `SMTP_*`, `CORS_ORIGINS`, `AUTH_MODE`, `ENVIRONMENT`.

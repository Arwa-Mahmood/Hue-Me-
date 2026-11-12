# Shared auth contract - Sprint 1

- Owner: **P2**. Consumers: **P3** (token validation on Day 4) and **P4** (frontend).
- Status: proposed on Day 1; becomes authoritative once P2, P3 and P4 sign off in `openspec/team/daily-scrum.md`.
- Base path: `/api/v1`. All bodies are JSON. Field names are `snake_case`.

## Types

`User` (public, never includes password hash or OTP data):

```json
{ "id": "uuid", "email": "a@b.com", "name": "Aya", "role": "user" }
```

- `id`: UUID string. `role`: `user` or `admin`. Role is never accepted from a client request.

## Endpoints

| Method and path | Request body | Success | Notes |
| --- | --- | --- | --- |
| `POST /auth/signup` | `{name, email, password}` | `201` `User` | Always creates `role = user`. Duplicate email: `409`. |
| `POST /auth/login` | `{email, password}` | `200` `{access_token, token_type: "bearer", user}` | Works for the admin account too. Bad credentials: `401`, same message for unknown email and wrong password. |
| `POST /auth/forgot-password` | `{email}` | `202` `{message}` | Always the same response, whether or not the account exists. Message: `If the account exists, a reset code has been sent.` |
| `POST /auth/reset-password` | `{email, otp, new_password}` | `200` `{message: "Password reset successful."}` | Bad, expired or used OTP: `400`. |
| `GET /auth/me` | none, bearer token | `200` `User` | Missing or invalid token: `401`. |

## Token

- JWT, HS256 (secret from `JWT_SECRET`), no refresh token in Sprint 1.
- Claims: `sub` = user UUID, `role` = `user` | `admin`, `iat`, `exp`, `tv` (token version).
- A password reset increments the user's token version, so older tokens stop validating.
- P2 provides one importable validator (`/backend/auth`, function `decode_access_token(token) -> {sub, role}`) so P3 does not reimplement JWT checks on Day 4.
- A missing, malformed, expired or wrongly signed token never falls back to a dev identity.

## Error envelope (all services)

```json
{ "error": { "code": "validation_error", "message": "Human readable text", "details": [ { "field": "email", "message": "Invalid email" } ] } }
```

| Status | `code` |
| --- | --- |
| 400 | `invalid_otp` (also used for other bad requests, such as `bad_request`) |
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

## Environment variables (names only; no values are committed)

`DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_MINUTES`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `OTP_TTL_MINUTES`, `MAIL_MODE` (`console` | `smtp`), `SMTP_*`, `AUTH_MODE`, `ENVIRONMENT`.

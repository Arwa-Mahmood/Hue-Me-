## Context

The contracts define every request and response. P4 chooses the frontend stack and mock tool on Day 1.

## Goals / Non-Goals

**Goals**
- Complete clickable user and admin flows on the mock API.
- A single configuration value switches between mock and real API.

**Non-Goals**
- Anything in the proposal's Non-goals list.

## Decisions

- **Stack:** chosen by P4 on Day 1 and recorded in `team/daily-scrum.md`. Any mainstream framework is acceptable.
- **API layer:** one module wraps every call; screens never call `fetch` directly. It reads `API_BASE_URL` and handles the error envelope and the bearer token.
- **Mock API:** implement handlers from the contract files (for example a mock service worker or a small local server). It must reproduce the error envelope and the 401, 403, 404, 409, 422 and 429 cases so error states can be built and tested.
- **Auth state:** keep the token in memory plus a persistence choice agreed with P2 (proposal: browser storage with a short expiry). On any 401 the app clears the session and shows login.
- **Route guards:** admin routes require `role = admin` from the user object; this is a convenience, the server is the real check.
- **Screens (user):** landing, signup, login, forgot password (enter email), reset password (OTP and new password), colour input (skin required, hair and eye optional, hex field plus colour picker), result (season, undertone, depth, LAB, swatch), product list with filters and buy link.
- **Screens (admin):** product list, add and edit product, shade list and edit, CSV import with row error table.
- **Wireframes:** in `/frontend/wireframes/` (images or exported files) and linked from the user manual.
- **Mock-to-real switch (Day 4):** change `API_BASE_URL` and disable the mock; no screen code changes.

## Risks / Trade-offs

- Mock drifts from the real API: mock is generated from the contracts only, and Day 4 includes a full run on the real API.
- Frontend recalculating colour results would diverge from the backend: it must display returned values only.
- Token storage trade-off between convenience and security; document the choice.

## Migration Plan

Day 4: point at the real API, re-run FE-01 to FE-10, record FE-11.

## Open Questions

- Frontend framework and mock tool.
- Where the wireframes are stored and in what format.
- Colour picker component.

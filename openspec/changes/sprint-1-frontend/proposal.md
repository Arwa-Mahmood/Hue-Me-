## Why

Users and the admin need screens for every Sprint 1 feature. The frontend can be built entirely against a mock API generated from the agreed contracts, so P4 never waits for the backend.

## What Changes

- **Owner:** P4. **May write to:** `/frontend` only (plus shared team documents).
- Updated wireframes for Sprint 1.
- All user screens: signup, login, forgot password and reset, colour input and result, product browsing.
- All admin screens: login (same form), product and shade management, CSV import.
- A mock API that follows `contracts/auth.md` and `contracts/products-api.md`, used until Day 4, then a switch to the real API by configuration.
- Test cases and results, and screenshots for the user manual.

## Capabilities

### New Capabilities
- `web-app`: user and admin screens, route protection, mock-to-real API switch.

### Modified Capabilities
None.

## Non-goals

- No backend, database or colour maths. Results come from the API.
- No product matching screens (Sprint 2).
- No changes to contracts without the process in `contracts/README.md`.

## Impact

- Depends only on the three contract files, never on a running backend until Day 4.
- Any contract change needs P4's agreement.
- P4 adds screenshots to the user manual and owns the wireframes shared by the team.

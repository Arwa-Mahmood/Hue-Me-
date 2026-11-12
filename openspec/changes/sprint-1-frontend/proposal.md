## Why

Users and the admin need screens for every Sprint 1 story. The SRS fixes the frontend as React/Next.js hosted on Vercel, accessible (font size, day/night theme, colour-blind modes, high contrast, text labels next to swatches) and responsive on mobile. The frontend can be built entirely against a mock API generated from the agreed contracts, so P4 never waits for the backend.

## What Changes

- **Owner:** P4. **May write to:** `/frontend` only (plus shared team documents and the Vercel project).
- **SRS stories:** screens for US1-US10.
- Next.js (React) app, responsive for desktop and mobile browsers, deployed on Vercel's free tier.
- Updated wireframes for Sprint 1.
- Account screens: signup (signed in straight away), login, logout, session kept across refresh, forgot password and reset from the emailed link, delete account with confirmation.
- Accessibility settings applied app-wide immediately and saved for signed-in users.
- Colour screens: selfie upload, hex input, swatch grid, result (season, undertone, depth, confidence, explanation, wear/avoid palette with hex and text labels), tone correction.
- A mock API that follows `contracts/auth.md` and `contracts/products-api.md`, used until Day 4, then a switch to the real API by configuration.
- Sprint 2 preparation (lower priority): product browsing and admin product, shade and CSV import screens.
- Test cases and results, and screenshots for the user manual.

## Capabilities

### New Capabilities
- `web-app`: user and admin screens, accessibility settings, route protection, mock-to-real API switch, Vercel deployment.

### Modified Capabilities
None.

## Non-goals

- No backend, database, colour maths or image processing in the browser. Results come from the API.
- No camera live preview, AR try-on, glasses, outfit or wardrobe screens, or product matching screens (later sprints).
- No analysis history screen (Sprint 1 keeps only the latest profile).
- PWA install is optional and only after all Sprint 1 screens work.
- No changes to contracts without the process in `contracts/README.md`.

## Impact

- Depends only on the three contract files, never on a running backend until Day 4.
- Any contract change needs P4's agreement.
- P4 adds screenshots to the user manual and owns the wireframes shared by the team.
- P2 adds the Vercel URL to the backend's `CORS_ORIGINS`.

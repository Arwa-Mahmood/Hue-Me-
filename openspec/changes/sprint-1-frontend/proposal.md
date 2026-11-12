## Why

Users need screens for every Sprint 1 story. The SRS fixes the frontend as React/Next.js hosted on Vercel, accessible (font size, day/night theme, colour-blind modes, high contrast, text labels next to swatches) and responsive on mobile. The frontend can be built entirely against a mock API generated from the agreed contracts, so Momina never waits for the backend.

## What Changes

- **Owner:** P4 Momina. **May write to:** `/frontend` only (plus shared team documents and the Vercel project).
- **SRS stories:** screens for US1-US10.
- Next.js (React) app, responsive for desktop and mobile browsers, deployed on Vercel's free tier.
- Updated wireframes for Sprint 1.
- Account screens: signup (signed in straight away), login, logout, session kept across refresh, forgot password and reset from the emailed link, delete account with confirmation.
- Accessibility settings applied app-wide immediately and saved for signed-in users.
- Colour screens: selfie upload, hex input, swatch grid, result (season, undertone, depth, confidence, explanation, wear/avoid palette with hex and text labels), tone correction.
- A mock API that follows `contracts/auth.md` and `contracts/profile-api.md`, used until integration, then a switch to the real API by configuration.
- Test cases and results, and screenshots for the user manual.

## Capabilities

### New Capabilities
- `web-app`: user screens, accessibility settings, route protection, mock-to-real API switch, Vercel deployment.

### Modified Capabilities
None.

## Non-goals

- Anything in Sprint 2: product browsing, admin screens and matching screens are parked in `openspec/sprint-2/`.
- No backend, database, colour maths or image processing in the browser. Results come from the API.
- No camera live preview, AR try-on, glasses, outfit or wardrobe screens.
- No analysis history screen (Sprint 1 keeps only the latest profile).
- PWA install is optional and only after all Sprint 1 screens work.
- No changes to contracts without the process in `contracts/README.md`.

## Impact

- Depends only on the contract files, never on a running backend until integration.
- Any change to `auth.md` or `profile-api.md` needs Momina's agreement.
- Momina adds screenshots to the user manual and owns the wireframes shared by the team.
- Eshaal adds the Vercel URL to the backend's `CORS_ORIGINS`.

## Context

The contracts define every request and response. The SRS fixes the stack (React/Next.js on Vercel) and the accessibility features.

## Goals / Non-Goals

**Goals**
- Complete clickable user and admin flows on the mock API.
- A single configuration value switches between mock and real API.
- Accessibility settings that change the whole app immediately (US4).

**Non-Goals**
- Anything in the proposal's Non-goals list.

## Decisions

- **Stack (SRS):** Next.js with React, TypeScript (proposal), App Router (proposal). Deployed on Vercel's free tier from the `frontend/` folder.
- **Mock API:** Mock Service Worker (proposal, confirm Day 1) with handlers written from the contract files. It must reproduce the error envelope and the 401, 403, 404, 409, 422 and 429 cases, the photo errors and the 1-hour reset-link expiry so error states can be built and tested.
- **API layer:** one module wraps every call; screens never call `fetch` directly. It reads `NEXT_PUBLIC_API_BASE_URL` and handles the error envelope and the bearer token.
- **Auth state (US2):** keep the token in `localStorage` (proposal, confirm Day 1) so the session survives a refresh; logout and any 401 clear it and show login. Signup stores the returned token and goes straight to the dashboard (SRS UC1).
- **Reset link (US3):** page `/reset-password?token=...` reads the token from the URL and posts it with the new password; an invalid or expired link shows a message and a button to request a new one.
- **Accessibility (US4, UC18):** settings in a React context applied as CSS variables and classes on `<html>`: font-size scale, `light`/`dark` theme, high-contrast theme, and colour-blind mode (an alternative UI accent palette that avoids the affected hue pairs). Applied immediately on change; stored in `localStorage` for everyone and synced to `PUT /me/preferences` when signed in; loaded from `GET /me/preferences` after login. Every swatch always shows its hex and name as text. Target WCAG 2.1 AA contrast.
- **Route guards:** signed-in routes require a token; admin routes require `role = admin`. This is a convenience; the server is the real check.
- **Screens (user):**
  - landing, signup, login, forgot password, reset password (from link)
  - dashboard: "Use a selfie" or "Enter my colour"
  - selfie upload (US6): JPG/PNG picker (and mobile camera capture via the file input), lighting tips, privacy note "your photo is not stored", error messages for each photo problem
  - manual entry (US7): hex field with colour picker, swatch grid of labelled skin tones, optional hair and eye colours
  - result (US8, US9): season, undertone, depth, LAB, skin swatch, confidence indicator (text + icon, not colour alone), explanation text, wear and avoid lists with hex and names, "corrected" badge
  - correct tone (US10): pick an undertone or adjust the skin colour (lighter/darker, choose a nearby swatch), submit to `POST /profile/correction`, show the recalculated palette
  - settings (US4) and delete account (US5) with a confirmation dialog that asks for the password, then signs out and redirects home
- **Swatch grid:** a static, labelled list of about 24 skin-tone hexes in `frontend/src/data/skin-swatches.ts`, covering every depth range; choosing one sends that hex through the same `PUT /profile` call as typing it.
- **Screens (admin, Sprint 2 prep):** product list, add and edit product, shade list and edit, CSV import with row error table.
- **Wireframes:** in `/frontend/wireframes/` (images or exported files) and linked from the user manual.
- **Mock-to-real switch (Day 4):** change `NEXT_PUBLIC_API_BASE_URL` and disable the mock; no screen code changes.
- **PWA (optional):** a web manifest and icons only if time allows after all Sprint 1 screens pass.

## Risks / Trade-offs

- Mock drifts from the real API: mock is written from the contracts only, and Day 4 includes a full run on the real API.
- Frontend recalculating colour results would diverge from the backend: it must display returned values only. The tone-adjustment control only picks a new hex; the server re-analyses it.
- `localStorage` token is readable by scripts on the page: acceptable for Sprint 1 with short JWT expiry and no third-party scripts; documented.
- Colour-blind mode changes UI colours only; the analysis swatches show true colours plus text labels.

## Migration Plan

Day 4: point at the real API on Railway, deploy to Vercel, re-run FE-01 to FE-18 and record FE-11.

## Open Questions

- Mock tool and token storage (proposals above).
- Colour picker component.
- Exact skin swatch grid values (P1 to review).

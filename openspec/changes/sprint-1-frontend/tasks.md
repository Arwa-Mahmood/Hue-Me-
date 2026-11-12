## 1. Day 1: design and setup

- [ ] 1.1 [P4][Day 1] Read all three contract files and record any questions or "ok" in `team/daily-scrum.md`
- [ ] 1.2 [P4][Day 1] Confirm the mock tool and token storage and record them
- [ ] 1.3 [P4][Day 1] Draw updated Sprint 1 wireframes for every user screen (US1-US10) and the admin screens
- [ ] 1.4 [P4][Day 1] Create the Next.js app in `/frontend` and add it to docker-compose with P2

## 2. Mock API and API layer

- [ ] 2.1 [P4][Day 2] Build the API module with `NEXT_PUBLIC_API_BASE_URL`, bearer token and error envelope handling
- [ ] 2.2 [P4][Day 2] Mock the auth, preferences and delete-account endpoints from `contracts/auth.md` including error cases
- [ ] 2.3 [P4][Day 2] Mock the profile, photo and correction endpoints from `contracts/products-api.md` including error cases
- [ ] 2.4 [P4][Day 3] Mock the product and import endpoints (Sprint 2 prep)

## 3. Account screens

- [ ] 3.1 [P4][Day 2][US1] Signup with field validation (email, password ≥ 8) and server errors; signed in on success
- [ ] 3.2 [P4][Day 2][US2] Login, logout, session kept across refresh, expired session handling
- [ ] 3.3 [P4][Day 2][US3] Forgot password and reset-password page that reads the link token; expired link message
- [ ] 3.4 [P4][Day 3][US5] Delete account with confirmation dialog, then sign out and redirect home

## 4. Accessibility

- [ ] 4.1 [P4][Day 2][US4] Settings screen: font size, day/night theme, colour-blind mode, high contrast
- [ ] 4.2 [P4][Day 2][US4] Apply settings app-wide immediately; store locally; sync with `/me/preferences` when signed in
- [ ] 4.3 [P4][Day 3][US9] Every swatch shows hex and a text label; confidence not shown by colour alone
- [ ] 4.4 [P4][Day 3] Check keyboard navigation and contrast on every screen; responsive layout on a phone

## 5. Colour screens

- [ ] 5.1 [P4][Day 2][US6] Selfie upload (JPG/PNG, mobile camera via file input), lighting tips, privacy note, error messages
- [ ] 5.2 [P4][Day 2][US7] Hex input with colour picker; optional hair and eye colours
- [ ] 5.3 [P4][Day 2][US7] Labelled skin swatch grid using the same call as hex input
- [ ] 5.4 [P4][Day 3][US8] Result screen: season, undertone, depth, LAB, swatch, confidence, explanation
- [ ] 5.5 [P4][Day 3][US9] Wear and avoid lists
- [ ] 5.6 [P4][Day 3][US8] Undetermined (422) message with no season shown
- [ ] 5.7 [P4][Day 3][US10] Correct-tone controls, recalculated palette, "corrected" badge

## 6. Admin and catalogue screens (Sprint 2 preparation, after sections 3-5)

- [ ] 6.1 [P4][Day 3] Route guard for admin screens
- [ ] 6.2 [P4][Day 4] Product browsing with category and brand filters, pagination and buy link
- [ ] 6.3 [P4][Day 4] Product and shade add, edit, delete
- [ ] 6.4 [P4][Day 4] CSV import with success counts and row error table

## 7. Switch to the real API and deploy (Day 4)

- [ ] 7.1 [P4][Day 4] Point `NEXT_PUBLIC_API_BASE_URL` at the Railway API and disable the mock
- [ ] 7.2 [P4][Day 4] Deploy to Vercel (free tier); give P2 the URL for `CORS_ORIGINS`
- [ ] 7.3 [P4][Day 4] Fix any mismatch with the contracts and report contract bugs to the owner in `team/daily-scrum.md`
- [ ] 7.4 [P4][Day 5] Run all flows on the deployed app
- [ ] 7.5 [P4][Day 5] Optional: PWA manifest and icons if all Sprint 1 tests pass

## 8. Test cases and results

- [ ] 8.1 [P4][Day 3] Run FE-01 to FE-18 (except FE-11) on the mock and record real results in `team/test-results.md`
- [ ] 8.2 [P4][Day 5] Run FE-11 and the integration cases with the team and record results

## 9. Shared documents

- [ ] 9.1 [P4][Day 4] Take screenshots and add them to `team/user-manual.md`
- [ ] 9.2 [P4][Day 4] Write the P4 sections of the user manual (accessibility, Vercel)
- [ ] 9.3 [P4][Day 4] Review the SRS update
- [ ] 9.4 [P4][Day 1-5] Add your own Trello cards (tagged US1-US10) and `team/daily-scrum.md` entries

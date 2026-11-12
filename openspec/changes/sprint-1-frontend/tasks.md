## 1. Design and setup

- [ ] 1.1 [P4] Read all three contract files and record any questions or "ok" in `team/daily-scrum.md`
- [ ] 1.2 [P4] Confirm the mock tool and token storage and record them
- [ ] 1.3 [P4] Draw updated Sprint 1 wireframes for every user screen (US1-US10)
- [ ] 1.4 [P4] Create the Next.js app in `/frontend` and add it to docker-compose with Eshaal

## 2. Mock API and API layer

- [ ] 2.1 [P4] Build the API module with `NEXT_PUBLIC_API_BASE_URL`, bearer token and error envelope handling
- [ ] 2.2 [P4] Mock the auth, preferences and delete-account endpoints from `contracts/auth.md` including error cases
- [ ] 2.3 [P4] Mock the profile, photo and correction endpoints from `contracts/profile-api.md` including error cases

## 3. Account screens

- [ ] 3.1 [P4][US1] Signup with field validation (email, password ≥ 8) and server errors; signed in on success
- [ ] 3.2 [P4][US2] Login, logout, session kept across refresh, expired session handling
- [ ] 3.3 [P4][US3] Forgot password and reset-password page that reads the link token; expired link message
- [ ] 3.4 [P4][US5] Delete account with confirmation dialog, then sign out and redirect home

## 4. Accessibility

- [ ] 4.1 [P4][US4] Settings screen: font size, day/night theme, colour-blind mode, high contrast
- [ ] 4.2 [P4][US4] Apply settings app-wide immediately; store locally; sync with `/me/preferences` when signed in
- [ ] 4.3 [P4][US9] Every swatch shows hex and a text label; confidence not shown by colour alone
- [ ] 4.4 [P4] Check keyboard navigation and contrast on every screen; responsive layout on a phone

## 5. Colour screens

- [ ] 5.1 [P4][US6] Selfie upload (JPG/PNG, mobile camera via file input), lighting tips, privacy note, error messages
- [ ] 5.2 [P4][US7] Hex input with colour picker; optional hair and eye colours
- [ ] 5.3 [P4][US7] Labelled skin swatch grid using the same call as hex input
- [ ] 5.4 [P4][US8] Result screen: season, undertone, depth, LAB, swatch, confidence, explanation
- [ ] 5.5 [P4][US9] Wear and avoid lists
- [ ] 5.6 [P4][US8] Undetermined (422) message with no season shown
- [ ] 5.7 [P4][US10] Correct-tone controls, recalculated palette, "corrected" badge

## 6. Switch to the real API and deploy

- [ ] 6.1 [P4] Point `NEXT_PUBLIC_API_BASE_URL` at the Railway API and disable the mock
- [ ] 6.2 [P4] Deploy to Vercel (free tier); give Eshaal the URL for `CORS_ORIGINS`
- [ ] 6.3 [P4] Fix any mismatch with the contracts and report contract bugs to the owner in `team/daily-scrum.md`
- [ ] 6.4 [P4] Run all flows on the deployed app
- [ ] 6.5 [P4] Optional: PWA manifest and icons if all Sprint 1 tests pass

## 7. Test cases and results

- [ ] 7.1 [P4] Run FE-01 to FE-14 on the mock and record real results in `team/test-results.md`
- [ ] 7.2 [P4] Run FE-15 and IN-01 to IN-05 with the team and record results

## 8. Shared documents

- [ ] 8.1 [P4] Take screenshots and add them to `team/user-manual.md`
- [ ] 8.2 [P4] Write Momina's section of the user manual (Vercel deployment)
- [ ] 8.3 [P4] Review the SRS update
- [ ] 8.4 [P4] Add your own Trello cards (tagged US1-US10) and `team/daily-scrum.md` entries

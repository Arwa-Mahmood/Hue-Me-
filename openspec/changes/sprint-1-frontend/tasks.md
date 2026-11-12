## 1. Day 1: design and setup

- [ ] 1.1 [P4][Day 1] Read all three contract files and record any questions or "ok" in `team/daily-scrum.md`
- [ ] 1.2 [P4][Day 1] Choose the frontend stack and mock tool and record them
- [ ] 1.3 [P4][Day 1] Draw updated Sprint 1 wireframes for every user and admin screen
- [ ] 1.4 [P4][Day 1] Create the `/frontend` skeleton and add it to docker-compose with P2

## 2. Mock API and API layer

- [ ] 2.1 [P4][Day 2] Build the API module with `API_BASE_URL`, bearer token and error envelope handling
- [ ] 2.2 [P4][Day 2] Mock the auth endpoints from `contracts/auth.md` including error cases
- [ ] 2.3 [P4][Day 2] Mock the product, profile and import endpoints from `contracts/products-api.md` including error cases

## 3. User screens

- [ ] 3.1 [P4][Day 2] Signup and login with field validation and server errors
- [ ] 3.2 [P4][Day 2] Forgot password and reset password with OTP
- [ ] 3.3 [P4][Day 3] Colour input (skin required, hair and eye optional)
- [ ] 3.4 [P4][Day 3] Result screen with season, undertone, depth, LAB and swatch
- [ ] 3.5 [P4][Day 3] Undetermined (422) message with no season shown
- [ ] 3.6 [P4][Day 3] Product browsing with category and brand filters, pagination and buy link
- [ ] 3.7 [P4][Day 3] Logout and expired session handling

## 4. Admin screens

- [ ] 4.1 [P4][Day 3] Route guard for admin screens
- [ ] 4.2 [P4][Day 3] Product add, edit, delete
- [ ] 4.3 [P4][Day 3] Shade add, edit, delete
- [ ] 4.4 [P4][Day 3] CSV import with success counts and row error table

## 5. Switch to the real API (Day 4)

- [ ] 5.1 [P4][Day 4] Point `API_BASE_URL` at the real services and disable the mock
- [ ] 5.2 [P4][Day 4] Fix any mismatch with the contracts and report contract bugs to the owner in `team/daily-scrum.md`
- [ ] 5.3 [P4][Day 5] Run all flows on the real API

## 6. Test cases and results

- [ ] 6.1 [P4][Day 3] Run FE-01 to FE-10 on the mock and record real results in `team/test-results.md`
- [ ] 6.2 [P4][Day 5] Run FE-11 and the integration cases with the team and record results

## 7. Shared documents

- [ ] 7.1 [P4][Day 4] Take screenshots and add them to `team/user-manual.md`
- [ ] 7.2 [P4][Day 4] Write the P4 sections of the user manual
- [ ] 7.3 [P4][Day 4] Review the SRS
- [ ] 7.4 [P4][Day 1-5] Add your own Trello cards and `team/daily-scrum.md` entries

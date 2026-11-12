# P2 Eshaal - Accounts and login (`/backend/auth`)

## 1. Setup

- [ ] 1.1 [P2] Create the repo folders, `.gitignore` and `.env.example`
- [ ] 1.2 [P2] Create the FastAPI app (`backend/main.py`)
- [ ] 1.3 [P2] Create `docker-compose.yml` with PostgreSQL and the backend
- [ ] 1.4 [P2] Create the `users`, `password_resets` and `preferences` tables

## 2. Accounts

- [ ] 2.1 [P2] Sign up (name, email, password of at least 8 characters, bcrypt hash, returns JWT)
- [ ] 2.2 [P2] Log in (returns JWT with expiry)
- [ ] 2.3 [P2] Get the current user from the JWT
- [ ] 2.4 [P2] Forgot password: email a reset link that expires after 1 hour
- [ ] 2.5 [P2] Reset password using the link
- [ ] 2.6 [P2] Save and load preferences (font size, theme, colour-blind mode, high contrast)
- [ ] 2.7 [P2] Delete account and all the user's data (including Ayesha's profile)

## 3. Testing and deployment

- [ ] 3.1 [P2] pytest for every endpoint above
- [ ] 3.2 [P2] Give Ayesha the function that checks a JWT
- [ ] 3.3 [P2] Deploy the backend and database to Railway

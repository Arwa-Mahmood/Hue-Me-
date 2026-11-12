# P3 Ayesha - Profile API (`/backend/profile`)

## 1. Setup

- [ ] 1.1 [P3] Create the `/backend/profile` folder and add its routes to `backend/main.py`
- [ ] 1.2 [P3] Create the `profiles` table
- [ ] 1.3 [P3] Use placeholder colour functions until Arwa's are ready

## 2. Endpoints

- [ ] 2.1 [P3] Save the user's skin colour from a hex code or swatch (`PUT /profile`)
- [ ] 2.2 [P3] Analyse an uploaded selfie and save the result, without storing the photo (`POST /profile/photo`)
- [ ] 2.3 [P3] Get the saved result: season, undertone, depth, palette, explanation, confidence (`GET /profile`)
- [ ] 2.4 [P3] Correct the detected tone and recalculate (`POST /profile/correction`)
- [ ] 2.5 [P3] Return clear errors for a bad hex code or a bad photo
- [ ] 2.6 [P3] Function to delete a user's profile (used by Eshaal's delete account)

## 3. Testing and integration

- [ ] 3.1 [P3] pytest for every endpoint above
- [ ] 3.2 [P3] Switch to Arwa's real colour functions
- [ ] 3.3 [P3] Switch to Eshaal's JWT check

# Deploying Hue&Me

| Part | Where | Folder |
| --- | --- | --- |
| Backend (FastAPI: auth, profile, admin, cv) | Railway | repo root (uses `Dockerfile` + `railway.json`) |
| Database | Railway Postgres (already set up) | — |
| Frontend (Next.js) | Vercel | `frontend` |

Deploy the backend first: the frontend needs its URL.

## 1. Backend on Railway

1. In the existing Railway project (the one with the Postgres database): **New → GitHub Repo** → `Hue-Me-`.
2. Service **Settings**:
   - **Branch**: `feature/frontend-auth-integration` (or `main` once merged).
   - **Root Directory**: leave empty (repo root). Railway finds `railway.json` and builds the `Dockerfile`.
   - **Networking → Generate Domain** to get a public URL, e.g. `https://hue-me-backend.up.railway.app`.
3. Service **Variables**:

   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | Reference the database: `${{Postgres.DATABASE_URL}}` (no need to paste the URL) |
   | `JWT_SECRET` | A long random string (keep it the same between deploys, or everyone is logged out) |
   | `ADMIN_EMAIL` | The existing admin account's email |
   | `FRONTEND_URL` | The Vercel URL from step 2, e.g. `https://hue-me.vercel.app` (comma-separate several) |
   | `BREVO_API_KEY` | A Brevo **API key** (`xkeysib-...`, Brevo → SMTP & API → API Keys). Not the SMTP key |
   | `SMTP_FROM` | The sender address, verified in Brevo, e.g. `Hue&Me <someone@example.com>` |

4. Check: open `https://<backend-url>/health` → `{"status":"ok"}`. API docs: `/docs`.

> **Email codes:** Railway blocks outgoing SMTP on its Free/Hobby plans, so the backend sends the
> signup and reset codes through Brevo's HTTP API when `BREVO_API_KEY` is set. Without it, it falls
> back to SMTP (`SMTP_HOST`, `SMTP_LOGIN`, `SMTP_PASS`), which works locally. If a send fails, the
> backend log shows `[EMAIL ERROR]` with Brevo's reason, and the code.

## 2. Frontend on Vercel

1. **Add New → Project** → import `Hue-Me-`.
2. **Root Directory**: `frontend`. Framework: Next.js (detected).
3. **Production branch**: `feature/frontend-auth-integration` (Settings → Git), or `main` once merged.
4. **Environment Variables**: `NEXT_PUBLIC_API_URL` = the Railway backend URL (no trailing slash).
5. Deploy, then put the Vercel URL into Railway's `FRONTEND_URL` (step 1.3). Railway redeploys automatically.

Changing `NEXT_PUBLIC_API_URL` needs a redeploy on Vercel (it is built into the pages).

## After that

Every push to the deploy branch redeploys both. Pages: `/login` (Eshaal's auth page), `/me`, `/admin`.

Vercel preview deployments get their own URLs; add one to `FRONTEND_URL` if you want it to talk to the backend.

## Running locally

- Backend: `cd backend`, create `backend/.env` from `.env.example`, then `uvicorn main:app --reload` (port 8000).
- Frontend: `cd frontend`, `npm install`, `npm run dev` (port 3000). Optional `frontend/.env.local` with `NEXT_PUBLIC_API_URL`.

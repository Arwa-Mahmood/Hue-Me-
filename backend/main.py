from dotenv import load_dotenv
load_dotenv()

import sys
from pathlib import Path
# Repo root on the path so the backend can use Arwa's colour module (cv/color.py)
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from auth.store import init_db
from fastapi import APIRouter, Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from auth.router import router as auth_router
from auth.seed import seed_admin
from auth.deps import require_admin
from admin_backend.main import app as admin_app
from profiles.router import router as profile_router
from profiles.store import init_profiles

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],   # P4's Next.js dev server
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(profile_router)

# Ayesha's admin API (backend/admin_backend) served from this same app,
# so the frontend talks to one backend. Only its API routes are added (not its /docs),
# and every admin route needs a logged-in admin (JWT with role "admin").
admin_router = APIRouter()
for route in admin_app.routes:
    if isinstance(route, APIRoute) and route.path != "/":
        admin_router.routes.append(route)
app.include_router(admin_router, dependencies=[Depends(require_admin)])

@app.on_event("startup")
def startup():
    init_db()
    init_profiles()
    seed_admin()

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.router import router as auth_router
from auth.seed import seed_admin

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],   # P4's Next.js dev server
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)

@app.on_event("startup")
def startup():
    seed_admin()
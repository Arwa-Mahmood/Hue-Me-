from dotenv import load_dotenv
load_dotenv()
from auth.store import init_db
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.router import router as auth_router
from auth.seed import seed_admin

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","https://hue-me-silk.vercel.app"],   # P4's Next.js dev server
    allow_origin_regex=r"https://hue-me-.*\.vercel\.app",  # Vercel preview URLs
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)

@app.on_event("startup")
def startup():
    init_db()
    seed_admin()

...

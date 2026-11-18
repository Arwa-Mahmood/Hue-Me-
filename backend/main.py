from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from auth.router import router as auth_router
from auth.seed import seed_admin

app = FastAPI()
app.include_router(auth_router)

@app.on_event("startup")
def startup():
    seed_admin()
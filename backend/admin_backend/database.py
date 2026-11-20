import os
import psycopg2
from dotenv import load_dotenv
from pathlib import Path

# Load backend/.env (never commit it: it holds the Railway connection string)
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

# Railway provides the full connection string in DATABASE_URL.
# Shared by the whole backend: auth, profile and admin.
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL is not set in backend/.env")
    return psycopg2.connect(DATABASE_URL)

import psycopg2
import os
from dotenv import load_dotenv
from pathlib import Path

# Load the .env file from the root directory
root_dir = Path(__file__).resolve().parent.parent.parent
env_path = root_dir / '.env'
load_dotenv(dotenv_path=env_path)

def get_db_connection():
    return psycopg2.connect(
        dbname="hueandme",          # Force the correct database name
        user="postgres",            # Force the correct user
        password="admin123",        # Force the correct password
        host="localhost",
        port="5432"
    )
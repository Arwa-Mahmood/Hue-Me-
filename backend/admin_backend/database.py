# import psycopg2
# import os
# from dotenv import load_dotenv
# from pathlib import Path

# # Load the .env file
# root_dir = Path(__file__).resolve().parent.parent.parent
# env_path = root_dir / '.env'
# load_dotenv(dotenv_path=env_path)

# def get_db_connection():
#     # Railway provides the full connection string in DATABASE_URL
#     database_url = os.getenv("DATABASE_URL")
    
#     if not database_url:
#         raise ValueError("DATABASE_URL is not set in the .env file")
        
#     return psycopg2.connect(database_url)

import psycopg2

def get_db_connection():
    # Replace this string with YOUR actual URL from Railway
    url = "postgresql://postgres:TLizGjDYJHAYUsxUHBdhdXPUHQwDyYcg@reseau.proxy.rlwy.net:17414/railway"
    
    return psycopg2.connect(url)
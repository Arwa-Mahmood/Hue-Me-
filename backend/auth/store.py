import os
import psycopg
from psycopg.rows import dict_row

def _conn():
    url = os.getenv("DATABASE_URL")
    if not url:
        raise RuntimeError("DATABASE_URL is not set")
    return psycopg.connect(url, row_factory=dict_row)

def init_db():
    with _conn() as c:
        c.execute("""
            CREATE TABLE IF NOT EXISTS otps (
                key TEXT PRIMARY KEY,
                code_hash TEXT NOT NULL,
                expires_at TIMESTAMP NOT NULL
            )""")
        c.execute("""
            CREATE TABLE IF NOT EXISTS pending_users (
                email TEXT PRIMARY KEY,
                password_hash TEXT NOT NULL
            )""")

_USER_COLS = ("user_id, email, password_hash, "
              "CASE WHEN is_admin THEN 'admin' ELSE 'user' END AS role")

def get_user(email):
    with _conn() as c:
        return c.execute(
            f"SELECT {_USER_COLS} FROM users WHERE email = %s", (email,)
        ).fetchone()

def create_user(email, password_hash, role="user"):
    name = email.split("@")[0]
    with _conn() as c:
        return c.execute(
            "INSERT INTO users (name, email, password_hash, is_active, is_admin) "
            f"VALUES (%s, %s, %s, TRUE, %s) RETURNING {_USER_COLS}",
            (name, email, password_hash, role == "admin")
        ).fetchone()

def update_password(email, password_hash):
    with _conn() as c:
        c.execute("UPDATE users SET password_hash = %s WHERE email = %s",
                  (password_hash, email))

def save_otp(key, code_hash, expires_at):
    with _conn() as c:
        c.execute(
            "INSERT INTO otps (key, code_hash, expires_at) VALUES (%s, %s, %s) "
            "ON CONFLICT (key) DO UPDATE SET code_hash = EXCLUDED.code_hash, "
            "expires_at = EXCLUDED.expires_at", (key, code_hash, expires_at))

def get_otp(key):
    with _conn() as c:
        return c.execute(
            "SELECT code_hash, expires_at FROM otps WHERE key = %s", (key,)
        ).fetchone()

def delete_otp(key):
    with _conn() as c:
        c.execute("DELETE FROM otps WHERE key = %s", (key,))

def save_pending(email, password_hash):
    with _conn() as c:
        c.execute(
            "INSERT INTO pending_users (email, password_hash) VALUES (%s, %s) "
            "ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash",
            (email, password_hash))

def get_pending(email):
    with _conn() as c:
        return c.execute(
            "SELECT email, password_hash FROM pending_users WHERE email = %s", (email,)
        ).fetchone()

def delete_pending(email):
    with _conn() as c:
        c.execute("DELETE FROM pending_users WHERE email = %s", (email,))
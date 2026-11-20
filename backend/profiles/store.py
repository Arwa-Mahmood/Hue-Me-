import os
import psycopg
from psycopg.rows import dict_row
from psycopg.types.json import Jsonb


def _conn():
    url = os.getenv("DATABASE_URL")
    if not url:
        raise RuntimeError("DATABASE_URL is not set")
    return psycopg.connect(url, row_factory=dict_row)


def init_profiles():
    with _conn() as c:
        c.execute("""
            CREATE TABLE IF NOT EXISTS profiles (
                user_id INTEGER PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
                skin_hex TEXT NOT NULL,
                undertone TEXT NOT NULL,
                detected_undertone TEXT,
                depth TEXT,
                season TEXT,
                confidence REAL,
                saved_colours JSONB NOT NULL DEFAULT '[]',
                updated_at TIMESTAMP NOT NULL DEFAULT now()
            )""")


_COLS = ("skin_hex, undertone, detected_undertone, depth, season, confidence, saved_colours")


def get_profile(user_id):
    with _conn() as c:
        return c.execute(f"SELECT {_COLS} FROM profiles WHERE user_id = %s", (user_id,)).fetchone()


def save_profile(user_id, p):
    with _conn() as c:
        return c.execute(
            f"""INSERT INTO profiles (user_id, skin_hex, undertone, detected_undertone, depth,
                                      season, confidence, saved_colours, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, now())
                ON CONFLICT (user_id) DO UPDATE SET
                    skin_hex = EXCLUDED.skin_hex, undertone = EXCLUDED.undertone,
                    detected_undertone = EXCLUDED.detected_undertone, depth = EXCLUDED.depth,
                    season = EXCLUDED.season, confidence = EXCLUDED.confidence,
                    saved_colours = EXCLUDED.saved_colours, updated_at = now()
                RETURNING {_COLS}""",
            (user_id, p["skin_hex"], p["undertone"], p["detected_undertone"], p["depth"],
             p["season"], p["confidence"], Jsonb(p["saved_colours"])),
        ).fetchone()


def delete_profile(user_id):
    """For delete-account (auth): removes the user's profile."""
    with _conn() as c:
        c.execute("DELETE FROM profiles WHERE user_id = %s", (user_id,))

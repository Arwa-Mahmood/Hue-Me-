import os
from auth import store
from auth.security import hash_password

def seed_admin():
    email = os.getenv("ADMIN_EMAIL", "admin@hueme.com")
    if not store.get_user(email):
        store.create_user(email, hash_password(os.getenv("ADMIN_PASSWORD", "admin1234")), "admin")
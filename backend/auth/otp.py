import secrets
from datetime import datetime, timedelta
from auth.security import hash_password, verify_password
from auth import store

def create_otp(email, purpose="reset") -> str:
    code = f"{secrets.randbelow(10**6):06d}"
    store.save_otp(f"{purpose}:{email}", hash_password(code),
                   datetime.utcnow() + timedelta(minutes=10))
    return code

def check_otp(email, code, purpose="reset") -> bool:
    key = f"{purpose}:{email}"
    row = store.get_otp(key)
    if not row or row["expires_at"] < datetime.utcnow():
        return False
    if not verify_password(code, row["code_hash"]):
        return False
    store.delete_otp(key)
    return True
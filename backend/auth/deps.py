from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from auth.security import decode_token
from auth import store

bearer = HTTPBearer()

def get_current_user(creds=Depends(bearer)):
    try:
        data = decode_token(creds.credentials)
    except Exception:
        raise HTTPException(401, "Invalid or expired token")
    user = store.get_user(data["sub"])
    if not user:
        raise HTTPException(401, "User not found")
    return user

def require_admin(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(403, "Admin only")
    return user
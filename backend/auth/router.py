from fastapi import APIRouter, Depends, HTTPException
from auth.schemas import SignupIn, LoginIn, ForgotIn, ResetIn, TokenOut, UserOut, VerifyIn
from auth.security import hash_password, verify_password, create_token
from auth.otp import create_otp, check_otp
from auth.email_utils import send_otp
from auth.deps import get_current_user
from auth import store

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", status_code=202)
def signup(data: SignupIn):
    email = data.email.lower()
    if store.get_user(email):
        raise HTTPException(409, "Email already registered")
    store.save_pending(email, hash_password(data.password))
    send_otp(email, create_otp(email, "signup"))
    return {"message": "Verification code sent"}


@router.post("/verify-signup", response_model=TokenOut, status_code=201)
def verify_signup(data: VerifyIn):
    email = data.email.lower()
    pending = store.get_pending(email)
    if not pending or not check_otp(email, data.otp, "signup"):
        raise HTTPException(400, "Invalid or expired code")
    user = store.create_user(email, pending["password_hash"])
    store.delete_pending(email)
    return TokenOut(access_token=create_token(email, user["role"]), role=user["role"])


@router.post("/login", response_model=TokenOut)
def login(data: LoginIn):
    user = store.get_user(data.email.lower())
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(401, "Invalid email or password")
    return TokenOut(access_token=create_token(user["email"], user["role"]), role=user["role"])


@router.post("/forgot-password")
def forgot_password(data: ForgotIn):
    email = data.email.lower()
    if store.get_user(email):
        send_otp(email, create_otp(email))
    return {"message": "If that email exists, a code has been sent"}


@router.post("/reset-password")
def reset_password(data: ResetIn):
    email = data.email.lower()
    if not store.get_user(email) or not check_otp(email, data.otp):
        raise HTTPException(400, "Invalid or expired code")
    store.update_password(email, hash_password(data.new_password))
    return {"message": "Password updated"}


@router.get("/me", response_model=UserOut)
def me(user=Depends(get_current_user)):
    return user
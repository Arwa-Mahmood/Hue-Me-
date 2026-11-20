import smtplib, os
from email.message import EmailMessage

def send_otp(to: str, code: str):
    host = os.getenv("SMTP_HOST")
    if not host:                      # no SMTP configured: print to terminal
        print(f"[DEV] OTP for {to}: {code}")
        return
    msg = EmailMessage()
    msg["Subject"] = "Hue&Me verification code"
    msg["From"] = os.getenv("SMTP_FROM")
    msg["To"] = to
    msg.set_content(f"Your Hue&Me code is {code}. It expires in 10 minutes.")
    try:
        with smtplib.SMTP(host, 587, timeout=15) as s:
            s.starttls()
            s.login(os.getenv("SMTP_LOGIN"), os.getenv("SMTP_PASS"))
            s.send_message(msg)
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
        print(f"[DEV FALLBACK] OTP for {to}: {code}")
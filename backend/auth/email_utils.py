import os, json, urllib.request

def send_otp(to: str, code: str):
    key = os.getenv("BREVO_API_KEY")
    if not key:                       # no key: print to terminal
        print(f"[DEV] OTP for {to}: {code}")
        return
    body = json.dumps({
        "sender": {"email": os.getenv("SMTP_FROM"), "name": "Hue&Me"},
        "to": [{"email": to}],
        "subject": "Hue&Me verification code",
        "textContent": f"Your Hue&Me code is {code}. It expires in 10 minutes.",
    }).encode()
    req = urllib.request.Request(
        "https://api.brevo.com/v3/smtp/email", data=body,
        headers={"api-key": key, "content-type": "application/json",
                 "accept": "application/json"})
    try:
        urllib.request.urlopen(req, timeout=15)
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
        print(f"[DEV FALLBACK] OTP for {to}: {code}")
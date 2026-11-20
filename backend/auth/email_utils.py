import json, smtplib, os, urllib.request
from email.message import EmailMessage
from email.utils import parseaddr

SUBJECT = "Hue&Me verification code"
BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


def _body(code: str) -> str:
    return f"Your Hue&Me code is {code}. It expires in 10 minutes."


def _send_via_brevo_api(to: str, code: str, api_key: str):
    # Brevo's HTTP API goes over HTTPS (port 443), which hosts like Railway don't block
    # the way they block SMTP. Uses the same Brevo account; needs an API key (xkeysib-...).
    name, sender = parseaddr(os.getenv("SMTP_FROM", ""))
    payload = {
        "sender": {"email": sender, "name": name or "Hue&Me"},
        "to": [{"email": to}],
        "subject": SUBJECT,
        "textContent": _body(code),
    }
    req = urllib.request.Request(
        BREVO_API_URL,
        data=json.dumps(payload).encode(),
        headers={"api-key": api_key, "Content-Type": "application/json", "Accept": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=15) as r:
        r.read()


def _send_via_smtp(to: str, code: str, host: str):
    msg = EmailMessage()
    msg["Subject"] = SUBJECT
    msg["From"] = os.getenv("SMTP_FROM")
    msg["To"] = to
    msg.set_content(_body(code))
    with smtplib.SMTP(host, 587, timeout=15) as s:
        s.starttls()
        s.login(os.getenv("SMTP_LOGIN"), os.getenv("SMTP_PASS"))
        s.send_message(msg)


def send_otp(to: str, code: str):
    api_key = os.getenv("BREVO_API_KEY")
    host = os.getenv("SMTP_HOST")
    if not api_key and not host:      # no email configured: print to terminal
        print(f"[DEV] OTP for {to}: {code}")
        return
    try:
        if api_key:
            _send_via_brevo_api(to, code, api_key)
        else:
            _send_via_smtp(to, code, host)
    except Exception as e:
        detail = e.read().decode(errors="replace") if hasattr(e, "read") else ""
        print(f"[EMAIL ERROR] {e} {detail}".strip())
        print(f"[DEV FALLBACK] OTP for {to}: {code}")

# The ONLY file that knows where data lives.
# Keep these function names and return shapes when swapping to a database.
# A user is a dict: {"email", "password_hash", "role"}

_users = {}
_otps = {}

def get_user(email):
    return _users.get(email)

def create_user(email, password_hash, role="user"):
    _users[email] = {"email": email, "password_hash": password_hash, "role": role}
    return _users[email]

def update_password(email, password_hash):
    _users[email]["password_hash"] = password_hash

def save_otp(email, code_hash, expires_at):
    _otps[email] = {"code_hash": code_hash, "expires_at": expires_at}

def get_otp(email):
    return _otps.get(email)

def delete_otp(email):
    _otps.pop(email, None)

_pending = {}

def save_pending(email, password_hash):
    _pending[email] = {"password_hash": password_hash}

def get_pending(email):
    return _pending.get(email)

def delete_pending(email):
    _pending.pop(email, None)
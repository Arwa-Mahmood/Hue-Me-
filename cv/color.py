import math

# ---------- hex -> RGB -> LAB ----------
def hex_to_rgb(hex_code):
    h = hex_code.strip().lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if len(h) != 6:
        raise ValueError("Invalid hex code")
    try:
        return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
    except ValueError:
        raise ValueError("Invalid hex code")

def rgb_to_lab(r, g, b):
    def lin(c):
        c /= 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    R, G, B = lin(r), lin(g), lin(b)
    X = (0.4124564*R + 0.3575761*G + 0.1804375*B) / 0.95047
    Y = (0.2126729*R + 0.7151522*G + 0.0721750*B)
    Z = (0.0193339*R + 0.1191920*G + 0.9503041*B) / 1.08883
    def f(t):
        return t ** (1/3) if t > 0.008856 else 7.787 * t + 16/116
    fx, fy, fz = f(X), f(Y), f(Z)
    return (116*fy - 16, 500*(fx - fy), 200*(fy - fz))

def hex_to_lab(hex_code):
    return rgb_to_lab(*hex_to_rgb(hex_code))

# ---------- ITA and depth ----------
def calculate_ita(lab):
    L, a, b = lab
    return math.degrees(math.atan2(L - 50, b))

def depth_from_ita(ita):
    if ita > 28:
        return "light"
    if ita > 10:
        return "tan"
    return "deep"

# ---------- undertone ----------
# Starting thresholds on the hue angle. TUNE THESE with real skin hex values.
COOL_MAX = 45
NEUTRAL_MAX = 55
WARM_MAX = 65

def hue_angle(lab):
    _, a, b = lab
    return math.degrees(math.atan2(b, a))

def classify_undertone(lab):
    h = hue_angle(lab)
    if h < COOL_MAX:
        return "cool"
    if h < NEUTRAL_MAX:
        return "neutral"
    if h < WARM_MAX:
        return "warm"
    return "olive"

# ---------- season ----------
SEASON_TABLE = {
    ("warm", "light"): "Spring",
    ("warm", "tan"): "Autumn",
    ("warm", "deep"): "Autumn",
    ("cool", "light"): "Summer",
    ("cool", "tan"): "Winter",
    ("cool", "deep"): "Winter",
    ("neutral", "light"): "Summer",
    ("neutral", "tan"): "Autumn",
    ("neutral", "deep"): "Winter",
    ("olive", "light"): "Autumn",
    ("olive", "tan"): "Autumn",
    ("olive", "deep"): "Winter",
}

def map_season(undertone, depth):
    return SEASON_TABLE[(undertone, depth)]

# ---------- confidence ----------
def confidence(lab):
    h = hue_angle(lab)
    d = min(abs(h - t) for t in (COOL_MAX, NEUTRAL_MAX, WARM_MAX))
    return round(min(1.0, 0.5 + d / 10), 2)

# ---------- one function for everyone ----------
def analyse_hex(hex_code):
    lab = hex_to_lab(hex_code)
    ita = calculate_ita(lab)
    depth = depth_from_ita(ita)
    undertone = classify_undertone(lab)
    return {
        "lab": [round(x, 2) for x in lab],
        "ita": round(ita, 1),
        "depth": depth,
        "undertone": undertone,
        "season": map_season(undertone, depth),
        "confidence": confidence(lab),
    }

# ---------- Sprint 2: product matching ----------
def delta_e(lab1, lab2):
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(lab1, lab2)))
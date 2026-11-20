import csv
import math
import pytest
from color import (
    hex_to_lab,
    calculate_ita,
    depth_from_ita,
    hue_angle,
    classify_undertone,
    map_season,
    confidence,
    analyse_hex,
    delta_e,
    COOL_MAX,
    NEUTRAL_MAX,
    WARM_MAX,
)


# ---------------------------------------------------------------------------
# 1. Color space conversion: hex -> RGB -> CIELAB
# ---------------------------------------------------------------------------

def test_white_lab():
    L, a, b = hex_to_lab("#FFFFFF")
    assert L == pytest.approx(100.0, abs=0.5)
    assert a == pytest.approx(0.0, abs=0.5)
    assert b == pytest.approx(0.0, abs=0.5)


def test_black_lab():
    L, a, b = hex_to_lab("#000000")
    assert L == pytest.approx(0.0, abs=0.5)
    assert a == pytest.approx(0.0, abs=0.5)
    assert b == pytest.approx(0.0, abs=0.5)


def test_pure_red_lab():
    L, a, b = hex_to_lab("#FF0000")
    assert L == pytest.approx(53.2, abs=0.5)
    assert a == pytest.approx(80.1, abs=0.5)
    assert b == pytest.approx(67.2, abs=0.5)


def test_three_digit_and_no_hash_hex():
    assert hex_to_lab("#FFF") == hex_to_lab("#FFFFFF")
    assert hex_to_lab("FFFFFF") == hex_to_lab("#FFFFFF")
    assert hex_to_lab("  #e0ac69 ") == hex_to_lab("#E0AC69")


@pytest.mark.parametrize("bad_hex", ["", "#12", "#GGGGGG", "hello", "#1234567"])
def test_invalid_hex_raises_value_error(bad_hex):
    with pytest.raises(ValueError, match="Invalid hex code"):
        hex_to_lab(bad_hex)


# ---------------------------------------------------------------------------
# 2. ITA angle & skin depth classification
# ---------------------------------------------------------------------------

def test_calculate_ita_and_depth_boundaries():
    assert calculate_ita((70.0, 5.0, 20.0)) == pytest.approx(45.0, abs=0.1)
    assert depth_from_ita(40.0) == "light"
    assert depth_from_ita(28.0) == "tan"     # > 28 is light; 28 falls into tan
    assert depth_from_ita(20.0) == "tan"
    assert depth_from_ita(10.0) == "deep"    # > 10 is tan; 10 falls into deep
    assert depth_from_ita(-10.0) == "deep"


# ---------------------------------------------------------------------------
# 3. Undertone classification & hue-angle thresholds
# ---------------------------------------------------------------------------

COOL_HEX    = "#D9A5A0"   # pink-leaning, hue angle < 45
NEUTRAL_HEX = "#C8A99A"   # muted mid-tone, inside [45, 55)
WARM_HEX    = "#B5651D"   # golden/orange-leaning, inside [55, 65)
OLIVE_HEX   = "#C19A6B"   # high b*, low a* (greenish lean), >= 65


@pytest.mark.parametrize("hex_code,expected_undertone", [
    (COOL_HEX, "cool"),
    (NEUTRAL_HEX, "neutral"),
    (WARM_HEX, "warm"),
    (OLIVE_HEX, "olive"),
])
def test_undertone_known_hexes(hex_code, expected_undertone):
    lab = hex_to_lab(hex_code)
    assert classify_undertone(lab) == expected_undertone


def _lab_at_hue(deg, L=60.0):
    rad = math.radians(deg)
    return (L, math.cos(rad), math.sin(rad))


@pytest.mark.parametrize("deg,expected", [
    (44.0, "cool"),
    (45.0, "neutral"),
    (54.9, "neutral"),
    (55.0, "warm"),
    (64.9, "warm"),
    (65.0, "olive"),
])
def test_hue_angle_band_boundaries(deg, expected):
    assert classify_undertone(_lab_at_hue(deg)) == expected


def test_thresholds_are_locked():
    assert COOL_MAX == 45
    assert NEUTRAL_MAX == 55
    assert WARM_MAX == 65


# ---------------------------------------------------------------------------
# 4. Seasonal palette mapping & end-to-end analyse_hex
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("undertone,depth", [
    ("warm", "light"), 
    ("warm", "tan"), 
    ("warm", "deep"),
    ("cool", "light"), 
    ("cool", "tan"), 
    ("cool", "deep"),
    ("neutral", "light"), 
    ("neutral", "tan"), 
    ("neutral", "deep"),
    ("olive", "light"), 
    ("olive", "tan"), 
    ("olive", "deep"),
])
def test_season_table_covers_all_combinations(undertone, depth):
    assert map_season(undertone, depth) in {"Spring", "Summer", "Autumn", "Winter"}


def test_analyse_hex_end_to_end():
    res = analyse_hex("#E0AC69")
    assert set(res.keys()) == {"lab", "ita", "depth", "undertone", "season", "confidence"}
    assert res["depth"] == "light"
    assert res["undertone"] == "olive"
    assert res["season"] == "Autumn"
    assert 0.5 <= res["confidence"] <= 1.0


def test_delta_e_distance():
    lab = hex_to_lab("#C68642")
    assert delta_e(lab, lab) == 0.0
    assert delta_e(hex_to_lab("#FFFFFF"), hex_to_lab("#000000")) == pytest.approx(100.0, abs=1.0)

# #pytests tests

# import pytest
# from color import *

# # Known LAB values from colour science references
# def test_white():
#     L, a, b = hex_to_lab("#FFFFFF")
#     assert L == pytest.approx(100, abs=0.5)
#     assert a == pytest.approx(0, abs=0.5)
#     assert b == pytest.approx(0, abs=0.5)

# def test_black():
#     assert hex_to_lab("#000000")[0] == pytest.approx(0, abs=0.5)

# def test_red():
#     L, a, b = hex_to_lab("#FF0000")
#     assert L == pytest.approx(53.2, abs=0.5)
#     assert a == pytest.approx(80.1, abs=0.5)
#     assert b == pytest.approx(67.2, abs=0.5)

# def test_three_digit_hex():
#     assert hex_to_lab("#FFF") == hex_to_lab("#FFFFFF")

# def test_no_hash():
#     assert hex_to_lab("FFFFFF") == hex_to_lab("#FFFFFF")

# @pytest.mark.parametrize("bad", ["", "#12", "#GGGGGG", "hello", "#1234567"])
# def test_invalid_hex(bad):
#     with pytest.raises(ValueError):
#         hex_to_lab(bad)

# def test_depth_boundaries():
#     assert depth_from_ita(40) == "light"
#     assert depth_from_ita(20) == "tan"
#     assert depth_from_ita(0) == "deep"

# def test_delta_e_same_colour_is_zero():
#     lab = hex_to_lab("#C68642")
#     assert delta_e(lab, lab) == 0

# def test_delta_e_far_colours():
#     assert delta_e(hex_to_lab("#FFFFFF"), hex_to_lab("#000000")) == pytest.approx(100, abs=1)

# def test_analyse_returns_all_keys():
#     r = analyse_hex("#E0AC69")
#     assert set(r) == {"lab", "ita", "depth", "undertone", "season", "confidence"}
#     assert r["season"] in {"Spring", "Summer", "Autumn", "Winter"}

import math
import pytest


import math

from color import (
    hex_to_lab, hue_angle, classify_undertone,
    COOL_MAX, NEUTRAL_MAX, WARM_MAX,
    analyse_hex, map_season,
)

# ---------------------------------------------------------------------------
# Undertone classification tests
#
# Hexes below were chosen to land clearly inside each hue-angle band.
# If a threshold is tuned later, update the expected label here deliberately.
# ---------------------------------------------------------------------------

COOL_HEX    = "#D9A5A0"   # pink-leaning, hue angle well below COOL_MAX
NEUTRAL_HEX = "#C8A99A"   # muted mid-tone, sits inside [COOL_MAX, NEUTRAL_MAX)
WARM_HEX    = "#B5651D"   # golden/orange-leaning, inside [NEUTRAL_MAX, WARM_MAX)
OLIVE_HEX   = "#C19A6B"   # high b*, low a* (greenish lean), above WARM_MAX


def test_undertone_cool():
    lab = hex_to_lab(COOL_HEX)
    assert hue_angle(lab) < COOL_MAX
    assert classify_undertone(lab) == "cool"


def test_undertone_neutral():
    lab = hex_to_lab(NEUTRAL_HEX)
    h = hue_angle(lab)
    assert COOL_MAX <= h < NEUTRAL_MAX
    assert classify_undertone(lab) == "neutral"


def test_undertone_warm():
    lab = hex_to_lab(WARM_HEX)
    h = hue_angle(lab)
    assert NEUTRAL_MAX <= h < WARM_MAX
    assert classify_undertone(lab) == "warm"


def test_undertone_olive():
    lab = hex_to_lab(OLIVE_HEX)
    assert hue_angle(lab) >= WARM_MAX
    assert classify_undertone(lab) == "olive"


# ---------------------------------------------------------------------------
# Boundary behaviour of the hue-angle bands
# ---------------------------------------------------------------------------

def _lab_at_hue(deg, L=60.0):
    """Synthetic LAB with a chosen hue angle (a, b on the unit circle)."""
    rad = math.radians(deg)
    return (L, math.cos(rad), math.sin(rad))


@pytest.mark.parametrize("deg,expected", [
    (44.0, "cool"),
    (45.0, "neutral"),   # exactly COOL_MAX is the first non-cool value
    (45.5, "neutral"),
    (54.9, "neutral"),
    (55.0, "warm"),      # exactly NEUTRAL_MAX is the first warm value
    (55.5, "warm"),
    (64.9, "warm"),
    (65.0, "olive"),     # exactly WARM_MAX is the first olive value
    (66.0, "olive"),
])
def test_hue_angle_band_boundaries(deg, expected):
    assert classify_undertone(_lab_at_hue(deg)) == expected


def test_thresholds_are_locked():
    # If you change these, update every test above and add a note in
    # THRESHOLDS.md explaining the new values and the labelled set used.
    assert COOL_MAX == 45
    assert NEUTRAL_MAX == 55
    assert WARM_MAX == 65


# ---------------------------------------------------------------------------
# End-to-end: analyse_hex returns the expected undertone
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("hex_code,expected_undertone", [
    (COOL_HEX, "cool"),
    (NEUTRAL_HEX, "neutral"),
    (WARM_HEX, "warm"),
    (OLIVE_HEX, "olive"),
])
def test_analyse_hex_undertone_end_to_end(hex_code, expected_undertone):
    result = analyse_hex(hex_code)
    assert result["undertone"] == expected_undertone
    assert result["season"] in {"Spring", "Summer", "Autumn", "Winter"}


# ---------------------------------------------------------------------------
# Season table covers all undertone x depth combinations
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

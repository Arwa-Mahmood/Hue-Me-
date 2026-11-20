import re
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator

from auth.deps import get_current_user
from cv.color import analyse_hex, map_season   # Arwa's colour module
from profiles import store

router = APIRouter(prefix="/profile", tags=["profile"])

Undertone = Literal["warm", "cool", "neutral", "olive"]
HEX = re.compile(r"^#?([0-9a-fA-F]{6})$")


def _clean_hex(v: str) -> str:
    m = HEX.match(v.strip())
    if not m:
        raise ValueError("Enter a 6-digit hex code like #E0AC69")
    return "#" + m.group(1).upper()


class SavedColour(BaseModel):
    name: str
    hex: str

    @field_validator("hex")
    @classmethod
    def check_hex(cls, v):
        return _clean_hex(v)


class ProfileIn(BaseModel):
    skin_hex: str
    undertone: Undertone | None = None   # user's choice; detected from the hex if left out
    saved_colours: list[SavedColour] = []

    @field_validator("skin_hex")
    @classmethod
    def check_skin_hex(cls, v):
        return _clean_hex(v)


class ProfileOut(BaseModel):
    skin_hex: str
    undertone: str            # what the user chose (or the detected one)
    detected_undertone: str   # what Arwa's analysis found
    depth: str
    season: str
    confidence: float
    saved_colours: list[SavedColour]


@router.get("", response_model=ProfileOut)
def get_profile(user=Depends(get_current_user)):
    profile = store.get_profile(user["user_id"])
    if not profile:
        raise HTTPException(404, "No profile saved yet")
    return profile


@router.post("", response_model=ProfileOut)
@router.put("", response_model=ProfileOut)
def save_profile(data: ProfileIn, user=Depends(get_current_user)):
    result = analyse_hex(data.skin_hex)
    undertone = data.undertone or result["undertone"]
    return store.save_profile(user["user_id"], {
        "skin_hex": data.skin_hex,
        "undertone": undertone,
        "detected_undertone": result["undertone"],
        "depth": result["depth"],
        # a corrected undertone recalculates the season
        "season": map_season(undertone, result["depth"]),
        "confidence": result["confidence"],
        "saved_colours": [c.model_dump() for c in data.saved_colours],
    })

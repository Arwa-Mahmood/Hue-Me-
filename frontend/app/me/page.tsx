"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Undertone = "warm" | "cool" | "neutral" | "olive";

interface SavedColour {
  name: string;
  hex: string;
}

interface UserProfile {
  skin_hex: string;
  undertone: Undertone;
  season?: string;
  saved_colours: SavedColour[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const SKIN_SWATCHES: SavedColour[] = [
  { name: "Porcelain", hex: "#FFDFC4" },
  { name: "Warm Ivory", hex: "#F5D0B9" },
  { name: "Golden Sand", hex: "#F1C27D" },
  { name: "Honey Tan", hex: "#E0AC69" },
  { name: "Olive Caramel", hex: "#C19A6B" },
  { name: "Warm Bronze", hex: "#C68642" },
  { name: "Rich Umber", hex: "#8D5524" },
  { name: "Deep Espresso", hex: "#6B4226" },
];

export default function MePage() {
  const router = useRouter();
  const [user, setUser] = useState({ name: "Arwa", email: "user@hueme.app" });
  const [detailsOpen, setDetailsOpen] = useState(true);

  const [skinHex, setSkinHex] = useState("#E0AC69");
  const [undertone, setUndertone] = useState<Undertone>("warm");
  const [favouriteColours, setFavouriteColours] = useState<SavedColour[]>([]);
  const [colourLabel, setColourLabel] = useState("");
  const [colourHex, setColourHex] = useState("#C96A7B");

  const [savedProfile, setSavedProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    const storedEmail = localStorage.getItem("user_email");
    if (storedName || storedEmail) {
      setUser({
        name: storedName || "Arwa",
        email: storedEmail || "user@hueme.app",
      });
    }

    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/profile`, {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : { "X-User-Id": "1" },
        });
        if (res.ok) {
          const data: UserProfile = await res.json();
          setSavedProfile(data);
          if (data.skin_hex) setSkinHex(data.skin_hex);
          if (data.undertone) setUndertone(data.undertone);
          if (data.saved_colours) setFavouriteColours(data.saved_colours);
          return;
        }
      } catch {
        // Fallback to localStorage if backend endpoint isn't live yet
      }

      const cached = localStorage.getItem("hueme_profile");
      if (cached) {
        const parsed: UserProfile = JSON.parse(cached);
        setSavedProfile(parsed);
        setSkinHex(parsed.skin_hex);
        setUndertone(parsed.undertone);
        setFavouriteColours(parsed.saved_colours || []);
      }
    };

    loadProfile();
  }, []);

  const handleAddColour = () => {
    setError(null);
    const formatted = colourHex.trim().startsWith("#")
      ? colourHex.trim().toUpperCase()
      : `#${colourHex.trim().toUpperCase()}`;

    if (!/^#[0-9A-F]{6}$/.test(formatted)) {
      setError("Enter a valid 6-digit hex code (e.g. #C96A7B).");
      return;
    }

    const name = colourLabel.trim() || `Shade ${favouriteColours.length + 1}`;
    setFavouriteColours((prev) => [...prev, { name, hex: formatted }]);
    setColourLabel("");
  };

  const handleRemoveColour = (idx: number) => {
    setFavouriteColours((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const formattedSkin = skinHex.trim().startsWith("#")
      ? skinHex.trim().toUpperCase()
      : `#${skinHex.trim().toUpperCase()}`;

    if (!/^#[0-9A-F]{6}$/.test(formattedSkin)) {
      setError("Enter a valid 6-digit skin hex code (e.g. #E0AC69).");
      return;
    }

    setSaving(true);
    const payload: UserProfile = {
      skin_hex: formattedSkin,
      undertone,
      saved_colours: favouriteColours,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : { "X-User-Id": "1" }),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.detail || `Backend error (${res.status})`);
      }

      const saved: UserProfile = await res.json();
      setSavedProfile(saved);
      localStorage.setItem("hueme_profile", JSON.stringify(saved));
      setMessage("Saved to your Hue-Me profile.");
    } catch (err: unknown) {
      setSavedProfile(payload);
      localStorage.setItem("hueme_profile", JSON.stringify(payload));
      setMessage(
        `Saved locally (${
          err instanceof Error ? err.message : "Backend offline"
        }).`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    router.push("/login");
  };

  return (
    <>
      <style>{`
        .hueme-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #F8F1E7 0%, #F3E6D8 100%);
          color: #3B2118;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          padding: 36px 16px 64px;
        }
        .hueme-container {
          max-width: 580px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .hueme-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 14px;
          border-bottom: 1.5px solid #E5CFC5;
        }
        .hueme-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .hueme-title {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #3B2118;
          margin: 0;
        }
        .hueme-pill-badge {
          background: #F9DCE2;
          color: #6E2F3B;
          border: 1px solid #ECB9C5;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .hueme-card {
          background: #FFFBF7;
          border: 1.5px solid #E8D3CA;
          border-radius: 22px;
          box-shadow: 0 8px 24px rgba(59, 33, 24, 0.06);
          overflow: hidden;
        }
        .hueme-profile-row {
          padding: 20px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: linear-gradient(135deg, #FFFBF7 60%, #FBE8EC 100%);
        }
        .hueme-avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #F5CCD5;
          border: 2px solid #3B2118;
          color: #3B2118;
          font-weight: 700;
          font-size: 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .hueme-accordion-btn {
          width: 100%;
          background: #FBE9ED;
          border: none;
          border-bottom: 1.5px solid #E8D3CA;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          cursor: pointer;
          color: #3B2118;
          transition: background 0.15s ease;
        }
        .hueme-accordion-btn:hover {
          background: #F8DCE3;
        }
        .hueme-form {
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .hueme-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #6B4437;
          margin-bottom: 8px;
        }
        .hueme-swatch-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        @media (max-width: 500px) {
          .hueme-swatch-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .hueme-swatch-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 10px;
          border-radius: 12px;
          border: 1.5px solid #E4CFC5;
          background: #FAF4EE;
          color: #3B2118;
          font-size: 11.5px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .hueme-swatch-btn:hover {
          border-color: #D48496;
          background: #FDF0F3;
        }
        .hueme-swatch-btn.active {
          border-color: #3B2118;
          background: #F9DCE2;
          font-weight: 700;
        }
        .hueme-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }
        .hueme-color-picker {
          width: 44px;
          height: 42px;
          padding: 2px;
          border-radius: 12px;
          border: 1.5px solid #D9BFB4;
          background: #FFFBF7;
          cursor: pointer;
          flex-shrink: 0;
        }
        .hueme-text-input {
          height: 42px;
          border-radius: 12px;
          border: 1.5px solid #D9BFB4;
          background: #FAF4EE;
          color: #3B2118;
          padding: 0 12px;
          font-size: 13.5px;
          outline: none;
          width: 100%;
        }
        .hueme-text-input:focus {
          border-color: #C96A7B;
          background: #FFFFFF;
        }
        .hueme-tone-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .hueme-tone-btn {
          height: 40px;
          border-radius: 12px;
          border: 1.5px solid #D9BFB4;
          background: #FAF4EE;
          color: #3B2118;
          font-size: 13px;
          font-weight: 600;
          text-transform: capitalize;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .hueme-tone-btn:hover {
          background: #FBE8EC;
          border-color: #D48496;
        }
        .hueme-tone-btn.active {
          background: #3B2118;
          color: #FDF5EE;
          border-color: #3B2118;
        }
        .hueme-add-btn {
          height: 42px;
          padding: 0 16px;
          border-radius: 12px;
          border: 1.5px solid #D48496;
          background: #F9DCE2;
          color: #3B2118;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }
        .hueme-add-btn:hover {
          background: #F4C4CF;
        }
        .hueme-chip-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }
        .hueme-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #FBE9ED;
          border: 1.5px solid #E6B8C3;
          padding: 5px 11px;
          border-radius: 999px;
          font-size: 12px;
          color: #3B2118;
        }
        .hueme-save-btn {
          width: 100%;
          height: 46px;
          border-radius: 14px;
          border: none;
          background: #3B2118;
          color: #FDF6EE;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.02em;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(59, 33, 24, 0.18);
          transition: background 0.15s ease;
        }
        .hueme-save-btn:hover:not(:disabled) {
          background: #522E22;
        }
        .hueme-save-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .hueme-footer-row {
          padding: 15px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13.5px;
          color: #5C3A2E;
          border-bottom: 1px solid #EFE0D8;
        }
        .hueme-logout-btn {
          width: 100%;
          padding: 15px 22px;
          background: transparent;
          border: none;
          text-align: left;
          font-size: 14px;
          font-weight: 700;
          color: #B43B52;
          cursor: pointer;
        }
        .hueme-logout-btn:hover {
          background: #FBE9ED;
        }
      `}</style>

      <div className="hueme-page">
        <div className="hueme-container">
          <header className="hueme-header">
            <div className="hueme-brand">
              <h1 className="hueme-title">ME</h1>
              <span className="hueme-pill-badge">Hue-Me Studio</span>
            </div>
            <span style={{ fontSize: "12px", color: "#7A5548", fontWeight: 500 }}>
              Language: English
            </span>
          </header>

          {/* Account Summary Card */}
          <section className="hueme-card">
            <div className="hueme-profile-row">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className="hueme-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "16px" }}>
                    {user.name}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "#7A5548" }}>
                    {user.email}
                  </p>
                </div>
              </div>

              {savedProfile ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#F9DCE2",
                    border: "1.5px solid #E3A7B5",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: savedProfile.skin_hex,
                      border: "1.5px solid #3B2118",
                    }}
                  />
                  <span style={{ textTransform: "capitalize" }}>
                    {savedProfile.season || `${savedProfile.undertone} undertone`}
                  </span>
                </div>
              ) : (
                <span style={{ fontSize: "12px", color: "#8C685B" }}>
                  No colours saved yet
                </span>
              )}
            </div>
          </section>

          {/* Details (Optional) Card */}
          <section className="hueme-card">
            <button
              type="button"
              onClick={() => setDetailsOpen((prev) => !prev)}
              className="hueme-accordion-btn"
            >
              <div>
                <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>
                  Details (optional)
                </h2>
                <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#6B4437" }}>
                  Enter your skin hex code, undertone, and shades that flatter you
                </p>
              </div>
              <span
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#FFFBF7",
                  border: "1.5px solid #D9BFB4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                }}
              >
                {detailsOpen ? "−" : "+"}
              </span>
            </button>

            {detailsOpen && (
              <form onSubmit={handleSave} className="hueme-form">
                {/* Skin Hex */}
                <div>
                  <label className="hueme-label">
                    Skin Shade Hex Code (Optional)
                  </label>
                  <div className="hueme-swatch-grid">
                    {SKIN_SWATCHES.map((s) => (
                      <button
                        key={s.hex}
                        type="button"
                        onClick={() => setSkinHex(s.hex)}
                        className={`hueme-swatch-btn ${
                          skinHex.toUpperCase() === s.hex ? "active" : ""
                        }`}
                      >
                        <span
                          style={{
                            width: "14px",
                            height: "14px",
                            borderRadius: "50%",
                            backgroundColor: s.hex,
                            border: "1px solid #6B4437",
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {s.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="hueme-input-row">
                    <input
                      type="color"
                      value={/^#[0-9A-Fa-f]{6}$/.test(skinHex) ? skinHex : "#E0AC69"}
                      onChange={(e) => setSkinHex(e.target.value.toUpperCase())}
                      className="hueme-color-picker"
                    />
                    <input
                      type="text"
                      value={skinHex}
                      onChange={(e) => setSkinHex(e.target.value)}
                      placeholder="#E0AC69"
                      className="hueme-text-input"
                      style={{ fontFamily: "monospace" }}
                    />
                  </div>
                </div>

                {/* Undertone */}
                <div>
                  <label className="hueme-label">Undertone</label>
                  <div className="hueme-tone-grid">
                    {(["warm", "cool", "neutral", "olive"] as Undertone[]).map(
                      (tone) => (
                        <button
                          key={tone}
                          type="button"
                          onClick={() => setUndertone(tone)}
                          className={`hueme-tone-btn ${
                            undertone === tone ? "active" : ""
                          }`}
                        >
                          {tone}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Favourite Colours */}
                <div>
                  <label className="hueme-label">
                    Colours That Look Good on Me
                  </label>
                  <div className="hueme-input-row" style={{ marginTop: 0 }}>
                    <input
                      type="text"
                      value={colourLabel}
                      onChange={(e) => setColourLabel(e.target.value)}
                      placeholder="Label (e.g. Dusty Rose, Espresso)"
                      className="hueme-text-input"
                    />
                    <input
                      type="color"
                      value={
                        /^#[0-9A-Fa-f]{6}$/.test(colourHex)
                          ? colourHex
                          : "#C96A7B"
                      }
                      onChange={(e) => setColourHex(e.target.value.toUpperCase())}
                      className="hueme-color-picker"
                    />
                    <input
                      type="text"
                      value={colourHex}
                      onChange={(e) => setColourHex(e.target.value)}
                      className="hueme-text-input"
                      style={{ width: "105px", fontFamily: "monospace", fontSize: "12.5px" }}
                    />
                    <button
                      type="button"
                      onClick={handleAddColour}
                      className="hueme-add-btn"
                    >
                      + Add
                    </button>
                  </div>

                  {favouriteColours.length > 0 && (
                    <div className="hueme-chip-wrap">
                      {favouriteColours.map((c, i) => (
                        <span key={`${c.hex}-${i}`} className="hueme-chip">
                          <span
                            style={{
                              width: "13px",
                              height: "13px",
                              borderRadius: "50%",
                              backgroundColor: c.hex,
                              border: "1px solid #3B2118",
                            }}
                          />
                          <strong style={{ fontWeight: 600 }}>{c.name}</strong>
                          <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#6B4437" }}>
                            {c.hex}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveColour(i)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#B43B52",
                              fontWeight: 800,
                              cursor: "pointer",
                              padding: "0 2px",
                            }}
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {error && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12.5px",
                      color: "#9E2A3F",
                      background: "#FDE7EC",
                      border: "1px solid #E6A4B3",
                      borderRadius: "12px",
                      padding: "10px 12px",
                    }}
                  >
                    {error}
                  </p>
                )}

                {message && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12.5px",
                      color: "#3B2118",
                      background: "#F5E6D8",
                      border: "1px solid #D6B8A3",
                      borderRadius: "12px",
                      padding: "10px 12px",
                      fontWeight: 600,
                    }}
                  >
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="hueme-save-btn"
                >
                  {saving ? "Saving..." : "Save Details"}
                </button>
              </form>
            )}
          </section>

          {/* Settings & Logout Card */}
          <section className="hueme-card">
            <div className="hueme-footer-row">
              <span>Accessibility</span>
              <span className="hueme-pill-badge">Sprint 2</span>
            </div>
            <div className="hueme-footer-row">
              <span>Privacy &amp; Data</span>
              <span style={{ fontSize: "12px", color: "#7A5548" }}>
                Selfies never stored
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="hueme-logout-btn"
            >
              Logout
            </button>
          </section>
        </div>
      </div>
    </>
  );
}
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { colornames as colorNameList } from "color-name-list";
import { API_URL, ApiError, auth, clearSession, getToken } from "@/lib/api";

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

const DEFAULT_SUGGESTIONS: SavedColour[] = [
  { name: "Dusty Rose", hex: "#C96A7B" },
  { name: "Terracotta", hex: "#E2725B" },
  { name: "Olive Green", hex: "#556B2F" },
  { name: "Emerald", hex: "#50C878" },
  { name: "Navy Blue", hex: "#000080" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Warm Beige", hex: "#F5F5DC" },
  { name: "Espresso", hex: "#4E312D" },
];

export default function MePage() {
  const router = useRouter();
  const [user, setUser] = useState({ name: "", email: "" });
  const [authChecked, setAuthChecked] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);

  const [skinHex, setSkinHex] = useState("#E0AC69");
  const [undertone, setUndertone] = useState<Undertone>("warm");

  const [favouriteColours, setFavouriteColours] = useState<SavedColour[]>([]);
  const [colourSearch, setColourSearch] = useState("");
  const [selectedName, setSelectedName] = useState("Dusty Rose");
  const [selectedHex, setSelectedHex] = useState("#C96A7B");

  const [savedProfile, setSavedProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Not logged in -> send to /login. Logged in -> confirm the token with the backend.
    if (!getToken()) {
      window.location.replace("/login"); // /login is a static page (public/auth), so use a full navigation
      return;
    }

    const loadUser = async () => {
      try {
        const me = await auth.me();
        const name = localStorage.getItem("user_name") || me.email.split("@")[0];
        setUser({ name, email: me.email });
        localStorage.setItem("user_email", me.email);
        setAuthChecked(true);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          // Expired or invalid token
          clearSession();
          window.location.replace("/login"); // /login is a static page (public/auth), so use a full navigation
          return;
        }
        // Backend unreachable or /auth/me failing: fall back to what we saved at login
        const email = localStorage.getItem("user_email") || "";
        setUser({ name: localStorage.getItem("user_name") || email.split("@")[0], email });
        setAuthChecked(true);
      }
    };
    loadUser();

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
        // Fallback to localStorage if backend isn't connected yet
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
  }, [router]);

  // Searches 30,000+ shades from color-name-list, ranking exact/prefix matches first
  const filteredSuggestions = useMemo(() => {
    const q = colourSearch.trim().toLowerCase();
    if (!q) return DEFAULT_SUGGESTIONS;

    const startsWith: SavedColour[] = [];
    const includes: SavedColour[] = [];

    for (const c of colorNameList) {
      const lower = c.name.toLowerCase();
      if (lower === q || lower.startsWith(q)) {
        startsWith.push({ name: c.name, hex: c.hex.toUpperCase() });
      } else if (lower.includes(q) || c.hex.toLowerCase().includes(q)) {
        includes.push({ name: c.name, hex: c.hex.toUpperCase() });
      }
      if (startsWith.length >= 12) break;
    }

    return [...startsWith, ...includes].slice(0, 12);
  }, [colourSearch]);

  const handleSelectSuggestion = (item: SavedColour) => {
    setError(null);
    setSelectedName(item.name);
    setSelectedHex(item.hex);
  };

  const handleSpectrumChange = (newHex: string) => {
    const upper = newHex.toUpperCase();
    setSelectedHex(upper);
    const exactMatch = colorNameList.find(
      (c) => c.hex.toUpperCase() === upper
    );
    if (exactMatch) {
      setSelectedName(exactMatch.name);
    }
  };

  const handleAddColour = () => {
    setError(null);
    const formatted = selectedHex.trim().startsWith("#")
      ? selectedHex.trim().toUpperCase()
      : `#${selectedHex.trim().toUpperCase()}`;

    if (!/^#[0-9A-F]{6}$/.test(formatted)) {
      setError("Enter a valid 6-digit hex code (e.g. #C96A7B).");
      return;
    }

    const name = selectedName.trim() || `Shade ${favouriteColours.length + 1}`;
    const alreadyExists = favouriteColours.some(
      (c) => c.hex === formatted && c.name.toLowerCase() === name.toLowerCase()
    );
    if (alreadyExists) {
      setError(`${name} (${formatted}) is already in your list.`);
      return;
    }

    setFavouriteColours((prev) => [...prev, { name, hex: formatted }]);
    setColourSearch("");
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
      setMessage("Saved to your Railway profile.");
    } catch (err: unknown) {
      setSavedProfile(payload);
      localStorage.setItem("hueme_profile", JSON.stringify(payload));
      setMessage(
        `Saved locally on this browser (connect Railway URL in .env.local to sync to DB — ${
          err instanceof Error ? err.message : "Backend offline"
        }).`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    window.location.replace("/login"); // /login is a static page (public/auth), so use a full navigation
  };

  // Don't flash the page before we know who is logged in
  if (!authChecked) {
    return (
      <div className="me-loading">
        Loading…
        <style>{`.me-loading{min-height:100vh;display:flex;align-items:center;justify-content:center;
          background:#FBEFEA url("/me/bg-small.jpg") center/cover no-repeat;color:#7A6560;
          font-family:var(--font-inter),system-ui,sans-serif;font-size:15px}`}</style>
      </div>
    );
  }

  const initial = (user.name || user.email || "?").charAt(0).toUpperCase();

  return (
    <>
      <style>{ME_STYLES}</style>

      <div className="me-page">
        <header className="me-topbar">
          <div className="me-brand">
            <span className="me-logo">Hue&amp;Me</span>
            <span className="me-pill">Hue&amp;Me Studio</span>
          </div>
          <label className="me-lang">
            <span>Language:</span>
            <select aria-label="Language" defaultValue="en">
              <option value="en">English</option>
            </select>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </label>
        </header>

        <main className="me-container">
          {/* Profile */}
          <section className="me-card me-profile">
            <div className="me-banner" />
            <div className="me-profile-body">
              <div className="me-avatar" aria-hidden="true">{initial}</div>
              <div className="me-who">
                <h1 className="me-name">{user.name}</h1>
                <p className="me-email">{user.email}</p>
              </div>
              {savedProfile ? (
                <span className="me-pill me-status">
                  <span className="me-dot" style={{ backgroundColor: savedProfile.skin_hex }} />
                  <span style={{ textTransform: "capitalize" }}>
                    {savedProfile.season || `${savedProfile.undertone} undertone`}
                  </span>
                </span>
              ) : (
                <span className="me-pill me-status">No colours saved yet</span>
              )}
            </div>
          </section>

          {/* Details (optional) */}
          <section className="me-card me-details">
            <button
              type="button"
              className="me-details-head"
              onClick={() => setDetailsOpen((prev) => !prev)}
              aria-expanded={detailsOpen}
            >
              <span>
                <span className="me-h2">Details (optional)</span>
                <span className="me-sub">
                  Enter your skin hex code, undertone, and shades that flatter you
                </span>
              </span>
              <span className="me-toggle" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10.5" />
                  <path d="M7.5 12h9" />
                  {!detailsOpen && <path d="M12 7.5v9" />}
                </svg>
              </span>
            </button>

            {detailsOpen && (
              <form onSubmit={handleSave} className="me-form">
                {/* Skin shade */}
                <div className="me-section">
                  <p className="me-label">Skin shade hex code (optional)</p>
                  <div className="me-swatches" role="radiogroup" aria-label="Skin shade">
                    {SKIN_SWATCHES.map((s) => {
                      const active = skinHex.toUpperCase() === s.hex;
                      return (
                        <button
                          key={s.hex}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setSkinHex(s.hex)}
                          className={`me-swatch ${active ? "active" : ""}`}
                        >
                          <span className="me-swatch-circle" style={{ backgroundColor: s.hex }}>
                            {active && (
                              <span className="me-check" aria-hidden="true">
                                <svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9" /></svg>
                              </span>
                            )}
                          </span>
                          <span className="me-swatch-name">{s.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="me-hex-row">
                    <span className="me-hex-caption">Or fine-tune</span>
                    <input
                      type="color"
                      value={/^#[0-9A-Fa-f]{6}$/.test(skinHex) ? skinHex : "#E0AC69"}
                      onChange={(e) => setSkinHex(e.target.value.toUpperCase())}
                      className="me-color"
                      aria-label="Fine-tune skin shade"
                      title="Fine-tune skin shade"
                    />
                    <input
                      type="text"
                      value={skinHex}
                      onChange={(e) => setSkinHex(e.target.value)}
                      placeholder="#E0AC69"
                      className="me-input me-hex"
                      aria-label="Skin hex code"
                    />
                  </div>
                </div>

                {/* Undertone */}
                <div className="me-section">
                  <p className="me-label">Undertone</p>
                    <div className="me-segment" role="radiogroup" aria-label="Undertone">
                      {(["warm", "cool", "neutral", "olive"] as Undertone[]).map((tone) => (
                        <button
                          key={tone}
                          type="button"
                          role="radio"
                          aria-checked={undertone === tone}
                          onClick={() => setUndertone(tone)}
                          className={undertone === tone ? "active" : ""}
                        >
                          {tone}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Colours that look good on me */}
                <div className="me-section">
                  <p className="me-label">Colours that look good on me</p>
                  <p className="me-hint">
                    Search any shade across 30,000+ named colours, pick a match, and fine-tune if needed.
                  </p>

                  <div className="me-search">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="11" cy="11" r="7" />
                      <path d="M20 20l-4-4" />
                    </svg>
                    <input
                      type="search"
                      value={colourSearch}
                      onChange={(e) => setColourSearch(e.target.value)}
                      placeholder="Search any shade (e.g. dusty rose, terracotta, sage, navy)..."
                      className="me-input"
                      aria-label="Search colours"
                    />
                  </div>

                  <div className="me-pills">
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((item) => {
                        const selected =
                          selectedHex.toUpperCase() === item.hex && selectedName === item.name;
                        return (
                          <button
                            key={`${item.name}-${item.hex}`}
                            type="button"
                            onClick={() => handleSelectSuggestion(item)}
                            className={`me-shade ${selected ? "selected" : ""}`}
                            style={
                              selected
                                ? undefined
                                : { backgroundColor: item.hex, color: textOn(item.hex) }
                            }
                            title={item.hex}
                            aria-pressed={selected}
                          >
                            {item.name}
                          </button>
                        );
                      })
                    ) : (
                      <span className="me-hint" style={{ margin: 0 }}>
                        No exact name match — adjust the shade below and click + Add.
                      </span>
                    )}
                  </div>

                  <div className="me-selected">
                    <span className="me-selected-label">Selected shade</span>
                    <input
                      type="text"
                      value={selectedName}
                      onChange={(e) => setSelectedName(e.target.value)}
                      placeholder="Shade name"
                      className="me-input me-selected-name"
                      aria-label="Selected shade name"
                    />
                    <input
                      type="color"
                      value={/^#[0-9A-Fa-f]{6}$/.test(selectedHex) ? selectedHex : "#C96A7B"}
                      onChange={(e) => handleSpectrumChange(e.target.value)}
                      className="me-color"
                      aria-label="Adjust selected shade"
                      title="Adjust shade on spectrum"
                    />
                    <input
                      type="text"
                      value={selectedHex}
                      onChange={(e) => setSelectedHex(e.target.value)}
                      className="me-input me-hex"
                      aria-label="Selected shade hex code"
                    />
                    <button type="button" onClick={handleAddColour} className="me-add">
                      <span aria-hidden="true">+</span> Add
                    </button>
                  </div>

                  {favouriteColours.length > 0 && (
                    <div className="me-saved">
                      {favouriteColours.map((c, i) => (
                        <span key={`${c.hex}-${i}`} className="me-chip">
                          <span className="me-dot" style={{ backgroundColor: c.hex }} />
                          <span>{c.name}</span>
                          <span className="me-chip-hex">{c.hex}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveColour(i)}
                            aria-label={`Remove ${c.name}`}
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {error && <p className="me-note me-error" role="alert">{error}</p>}
                {message && <p className="me-note me-ok" role="status">{message}</p>}

                <button type="submit" disabled={saving} className="me-save">
                  {saving ? "Saving..." : "Save Details"}
                </button>
              </form>
            )}
          </section>

          {/* Settings & logout */}
          <section className="me-card me-settings">
            <div className="me-setting">
              <span>Accessibility</span>
              <span className="me-pill">Coming soon</span>
            </div>
            <div className="me-setting">
              <span>Privacy &amp; Data</span>
              <span className="me-muted">Selfies never stored</span>
            </div>
            <button type="button" onClick={handleLogout} className="me-logout">
              Logout
            </button>
          </section>
        </main>
      </div>
    </>
  );
}

// Dark text on light colour pills, white text on dark ones
function textOn(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  if (Number.isNaN(n)) return "#3A1F1A";
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.36 ? "#3A1F1A" : "#FFFFFF";
}

const ME_STYLES = `
  .me-page {
    --ink: #3A1F1A;
    --muted: #7A6560;
    --line: #EAD7D6;
    --field: rgba(255, 238, 243, 0.72);
    --field-line: #EBCFD7;
    --pink: #F2A7BE;
    --pink-hover: #EC95B0;
    --pill: #FBDDE6;
    --soft-ink: #4A3430;
    min-height: 100vh;
    min-height: 100dvh;
    color: var(--ink);
    font-family: var(--font-inter), system-ui, -apple-system, "Segoe UI", sans-serif;
    font-size: 16px;
    line-height: 1.45;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #FBEFEA url("/me/bg.jpg") center / cover no-repeat fixed;
    padding-bottom: 56px;
  }
  @media (max-width: 700px) {
    .me-page { background-image: url("/me/bg-small.jpg"); background-attachment: scroll; }
  }
  .me-page *, .me-page *::before, .me-page *::after { box-sizing: border-box; }
  .me-page :where(button, input, select) { font: inherit; color: inherit; }  /* :where keeps this reset weaker than the classes below */
  .me-page :where(button) { cursor: pointer; }
  .me-page :focus-visible { outline: 2px solid #C96A8A; outline-offset: 2px; }

  /* Top bar */
  .me-topbar {
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    padding: 28px 48px 8px;
  }
  .me-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .me-logo {
    font-family: var(--font-young-serif), Georgia, serif;
    font-size: 40px; line-height: 1; letter-spacing: -0.01em; color: var(--ink);
  }
  .me-pill {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px; border-radius: 999px;
    background: var(--pill); color: var(--ink);
    font-size: 15px; white-space: nowrap;
  }
  .me-lang { position: relative; display: flex; align-items: center; gap: 4px; font-size: 16px; }
  .me-lang select {
    appearance: none; -webkit-appearance: none;
    border: 0; background: transparent; padding: 11px 22px 11px 2px;
    color: #8A5A4A; cursor: pointer;
  }
  .me-lang svg {
    position: absolute; right: 2px; width: 16px; height: 16px; pointer-events: none;
    fill: none; stroke: #8A5A4A; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
  }

  .me-container { max-width: 920px; margin: 0 auto; padding: 24px 16px 0; display: flex; flex-direction: column; gap: 24px; }

  /* Frosted glass (from your snippet: blur 14px + saturate 160%, white edge, inner highlight, shadow),
     tuned for our light background. The blur sits on ::before, behind the content, so the text
     itself is not drawn inside the blurred layer and stays crisp. */
  .me-card {
    position: relative; isolation: isolate;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.42);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 12px 32px rgba(120, 80, 110, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.7);
  }
  .me-card::before {
    content: ""; position: absolute; inset: 0; z-index: -1; border-radius: inherit; pointer-events: none;
    -webkit-backdrop-filter: blur(14px) saturate(160%);
    backdrop-filter: blur(14px) saturate(160%);
  }

  /* Profile card */
  .me-profile { overflow: hidden; }
  .me-banner {
    height: 88px;
    background: linear-gradient(90deg, #F9DDD3 0%, #F5B8CF 38%, #E9C1EA 70%, #CED6F7 100%);
  }
  .me-profile-body {
    position: relative; display: flex; align-items: flex-end; gap: 18px;
    padding: 0 32px 26px 180px; min-height: 108px;
  }
  .me-avatar {
    position: absolute; left: 30px; top: -48px;
    width: 128px; height: 128px; border-radius: 50%;
    display: grid; place-items: center;
    background: radial-gradient(circle at 35% 30%, #FBD3DF, #F4B3C9);
    border: 6px solid #FFF7F7;
    box-shadow: 0 8px 22px rgba(170, 100, 120, 0.22);
    font-family: var(--font-young-serif), Georgia, serif;
    font-size: 64px; line-height: 1; color: var(--ink);
  }
  .me-who { flex: 1; min-width: 0; padding-top: 14px; }
  .me-name {
    margin: 0; font-family: var(--font-young-serif), Georgia, serif; font-weight: 400;
    font-size: 34px; line-height: 1.1; overflow-wrap: anywhere;
  }
  .me-email { margin: 4px 0 0; color: var(--muted); font-size: 16px; overflow-wrap: anywhere; }
  .me-status { margin-bottom: 18px; }
  .me-dot { width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid rgba(58, 31, 26, 0.55); flex-shrink: 0; }

  /* Details card */
  .me-details-head {
    width: 100%; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
    padding: 30px 32px 22px; background: none; border: 0; text-align: left;
  }
  .me-h2 { display: block; font-family: var(--font-young-serif), Georgia, serif; font-size: 28px; line-height: 1.2; }
  .me-sub { display: block; margin-top: 8px; font-size: 16px; color: var(--muted); }
  .me-toggle { flex-shrink: 0; width: 34px; height: 34px; margin-top: 2px; }
  .me-toggle svg { width: 100%; height: 100%; fill: none; stroke: var(--ink); stroke-width: 1.5; stroke-linecap: round; }

  .me-form { display: flex; flex-direction: column; padding: 0 32px 32px; }
  /* Each part of the form is its own calm block, separated by a thin line */
  .me-section { padding: 30px 0 32px; border-top: 1px solid var(--line); }
  .me-label {
    margin: 0 0 18px; font-size: 13px; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase; color: var(--soft-ink);
  }
  .me-hint { margin: -10px 0 18px; font-size: 15px; color: var(--muted); }
  .me-muted { color: var(--muted); font-size: 15px; }

  .me-input {
    width: 100%; height: 42px; padding: 0 14px;
    background: var(--field); border: 1px solid var(--field-line); border-radius: 12px;
    font-size: 16px; color: var(--ink); outline: none;
    transition: border-color .15s, box-shadow .15s, background .15s;
  }
  .me-input::placeholder { color: #9A8285; }
  .me-input:focus { background: #FFF6F9; border-color: #E39AB3; box-shadow: 0 0 0 3px rgba(242, 167, 190, 0.25); }
  .me-hex { max-width: 180px; font-variant-numeric: tabular-nums; }

  /* Skin swatches */
  .me-swatches { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 22px 10px; }
  .me-swatch {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    padding: 4px 0; background: none; border: 0; border-radius: 14px;
  }
  .me-swatch-circle {
    position: relative; width: 64px; height: 64px; max-width: 100%; aspect-ratio: 1;
    border-radius: 50%; box-shadow: inset 0 0 0 1px rgba(58, 31, 26, 0.08);
    transition: transform .15s;
  }
  .me-swatch:hover .me-swatch-circle { transform: scale(1.05); }
  .me-swatch.active .me-swatch-circle { box-shadow: 0 0 0 3px #FFF8F6, 0 0 0 5.5px var(--ink); }
  .me-check {
    position: absolute; top: -6px; right: -6px; width: 22px; height: 22px; border-radius: 50%;
    display: grid; place-items: center; background: var(--ink); border: 2px solid #FFF8F6;
  }
  .me-check svg { width: 13px; height: 13px; fill: none; stroke: #fff; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
  .me-swatch-name { font-size: 14px; color: var(--ink); text-align: center; line-height: 1.2; }
  .me-swatch.active .me-swatch-name { font-weight: 600; }
  @media (min-width: 761px) { .me-swatch-name { white-space: nowrap; } }

  .me-hex-row { display: flex; align-items: center; gap: 14px; margin-top: 26px; }
  .me-hex-caption { font-size: 15px; color: var(--muted); margin-right: 4px; }
  .me-color {
    width: 42px; height: 42px; flex-shrink: 0; padding: 0; cursor: pointer;
    border: 1px solid rgba(58, 31, 26, 0.12); border-radius: 8px; background: none;
  }
  .me-color::-webkit-color-swatch-wrapper { padding: 0; }
  .me-color::-webkit-color-swatch { border: 0; border-radius: 7px; }
  .me-color::-moz-color-swatch { border: 0; border-radius: 7px; }

  /* Undertone segmented control */
  .me-segment {
    display: grid; grid-template-columns: repeat(4, 1fr); max-width: 560px;
    padding: 4px; border: 1px solid #DCC8C8; border-radius: 999px; background: rgba(255, 255, 255, 0.5);
  }
  .me-segment button {
    height: 46px; border: 1px solid transparent; border-radius: 999px; background: none;
    font-size: 17px; text-transform: capitalize; transition: background .15s;
  }
  .me-segment button:hover { background: rgba(242, 167, 190, 0.15); }
  .me-segment button.active { background: #F9CFDB; border-color: #E9A9BC; }

  /* Search + colour pills */
  .me-search { position: relative; }
  .me-search svg {
    position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px;
    fill: none; stroke: var(--ink); stroke-width: 1.8; stroke-linecap: round;
  }
  .me-search .me-input { height: 50px; padding-left: 48px; border-radius: 999px; }
  .me-search input::-webkit-search-cancel-button { cursor: pointer; }

  .me-pills { display: flex; flex-wrap: wrap; gap: 14px 12px; margin-top: 22px; }
  .me-shade {
    height: 42px; padding: 0 18px; border-radius: 999px; border: 2px solid transparent;
    font-size: 17px; white-space: nowrap; transition: transform .12s, box-shadow .12s;
  }
  .me-shade:hover { transform: translateY(-1px); box-shadow: 0 4px 10px rgba(58, 31, 26, 0.12); }
  .me-shade.selected { background: #FCE6EC; color: var(--ink); border-color: var(--ink); }

  /* "Selected shade" sits in its own soft panel so it reads as one step */
  .me-selected {
    display: grid; grid-template-columns: 1fr 42px 130px auto;
    gap: 12px; align-items: center; margin-top: 26px;
    padding: 18px 18px 20px; border-radius: 16px;
    background: rgba(253, 238, 242, 0.45); border: 1px solid var(--line);
  }
  .me-selected-label { grid-column: 1 / -1; font-size: 15px; color: var(--muted); }
  .me-selected .me-hex { max-width: none; }
  .me-add {
    height: 42px; padding: 0 18px; border: 0; border-radius: 10px;
    background: var(--pink); color: var(--ink); font-size: 17px; white-space: nowrap;
    box-shadow: 0 4px 10px rgba(236, 149, 176, 0.25); transition: background .15s;
  }
  .me-add:hover { background: var(--pink-hover); }

  .me-saved { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
  .me-chip {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 6px 6px 12px; border-radius: 999px;
    background: #FFF7F9; border: 1px solid var(--field-line); font-size: 15px;
  }
  .me-chip-hex { color: var(--muted); font-size: 13px; font-variant-numeric: tabular-nums; }
  .me-chip button {
    width: 36px; height: 36px; margin: -4px -2px -4px 0; border-radius: 50%; border: 0; background: none;
    color: #B43B52; font-size: 18px; line-height: 1;
  }
  .me-chip button:hover { background: #FBE3EA; }

  .me-note { margin: 0 0 16px; padding: 12px 14px; border-radius: 12px; font-size: 15px; }
  .me-error { color: #9E2A3F; background: #FDE7EC; border: 1px solid #EDB3C1; }
  .me-ok { color: var(--ink); background: #FFF3EC; border: 1px solid #EBD3C4; }

  .me-save {
    width: 100%; height: 56px; border: 0; border-radius: 14px;
    background: var(--pink); color: var(--ink); font-size: 21px; font-weight: 500;
    box-shadow: 0 8px 18px rgba(236, 149, 176, 0.35);
    transition: background .15s, transform .05s;
  }
  .me-save:hover:not(:disabled) { background: var(--pink-hover); }
  .me-save:active:not(:disabled) { transform: translateY(1px); }
  .me-save:disabled { opacity: .6; cursor: wait; }

  /* Settings card */
  .me-settings { padding: 8px 32px; }
  .me-setting {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    min-height: 64px; border-bottom: 1px solid var(--line); font-size: 19px;
  }
  .me-logout {
    display: block; width: 100%; min-height: 64px; padding: 0;
    background: none; border: 0; text-align: left; font-size: 19px; color: #B4697A;
  }
  .me-logout:hover { color: #9E4F62; text-decoration: underline; text-underline-offset: 4px; }

  /* Tablets */
  @media (max-width: 760px) {
    .me-swatches { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px 10px; }
    .me-segment { max-width: none; }
    .me-selected { grid-template-columns: 42px 1fr auto; }
    .me-selected-name { grid-column: 1 / -1; }
  }

  /* Phones */
  @media (max-width: 520px) {
    .me-topbar { padding: 18px 16px 4px; flex-wrap: wrap; row-gap: 4px; }
    .me-logo { font-size: 32px; }
    .me-pill { font-size: 13px; padding: 5px 11px; }
    .me-lang { font-size: 15px; }
    .me-container { padding-top: 16px; gap: 20px; }
    .me-banner { height: 72px; }
    .me-profile-body { flex-wrap: wrap; align-items: center; padding: 0 20px 22px 128px; min-height: 64px; }
    .me-avatar { width: 92px; height: 92px; top: -40px; left: 20px; font-size: 46px; border-width: 5px; }
    .me-who { padding-top: 12px; }
    .me-name { font-size: 26px; }
    .me-email { font-size: 14px; }
    .me-status { margin: 10px 0 0 -108px; }
    .me-details-head { padding: 24px 20px 18px; }
    .me-h2 { font-size: 24px; }
    .me-sub, .me-hint { font-size: 15px; }
    .me-form { padding: 0 20px 24px; }
    .me-section { padding: 26px 0 28px; }
    .me-swatch-circle { width: 56px; height: 56px; }
    .me-swatch-name { font-size: 13px; }
    .me-hex-row { flex-wrap: wrap; row-gap: 10px; }
    .me-hex-caption { width: 100%; }
    .me-segment button { height: 42px; font-size: 15px; }
    .me-pills { gap: 12px 10px; }
    .me-shade { height: 40px; padding: 0 16px; font-size: 15px; }
    .me-selected { grid-template-columns: 42px 1fr; padding: 16px; }
    .me-add { grid-column: 1 / -1; height: 44px; }
    .me-save { height: 52px; font-size: 19px; }
    .me-settings { padding: 4px 20px; }
    .me-setting, .me-logout { font-size: 17px; min-height: 56px; }
  }
`;

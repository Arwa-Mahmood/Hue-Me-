"use client";
import { useEffect, useRef, useState } from "react";
import { API_URL, ApiError, auth, clearSession, getToken } from "@/lib/api";

const CATEGORIES = ["Foundation", "Concealer", "Lipstick", "Blush"];
const HEX = /^#[0-9A-Fa-f]{6}$/;

export default function AdminPage() {
  // Integration: only logged-in admins can use this page
  const [allowed, setAllowed] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  useEffect(() => {
    if (!getToken()) return window.location.replace("/login");
    auth.me()
      .then((me) => {
        if (me.role !== "admin") return window.location.replace("/me");
        setAdminEmail(me.email);
        setAllowed(true);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) window.location.replace("/login");
      });
  }, []);

  const [formData, setFormData] = useState({
    brand: "",
    name: "",
    category: "Foundation",
    product_type: "Liquid",
    buy_link: "",
    shade_name: "",
    shade_hex: "#E3B98F", // Beige default
    undertone: "warm",
  });

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Settings menu (top right)
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    clearSession();
    window.location.replace("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!HEX.test(formData.shade_hex)) {
      setMessage("❌ Enter a valid 6-digit hex code (e.g. #E3B98F).");
      return;
    }
    setMessage("Adding product...");
    setSubmitting(true);

    const payload = {
      brand: formData.brand,
      name: formData.name,
      category: formData.category,
      product_type: formData.product_type,
      buy_link: formData.buy_link,
      shades: [
        {
          shade_name: formData.shade_name,
          shade_hex: formData.shade_hex.toUpperCase(),
          lab_l: 0,
          lab_a: 0,
          lab_b: 0,
          undertone: formData.undertone,
        },
      ],
    };

    try {
      const response = await fetch(`${API_URL}/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage("✅ Product added to Railway database!");
      } else {
        setMessage(
          response.status === 401 || response.status === 403
            ? "❌ Your admin session has expired. Please log in again."
            : "❌ Error adding product. Check backend console."
        );
      }
    } catch {
      setMessage("❌ Could not connect to backend.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!allowed) return null;

  const set = (key: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setFormData({ ...formData, [key]: e.target.value });

  const previewHex = HEX.test(formData.shade_hex) ? formData.shade_hex : "#E3B98F";
  const buyHref = /^https?:\/\/\S+\.\S+/.test(formData.buy_link) ? formData.buy_link : "";
  const status = message.startsWith("✅") ? "ok" : message.startsWith("❌") ? "err" : "info";
  const cleanMessage = message.replace(/^(✅|❌)\s*/, "");

  return (
    <div className="ad-page">
      <style>{AD_STYLES}</style>

      <header className="ad-topbar">
        <div className="ad-brand">
          <span className="ad-logo">Hue&amp;Me</span>
          <span className="ad-badge">Admin</span>
        </div>
        <div className="ad-actions" ref={menuRef}>
          <span className="ad-avatar" title={adminEmail} aria-label={`Signed in as ${adminEmail}`}>
            {(adminEmail || "A").charAt(0).toUpperCase()}
          </span>
          <button
            type="button"
            className="ad-icon-btn"
            aria-label="Settings"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
          {menuOpen && (
            <div className="ad-menu" role="menu">
              <p className="ad-menu-email">{adminEmail}</p>
              <button type="button" role="menuitem" onClick={handleLogout}>
                Log out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="ad-layout">
        {/* Form */}
        <section className="ad-glass ad-form-card">
          <h1 className="ad-title">Add Product</h1>
          <p className="ad-sub">Add a product and its shade to the catalogue</p>

          <form onSubmit={handleSubmit} className="ad-form">
            <label className="ad-field">
              <span className="ad-label">Brand</span>
              <input type="text" placeholder="Brand" required className="ad-input"
                value={formData.brand} onChange={set("brand")} />
            </label>

            <label className="ad-field">
              <span className="ad-label">Product name</span>
              <input type="text" placeholder="Product Name" required className="ad-input"
                value={formData.name} onChange={set("name")} />
            </label>

            <label className="ad-field">
              <span className="ad-label">Category</span>
              <span className="ad-select">
                <select className="ad-input" value={formData.category} onChange={set("category")}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
              </span>
            </label>

            <label className="ad-field">
              <span className="ad-label">Shade name</span>
              <input type="text" placeholder="Shade Name (e.g. 220 Natural Beige)" required className="ad-input"
                value={formData.shade_name} onChange={set("shade_name")} />
            </label>

            <div className="ad-field">
              <span className="ad-label" id="shade-colour-label">Shade colour</span>
              <div className="ad-colour-row">
                <span className="ad-swatch">
                  <input type="color" value={previewHex} aria-label="Pick shade colour"
                    onChange={(e) => setFormData({ ...formData, shade_hex: e.target.value.toUpperCase() })} />
                </span>
                <input type="text" className="ad-input ad-hex" aria-labelledby="shade-colour-label"
                  value={formData.shade_hex} maxLength={7} spellCheck={false}
                  onChange={(e) => {
                    const v = e.target.value.trim();
                    setFormData({ ...formData, shade_hex: (v.startsWith("#") ? v : `#${v}`).toUpperCase() });
                  }} />
              </div>
            </div>

            <label className="ad-field">
              <span className="ad-label">Buy link</span>
              <span className="ad-icon-input">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <input type="url" placeholder="Buy Link (https://...)" className="ad-input" inputMode="url"
                  value={formData.buy_link} onChange={set("buy_link")} />
              </span>
            </label>

            {message && <p className={`ad-note ${status}`} role="status">{cleanMessage}</p>}

            <button type="submit" className="ad-submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add Product"}
            </button>
          </form>
        </section>

        {/* Live preview */}
        <aside className="ad-glass ad-preview-card" aria-label="Preview">
          <p className="ad-label ad-preview-label">Preview</p>
          <div className="ad-preview">
            <div className="ad-sphere" style={{ backgroundColor: previewHex }} />
            <div className="ad-preview-text">
              {formData.brand ? <p className="ad-p-brand">{formData.brand}</p> : <span className="ad-skel" style={{ width: "55%" }} />}
              {formData.name ? <p className="ad-p-name">{formData.name}</p> : <span className="ad-skel" style={{ width: "100%" }} />}
              {formData.shade_name ? <p className="ad-p-shade">{formData.shade_name} · {previewHex}</p> : <span className="ad-skel" style={{ width: "70%" }} />}
            </div>
            <div className="ad-preview-foot">
              <span className="ad-chip">{formData.category}</span>
              {buyHref ? (
                <a className="ad-buy" href={buyHref} target="_blank" rel="noopener noreferrer">Buy</a>
              ) : (
                <span className="ad-buy disabled" title="Add a buy link to enable">Buy</span>
              )}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

const AD_STYLES = `
  .ad-page {
    --ink: #3A1F1A;
    --soft-ink: #4A3430;
    --muted: #7E6763;
    --field: rgba(255, 238, 243, 0.72);
    --field-line: #EBCFD7;
    --pink: #F2A7BE;
    --pink-hover: #EC95B0;
    min-height: 100vh;
    min-height: 100dvh;
    color: var(--ink);
    font-family: var(--font-inter), system-ui, -apple-system, "Segoe UI", sans-serif;
    font-size: 16px;
    line-height: 1.45;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #FBEFEA url("/me/bg.jpg") center / cover no-repeat fixed;
    padding-bottom: 64px;
  }
  @media (max-width: 700px) {
    .ad-page { background-image: url("/me/bg-small.jpg"); background-attachment: scroll; }
  }
  .ad-page *, .ad-page *::before, .ad-page *::after { box-sizing: border-box; }
  .ad-page :where(button, input, select) { font: inherit; color: inherit; }
  .ad-page :where(button) { cursor: pointer; }
  .ad-page :focus-visible { outline: 2px solid #C96A8A; outline-offset: 2px; }

  /* Top bar */
  .ad-topbar {
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    padding: 12px 40px;
    background: rgba(255, 255, 255, 0.32);
    border-bottom: 1px solid rgba(255, 255, 255, 0.7);
  }
  .ad-brand { display: flex; align-items: center; gap: 14px; }
  .ad-logo { font-family: var(--font-young-serif), Georgia, serif; font-size: 30px; line-height: 1; }
  .ad-badge {
    padding: 4px 12px; border-radius: 999px; background: #4A2A22; color: #F8E7DB;
    font-size: 14px; font-weight: 500;
  }
  .ad-actions { position: relative; display: flex; align-items: center; gap: 14px; }
  .ad-avatar {
    width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center;
    background: radial-gradient(circle at 35% 30%, #FBD3DF, #F0AFC5);
    border: 2px solid #fff; box-shadow: 0 4px 12px rgba(170, 100, 120, 0.2);
    font-family: var(--font-young-serif), Georgia, serif; font-size: 17px;
  }
  .ad-icon-btn {
    width: 44px; height: 44px; display: grid; place-items: center;
    border: 0; border-radius: 12px; background: transparent;
  }
  .ad-icon-btn:hover { background: rgba(255, 255, 255, 0.55); }
  .ad-icon-btn svg { width: 22px; height: 22px; fill: none; stroke: var(--ink); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
  .ad-menu {
    position: absolute; right: 0; top: calc(100% + 8px); z-index: 10; min-width: 220px;
    padding: 8px; border-radius: 16px;
    background: rgba(255, 252, 251, 0.97); border: 1px solid rgba(235, 207, 215, 0.9);
    box-shadow: 0 16px 40px rgba(120, 80, 100, 0.18);
  }
  .ad-menu-email { margin: 6px 10px 8px; font-size: 13px; color: var(--muted); overflow-wrap: anywhere; }
  .ad-menu button {
    width: 100%; height: 42px; padding: 0 10px; border: 0; border-radius: 10px;
    background: none; text-align: left; color: #B4697A;
  }
  .ad-menu button:hover { background: #FBE9EE; }

  /* Layout */
  .ad-layout {
    max-width: 960px; margin: 0 auto; padding: 40px 24px 0;
    display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 22px; align-items: start;
  }

  /* Frosted glass (from your snippet: blur 14px + saturate 160%, white edge, inner highlight, shadow),
     tuned for our light background. The blur sits on ::before, behind the content, so the text
     itself is not drawn inside the blurred layer and stays crisp. */
  .ad-glass {
    position: relative; isolation: isolate;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.42);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 12px 32px rgba(120, 80, 110, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.7);
  }
  .ad-glass::before {
    content: ""; position: absolute; inset: 0; z-index: -1; border-radius: inherit; pointer-events: none;
    -webkit-backdrop-filter: blur(14px) saturate(160%);
    backdrop-filter: blur(14px) saturate(160%);
  }
  .ad-form-card { padding: 32px 34px 30px; }
  .ad-title { margin: 0; font-family: var(--font-young-serif), Georgia, serif; font-weight: 400; font-size: 36px; line-height: 1.1; }
  .ad-sub { margin: 8px 0 0; font-size: 15px; color: var(--muted); }

  .ad-form { display: flex; flex-direction: column; gap: 18px; margin-top: 26px; }
  .ad-field { display: flex; flex-direction: column; gap: 8px; }
  .ad-label {
    margin: 0; font-size: 12px; font-weight: 500; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--soft-ink);
  }
  .ad-input {
    width: 100%; height: 46px; padding: 0 16px;
    background: var(--field); border: 1px solid var(--field-line); border-radius: 12px;
    font-size: 16px; color: var(--ink); outline: none;
    transition: border-color .15s, box-shadow .15s, background .15s;
  }
  .ad-input::placeholder { color: #9A8285; }
  .ad-input:focus { background: rgba(255, 247, 250, 0.95); border-color: #E39AB3; box-shadow: 0 0 0 3px rgba(242, 167, 190, 0.25); }

  .ad-select { position: relative; display: block; }
  .ad-select select { appearance: none; -webkit-appearance: none; padding-right: 44px; cursor: pointer; }
  .ad-select svg, .ad-icon-input svg { position: absolute; top: 50%; transform: translateY(-50%); pointer-events: none; }
  .ad-select svg { right: 16px; width: 18px; height: 18px; fill: none; stroke: var(--ink); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

  .ad-colour-row { display: flex; gap: 10px; }
  .ad-swatch {
    flex-shrink: 0; width: 46px; height: 46px; padding: 4px; border-radius: 12px;
    background: var(--field); border: 1px solid var(--field-line);
  }
  .ad-swatch input { width: 100%; height: 100%; padding: 0; border: 0; border-radius: 9px; background: none; cursor: pointer; }
  .ad-swatch input::-webkit-color-swatch-wrapper { padding: 0; }
  .ad-swatch input::-webkit-color-swatch { border: 0; border-radius: 9px; }
  .ad-swatch input::-moz-color-swatch { border: 0; border-radius: 9px; }
  .ad-hex { font-variant-numeric: tabular-nums; letter-spacing: 0.02em; }

  .ad-icon-input { position: relative; display: block; }
  .ad-icon-input svg { left: 16px; width: 18px; height: 18px; fill: none; stroke: var(--ink); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .ad-icon-input .ad-input { padding-left: 44px; }

  .ad-note { margin: 0; padding: 10px 14px; border-radius: 12px; font-size: 14px; }
  .ad-note.ok { color: #2F6B3F; background: rgba(226, 245, 231, 0.85); border: 1px solid #BFE0C8; }
  .ad-note.err { color: #9E2A3F; background: rgba(253, 231, 236, 0.9); border: 1px solid #EDB3C1; }
  .ad-note.info { color: var(--soft-ink); background: rgba(255, 255, 255, 0.6); border: 1px solid var(--field-line); }

  .ad-submit {
    height: 50px; margin-top: 6px; border: 0; border-radius: 999px;
    background: var(--pink); color: var(--ink); font-size: 17px; font-weight: 500;
    box-shadow: 0 10px 22px rgba(236, 149, 176, 0.38);
    transition: background .15s, transform .05s;
  }
  .ad-submit:hover:not(:disabled) { background: var(--pink-hover); }
  .ad-submit:active:not(:disabled) { transform: translateY(1px); }
  .ad-submit:disabled { opacity: .65; cursor: wait; }

  /* Preview */
  .ad-preview-card { padding: 24px 20px 20px; position: sticky; top: 24px; }
  .ad-preview-label { margin: 4px 0 16px 4px; }
  .ad-preview {
    padding: 22px 16px 18px; border-radius: 18px;
    background: linear-gradient(170deg, rgba(255, 255, 255, 0.92), rgba(250, 246, 255, 0.86));
    border: 1px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 14px 30px rgba(150, 110, 150, 0.14);
  }
  /* Shade shown as a soft glossy dot in the chosen colour */
  .ad-sphere {
    width: 70%; max-width: 160px; aspect-ratio: 1; margin: 0 auto; border-radius: 50%;
    background-image:
      radial-gradient(circle at 32% 26%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.18) 22%, rgba(255, 255, 255, 0) 42%),
      radial-gradient(circle at 70% 78%, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0) 55%);
    box-shadow: 0 12px 26px rgba(120, 80, 60, 0.18), inset 0 -6px 14px rgba(0, 0, 0, 0.06);
    transition: background-color .2s;
  }
  .ad-preview-text { display: flex; flex-direction: column; gap: 10px; margin: 22px 4px 18px; }
  .ad-skel { display: block; height: 16px; border-radius: 999px; background: #EAE3E5; }
  .ad-p-brand, .ad-p-name, .ad-p-shade { margin: 0; overflow-wrap: anywhere; }
  .ad-p-brand { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
  .ad-p-name { font-family: var(--font-young-serif), Georgia, serif; font-size: 18px; line-height: 1.2; }
  .ad-p-shade { font-size: 14px; color: var(--soft-ink); }
  .ad-preview-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin: 0 4px; }
  .ad-chip { padding: 6px 12px; border-radius: 999px; background: #FBE3EA; font-size: 14px; }
  .ad-buy {
    display: inline-grid; place-items: center; min-width: 60px; height: 40px; padding: 0 14px;
    border-radius: 999px; border: 1.5px solid var(--ink); color: var(--ink);
    font-size: 14px; text-decoration: none; transition: background .15s;
  }
  a.ad-buy:hover { background: rgba(58, 31, 26, 0.06); }
  .ad-buy.disabled { opacity: .45; cursor: not-allowed; }

  /* Tablets and phones: stack the preview under the form */
  @media (max-width: 900px) {
    .ad-layout { grid-template-columns: 1fr; padding-top: 28px; max-width: 560px; }
    .ad-preview-card { position: static; }
    .ad-sphere { max-width: 130px; }
  }
  @media (max-width: 520px) {
    .ad-topbar { padding: 14px 16px; }
    .ad-logo { font-size: 26px; }
    .ad-badge { font-size: 13px; padding: 4px 10px; }
    .ad-layout { padding: 20px 16px 0; gap: 20px; }
    .ad-glass { border-radius: 22px; }
    .ad-form-card { padding: 24px 18px 22px; }
    .ad-title { font-size: 30px; }
    .ad-form { margin-top: 22px; gap: 16px; }
    .ad-input { height: 46px; }
    .ad-preview-card { padding: 24px 16px 18px; }
  }
`;

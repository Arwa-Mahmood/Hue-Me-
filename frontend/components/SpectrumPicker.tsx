"use client";

// Colour spectrum picker that looks and works the same on phones and computers.
// (A plain <input type="color"> opens a different native dialog on Android, with
// Hue/Saturation/Value sliders, so we draw our own: shade square + hue slider + RGB.)
// Styles live in app/globals.css under "Spectrum picker".
import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

type Props = {
  value: string;                  // current colour, e.g. "#E0AC69" (may be half-typed)
  onChange: (hex: string) => void; // called with "#RRGGBB" while the user drags or types
  label: string;                  // what this picker is for, for screen readers and tooltip
  fallback?: string;              // colour to show while `value` is not a full hex yet
};

const HEX = /^#[0-9A-Fa-f]{6}$/;

export default function SpectrumPicker({ value, onChange, label, fallback = "#C96A7B" }: Props) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const hex = (HEX.test(value) ? value : fallback).toUpperCase();
  const n = parseInt(hex.slice(1), 16);
  const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];

  // Eyedropper exists in desktop Chrome/Edge only; show the button only where it works.
  // (The panel only renders after a click in the browser, so reading `window` here is safe.)
  const hasEyeDropper = open && typeof window !== "undefined" && "EyeDropper" in window;

  // When it opens near the bottom of the screen, scroll so the whole panel is visible
  const popRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) popRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [open]);

  // Close when tapping outside or pressing Escape
  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const setChannel = (i: number, raw: string) => {
    const next = [...rgb];
    next[i] = Math.max(0, Math.min(255, Math.round(Number(raw) || 0)));
    onChange("#" + next.map((c) => c.toString(16).padStart(2, "0")).join("").toUpperCase());
  };

  const pickFromScreen = async () => {
    try {
      // EyeDropper is not in TypeScript's DOM types yet
      const Dropper = (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper;
      const result = await new Dropper().open();
      onChange(result.sRGBHex.toUpperCase());
    } catch {
      // user pressed Escape, nothing to do
    }
  };

  return (
    <div className="sp" ref={boxRef}>
      <button
        type="button"
        className="sp-tile"
        title={label}
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="sp-tile-colour" style={{ backgroundColor: hex }} />
      </button>

      {open && (
        <div className="sp-pop" role="dialog" aria-label={label} ref={popRef}>
          <HexColorPicker color={hex} onChange={(c) => onChange(c.toUpperCase())} />

          <div className="sp-row">
            {hasEyeDropper && (
              <button type="button" className="sp-eye" onClick={pickFromScreen} aria-label="Pick a colour from the screen" title="Pick a colour from the screen">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m2 22 1-1h3l9-9" /><path d="M3 21v-3l9-9" />
                  <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
                </svg>
              </button>
            )}
            <span className="sp-preview" style={{ backgroundColor: hex }} />
            <span className="sp-hex">{hex}</span>
          </div>

          <div className="sp-rgb">
            {["R", "G", "B"].map((ch, i) => (
              <label key={ch}>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={255}
                  value={rgb[i]}
                  onChange={(e) => setChannel(i, e.target.value)}
                  aria-label={`${ch} (0 to 255)`}
                />
                <span>{ch}</span>
              </label>
            ))}
          </div>

          <button type="button" className="sp-done" onClick={() => setOpen(false)}>
            Done
          </button>
        </div>
      )}
    </div>
  );
}

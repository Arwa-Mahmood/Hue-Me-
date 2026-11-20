import { API_URL } from "@/lib/api";

// Served at /hueme-config.js. Gives Eshaal's plain HTML auth page (public/auth/index.html)
// the same backend address the rest of the app uses (NEXT_PUBLIC_API_URL).
export function GET() {
  return new Response(`window.HUEME_API_URL = ${JSON.stringify(API_URL)};\n`, {
    headers: { "Content-Type": "application/javascript; charset=utf-8" },
  });
}

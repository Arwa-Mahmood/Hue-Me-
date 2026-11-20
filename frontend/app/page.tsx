"use client";

import { useEffect } from "react";
import { getToken } from "@/lib/api";

// Entry point: logged-in users go to their profile, everyone else to login (public/auth).
export default function Home() {
  useEffect(() => {
    window.location.replace(getToken() ? "/me" : "/login");
  }, []);
  return null;
}

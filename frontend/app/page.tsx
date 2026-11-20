"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";

// Entry point: logged-in users go to their profile, everyone else to login.
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace(getToken() ? "/me" : "/login");
  }, [router]);
  return null;
}

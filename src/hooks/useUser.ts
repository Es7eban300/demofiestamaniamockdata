"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { SessionUser } from "@/types";

interface UseUserResult {
  user: SessionUser | null;
  loading: boolean;
  refresh: () => void;
}

export function useUser(): UseUserResult {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled) {
          setUser(data?.data ?? null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [tick, pathname]);

  return { user, loading, refresh: () => setTick((n) => n + 1) };
}

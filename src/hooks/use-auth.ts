import { useEffect, useState } from "react";
import { authClient } from "@/integrations/auth/auth-client";
import { getUserSession } from "@/lib/api/auth.functions";
import type { AuthUser } from "@/lib/api/auth.functions";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authClient.getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    getUserSession()
      .then((result) => {
        setUser(result.user ?? null);
      })
      .catch(() => {
        authClient.clearToken();
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { user, loading };
}

import { useState, useEffect } from "react";
import { a as authClient } from "./auth-client-wqRgA7mG.js";
import { g as getUserSession } from "./router-CE46XRWC.js";
function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = authClient.getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    getUserSession().then((result) => {
      setUser(result.user ?? null);
    }).catch(() => {
      authClient.clearToken();
      setUser(null);
    }).finally(() => {
      setLoading(false);
    });
  }, []);
  return { user, loading };
}
export {
  useAuth as u
};

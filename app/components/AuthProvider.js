"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMe, logout as apiLogout } from "../actions/auth";

/* Who is logged in. The login cookie cannot be read by scripts (that is what
   keeps it safe), so the only way to know is to ask the API: GET /auth/me.
   status: "loading" (still asking) | "in" | "out". `byUser` is true when the
   person logged out (or timed out) on purpose, so a page does not treat it as
   "someone who was never logged in" and bounce them to login with a "come back
   to this page" note. */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState({ status: "loading", user: null, byUser: false });

  const refresh = useCallback(async () => {
    try {
      const data = await getMe();
      setState({ status: "in", user: data.user, byUser: false });
      return data.user;
    } catch {
      setState({ status: "out", user: null, byUser: false });
      return null;
    }
  }, []);

  // The first check, when the site opens.
  useEffect(() => {
    let cancelled = false;
    getMe()
      .then((data) => { if (!cancelled) setState({ status: "in", user: data.user, byUser: false }); })
      .catch(() => { if (!cancelled) setState({ status: "out", user: null, byUser: false }); });
    return () => { cancelled = true; };
  }, []);

  /* Ends the session on the server, then here. The screen is cleared even if
     the request fails, so a person is never left looking at a live session. */
  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      /* the server session ends by itself when it times out */
    }
    setState({ status: "out", user: null, byUser: true });
  }, []);

  const value = useMemo(() => ({ ...state, refresh, logout }), [state, refresh, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
}

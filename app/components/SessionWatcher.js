"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "../actions/auth";
import { idleMinutes } from "../lib/gate-config";
import { UNAUTHORIZED_EVENT } from "../utils/panelAuth";
import { useAuth } from "./AuthProvider";

const WARN_BEFORE_MS = 2 * 60 * 1000;   // warn this long before the limit
const KEEP_ALIVE_MS = 5 * 60 * 1000;    // tell the server "still here" this often
const TICK_MS = 15 * 1000;

/* Signs a person out after they have been idle, and warns them 2 minutes
   before. The server enforces the same limit on its own; this only makes it
   visible. While a person is actually using the page it also pings the
   server every 5 minutes, because the server counts "idle" from the last
   request, and reading a long form makes none. */
export default function SessionWatcher() {
  const { status, user, logout, refresh } = useAuth();
  const router = useRouter();
  // Set when watching starts (in the effect below), not while rendering.
  const lastActive = useRef(0);
  const lastPing = useRef(0);
  const [warning, setWarning] = useState(false);

  const stayIn = useCallback(async () => {
    lastActive.current = Date.now();
    lastPing.current = Date.now();
    setWarning(false);
    const alive = await refresh();
    if (!alive) router.replace("/login?reason=timeout");
  }, [refresh, router]);

  // actions/apiClient.js fires this when the server answers 401 to a call that needs
  // a login (for example the session ended in another tab). Ask the server who
  // we are now; if nobody, the panel sends the person to the login page.
  useEffect(() => {
    const onUnauthorized = () => { refresh(); };
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, [refresh]);

  useEffect(() => {
    if (status !== "in") return undefined;

    const limit = (idleMinutes[user.kind] ?? 15) * 60 * 1000;
    const mark = () => { lastActive.current = Date.now(); };
    const events = ["pointerdown", "keydown", "scroll", "touchstart"];
    events.forEach((name) => window.addEventListener(name, mark, { passive: true }));
    lastActive.current = Date.now();
    lastPing.current = Date.now();

    const timer = setInterval(async () => {
      const now = Date.now();
      const idle = now - lastActive.current;

      if (idle >= limit) {
        setWarning(false);
        await logout();
        router.replace("/login?reason=timeout");
        return;
      }
      if (idle >= limit - WARN_BEFORE_MS) {
        setWarning(true);
        return;
      }
      setWarning(false);
      if (now - lastPing.current >= KEEP_ALIVE_MS && idle < KEEP_ALIVE_MS) {
        lastPing.current = now;
        try { await getMe(); } catch { /* the next tick or request will notice */ }
      }
    }, TICK_MS);

    return () => {
      clearInterval(timer);
      events.forEach((name) => window.removeEventListener(name, mark));
    };
  }, [status, user, logout, router]);

  if (status !== "in" || !warning) return null;
  return (
    <div className="idle-warn" role="alertdialog" aria-live="assertive" aria-label="You are about to be signed out">
      <p><b>You will be signed out soon</b> because the page has been idle. This keeps your account safe.</p>
      <button type="button" className="btn btn-fill btn-sm" onClick={stayIn}>Stay signed in</button>
    </div>
  );
}

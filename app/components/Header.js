"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SITE_URL } from "../lib/gate-config";
import { useAuth } from "./AuthProvider";

/* Slim header, the same on every page. The logo goes back to the public
   website. Signed out, the right side offers "Log in" and "Create account";
   signed in, it shows the person's name with a small menu. Nothing here
   mentions staff: staff use the same "Log in". */
export default function Header() {
  const { status, user, logout } = useAuth();
  const router = useRouter();

  const onLogout = async (e) => {
    e.currentTarget.closest("details")?.removeAttribute("open");
    await logout();
    router.replace("/login");
  };

  const name = user?.companyName || user?.contactName || "My account";

  return (
    <header className="hdr">
      <div className="shell hdr-in">
        <a className="brand" href={SITE_URL} aria-label="GATE 2027 — back to the main website">
          {/* Plain <img>, not next/image: next/image adds an inline style that the strict security policy blocks. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/gate-logo.png" alt="GATE 2027 — GCCI Annual Trade Expo" width="150" height="52" />
        </a>

        <nav className="nav" aria-label="Primary">
          <Link href="/">Stalls</Link>
          <a href={`${SITE_URL}/exhibitor`}>Tariffs</a>
          <a href={`${SITE_URL}/contact`}>Contact</a>
        </nav>

        <div className="hdr-cta">
          {status === "loading" && <span className="hdr-wait" aria-hidden="true" />}

          {status === "out" && (
            <>
              <Link className="btn btn-line btn-sm" href="/login">Log in</Link>
              <Link className="btn btn-fill btn-sm" href="/signup">Create account</Link>
            </>
          )}

          {status === "in" && (
            <details className="acct">
              <summary className="btn btn-line btn-sm">
                <span className="acct-name">{name}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
              </summary>
              <div className="acct-menu">
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/account/password">Change password</Link>
                <button type="button" onClick={onLogout}>Log out</button>
              </div>
            </details>
          )}
        </div>
      </div>
    </header>
  );
}

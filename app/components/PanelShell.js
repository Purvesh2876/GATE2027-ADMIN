"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";

/* The menu for each kind of signed-in person. `soon` items are shown greyed
   so people can see what is coming; they are not links yet. Staff areas are
   added here as they are built. */
const MENUS = {
  exhibitor: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Company profile", soon: true },
    { label: "Stalls", href: "/" },
    { label: "My bookings", soon: true },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Stall requests", soon: true },
    { label: "Stalls", soon: true },
    { label: "Payments", soon: true },
    { label: "Exhibitors", soon: true },
    { label: "Enquiries", soon: true },
    { label: "Activity log", soon: true },
  ],
  superadmin: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Stall requests", soon: true },
    { label: "Stalls and prices", soon: true },
    { label: "Payments", soon: true },
    { label: "Exhibitors", soon: true },
    { label: "Enquiries", soon: true },
    { label: "Partners and sponsors", soon: true },
    { label: "Admin accounts", soon: true },
    { label: "Activity log", soon: true },
  ],
};

export const roleOf = (user) =>
  user.roles.includes("superadmin") ? "superadmin" : user.roles.includes("admin") ? "admin" : "exhibitor";

/* Guards every signed-in page and wraps it in the menu. Someone who is not
   logged in is sent to the login page and brought back afterwards. The real
   protection is on the server (every API route checks the session); this only
   decides what to show. */
export default function PanelShell({ children }) {
  const { status, user, byUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "out" && !byUser) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [status, byUser, pathname, router]);

  if (status !== "in") {
    return <main id="main" className="panel-skel"><p>{status === "loading" ? "Loading your account…" : byUser ? "You have been signed out." : "Taking you to the login page…"}</p></main>;
  }

  const menu = MENUS[roleOf(user)];

  return (
    <div className="panel">
      <aside className="panel-side">
        <h2>{roleOf(user) === "exhibitor" ? "Exhibitor panel" : "Staff panel"}</h2>
        <nav className="panel-nav" aria-label="Panel">
          {menu.map((item) =>
            item.soon ? (
              <span key={item.label} className="soon" aria-disabled="true">
                {item.label} <em>Soon</em>
              </span>
            ) : (
              <Link key={item.label} href={item.href} className={pathname === item.href ? "is-active" : undefined}>
                {item.label}
              </Link>
            )
          )}
        </nav>
      </aside>
      <main id="main" className="panel-main">{children}</main>
    </div>
  );
}

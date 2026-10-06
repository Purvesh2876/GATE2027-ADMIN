"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

/* The hero buttons. Someone already signed in gets "Go to my dashboard"
   instead of being asked to create an account again. */
export default function HeroActions() {
  const { status } = useAuth();

  return (
    <div className="hero-actions">
      <a className="btn btn-fill btn-lg" href="#stalls">View stalls</a>
      {status === "in" ? (
        <Link className="btn btn-ghost-light btn-lg" href="/dashboard">Go to my dashboard</Link>
      ) : (
        <Link className="btn btn-ghost-light btn-lg" href="/signup">Create account</Link>
      )}
    </div>
  );
}

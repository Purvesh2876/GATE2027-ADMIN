"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "../actions/auth";
import AuthCard from "../components/AuthCard";
import Notice from "../components/Notice";
import PasswordField from "../components/PasswordField";

/* Opened from the emailed link: /reset-password?token=… The token is read
   once and then removed from the address bar, so it does not stay in the
   browser history or get copied along with the page address. */
export default function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [token, setToken] = useState(params.get("token") || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [problem, setProblem] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (window.location.search) window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 12) { setError("Use at least 12 characters."); return; }
    setError("");
    setProblem("");
    setBusy(true);
    try {
      await resetPassword(token, password);
      router.replace("/login?reset=1");
    } catch (err) {
      setProblem(err.message);
      if (err.status === 400 && /link/i.test(err.message)) setToken("");
      setBusy(false);
    }
  };

  if (!token) {
    return (
      <AuthCard title="This link cannot be used" footer={<Link className="link" href="/login">Back to log in</Link>}>
        <Notice kind="error">{problem || "This reset link is missing, has already been used, or has expired."}</Notice>
        <p className="auth-lead">Ask for a new one and we will email it right away.</p>
        <Link className="btn btn-fill btn-lg btn-block" href="/forgot-password">Get a new link</Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Choose a new password" lead="You will log in with it straight after.">
      <Notice kind="error">{problem}</Notice>
      <form onSubmit={submit} noValidate>
        <PasswordField label="New password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} error={error} rules autoComplete="new-password" autoFocus />
        <button className={"btn btn-fill btn-lg btn-block" + (busy ? " is-busy" : "")} disabled={busy}>Save new password</button>
      </form>
    </AuthCard>
  );
}

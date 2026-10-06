"use client";

import Link from "next/link";
import { useState } from "react";
import { forgotPassword } from "../actions/auth";
import AuthCard from "../components/AuthCard";
import Field from "../components/Field";
import Notice from "../components/Notice";

/* Asks for an email or mobile and always answers the same way, whether or not
   an account exists, so this page cannot be used to find out who has one. */
export default function ForgotForm() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [problem, setProblem] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) { setError("Enter your email or mobile number."); return; }
    setError("");
    setProblem("");
    setBusy(true);
    try {
      await forgotPassword(identifier.trim());
      setSent(true);
    } catch (err) {
      setProblem(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <AuthCard
        title="Check your email"
        footer={<Link className="link" href="/login">Back to log in</Link>}
      >
        <Notice kind="success">
          If an account exists for these details, we have emailed it a link to choose a new password.
        </Notice>
        <p className="auth-lead">
          The link works once and expires in 30 minutes. If nothing arrives within a few minutes, check your spam
          folder, or try again.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot your password?"
      lead="Enter the email or mobile number you signed up with. We will email you a link to choose a new one."
      footer={<Link className="link" href="/login">Back to log in</Link>}
    >
      <Notice kind="error">{problem}</Notice>
      <form onSubmit={submit} noValidate>
        <Field label="Email or mobile number" value={identifier} onChange={(e) => { setIdentifier(e.target.value); setError(""); }} error={error} autoComplete="username" autoCapitalize="none" spellCheck={false} maxLength={190} required autoFocus />
        <button className={"btn btn-fill btn-lg btn-block" + (busy ? " is-busy" : "")} disabled={busy}>Email me a reset link</button>
      </form>
    </AuthCard>
  );
}

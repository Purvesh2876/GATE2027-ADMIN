"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { finishLogin, resendLoginCode, startLogin } from "../actions/auth";
import AuthCard from "../components/AuthCard";
import { useAuth } from "../components/AuthProvider";
import CodeField from "../components/CodeField";
import Field from "../components/Field";
import Notice from "../components/Notice";
import PasswordField from "../components/PasswordField";
import ResendButton from "../components/ResendButton";
import safeNext from "../utils/safeNext";

/* Login is two steps: the password, then a code sent by SMS to the mobile
   number. The same page serves exhibitors and staff; nothing here says which
   kind of account it is. */
export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { status, refresh } = useAuth();
  const dest = safeNext(params.get("next"));

  const [stage, setStage] = useState("password"); // password | code
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loginKey, setLoginKey] = useState(null);
  const [sentTo, setSentTo] = useState("");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(
    params.get("reason") === "timeout"
      ? { kind: "info", text: "You were signed out because the page was idle for a while. Please log in again." }
      : params.get("reset") === "1"
        ? { kind: "success", text: "Your password has been changed. Log in with the new password." }
        : params.get("welcome") === "1"
          ? { kind: "success", text: "Your account is ready. Log in with your email or mobile number and the password you just chose." }
          : { kind: "", text: "" }
  );

  // Already logged in: go straight on.
  useEffect(() => {
    if (status === "in") router.replace(dest);
  }, [status, dest, router]);

  const submitPassword = async (e) => {
    e.preventDefault();
    const next = {};
    if (!identifier.trim()) next.identifier = "Enter your email or mobile number.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    setMessage({ kind: "", text: "" });
    try {
      const s = await startLogin(identifier.trim(), password);
      setLoginKey(s.loginKey);
      setSentTo(s.sentTo);
      setPassword("");
      setStage("code");
    } catch (err) {
      setMessage({ kind: "error", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const submitCode = async (e) => {
    e.preventDefault();
    if (code.length !== 6) { setErrors({ code: "Enter all 6 digits." }); return; }
    setErrors({});
    setBusy(true);
    try {
      await finishLogin(loginKey, code);
      await refresh();
      router.replace(dest);
    } catch (err) {
      setMessage({ kind: "error", text: err.message });
      // The login key is dead after too many wrong codes or when it expires.
      if (err.status === 401) { setStage("password"); setCode(""); setLoginKey(null); }
      setBusy(false);
    }
  };

  const resend = async () => {
    setMessage({ kind: "", text: "" });
    try {
      await resendLoginCode(loginKey);
      setMessage({ kind: "success", text: "A new code is on its way." });
    } catch (err) {
      setMessage({ kind: "error", text: err.message });
      throw err;
    }
  };

  const back = () => {
    setStage("password");
    setCode("");
    setLoginKey(null);
    setMessage({ kind: "", text: "" });
  };

  const signupHref = `/signup${params.get("next") ? `?next=${encodeURIComponent(dest)}` : ""}`;

  return (
    <AuthCard
      title={stage === "password" ? "Log in" : "Check your phone"}
      lead={stage === "password" ? "Welcome back. Use the email or mobile number you signed up with." : undefined}
      footer={
        stage === "password" && (
          <span>New to GATE 2027? <Link className="link" href={signupHref}>Create an account</Link></span>
        )
      }
    >
      <Notice kind={message.kind || "info"}>{message.text}</Notice>

      {stage === "password" && (
        <form onSubmit={submitPassword} noValidate>
          <Field label="Email or mobile number" value={identifier} onChange={(e) => { setIdentifier(e.target.value); setErrors({}); }} error={errors.identifier} autoComplete="username" autoCapitalize="none" spellCheck={false} maxLength={190} required autoFocus />
          <PasswordField value={password} onChange={(e) => { setPassword(e.target.value); setErrors({}); }} error={errors.password} />
          <button className={"btn btn-fill btn-lg btn-block" + (busy ? " is-busy" : "")} disabled={busy}>Continue</button>
          <div className="auth-row">
            <Link className="link-btn" href="/forgot-password">Forgot your password?</Link>
          </div>
        </form>
      )}

      {stage === "code" && (
        <form onSubmit={submitCode} noValidate>
          <p className="auth-lead">We sent a 6-digit code by SMS to <b>{sentTo}</b>. Enter it to finish logging in.</p>
          <CodeField value={code} onChange={(v) => { setCode(v); setErrors({}); }} error={errors.code} />
          <button className={"btn btn-fill btn-lg btn-block" + (busy ? " is-busy" : "")} disabled={busy}>Log in</button>
          <div className="auth-row">
            <ResendButton onResend={resend} disabled={busy} />
            <button type="button" className="link-btn" onClick={back}>Use a different account</button>
          </div>
        </form>
      )}
    </AuthCard>
  );
}

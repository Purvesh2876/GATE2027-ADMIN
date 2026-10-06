"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  completeSignup, resendSignup, signupStatus, startSignup, verifySignup,
} from "../actions/auth";
import AuthCard from "../components/AuthCard";
import { useAuth } from "../components/AuthProvider";
import CodeField from "../components/CodeField";
import Field from "../components/Field";
import Notice from "../components/Notice";
import PasswordField from "../components/PasswordField";
import ResendButton from "../components/ResendButton";
import Stepper from "../components/Stepper";
import safeNext from "../utils/safeNext";

const STEPS = ["Your details", "Verify your email", "Verify your mobile", "Choose a password"];
const STAGE_NO = { email: 2, mobile: 3, password: 4 };
const KEY = "gate-signup-key";

/* The key is kept for this tab only, so a refresh does not lose a sign-up in
   progress. It is useless after 30 minutes and is removed as soon as the
   sign-up ends. */
const keep = {
  get: () => { try { return sessionStorage.getItem(KEY); } catch { return null; } },
  set: (v) => { try { sessionStorage.setItem(KEY, v); } catch { /* private mode: no resume */ } },
  clear: () => { try { sessionStorage.removeItem(KEY); } catch { /* nothing to clear */ } },
};

const EMPTY = { companyName: "", contactName: "", email: "", mobile: "" };
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* The sign-up as a person sees it: details, email code, SMS code, password,
   in that order. The server decides what comes next (`stage`); this only
   shows it. */
export default function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { status, refresh } = useAuth();
  const dest = safeNext(params.get("next"));

  const [stage, setStage] = useState("details"); // details | email | mobile | password
  const [key, setKey] = useState(null);
  const [masked, setMasked] = useState({ email: "", mobile: "" });
  const [form, setForm] = useState(EMPTY);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ kind: "", text: "" });
  const [busy, setBusy] = useState(false);
  const [resumed, setResumed] = useState(false);

  // Already logged in: nothing to sign up for.
  useEffect(() => {
    if (status === "in") router.replace(dest);
  }, [status, dest, router]);

  // Pick up a sign-up that was in progress before a refresh.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = keep.get();
      if (saved) {
        try {
          const s = await signupStatus(saved);
          if (cancelled) return;
          setKey(saved);
          setMasked({ email: s.email, mobile: s.mobile });
          setStage(s.stage);
        } catch {
          if (cancelled) return;
          keep.clear();
          setMessage({ kind: "info", text: "Your earlier sign-up timed out, so please start again. Nothing was saved." });
        }
      }
      if (!cancelled) setResumed(true);
    })();
    return () => { cancelled = true; };
  }, []);

  const applyStep = useCallback((s) => {
    setMasked({ email: s.email, mobile: s.mobile });
    setStage(s.stage);
    setCode("");
    setMessage({ kind: "", text: "" });
  }, []);

  const fail = (err) => {
    // The sign-up ended on the server (already registered, or timed out).
    if (err.status === 404 || err.status === 409) {
      keep.clear();
      setKey(null);
      setStage("details");
    }
    setMessage({ kind: "error", text: err.message });
  };

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((x) => ({ ...x, [field]: "" }));
  };

  /* ── Step 1: details ── */
  const submitDetails = async (e) => {
    e.preventDefault();
    const next = {};
    if (form.companyName.trim().length < 2) next.companyName = "Enter your company name.";
    if (form.contactName.trim().length < 2) next.contactName = "Enter the name of the person signing up.";
    if (!EMAIL_OK.test(form.email.trim())) next.email = "Enter a valid email address, like name@company.com.";
    if (!/^(\+?91|0)?[6-9]\d{9}$/.test(form.mobile.replace(/[\s-]/g, ""))) next.mobile = "Enter a 10-digit Indian mobile number.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    setMessage({ kind: "", text: "" });
    try {
      const s = await startSignup({
        companyName: form.companyName.trim(),
        contactName: form.contactName.trim(),
        email: form.email.trim(),
        mobile: form.mobile.replace(/[\s-]/g, ""),
      });
      keep.set(s.signupKey);
      setKey(s.signupKey);
      applyStep(s);
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  /* ── Steps 2 and 3: the codes ── */
  const submitCode = async (e) => {
    e.preventDefault();
    if (code.length !== 6) { setErrors({ code: "Enter all 6 digits." }); return; }
    setErrors({});
    setBusy(true);
    try {
      applyStep(await verifySignup(key, code));
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setMessage({ kind: "", text: "" });
    try {
      await resendSignup(key);
      setMessage({ kind: "success", text: "A new code is on its way." });
    } catch (err) {
      fail(err);
      throw err;
    }
  };

  /* ── Step 4: password, which creates the account ── */
  const submitPassword = async (e) => {
    e.preventDefault();
    if (password.length < 12) { setErrors({ password: "Use at least 12 characters." }); return; }
    setErrors({});
    setBusy(true);
    try {
      await completeSignup(key, password);
      keep.clear();
      await refresh();
      router.replace(dest);
    } catch (err) {
      fail(err);
      setBusy(false);
    }
  };

  const startOver = () => {
    keep.clear();
    setKey(null);
    setStage("details");
    setCode("");
    setPassword("");
    setMessage({ kind: "", text: "" });
  };

  if (!resumed || status === "in") {
    return <AuthCard title="Create your account"><p className="auth-lead">One moment…</p></AuthCard>;
  }

  const current = stage === "details" ? 1 : STAGE_NO[stage];
  const loginHref = `/login${params.get("next") ? `?next=${encodeURIComponent(dest)}` : ""}`;

  return (
    <AuthCard
      title="Create your account"
      lead={stage === "details" ? "It takes about 3 minutes. You will need your phone and your email." : undefined}
      footer={
        <>
          <span>Already have an account? <Link className="link" href={loginHref}>Log in</Link></span>
          {key && <button type="button" className="link-btn" onClick={startOver}>Start again with different details</button>}
        </>
      }
    >
      <Stepper steps={STEPS} current={current} />
      <Notice kind={message.kind || "info"}>{message.text}</Notice>

      {stage === "details" && (
        <form onSubmit={submitDetails} noValidate>
          <Field label="Company name" value={form.companyName} onChange={set("companyName")} error={errors.companyName} autoComplete="organization" required maxLength={150} />
          <Field label="Your name" value={form.contactName} onChange={set("contactName")} error={errors.contactName} autoComplete="name" required maxLength={100} hint="The person who will manage this account." />
          <Field label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} autoComplete="email" required maxLength={190} hint="We will send a code here first." />
          <Field label="Mobile number" type="tel" value={form.mobile} onChange={set("mobile")} error={errors.mobile} autoComplete="tel-national" inputMode="numeric" required maxLength={16} hint="A 10-digit Indian mobile number. It is also used to log in." />
          <button className={"btn btn-fill btn-lg btn-block" + (busy ? " is-busy" : "")} disabled={busy}>Send me the email code</button>
        </form>
      )}

      {(stage === "email" || stage === "mobile") && (
        <form onSubmit={submitCode} noValidate>
          <p className="auth-lead">
            {stage === "email"
              ? <>We emailed a 6-digit code to <b>{masked.email}</b>. It may take a minute; check your spam folder too.</>
              : <>We sent a 6-digit code by SMS to <b>{masked.mobile}</b>.</>}
          </p>
          <CodeField value={code} onChange={(v) => { setCode(v); setErrors({}); }} error={errors.code} />
          <button className={"btn btn-fill btn-lg btn-block" + (busy ? " is-busy" : "")} disabled={busy}>
            {stage === "email" ? "Verify email" : "Verify mobile"}
          </button>
          <div className="auth-row">
            <ResendButton key={stage} onResend={resend} disabled={busy} />
          </div>
        </form>
      )}

      {stage === "password" && (
        <form onSubmit={submitPassword} noValidate>
          <p className="auth-lead">Both are verified. Last step: choose a password for your account.</p>
          <PasswordField label="New password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors({}); }} error={errors.password} rules autoComplete="new-password" autoFocus />
          <button className={"btn btn-fill btn-lg btn-block" + (busy ? " is-busy" : "")} disabled={busy}>Create my account</button>
        </form>
      )}
    </AuthCard>
  );
}

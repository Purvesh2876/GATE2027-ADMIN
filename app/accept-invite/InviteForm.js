"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { acceptInvite, startInvite } from "../actions/auth";
import AuthCard from "../components/AuthCard";
import CodeField from "../components/CodeField";
import Notice from "../components/Notice";
import PasswordField from "../components/PasswordField";
import ResendButton from "../components/ResendButton";

/* Opened from the emailed invitation: /accept-invite?token=… The text message
   is sent only when the person presses the button, not when the page opens,
   because email security scanners open links automatically and would use up
   the daily text limit. */
export default function InviteForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [token, setToken] = useState(params.get("token") || "");
  const [stage, setStage] = useState("intro"); // intro | finish
  const [who, setWho] = useState({ name: "", sentTo: "" });
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [problem, setProblem] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (window.location.search) window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const sendCode = async () => {
    setProblem("");
    setBusy(true);
    try {
      const s = await startInvite(token);
      setWho({ name: s.contactName, sentTo: s.sentTo });
      setStage("finish");
    } catch (err) {
      setProblem(err.message);
      if (err.status === 400) setToken("");
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setProblem("");
    try {
      await startInvite(token);
    } catch (err) {
      setProblem(err.message);
      throw err;
    }
  };

  const finish = async (e) => {
    e.preventDefault();
    const next = {};
    if (code.length !== 6) next.code = "Enter all 6 digits.";
    if (password.length < 12) next.password = "Use at least 12 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setProblem("");
    setBusy(true);
    try {
      await acceptInvite(token, code, password);
      router.replace("/login?welcome=1");
    } catch (err) {
      setProblem(err.message);
      setBusy(false);
    }
  };

  if (!token) {
    return (
      <AuthCard title="This invitation cannot be used" footer={<Link className="link" href="/login">Back to log in</Link>}>
        <Notice kind="error">{problem || "This link is missing, has already been used, or has expired (invitations last 48 hours)."}</Notice>
        <p className="auth-lead">Ask the person who invited you to send a new invitation.</p>
      </AuthCard>
    );
  }

  if (stage === "intro") {
    return (
      <AuthCard title="Set up your account" lead="You have been invited to the GATE 2027 panel. We will text a code to your mobile number to confirm it is you, then you choose a password.">
        <Notice kind="error">{problem}</Notice>
        <button type="button" className={"btn btn-fill btn-lg btn-block" + (busy ? " is-busy" : "")} onClick={sendCode} disabled={busy}>
          Text me the code
        </button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title={`Welcome, ${who.name}`} lead={<>We sent a 6-digit code by SMS to <b>{who.sentTo}</b>. Enter it, then choose a password.</>}>
      <Notice kind="error">{problem}</Notice>
      <form onSubmit={finish} noValidate>
        <CodeField value={code} onChange={(v) => { setCode(v); setErrors({}); }} error={errors.code} />
        <PasswordField label="Choose a password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors({}); }} error={errors.password} rules autoComplete="new-password" />
        <button className={"btn btn-fill btn-lg btn-block" + (busy ? " is-busy" : "")} disabled={busy}>Finish set-up</button>
        <div className="auth-row"><ResendButton onResend={resend} disabled={busy} /></div>
      </form>
    </AuthCard>
  );
}

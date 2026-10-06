"use client";

import { useState } from "react";
import { changePassword } from "../../../actions/auth";
import Notice from "../../../components/Notice";
import PasswordField from "../../../components/PasswordField";

export default function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ kind: "", text: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const found = {};
    if (!current) found.current = "Enter your current password.";
    if (next.length < 12) found.next = "Use at least 12 characters.";
    setErrors(found);
    if (Object.keys(found).length) return;

    setBusy(true);
    setMessage({ kind: "", text: "" });
    try {
      await changePassword(current, next);
      setCurrent("");
      setNext("");
      setMessage({ kind: "success", text: "Your password has been changed. We also emailed you a confirmation." });
    } catch (err) {
      setMessage({ kind: "error", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card card-form">
      <h2>Change password</h2>
      <Notice kind={message.kind || "info"}>{message.text}</Notice>
      <form onSubmit={submit} noValidate>
        <PasswordField label="Current password" value={current} onChange={(e) => { setCurrent(e.target.value); setErrors({}); }} error={errors.current} />
        <PasswordField label="New password" value={next} onChange={(e) => { setNext(e.target.value); setErrors({}); }} error={errors.next} rules autoComplete="new-password" />
        <button className={"btn btn-fill btn-lg" + (busy ? " is-busy" : "")} disabled={busy}>Change password</button>
      </form>
    </div>
  );
}

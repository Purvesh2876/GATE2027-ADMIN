"use client";

import Field from "./Field";

/* The 6-digit code box. Digits only; phones offer the SMS code from the
   keyboard (autoComplete="one-time-code"). */
export default function CodeField({ value, onChange, error, label = "6-digit code" }) {
  return (
    <Field
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
      error={error}
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="[0-9]{6}"
      maxLength={6}
      placeholder="000000"
      className="code-input"
      autoFocus
      required
    />
  );
}

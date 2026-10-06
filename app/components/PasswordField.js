"use client";

import { useState } from "react";
import Field from "./Field";

/* A password input with a "Show" button (so there is no need to type it
   twice) and, when `rules` is on, a short live checklist. The checklist only
   covers what the browser can know; the server makes the final check (common
   and leaked passwords, your own email or mobile in it). */
export default function PasswordField({
  label = "Password",
  value,
  onChange,
  error,
  rules = false,
  autoComplete = "current-password",
  ...rest
}) {
  const [shown, setShown] = useState(false);
  const longEnough = value.length >= 12;

  return (
    <>
      <Field
        label={label}
        type={shown ? "text" : "password"}
        value={value}
        onChange={onChange}
        error={error}
        autoComplete={autoComplete}
        maxLength={128}
        required
        {...rest}
      >
        <button
          type="button"
          className="field-toggle"
          onClick={() => setShown((s) => !s)}
          aria-pressed={shown}
        >
          {shown ? "Hide" : "Show"}
        </button>
      </Field>

      {rules && (
        <ul className="rules" aria-live="polite">
          <li className={longEnough ? "ok" : ""}>
            <span aria-hidden="true">{longEnough ? "✓" : "○"}</span> At least 12 characters
            <span className="sr-only">{longEnough ? " (done)" : " (not yet)"}</span>
          </li>
          <li className="tip">
            Tip: a few unrelated words are easy to remember and hard to guess, like <i>river-stone-lantern-42</i>.
          </li>
        </ul>
      )}
    </>
  );
}

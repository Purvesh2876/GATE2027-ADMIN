"use client";

import { useId } from "react";

/* One labelled input. The label is always visible (a placeholder is not a
   label), the hint says what to type, and an error appears right under the
   field, in words. */
export default function Field({ label, hint, error, children, ...input }) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={"field" + (error ? " has-error" : "")}>
      <label htmlFor={id}>{label}</label>
      <div className="field-box">
        <input
          id={id}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
          {...input}
        />
        {children}
      </div>
      {hint && !error && <p className="field-hint" id={hintId}>{hint}</p>}
      {error && <p className="field-error" id={errorId} role="alert">{error}</p>}
    </div>
  );
}

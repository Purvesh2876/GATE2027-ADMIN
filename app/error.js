"use client";

import AuthCard from "./components/AuthCard";

/* Shown if a page crashes. No technical detail is shown to the visitor. */
export default function Error({ reset }) {
  return (
    <AuthCard title="Something went wrong" lead="Sorry about that. Nothing you entered has been lost on our side. Please try again.">
      <button type="button" className="btn btn-fill btn-lg btn-block" onClick={reset}>Try again</button>
    </AuthCard>
  );
}

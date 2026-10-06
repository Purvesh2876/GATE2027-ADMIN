"use client";

import { useEffect } from "react";
import useCooldown from "../utils/useCooldown";

/* "Send a new code", which waits 30 seconds between uses. A code has just
   been sent when this appears, so it starts already counting down (give it a
   new `key` when a new code goes out, to restart the count). `onResend` does
   the request and should throw if it fails. */
export default function ResendButton({ onResend, disabled = false }) {
  const [left, start] = useCooldown(30);

  useEffect(() => {
    start();
  }, [start]);

  const click = async () => {
    try {
      await onResend();
      start();
    } catch {
      /* the parent shows the error */
    }
  };

  return (
    <button type="button" className="link-btn" onClick={click} disabled={disabled || left > 0}>
      {left > 0 ? `Send a new code in ${left}s` : "Send a new code"}
    </button>
  );
}

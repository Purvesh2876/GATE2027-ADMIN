"use client";

import { useCallback, useEffect, useState } from "react";

/* A countdown for "Resend code" buttons, so a code cannot be requested again
   and again. `start()` begins it; `left` is the seconds remaining (0 = ready). */
export default function useCooldown(seconds = 30) {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    if (left <= 0) return undefined;
    const timer = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [left]);

  const start = useCallback(() => setLeft(seconds), [seconds]);
  return [left, start];
}

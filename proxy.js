import { NextResponse } from "next/server";

/* Runs before every page. It sets the Content-Security-Policy, the browser's
   list of what this page may load and run. Each request gets a fresh nonce
   (a one-time code); only scripts carrying it may run, so a script injected
   by an attacker is refused by the browser even if it got into the page.
   (This file was called middleware.js in older Next.js versions.) */

const isDev = process.env.NODE_ENV === "development";

// The API is the only other place the browser may talk to.
const apiOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").origin;
  } catch {
    return "";
  }
})();

export function proxy(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const policy = [
    "default-src 'self'",
    // 'strict-dynamic' lets a trusted script load its own helpers. Development
    // also needs 'unsafe-eval' for React's debugging tools; production does not.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    isDev ? "style-src 'self' 'unsafe-inline'" : `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' blob: data:",
    "font-src 'self'",
    `connect-src 'self' ${apiOrigin}`.trim(),
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    // Only when the API is on https; on plain http://localhost it would break.
    apiOrigin.startsWith("https:") ? "upgrade-insecure-requests" : "",
  ]
    .filter(Boolean)
    .join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", policy);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

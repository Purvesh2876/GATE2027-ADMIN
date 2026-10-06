/* Security headers for every page. The Content-Security-Policy is set per
   request in proxy.js, because it carries a fresh one-time code (nonce). */
const securityHeaders = [
  // Browsers must use HTTPS for two years (ignored on plain http://localhost).
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Nobody may show this site inside a frame (clickjacking). Same rule is in
  // the CSP as frame-ancestors; this covers older browsers.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Other sites see only "events.gccigate.com", never the full address.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The panel needs none of these browser features.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // No "X-Powered-By: Next.js" banner.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

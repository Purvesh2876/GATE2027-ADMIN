/* Where to send a person after login. Only a path on this site is allowed:
   anything else (another website, "//evil.com", a script address) is ignored,
   so a crafted login link can never bounce someone to a fake site. */
export default function safeNext(value, fallback = "/dashboard") {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  if (/[\u0000-\u001f]/.test(value)) return fallback;
  return value;
}

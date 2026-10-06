// app/utils/apiUrl.js

/**
 * Returns the API base URL (already ending in /api/v1), from NEXT_PUBLIC_API_URL.
 * Same job as getApiBase() in the Appleton projects, so there is one place
 * that decides where the API lives.
 */
export const getApiBase = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  // Ensure no trailing slash
  return envUrl.endsWith("/") ? envUrl.slice(0, -1) : envUrl;
};

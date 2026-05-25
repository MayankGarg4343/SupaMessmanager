const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Clean up trailing slash and ensure it ends with /api
let apiUrl = rawApiUrl.trim().replace(/\/$/, "");
if (!apiUrl.endsWith("/api") && apiUrl !== "") {
  apiUrl = `${apiUrl}/api`;
}

export const API_URL = apiUrl;

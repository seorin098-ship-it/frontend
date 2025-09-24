// Lightweight HTTP client using fetch with a base URL from env
// Vite env var must be prefixed with VITE_

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Build an absolute URL from the base and a path
 * @param {string} path
 */
function buildUrl(path) {
  if (!API_BASE_URL) return path; // allow relative paths in dev
  const base = API_BASE_URL.replace(/\/$/, "");
  const cleanedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanedPath}`;
}

/**
 * Perform a JSON fetch with sensible defaults and error handling
 * @param {string} path
 * @param {RequestInit & { query?: Record<string,string|number|boolean> }} options
 */
export async function httpJson(path, options = {}) {
  const { query, headers, ...rest } = options;

  let url = buildUrl(path);
  if (query && Object.keys(query).length > 0) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) qs.set(key, String(value));
    }
    url += `?${qs.toString()}`;
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...rest,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const message = isJson && body && body.message ? body.message : response.statusText;
    const error = new Error(message || "Request failed");
    error.status = response.status;
    error.data = body;
    throw error;
  }

  return body;
}

export function get(path, options) {
  return httpJson(path, { method: "GET", ...options });
}

export function post(path, body, options) {
  return httpJson(path, { method: "POST", body: JSON.stringify(body ?? {}), ...options });
}



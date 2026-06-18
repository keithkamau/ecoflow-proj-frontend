const API_BASE = import.meta.env.VITE_API_BASE_URL || window.__ENV__?.API_BASE_URL || "http://127.0.0.1:8000/api/v1";

function getToken() {
  return localStorage.getItem("access_token");
}

function buildQuery(params) {
  if (!params) return "";
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) qs.append(k, v);
  }
  const str = qs.toString();
  return str ? `?${str}` : "";
}

let refreshPromise = null;

async function refreshToken() {
  const stored = localStorage.getItem("refresh_token");
  if (!stored) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: stored }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function request(url, options = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  Object.assign(headers, options.headers);

  const query = buildQuery(options.params);
  let res;
  try {
    res = await fetch(`${API_BASE}${url}${query}`, { ...options, headers });
  } catch (err) {
    throw new Error(`Network error: unable to reach server. Check your connection.`);
  }

  if (res.status === 401 && !options._retry) {
    if (!refreshPromise) {
      refreshPromise = refreshToken();
    }
    const refreshed = await refreshPromise;
    refreshPromise = null;
    if (refreshed) {
      const newToken = getToken();
      if (newToken) headers["Authorization"] = `Bearer ${newToken}`;
      const retryOptions = { ...options, _retry: true, headers };
      const retryRes = await fetch(`${API_BASE}${url}${query}`, retryOptions);
      if (retryRes.status === 204) return null;
      if (!retryRes.ok) {
        const body = await retryRes.json().catch(() => ({ detail: retryRes.statusText }));
        const detail = Array.isArray(body.detail)
          ? body.detail.map((e) => e.msg || e.message).join("; ")
          : body.detail;
        throw new Error(detail || `Request failed (${retryRes.status})`);
      }
      return retryRes.json();
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }

  if (res.status === 204) return null;
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    const detail = Array.isArray(body.detail)
      ? body.detail.map((e) => e.msg || e.message).join("; ")
      : body.detail;
    throw new Error(detail || `Request failed (${res.status})`);
  }
  return res.json();
}

export function getWsBaseUrl() {
  const httpBase = import.meta.env.VITE_API_BASE_URL || window.__ENV__?.API_BASE_URL || "http://127.0.0.1:8000/api/v1";
  return httpBase.replace(/^http/, "ws").replace(/\/api\/v1\/?$/, "");
}

export const api = {
  get: (url, config) => request(url, { method: "GET", ...config }),
  post: (url, data, config) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return request(url, { method: "POST", body, ...config });
  },
  put: (url, data, config) => request(url, { method: "PUT", body: JSON.stringify(data), ...config }),
  delete: (url, config) => request(url, { method: "DELETE", ...config }),
};
export default api;

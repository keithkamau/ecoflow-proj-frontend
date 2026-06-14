const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

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

async function request(url, options = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  Object.assign(headers, options.headers);

  const query = buildQuery(options.params);
  const res = await fetch(`${API_BASE}${url}${query}`, { ...options, headers });

  if (res.status === 204) return null;
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `Request failed (${res.status})`);
  }
  return res.json();
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
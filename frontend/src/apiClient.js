// src/apiClient.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Simple helper to call backend with auth token
export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("siisa_token"); // we'll store it manually for now

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data?.message || "Request failed";
    throw new Error(message);
  }

  return data;
}

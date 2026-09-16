const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
export const DEMO_MODE = String(import.meta.env.VITE_DEMO_MODE ?? 'true').toLowerCase() === 'true';

export function getApiConfig() {
  return { baseUrl: API_BASE_URL, demoMode: DEMO_MODE };
}

export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) throw new Error('API base URL is not configured.');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(import.meta.env.VITE_API_TIMEOUT_MS || 10000));
  try {
    const token = localStorage.getItem('yogyasatu-access-token');
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      ...options,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) },
      signal: controller.signal,
    });
    const text = await response.text();
    let body = null;
    try { body = text ? JSON.parse(text) : null; } catch { body = text; }
    if (!response.ok) {
      const message = body?.message || body?.error || `API request failed with status ${response.status}.`;
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }
    return body;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('API request timed out.');
    throw error;
  } finally { clearTimeout(timeout); }
}

export async function apiGet(path) { return apiRequest(path); }
export async function apiPost(path, body) { return apiRequest(path, { method: 'POST', body: JSON.stringify(body) }); }
export async function apiPut(path, body) { return apiRequest(path, { method: 'PUT', body: JSON.stringify(body) }); }
export async function apiPatch(path, body) { return apiRequest(path, { method: 'PATCH', body: JSON.stringify(body) }); }
export async function apiDelete(path) { return apiRequest(path, { method: 'DELETE' }); }

export async function serviceCall({ api, mock, label = 'data' }) {
  if (DEMO_MODE) return { data: await mock(), source: 'mock', message: 'Using demo data because demo mode is enabled.' };
  if (!API_BASE_URL) throw new Error(`Unable to load ${label}: VITE_API_BASE_URL is not configured.`);
  const data = await api();
  return { data, source: 'api', message: '' };
}

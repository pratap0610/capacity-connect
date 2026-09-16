import { apiPost, apiGet, DEMO_MODE } from './api.js';
import { login as mockLogin, signup as mockSignup, getSession as getMockSession, logout as mockLogout } from './auth.js';

export async function login(email, password) {
  if (DEMO_MODE) return { data: await mockLogin(email, password), source: 'mock', message: 'Signed in with demo authentication.' };
  const data = await apiPost('/auth/login', { email, password });
  const session = data?.user || data;
  if (data?.token) localStorage.setItem('yogyasatu-access-token', data.token);
  localStorage.setItem('yogyasatu-session', JSON.stringify(session));
  return { data: session, source: 'api', message: '' };
}
export async function signup(payload) {
  if (DEMO_MODE) return { data: await mockSignup(payload), source: 'mock', message: 'Account created in demo mode.' };
  const data = await apiPost('/auth/signup', payload);
  return { data: data?.user || data, source: 'api', message: '' };
}
export async function currentUser() {
  if (DEMO_MODE) return { data: getMockSession(), source: 'mock', message: 'Using the local demo session.' };
  const data = await apiGet('/auth/me');
  const user = data?.user || data;
  localStorage.setItem('yogyasatu-session', JSON.stringify(user));
  return { data: user, source: 'api', message: '' };
}
export async function logout() {
  if (!DEMO_MODE) { try { await apiPost('/auth/logout', {}); } finally { localStorage.removeItem('yogyasatu-access-token'); localStorage.removeItem('yogyasatu-session'); } }
  else mockLogout();
  return { data: true, source: DEMO_MODE ? 'mock' : 'api', message: '' };
}

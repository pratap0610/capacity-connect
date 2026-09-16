const SESSION_KEY = 'yogyasatu-session';
const USERS_KEY = 'yogyasatu-users';

const demoUsers = [
  { id: 'demo-admin', name: 'Aarav Admin', email: 'admin@capacityconnect.demo', password: 'demo-password', role: 'admin', status: 'approved' },
  { id: 'demo-trainer', name: 'Ananya Sharma', email: 'trainer@capacityconnect.demo', password: 'demo-password', role: 'trainer', status: 'approved' },
  { id: 'demo-trainee', name: 'Aarav Kumar', email: 'trainee@capacityconnect.demo', password: 'demo-password', role: 'trainee', status: 'approved' },
];

function getStoredUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
}

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function normalizeUser(user) {
  return { ...user, passwordHash: user.passwordHash || await hashPassword(user.password) };
}

export function getDemoUsers() {
  return demoUsers.map(({ password, ...user }) => user);
}

export async function login(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = [...demoUsers, ...getStoredUsers()];
  const user = users.find(item => item.email.toLowerCase() === normalizedEmail);
  if (!user) throw new Error('No account exists with this email.');
  const passwordHash = await hashPassword(password);
  const expectedHash = user.passwordHash || await hashPassword(user.password);
  if (passwordHash !== expectedHash) throw new Error('Incorrect password.');
  if (user.status === 'pending') throw new Error('Your account is pending administrator approval.');

  const session = { id: user.id, name: user.name, email: user.email, role: user.role, loggedInAt: new Date().toISOString() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function signup({ name, email, password, role }) {
  const normalizedEmail = email.trim().toLowerCase();
  const exists = [...demoUsers, ...getStoredUsers()].some(item => item.email.toLowerCase() === normalizedEmail);
  if (exists) throw new Error('An account with this email already exists.');
  const user = { id: `user-${Date.now()}`, name: name.trim(), email: normalizedEmail, passwordHash: await hashPassword(password), role, status: 'approved' };
  localStorage.setItem(USERS_KEY, JSON.stringify([...getStoredUsers(), user]));
  return user;
}

export function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
}

export function logout() { localStorage.removeItem(SESSION_KEY); }

export function dashboardPath(role) {
  return role === 'admin' ? '/admin/dashboard' : role === 'trainer' ? '/trainer/dashboard' : '/trainee/dashboard';
}

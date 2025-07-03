export const TOKEN_KEY = 'auth_token';
export const USER_ID_KEY = 'user_id';
// Support both Node.js and browser environments for environment variables
const PUBLIC_API_URL =
  typeof window === 'undefined'
    ? process.env.PUBLIC_API_URL
    : (import.meta as any).env.PUBLIC_API_URL;
export const API_BASE = PUBLIC_API_URL ?? 'http://localhost:3000';

export function setToken(token: string) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function setUserId(id: string) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(USER_ID_KEY, id);
}

export function getToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUserId(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(USER_ID_KEY);
}

export function logout() {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error('Login failed');
  }
  const data = await res.json();
  const token = data.accessToken ?? data.token;
  if (!token) {
    throw new Error('No token returned');
  }
  setToken(token);
  const userId = data.userId ?? data.user?.id;
  if (userId) {
    setUserId(userId);
  }
}

export async function signup(email: string, username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, username, password }),
  });
  if (!res.ok) {
    throw new Error('Sign up failed');
  }
  let data: any = {};
  try {
    data = await res.json();
  } catch {
    // some APIs may return no body
  }
  const token = data.accessToken ?? data.token;
  if (token) {
    setToken(token);
    const userId = data.userId ?? data.user?.id;
    if (userId) {
      setUserId(userId);
    }
    return;
  }
  // automatically log in after successful signup when no token is returned
  await login(email, password);
}

export async function getMyId(): Promise<string | null> {
  const stored = getUserId();
  if (stored) return stored;
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_BASE}/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch id');
  }
  const data = await res.json();
  if (data.userId) {
    setUserId(data.userId);
    return data.userId;
  }
  return null;
}

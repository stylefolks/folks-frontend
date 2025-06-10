export const TOKEN_KEY = 'auth_token';
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export function setToken(token: string) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
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
  if (!data.accessToken) {
    throw new Error('No token returned');
  }
  setToken(data.accessToken);
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
  // automatically log in after successful signup
  await login(email, password);
}

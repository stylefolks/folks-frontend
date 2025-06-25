import { API_BASE } from './auth';
import type { SimpleUser } from './profile';

export async function searchUsers(
  params: Record<string, string> = {},
): Promise<SimpleUser[]> {
  const search = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/users${search ? `?${search}` : ''}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
}

export interface Profile {
  userId: string;
  email: string;
  username: string;
  bio?: string;
  imageUrl?: string;
}

import { API_BASE, getToken } from './auth';

export async function getMyProfile(): Promise<Profile> {
  const token = getToken();
  if (!token) {
    throw new Error('Not logged in');
  }
  const res = await fetch(`${API_BASE}/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to load profile');
  }
  return res.json();
}

export async function updateMyProfile(
  profile: Partial<Pick<Profile, 'username' | 'bio' | 'imageUrl'>>,
): Promise<Profile> {
  const token = getToken();
  if (!token) {
    throw new Error('Not logged in');
  }
  const res = await fetch(`${API_BASE}/user/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });
  if (!res.ok) {
    throw new Error('Failed to update profile');
  }
  return res.json();
}

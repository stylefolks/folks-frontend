export interface Profile {
  userId: string;
  email: string;
  username: string;
  bio?: string;
  imageUrl?: string;
  website?: string;
  backgroundUrl?: string;
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
  profile: Partial<Pick<Profile, 'username' | 'bio' | 'imageUrl' | 'website' | 'backgroundUrl'>>,
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

export async function changeMyPassword(oldPassword: string, newPassword: string): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('Not logged in');
  }
  const res = await fetch(`${API_BASE}/user/me/password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });
  if (!res.ok) {
    throw new Error('Failed to change password');
  }
}

export interface PostSummary {
  id: number;
  title: string;
  imageUrl?: string;
  category: string;
}

export async function getMyPosts(category?: string): Promise<PostSummary[]> {
  const token = getToken();
  if (!token) {
    throw new Error('Not logged in');
  }
  const url = new URL(`${API_BASE}/user/me/posts`);
  if (category) url.searchParams.set('category', category);
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to load posts');
  }
  return res.json();
}

export interface Crew {
  id: string;
  name: string;
}

export async function getFollowedCrews(): Promise<Crew[]> {
  const token = getToken();
  if (!token) {
    throw new Error('Not logged in');
  }
  const res = await fetch(`${API_BASE}/user/me/following`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to load followed crews');
  }
  return res.json();
}

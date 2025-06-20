import { API_BASE } from './auth';
import type { Post } from './posts';

export interface Crew {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  links: { title: string; url: string }[];
}

export async function fetchCrew(id: string): Promise<Crew> {
  const res = await fetch(`${API_BASE}/crews/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load crew');
  return res.json();
}

export async function fetchCrewPosts(id: string): Promise<Post[]> {
  const res = await fetch(`${API_BASE}/crews/${id}/posts`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load posts');
  return res.json();
}

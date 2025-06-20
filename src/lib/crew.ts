import { API_BASE } from './auth';
import type { Post } from './posts';

export interface CrewLink {
  title: string;
  url: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface Crew {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  links: CrewLink[];
  ownerId: string;
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

export async function fetchCrewEvents(id: string): Promise<Event[]> {
  const res = await fetch(`${API_BASE}/crews/${id}/events`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load events');
  return res.json();
}

export async function fetchCrewNotices(id: string): Promise<Notice[]> {
  const res = await fetch(`${API_BASE}/crews/${id}/notices`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load notices');
  return res.json();
}

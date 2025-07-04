import { API_BASE, getToken } from './auth';
import type { Post } from './posts';
import type { SimpleUser } from './profile';

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

export interface CrewTopic {
  tag: string;
  count: number;
}

export interface CrewTab {
  id: number;
  crewId: number;
  title: string;
  type: string;
  isVisible: boolean;
  order: number;
  hashtags?: string[];
}

export interface Crew {
  id: string;
  name: string;
  profileImage?: string;
  coverImage: string;
  description: string;
  links: CrewLink[];
  ownerId: string;
  followers?: SimpleUser[];
}

export interface CrewSummary {
  id: string;
  name: string;
  coverImage: string;
  tags: string[];
  memberCount: number;
  upcomingEvent?: {
    title: string;
    date: string;
  };
}

export async function fetchCrew(id: string): Promise<Crew> {
  const res = await fetch(`${API_BASE}/crews/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load crew');
  return res.json();
}

export async function fetchCrewPosts(
  id: string,
  topics: string[] = [],
): Promise<Post[]> {
  const search = topics.length ? `?topics=${topics.join(',')}` : '';
  const res = await fetch(`${API_BASE}/crews/${id}/posts${search}`, {
    cache: 'no-store',
  });
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

export async function fetchCrewTopics(id: string): Promise<CrewTopic[]> {
  const res = await fetch(`${API_BASE}/crews/${id}/topics`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load topics');
  return res.json();
}

export async function fetchCrewTabs(id: string): Promise<CrewTab[]> {
  const res = await fetch(`${API_BASE}/crews/${id}/tabs`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load crew tabs');
  return res.json();
}

export async function updateCrewTabs(id: string, tabs: CrewTab[]): Promise<CrewTab[]> {
  const res = await fetch(`${API_BASE}/crews/${id}/tabs`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tabs),
  });
  if (!res.ok) throw new Error('Failed to update crew tabs');
  return res.json();
}

export async function fetchCrews(
  params: Record<string, string> = {},
): Promise<CrewSummary[]> {
  const search = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/crews${search ? `?${search}` : ''}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load crews');
  return res.json();
}

export async function searchCrew(
  params: Record<string, string> = {},
): Promise<CrewSummary[]> {
  return fetchCrews(params);
}

export async function createCrew(data: {
  name: string;
  description: string;
}): Promise<Crew> {
  const res = await fetch(`${API_BASE}/crews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create crew');
  return res.json();
}

export async function updateCrew(
  id: string,
  data: Partial<Omit<Crew, 'id' | 'ownerId'>>,
): Promise<Crew> {
  const res = await fetch(`${API_BASE}/crews/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update crew');
  return res.json();
}

export type CrewRole = 'member' | 'master' | 'owner';

export async function fetchMyCrewRole(id: string): Promise<CrewRole> {
  const token = getToken();
  const res = await fetch(`${API_BASE}/crews/${id}/my-role`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load role');
  const data = await res.json();
  return data.role as CrewRole;
}

export interface CrewMember {
  userId: string;
  nickname: string;
  role: CrewRole;
}

export async function fetchCrewMembers(id: string): Promise<CrewMember[]> {
  const res = await fetch(`${API_BASE}/crews/${id}/members`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load members');
  return res.json();
}

export async function updateCrewMemberRole(
  crewId: string,
  userId: string,
  role: CrewRole,
): Promise<void> {
  const res = await fetch(`${API_BASE}/crews/${crewId}/members/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error('Failed to update role');
}

export async function removeCrewMember(crewId: string, userId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/crews/${crewId}/members/${userId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to remove member');
}

export async function deleteCrew(id: string): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_BASE}/crews/${id}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Failed to delete crew');
}

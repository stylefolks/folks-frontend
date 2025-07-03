import { API_BASE } from './auth';

export interface PostDetail {
  id: string;
  title: string;
  content: string;
  hashtags: string[];
  author: { name: string; initials: string };
  createdAt: string;
  crewName: string;
  likes: number;
  comments: number;
}

export interface PostComment {
  id: string;
  author: { name: string; initials: string };
  createdAt: string;
  content: string;
}

export async function fetchPostDetail(id: string): Promise<PostDetail> {
  const res = await fetch(`${API_BASE}/posts/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load post');
  return res.json();
}

export async function fetchPostComments(id: string): Promise<PostComment[]> {
  const res = await fetch(`${API_BASE}/posts/${id}/comments`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load comments');
  return res.json();
}

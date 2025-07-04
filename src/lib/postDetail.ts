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

export async function addPostComment(
  id: string,
  content: string,
): Promise<PostComment> {
  const res = await fetch(`${API_BASE}/posts/${id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
}

export async function likePost(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/posts/${id}/like`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to like post');
}

export async function unlikePost(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/posts/${id}/unlike`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to unlike post');
}

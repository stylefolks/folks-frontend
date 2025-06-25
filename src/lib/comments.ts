import { API_BASE } from './auth';
<<<<<<< HEAD
import type { SimpleUser } from './profile';
=======
>>>>>>> 2909d7313c17ff510549ea1b7b13909f6c7cf391

export interface Comment {
  id: string;
  postId: string;
  text: string;
<<<<<<< HEAD
  author: SimpleUser;
=======
>>>>>>> 2909d7313c17ff510549ea1b7b13909f6c7cf391
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load comments');
  return res.json();
}

export async function addComment(postId: string, text: string): Promise<Comment> {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
}

export async function updateComment(id: string, text: string): Promise<Comment> {
  const res = await fetch(`${API_BASE}/comments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to update comment');
  return res.json();
}

export async function deleteComment(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/comments/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete comment');
}

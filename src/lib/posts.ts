import { API_BASE } from './auth';

export interface Post {
  id: number;
  title: string;
  image: string;
  date: string;
  content: any; // ProseMirror JSON
}

const BASE_TIME = Date.UTC(2023, 0, 1); // fixed date for deterministic output

export function mockPost(id: number): Post {
  return {
    id,
    title: `Post ${id}`,
    image: `https://picsum.photos/seed/${id}/600/400`,
    date: new Date(BASE_TIME - id * 24 * 60 * 60 * 1000).toISOString(),
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: `This is the content for post ${id}.` },
          ],
        },
      ],
    },
  };
}

export function getPosts(page: number, limit: number): Post[] {
  const start = page * limit + 1;
  return Array.from({ length: limit }, (_, i) => mockPost(start + i));
}

export function getPostById(id: number): Post {
  return mockPost(id);
}

export function getNextPosts(startId: number, limit: number): Post[] {
  return Array.from({ length: limit }, (_, i) => mockPost(startId + i + 1));
}

export async function fetchPost(id: number): Promise<Post> {
  const res = await fetch(`${API_BASE}/posts/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to load post');
  }
  return res.json();
}

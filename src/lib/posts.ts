export interface Post {
  id: number;
  title: string;
  image: string;
  date: string;
  content: string;
}

const BASE_TIME = Date.UTC(2023, 0, 1); // fixed date for deterministic output

export function mockPost(id: number): Post {
  return {
    id,
    title: `Post ${id}`,
    image: `https://picsum.photos/seed/${id}/600/400`,
    date: new Date(BASE_TIME - id * 24 * 60 * 60 * 1000).toISOString(),
    content: `This is the content for post ${id}.`,
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

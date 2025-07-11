export function getPosts(page: number, limit: number): PostDto[] {
  const start = page * limit + 1;
  return Array.from({ length: limit }, (_, i) => mockPost(start + i));
}

export function getPostById(id: number): PostDto {
  return mockPost(id);
}

export function getNextPosts(startId: number, limit: number): PostDto[] {
  return Array.from({ length: limit }, (_, i) => mockPost(startId + i + 1));
}

export async function fetchPost(id: number): Promise<PostDto> {
  const res = await fetch(`${API_BASE}/posts/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load post");
  }
  return res.json();
}
import { PostDto } from "@/dto/postDto";
import { ApiResponseDto } from "@/dto/commonDto";
import { API_BASE } from "@/lib/auth";
import { SearchPostType } from "@/dto/postDto";

export function mockPost(id: number): PostDto {
  const author = {
    userId: `user${id}`,
    username: `User ${id}`,
    imageUrl: `https://picsum.photos/seed/user${id}/100`,
  };
  return {
    id,
    title: `Post ${id}`,
    type: id % 2 === 0 ? "BASIC" : "COLUMN",
    brandMetaType: id % 3 === 0 ? "POSTS" : undefined,
    crewMetaType: id % 4 === 0 ? "TOPIC" : undefined,
    image: `https://picsum.photos/seed/${id}/600/400`,
    date: new Date(
      Date.UTC(2023, 0, 1) - id * 24 * 60 * 60 * 1000
    ).toISOString(),
    views: id * 10,
    author,
    tags: [`tag${id}`, `tag${id + 1}`],
    crew: id % 2 === 0 ? { id: `crew${id}`, name: `Crew ${id}` } : undefined,
    brand: id % 3 === 0 ? { id: `brand${id}`, name: `Brand ${id}` } : undefined,
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: `This is the content for post ${id}.` },
          ],
        },
      ],
    },
  };
}

export async function createPost(data: any): Promise<PostDto> {
  const res = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

export async function savePostDraft(data: any): Promise<ApiResponseDto> {
  const res = await fetch(`${API_BASE}/posts/draft`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save draft");
  return res.json();
}

export async function searchPosts(params: {
  query?: string;
  tags?: string[];
  tab?: SearchPostType;
}): Promise<PostDto[]> {
  const urlParams = new URLSearchParams();
  if (params.query) urlParams.set("query", params.query);
  if (params.tags && params.tags.length)
    urlParams.set("tag", params.tags.join(","));
  if (params.tab && params.tab !== "ALL") urlParams.set("tab", params.tab);
  const search = urlParams.toString();
  const res = await fetch(`${API_BASE}/posts${search ? `?${search}` : ""}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load posts");
  return res.json();
}

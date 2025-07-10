import { CrewMetaType } from "@/types/crew";
import { API_BASE } from "./auth";
import { SimpleUser } from "@/types/user";
import { BrandMetaType } from "@/types/brand";
import { Post, PostType, SearchPostType } from "@/types/post";

const BASE_TIME = Date.UTC(2023, 0, 1); // fixed date for deterministic output

export function mockPost(id: number): Post {
  const author: SimpleUser = {
    userId: `user${id}`,
    username: `User ${id}`,
    imageUrl: `https://picsum.photos/seed/user${id}/100`,
  };
  return {
    id,
    title: `Post ${id}`,
    type: id % 2 === 0 ? "BASIC" : "COLUMN", // alternating types for mock data
    brandMetaType: id % 3 === 0 ? "POSTS" : undefined,
    crewMetaType: id % 4 === 0 ? "TOPIC" : undefined,
    image: `https://picsum.photos/seed/${id}/600/400`,
    date: new Date(BASE_TIME - id * 24 * 60 * 60 * 1000).toISOString(),
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
  const res = await fetch(`${API_BASE}/posts/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load post");
  }
  return res.json();
}

export interface CreatePostDto {
  title: string;
  type: PostType;
  content: any;
  crewIds?: number[]; // optional crew ID
  brandIds?: number[]; // optional brand ID
  brandMetaType?: BrandMetaType;
  crewMetaType?: CrewMetaType;
  hashtags?: string[];
}

export async function createPost(data: CreatePostDto): Promise<Post> {
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

export async function savePostDraft(
  data: CreatePostDto
): Promise<{ success: boolean; postId?: string }> {
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

export interface SearchPostParams {
  query?: string;
  tags?: string[];
  tab?: SearchPostType;
}

export async function searchPosts({
  query,
  tags,
  tab,
}: SearchPostParams = {}): Promise<Post[]> {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (tags && tags.length) params.set("tag", tags.join(","));
  if (tab && tab !== "ALL") params.set("tab", tab);
  const search = params.toString();
  const res = await fetch(`${API_BASE}/posts${search ? `?${search}` : ""}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load posts");
  return res.json();
}

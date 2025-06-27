import { API_BASE } from "./auth";
import type { SimpleUser } from "./profile";

export interface Post {
  id: number;
  title: string;
  image: string;
  date: string;
  views: number;
  author: SimpleUser;
  tags?: string[];
  crew?: { id: string; name: string };
  brand?: { id: string; name: string };
  content: any; // ProseMirror JSON
  type: "BASIC" | "COLUMN"; // assuming these are the only types
  brandMetaType?: "POSTS" | "EVENT" | "NOTICE"; // optional meta type
  crewMetaType?: "TOPIC" | "OVERVIEW" | "POSTS" | "EVENT" | "NOTICE"; // optional meta type
}

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
export const BRAND_META_TYPES = ["POSTS", "EVENT", "NOTICE"] as const;
export const CREW_META_TYPES = [
  "TOPIC",
  "OVERVIEW",
  "POSTS",
  "EVENT",
  "NOTICE",
] as const;
export type BrandMetaType = (typeof BRAND_META_TYPES)[number];
export type CrewMetaType = (typeof CREW_META_TYPES)[number];

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

const TYPES = ["BASIC", "COLUMN"] as const;
export const SEARCH_POST_TYPES = ["ALL", ...TYPES] as const;
export type PostType = (typeof TYPES)[number];
export type SearchPostType = "TALK" | "COLUMN" | "ALL";

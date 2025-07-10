import { Post } from "@/types/post";
import { API_BASE } from "./auth";

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  links: { title: string; url: string }[];
}

export interface BrandSummary {
  id: string;
  name: string;
  logo: string;
  description: string;
  tags?: string[];
  crews?: { id: string; name: string; image: string }[];
  upcomingEvent?: { title: string; date: string };
}

export async function fetchBrand(id: string): Promise<Brand> {
  const res = await fetch(`${API_BASE}/brands/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load brand");
  return res.json();
}

export async function fetchBrandPosts(id: string): Promise<Post[]> {
  const res = await fetch(`${API_BASE}/brands/${id}/posts`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load posts");
  return res.json();
}

export async function fetchBrands(
  params: Record<string, string> = {}
): Promise<BrandSummary[]> {
  const search = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/brands${search ? `?${search}` : ""}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load brands");
  return res.json();
}

export async function fetchBrandPostPreviews(limit = 6): Promise<Post[]> {
  const search = new URLSearchParams({
    authorType: "BRAND",
    limit: String(limit),
  }).toString();
  const res = await fetch(`${API_BASE}/posts?${search}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load posts");
  return res.json();
}

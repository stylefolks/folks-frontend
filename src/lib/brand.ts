import { Post } from "@/types/post";
import { API_BASE } from "./auth";
import { Brand, BrandSummary } from "@/types/brand";

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

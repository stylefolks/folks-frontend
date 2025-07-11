import { PostDto } from "@/dto/postDto";
import { API_BASE } from "../lib/auth";
import { BrandDto } from "@/dto/brandDto";

export async function fetchBrand(id: string): Promise<BrandDto> {
  const res = await fetch(`${API_BASE}/brands/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load brand");
  return res.json();
}

export async function fetchBrandPosts(id: string): Promise<PostDto[]> {
  const res = await fetch(`${API_BASE}/brands/${id}/posts`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load posts");
  return res.json();
}

export async function fetchBrands(
  params: Record<string, string> = {}
): Promise<BrandDto[]> {
  const search = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/brands${search ? `?${search}` : ""}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load brands");
  return res.json();
}

export async function fetchBrandPostPreviews(limit = 6): Promise<PostDto[]> {
  const search = new URLSearchParams({
    authorType: "BRAND",
    limit: String(limit),
  }).toString();
  const res = await fetch(`${API_BASE}/posts?${search}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load posts");
  return res.json();
}

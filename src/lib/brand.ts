import { API_BASE } from './auth';
import type { Post } from './posts';

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  links: { title: string; url: string }[];
}

export async function fetchBrand(id: string): Promise<Brand> {
  const res = await fetch(`${API_BASE}/brands/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load brand');
  return res.json();
}

export async function fetchBrandPosts(id: string): Promise<Post[]> {
  const res = await fetch(`${API_BASE}/brands/${id}/posts`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load posts');
  return res.json();
}

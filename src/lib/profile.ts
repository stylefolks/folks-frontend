import { API_BASE, getToken } from "./auth";
import { UserDto, SimpleUserDto } from "@/dto/userDto";
import { PostDto } from "@/dto/postDto";
import { CrewDto } from "@/dto/crewDto";
import { BrandDto } from "@/dto/brandDto";

export async function getProfile(userId: string): Promise<UserDto> {
  const res = await fetch(`${API_BASE}/user/${userId}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load profile");
  }
  return res.json();
}

export async function getMyProfile(): Promise<UserDto> {
  const token = getToken();
  if (!token) {
    throw new Error("Not logged in");
  }
  const res = await fetch(`${API_BASE}/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load profile");
  }
  return res.json();
}

export async function updateMyProfile(
  profile: Partial<
    Pick<UserDto, "username" | "bio" | "imageUrl" | "website" | "backgroundUrl">
  >
): Promise<UserDto> {
  const token = getToken();
  if (!token) {
    throw new Error("Not logged in");
  }
  const res = await fetch(`${API_BASE}/user/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });
  if (!res.ok) {
    throw new Error("Failed to update profile");
  }
  return res.json();
}

export async function changeMyPassword(
  oldPassword: string,
  newPassword: string
): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error("Not logged in");
  }
  const res = await fetch(`${API_BASE}/user/me/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });
  if (!res.ok) {
    throw new Error("Failed to change password");
  }
}

export async function getMyPosts(category?: string): Promise<PostDto[]> {
  const token = getToken();
  if (!token) {
    throw new Error("Not logged in");
  }
  const url = new URL(`${API_BASE}/user/me/posts`);
  if (category) url.searchParams.set("category", category);
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load posts");
  }
  return res.json();
}

export async function getFollowedCrews(): Promise<CrewDto[]> {
  const token = getToken();
  if (!token) {
    throw new Error("Not logged in");
  }
  const res = await fetch(`${API_BASE}/user/me/following`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load followed crews");
  }
  return res.json();
}

export async function getUserPosts(
  userId: string,
  category?: string
): Promise<PostDto[]> {
  const url = new URL(`${API_BASE}/user/${userId}/posts`);
  if (category) url.searchParams.set("category", category);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load posts");
  }
  return res.json();
}

export async function getFollowers(userId: string): Promise<SimpleUserDto[]> {
  const res = await fetch(`${API_BASE}/user/${userId}/followers`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load followers");
  }
  return res.json();
}

export async function getFollowing(userId: string): Promise<SimpleUserDto[]> {
  const res = await fetch(`${API_BASE}/user/${userId}/following`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load following");
  }
  return res.json();
}

export async function getUserCrews(userId: string): Promise<CrewDto[]> {
  const res = await fetch(`${API_BASE}/user/${userId}/crews`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load crews");
  }
  return res.json();
}

export async function getFollowedBrands(userId: string): Promise<BrandDto[]> {
  const res = await fetch(`${API_BASE}/user/${userId}/brands`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load brands");
  }
  return res.json();
}

export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/users/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error("Failed to delete user");
  }
}

export async function blockUser(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/users/${id}/block`, { method: "POST" });
  if (!res.ok) {
    throw new Error("Failed to block user");
  }
}

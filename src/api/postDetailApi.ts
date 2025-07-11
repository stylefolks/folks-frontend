import { API_BASE } from "../lib/auth";
import { PostDto, PostDetailCommentDto } from "@/dto/postDto";

export async function fetchPostDetail(id: string): Promise<PostDto> {
  const res = await fetch(`${API_BASE}/posts/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load post");
  return res.json();
}

export async function fetchPostComments(
  id: string
): Promise<PostDetailCommentDto[]> {
  const res = await fetch(`${API_BASE}/posts/${id}/comments`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load comments");
  return res.json();
}

export async function addPostComment(
  id: string,
  content: string
): Promise<PostDetailCommentDto> {
  const res = await fetch(`${API_BASE}/posts/${id}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
}

export async function likePost(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/posts/${id}/like`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to like post");
}

export async function unlikePost(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/posts/${id}/unlike`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to unlike post");
}

export async function updatePostComment(
  id: string,
  content: string
): Promise<PostDetailCommentDto> {
  const res = await fetch(`${API_BASE}/comment/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Failed to update comment");
  return res.json();
}

export async function deletePostComment(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/comment/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete comment");
}

import { SimpleUserDto } from "@/dto/userDto";
import { API_BASE } from "./auth";

export async function searchUsers(
  params: Record<string, string> = {}
): Promise<SimpleUserDto[]> {
  const search = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/users${search ? `?${search}` : ""}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load users");
  return res.json();
}

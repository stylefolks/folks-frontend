import { API_BASE } from "../lib/auth";

export async function getProfileApi(userId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/users/${userId}/profile`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load profile");
  return res.json();
}

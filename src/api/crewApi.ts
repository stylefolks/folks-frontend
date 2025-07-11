import { API_BASE, getToken } from "../lib/auth";
import { CrewDto, CrewEventDto, CrewNoticeDto } from "@/dto/crewDto";
import { PostDto } from "@/dto/postDto";
import { CrewRole } from "@/dto/crewDto";

export async function fetchCrew(id: string): Promise<CrewDto> {
  const res = await fetch(`${API_BASE}/crews/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load crew");
  return res.json();
}

export async function fetchCrewPosts(id: string): Promise<PostDto[]> {
  const res = await fetch(`${API_BASE}/crews/${id}/posts`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load posts");
  return res.json();
}

export async function fetchCrewDescription(id: string): Promise<string> {
  const res = await fetch(`${API_BASE}/crews/${id}/description`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load description");
  const data = await res.json();
  return data.description as string;
}

export async function fetchCrewEvents(id: string): Promise<CrewEventDto[]> {
  const res = await fetch(`${API_BASE}/crews/${id}/events`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load events");
  return res.json();
}

export async function fetchCrewNotices(id: string): Promise<CrewNoticeDto[]> {
  const res = await fetch(`${API_BASE}/crews/${id}/notices`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load notices");
  return res.json();
}

export async function joinCrew(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/crews/${id}/join`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to join crew");
}

export async function leaveCrew(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/crews/${id}/leave`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to leave crew");
}

export async function fetchMyCrewRole(
  crewId: string
): Promise<CrewRole | null> {
  const res = await fetch(`${API_BASE}/crews/${crewId}/my-role`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch crew role");
  const data = await res.json();
  return data.role;
}

export async function fetchCrews(
  params: Record<string, string> = {}
): Promise<CrewDto[]> {
  const search = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/crews${search ? `?${search}` : ""}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load crews");
  return res.json();
}

export async function createCrew(data: {
  name: string;
  description: string;
}): Promise<CrewDto> {
  const res = await fetch(`${API_BASE}/crews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create crew");
  return res.json();
}

export async function fetchCrewTabs(crewId: string): Promise<any[]> {
  const res = await fetch(`${API_BASE}/crews/${crewId}/tabs`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load crew tabs");
  return res.json();
}

export async function updateCrewTabs(
  crewId: string,
  tabs: any[]
): Promise<void> {
  const res = await fetch(`${API_BASE}/crews/${crewId}/tabs`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tabs }),
  });
  if (!res.ok) throw new Error("Failed to update crew tabs");
}

export async function fetchCrewMembers(crewId: string): Promise<any[]> {
  const res = await fetch(`${API_BASE}/crews/${crewId}/members`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load crew members");
  return res.json();
}

export async function updateCrewMemberRole(
  crewId: string,
  userId: string,
  role: string
): Promise<void> {
  const res = await fetch(
    `${API_BASE}/crews/${crewId}/members/${userId}/role`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    }
  );
  if (!res.ok) throw new Error("Failed to update crew member role");
}

export async function removeCrewMember(
  crewId: string,
  userId: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/crews/${crewId}/members/${userId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove crew member");
}

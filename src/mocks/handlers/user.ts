import { http, HttpResponse } from "msw";
import { UserDto, SimpleUserDto } from "@/dto/userDto";
import { UserTier } from "@/dto/userDto";

const PUBLIC_API_URL =
  typeof window === "undefined"
    ? process.env.PUBLIC_API_URL
    : (import.meta as any).env.PUBLIC_API_URL;
const API_BASE = PUBLIC_API_URL ?? "http://localhost:3000";

let currentProfile: UserDto = {
  userId: "folks",
  email: "folks@gmail.com",
  username: "folks",
  bio: "Mock user",
  imageUrl: "https://picsum.photos/seed/folks/200",
  website: "https://example.com",
  backgroundUrl: "https://picsum.photos/seed/folks-bg/1200/400",
  role: UserTier.MASTER,
};

function randomProfile(id: string): UserDto {
  const rand = Math.random().toString(36).slice(2, 8);
  return {
    userId: id,
    email: `${id}@example.com`,
    username: `${id}-${rand}`,
    bio: `Bio ${rand}`,
    imageUrl: `https://picsum.photos/seed/${rand}/200`,
    website: `https://example.com/${id}`,
    backgroundUrl: `https://picsum.photos/seed/${rand}-bg/1200/400`,
    role: UserTier.USER,
  };
}

const followersMap: Record<string, SimpleUserDto[]> = {};
const followingMap: Record<string, SimpleUserDto[]> = {};
const blockedUsers = new Set<string>();

export const userHandlers = [
  // /users/:id/profile 핸들러 추가
  http.get(`${API_BASE}/users/:id/profile`, ({ params }) => {
    const { id } = params as { id: string };
    // ProfileDto 타입에 맞는 mock 데이터 반환
    const profile: UserDto = {
      userId: id,
      username: `${id}-mockuser`,
      bio: "이것은 mock 프로필입니다.",
      imageUrl: `https://picsum.photos/seed/profile-${id}/200`,
      website: `https://example.com/${id}`,
      backgroundUrl: `https://picsum.photos/seed/profile-bg-${id}/1200/400`,
      role: UserTier.USER,
      posts: Array.from({ length: 3 }, (_, i) => ({
        id: `${id}-post-${i}`,
        title: `유저 ${id}의 게시글 ${i + 1}`,
        content: `유저 ${id}의 게시글 내용입니다.`,
        createdAt: new Date(Date.now() - i * 1000000).toISOString(),
        tags: ["테스트", "샘플"],
        imageUrls: [`https://picsum.photos/seed/${id}-post-${i}/400/400`],
        likeCount: Math.floor(Math.random() * 100),
        commentCount: Math.floor(Math.random() * 10),
        author: {
          userId: id,
          username: `${id}-mockuser`,
          imageUrl: `https://picsum.photos/seed/profile-${id}/200`,
        },
      })),
      followers: Array.from({ length: 5 }, (_, i) => ({
        userId: `follower-${id}-${i}`,
        username: `팔로워${i}`,
        imageUrl: `https://picsum.photos/seed/follower-${id}-${i}/100/100`,
      })),
      following: Array.from({ length: 5 }, (_, i) => ({
        userId: `following-${id}-${i}`,
        username: `팔로잉${i}`,
        imageUrl: `https://picsum.photos/seed/following-${id}-${i}/100/100`,
      })),
    };
    return HttpResponse.json(profile);
  }),
  http.post(`${API_BASE}/auth/signup`, async ({ request }) => {
    const { email, password, nickname } = (await request.json()) as {
      email?: string;
      password?: string;
      nickname?: string;
    };
    if (email && password && nickname) {
      return HttpResponse.json(
        { user: { id: "user-123", nickname } },
        { status: 200 }
      );
    }
    return HttpResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }),

  http.get(`${API_BASE}/user/me`, () => {
    return HttpResponse.json(currentProfile);
  }),

  http.patch(`${API_BASE}/user/me`, async ({ request }) => {
    const data = await request.json();
    currentProfile = { ...currentProfile, ...(data as Partial<UserDto>) };
    return HttpResponse.json(currentProfile);
  }),

  http.patch(`${API_BASE}/user/me/password`, async () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.get(`${API_BASE}/user/me/posts`, () => {
    return HttpResponse.json([]);
  }),

  http.get(`${API_BASE}/user/me/following`, () => {
    return HttpResponse.json([]);
  }),

  http.get(`${API_BASE}/user/:id/followers`, ({ params }) => {
    const { id } = params as { id: string };
    if (!followersMap[id]) {
      followersMap[id] = Array.from({ length: 5 }, (_, i) => {
        const p = randomProfile(`follower-${id}-${i}`);
        return {
          userId: p.userId ?? "",
          username: p.username ?? "",
          imageUrl: p.imageUrl ?? "",
        };
      });
    }
    const list = followersMap[id].filter((u) => !blockedUsers.has(u.userId));
    return HttpResponse.json(list);
  }),

  http.get(`${API_BASE}/user/:id/following`, ({ params }) => {
    const { id } = params as { id: string };
    if (!followingMap[id]) {
      followingMap[id] = Array.from({ length: 5 }, (_, i) => {
        const p = randomProfile(`following-${id}-${i}`);
        return {
          userId: p.userId ?? "",
          username: p.username ?? "",
          imageUrl: p.imageUrl ?? "",
        };
      });
    }
    const list = followingMap[id].filter((u) => !blockedUsers.has(u.userId));
    return HttpResponse.json(list);
  }),

  http.get(`${API_BASE}/user/:id`, ({ params }) => {
    const { id } = params as { id: string };
    return HttpResponse.json(randomProfile(id));
  }),

  http.delete(`${API_BASE}/users/:id`, ({ params }) => {
    const { id } = params as { id: string };
    for (const key of Object.keys(followersMap)) {
      followersMap[key] = followersMap[key].filter((u) => u.userId !== id);
    }
    for (const key of Object.keys(followingMap)) {
      followingMap[key] = followingMap[key].filter((u) => u.userId !== id);
    }
    blockedUsers.delete(id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${API_BASE}/users/:id/block`, ({ params }) => {
    const { id } = params as { id: string };
    blockedUsers.add(id);
    for (const key of Object.keys(followersMap)) {
      followersMap[key] = followersMap[key].filter((u) => u.userId !== id);
    }
    for (const key of Object.keys(followingMap)) {
      followingMap[key] = followingMap[key].filter((u) => u.userId !== id);
    }
    return new HttpResponse(null, { status: 200 });
  }),
];

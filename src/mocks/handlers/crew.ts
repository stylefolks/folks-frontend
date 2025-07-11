import { CrewRole } from "@/dto/crewDto";
import { CrewDto, CrewTabDto, CrewMemberDto } from "@/dto/crewDto";
import { UserTier } from "@/dto/userDto";
import { SimpleUserDto, UserDto } from "@/dto/userDto";
import { http, HttpResponse } from "msw";

const PUBLIC_API_URL =
  typeof window === "undefined"
    ? process.env.PUBLIC_API_URL
    : (import.meta as any).env.PUBLIC_API_URL;
const API_BASE = PUBLIC_API_URL ?? "http://localhost:3000";

const directoryCrews: CrewDto[] = [
  {
    id: "1",
    name: "Shinchon Crew",
    memberCount: 2250,
    coverImage: "https://picsum.photos/seed/crew1/400/400",
    tags: ["빈티지", "홍대"],
  },
  {
    id: "2",
    name: "Hongdae Cafe",
    memberCount: 1800,
    coverImage: "https://picsum.photos/seed/crew2/400/400",
    tags: ["카페", "사진"],
  },
  {
    id: "3",
    name: "비정인돌",
    memberCount: 1482,
    coverImage: "https://picsum.photos/seed/crew3/400/400",
    tags: ["스트릿", "블랙"],
  },
  {
    id: "4",
    name: "AAAAAAA",
    memberCount: 1482,
    coverImage: "https://picsum.photos/seed/crew3/400/400",
    tags: ["스트릿", "블랙"],
  },
  {
    id: "5",
    name: "BBBBB",
    memberCount: 1482,
    coverImage: "https://picsum.photos/seed/crew3/400/400",
    tags: ["스트릿", "블랙"],
  },
];

let createdCrews: CrewDto[] = [];
let crewSeq = 100;
const managerCrewIds = new Set<string>(["2"]);
const crewFollowersMap: Record<string, SimpleUserDto[]> = {};
const crewTabsMap: Record<string, CrewTabDto[]> = {};
const crewMembersMap: Record<string, CrewMemberDto[]> = {};

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

export const crewHandlers = [
  http.get(`${API_BASE}/crews`, ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get("keyword");
    const tag = url.searchParams.get("tag");
    let crews = directoryCrews;
    if (keyword) {
      crews = crews.filter((c) =>
        c.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    if (tag) {
      crews = crews.filter((c) => c.tags?.includes(tag));
    }
    return HttpResponse.json(crews);
  }),
  http.get(`${API_BASE}/crews/:id`, ({ params }) => {
    const { id } = params as { id: string };
    if (id === "crew-1") {
      return HttpResponse.json({
        id: "crew-1",
        name: "Shinchon Crew",
        avatarUrl: "https://picsum.photos/seed/crew-1-banner/1200/675",
        memberCount: 2250,
        description: "Street fashion crew in Shinchon, Seoul.",
        tags: ["힙합", "스트릿"],
      });
    }
    const found = createdCrews.find((c) => c.id === id);
    if (!crewFollowersMap[id]) {
      crewFollowersMap[id] = Array.from({ length: 5 }, (_, i) => {
        const p = randomProfile(`crew-${id}-follower-${i}`);
        return {
          userId: p.userId ?? "",
          username: p.username ?? "",
          imageUrl: p.imageUrl ?? "",
        };
      });
    }
    if (found) {
      return HttpResponse.json({ ...found, followers: crewFollowersMap[id] });
    }
    const res: CrewDto = {
      id: id,
      name: `Crew ${id}`,
      coverImage: `https://picsum.photos/seed/crew-${id}/400/400`,
      description: `This is crew ${id} description`,
      members: Array.from({ length: 5 }, (_, i) => {
        const p = randomProfile(`crew-${id}-member-${i}`);
        return {
          userId: p.userId ?? "",
          nickname: p.username ?? "",
          role: CrewRole.MEMBER,
        };
      }),
      tags: ["테스트", "샘플"],
    };
    return HttpResponse.json(res);
  }),
  http.get(`${API_BASE}/crews/:id/description`, ({ params }) => {
    const { id } = params as { id: string };
    if (id === "crew-1") {
      return HttpResponse.json({
        description: "Street fashion crew in Shinchon, Seoul.",
      });
    }
    const found = createdCrews.find((c) => c.id === id);
    if (found) {
      return HttpResponse.json({ description: found.description });
    }
    return HttpResponse.json({
      description: `This is crew ${id} description  \n lorem ipsum dolor sit amet, consectetur adipiscing elit. \n lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    });
  }),
  http.get(`${API_BASE}/crews/:id/posts`, ({ params }) => {
    const { id } = params as { id: string };
    // randomPost 함수는 post.ts로 분리 필요
    // 크루별 포스트 mock (postDto 기반)
    // 실제 구현은 postHandlers와 연동 필요, 여기선 간단 mock
    const posts = Array.from({ length: 5 }, (_, i) => ({
      id: `${id}-post-${i}`,
      crewId: id,
      title: `Crew ${id} Post ${i}`,
      content: `This is a post for crew ${id}`,
      author: randomProfile(`crew-${id}-author-${i}`),
      createdAt: new Date().toISOString(),
      tags: ["테스트", "샘플"],
      imageUrls: [`https://picsum.photos/seed/${id}-post-${i}/400/400`],
      likeCount: Math.floor(Math.random() * 100),
      commentCount: Math.floor(Math.random() * 10),
      liked: false,
    }));
    return HttpResponse.json(posts);
  }),
  http.get(`${API_BASE}/crews/:id/events`, ({ params }) => {
    const { id } = params as { id: string };
    // 크루 이벤트 mock
    const events = Array.from({ length: 2 }, (_, i) => ({
      id: `${id}-event-${i}`,
      crewId: id,
      title: `Crew ${id} Event ${i}`,
      description: `Event ${i} for crew ${id}`,
      date: new Date(Date.now() + i * 86400000).toISOString(),
      imageUrl: `https://picsum.photos/seed/${id}-event-${i}/400/400`,
    }));
    return HttpResponse.json(events);
  }),
  http.get(`${API_BASE}/crews/:id/notices`, ({ params }) => {
    const { id } = params as { id: string };
    // 크루 공지 mock
    const notices = Array.from({ length: 2 }, (_, i) => ({
      id: `${id}-notice-${i}`,
      crewId: id,
      title: `Crew ${id} Notice ${i}`,
      content: `Notice ${i} for crew ${id}`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    }));
    return HttpResponse.json(notices);
  }),
  http.get(`${API_BASE}/crews/:id/tabs`, ({ params }) => {
    const { id } = params as { id: string };
    // 크루 탭 mock
    if (!crewTabsMap[id]) {
      crewTabsMap[id] = [
        { "id": 1, "crewId": Number(id), "title": "게시글", "type": "posts", "isVisible": true, "order": 1 },
        { "id": 2, "crewId": Number(id), "title": "이벤트", "type": "events", "isVisible": true, "order": 2 },
        { "id": 3, "crewId": Number(id), "title": "공지", "type": "notices", "isVisible": true, "order": 3 },
        { "id": 4, "crewId": Number(id), "title": "멤버", "type": "members", "isVisible": true, "order": 4 },
      ];
    }
    return HttpResponse.json(crewTabsMap[id]);
  }),
  http.get(`${API_BASE}/crews/:id/members`, ({ params }) => {
    const { id } = params as { id: string };
    // 크루 멤버 mock
    if (!crewMembersMap[id]) {
      crewMembersMap[id] = Array.from({ length: 10 }, (_, i) => ({
        "userId": `crew-${id}-member-${i}`,
        "nickname": `멤버${i}`,
        "role": i === 0 ? CrewRole.MANAGER : CrewRole.MEMBER,
      }));
    }
    return HttpResponse.json(crewMembersMap[id]);
  }),
  http.post(`${API_BASE}/crews/:id/join`, ({ params }) => {
    const { id } = params as { id: string };
    // 가입 처리 mock
    // 실제 유저 정보는 userHandlers와 연동 필요
    if (!crewMembersMap[id]) crewMembersMap[id] = [];
    crewMembersMap[id].push({
      "userId": `crew-${id}-member-joined`,
      "nickname": "새멤버",
      "role": CrewRole.MEMBER,
    });
    return HttpResponse.json({ "success": true, "message": "크루에 가입되었습니다." });
  }),
  http.post(`${API_BASE}/crews/:id/leave`, ({ params }) => {
    const { id } = params as { id: string };
    // 탈퇴 처리 mock
    if (crewMembersMap[id]) {
      crewMembersMap[id] = crewMembersMap[id].filter(
        (m) => m.userId !== `crew-${id}-member-joined`
      );
    }
    return HttpResponse.json({ "success": true, "message": "크루에서 탈퇴되었습니다." });
  }),
  http.patch(`${API_BASE}/crews/:id`, async ({ params, request }) => {
    const { id } = params as { id: string };
    const body = await request.json();
    // 크루 정보 수정 mock
    const found = createdCrews.find((c) => c.id === id);
    if (found) {
      Object.assign(found, body);
      return HttpResponse.json({ "success": true, "message": "크루 정보가 수정되었습니다.", "updated": found });
    }
    return HttpResponse.json({ "success": false, "message": "크루를 찾을 수 없습니다." }, { status: 404 });
  }),
  http.delete(`${API_BASE}/crews/:id`, ({ params }) => {
    const { id } = params as { id: string };
    // 크루 삭제 mock
    createdCrews = createdCrews.filter((c) => c.id !== id);
    return HttpResponse.json({ "success": true, "message": "크루가 삭제되었습니다." });
  }),
];

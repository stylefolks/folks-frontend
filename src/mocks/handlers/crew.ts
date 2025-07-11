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
    return HttpResponse.json([]);
  }),
  // ...나머지 crew 관련 핸들러도 동일하게 추가...
];

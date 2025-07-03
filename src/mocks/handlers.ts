import { http, HttpResponse } from "msw";
import { TAGS } from "./tags";

const hotTags = [
  { name: "비건카페", postCount: 32 },
  { name: "90s", postCount: 12 },
  { name: "한남", postCount: 7 },
];
const directoryCrews = [
  {
    id: "1",
    name: "Shinchon Crew",
    memberCount: 2250,
    avatarUrl: "https://picsum.photos/seed/crew1/400/400",
    tags: ["빈티지", "홍대"],
  },
  {
    id: "2",
    name: "Hongdae Cafe",
    memberCount: 1800,
    avatarUrl: "https://picsum.photos/seed/crew2/400/400",
    tags: ["카페", "사진"],
  },
  {
    id: "3",
    name: "비정인돌",
    memberCount: 1482,
    avatarUrl: "https://picsum.photos/seed/crew3/400/400",
    tags: ["스트릿", "블랙"],
  },
];

interface FeedPost {
  id: string;
  title: string;
  imageUrl: string;
  author: { nickname: string };
  tags: string[];
  likeCount: number;
}

const feedPosts: FeedPost[] = Array.from({ length: 15 }, (_, i) => ({
  id: String(i + 1),
  title: `오늘의 OOTD ${i + 1}`,
  imageUrl: `https://picsum.photos/seed/post-${i + 1}/400/300`,
  author: { nickname: `user${i + 1}` },
  tags: ["빈티지", "홍대"],
  likeCount: 10 * (i + 1),
}));

const me = {
  id: "me",
  role: "USER",
  nickname: "cloudlee",
  avatarUrl: "https://picsum.photos/seed/me/100",
};

const PUBLIC_API_URL =
  typeof window === "undefined"
    ? process.env.PUBLIC_API_URL
    : (import.meta as any).env.PUBLIC_API_URL;
const API_BASE = PUBLIC_API_URL ?? "http://localhost:3000";

interface Profile {
  userId: string;
  email: string;
  username: string;
  bio?: string;
  imageUrl?: string;
  website?: string;
  backgroundUrl?: string;
  role?: "member" | "master" | "admin";
}

let currentProfile: Profile = {
  userId: "folks",
  email: "folks@gmail.com",
  username: "folks",
  bio: "Mock user",
  imageUrl: "https://picsum.photos/seed/folks/200",
  website: "https://example.com",
  backgroundUrl: "https://picsum.photos/seed/folks-bg/1200/400",
  role: "master",
};

function randomProfile(id: string): Profile {
  const rand = Math.random().toString(36).slice(2, 8);
  return {
    userId: id,
    email: `${id}@example.com`,
    username: `${id}-${rand}`,
    bio: `Bio ${rand}`,
    imageUrl: `https://picsum.photos/seed/${rand}/200`,
    website: `https://example.com/${id}`,
    backgroundUrl: `https://picsum.photos/seed/${rand}-bg/1200/400`,
    role: "member",
  };
}

function randomPost(id: number) {
  const seed = Math.random().toString(36).slice(2, 8);
  const author = randomProfile(`user${id}`);
  const content = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          { type: "text", text: `Random post ${id}` },
          { type: "text", text: `this is new text` },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "다양한 스타일의 문단 ",
            marks: [
              { type: "font", attrs: { name: "Georgia" } },
              { type: "color", attrs: { color: "blue" } },
            ],
          },
          { type: "text", text: "😊" },
        ],
      },
      {
        type: "image",
        attrs: {
          src: `https://picsum.photos/seed/${seed + 1}/600/400`,
          alt: "random image",
        },
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Comic Sans 폰트의 문단입니다.",
            marks: [{ type: "font", attrs: { name: "Comic Sans MS" } }],
          },
        ],
      },
    ],
  };

  return {
    id,
    title: `Post title ${id}`,
    image: `https://picsum.photos/seed/${seed}/600/400`,
    date: new Date().toISOString(),
    views: id * 10,
    author: {
      userId: author.userId,
      username: author.username,
      imageUrl: author.imageUrl,
    },
    tags: [`tag${id}`, `tag${id + 1}`],
    crew: id % 2 === 0 ? { id: `crew${id}`, name: `Crew ${id}` } : undefined,
    brand: id % 3 === 0 ? { id: `brand${id}`, name: `Brand ${id}` } : undefined,
    content,
  };
}

interface CrewSummary {
  id: string;
  name: string;
  coverImage: string;
  tags: string[];
  memberCount: number;
  upcomingEvent?: { title: string; date: string };
}

function randomCrew(id: number): CrewSummary {
  const seed = Math.random().toString(36).slice(2, 8);
  const tags = [`tag${id}`, `tag${id + 1}`];
  const hasEvent = id % 2 === 0;
  const event = hasEvent
    ? { title: `Event ${id}`, date: new Date().toISOString().slice(0, 10) }
    : undefined;
  return {
    id: `${id}`,
    name: `Crew ${id}`,
    coverImage: `https://picsum.photos/seed/crew-${seed}/400/200`,
    tags,
    memberCount: 10 + id,
    upcomingEvent: event,
  };
}

interface Crew {
  id: string;
  name: string;
  profileImage?: string;
  coverImage: string;
  description: string;
  links: { title: string; url: string }[];
  ownerId: string;
  followers?: SimpleUser[];
}

let createdCrews: Crew[] = [];
let crewSeq = 100;
const masterCrewIds = new Set<string>(["2"]);

interface Comment {
  id: string;
  postId: string;
  text: string;
  author: { userId: string; username: string; imageUrl?: string };
}

const commentsMap: Record<string, Comment[]> = {};

type SimpleUser = { userId: string; username: string; imageUrl?: string };
const followersMap: Record<string, SimpleUser[]> = {};
const followingMap: Record<string, SimpleUser[]> = {};
const blockedUsers = new Set<string>();
const crewFollowersMap: Record<string, SimpleUser[]> = {};

interface CrewTab {
  id: number;
  crewId: number;
  title: string;
  type: string;
  isVisible: boolean;
  order: number;
  hashtags?: string[];
}

const crewTabsMap: Record<string, CrewTab[]> = {};

interface BrandSummary {
  id: string;
  name: string;
  logo: string;
  description: string;
  tags: string[];
  crews: { id: string; name: string; image: string }[];
  upcomingEvent?: { title: string; date: string };
}

function randomBrand(id: number): BrandSummary {
  const seed = Math.random().toString(36).slice(2, 8);
  const brandTags = [TAGS[id % TAGS.length], TAGS[(id + 1) % TAGS.length]];
  const hasEvent = id % 2 === 0;
  const event = hasEvent
    ? { title: `Event ${id}`, date: new Date().toISOString().slice(0, 10) }
    : undefined;
  const crews = Array.from({ length: 2 }, (_, i) => ({
    id: `crew${id}-${i}`,
    name: `Crew ${id}-${i}`,
    image: `https://picsum.photos/seed/crew-${seed}-${i}/40/40`,
  }));
  return {
    id: `${id}`,
    name: `Brand ${id}`,
    logo: `https://picsum.photos/seed/brand-${seed}/200/200`,
    description: `This is brand ${id}.`,
    tags: brandTags,
    crews,
    upcomingEvent: event,
  };
}

export const handlers = [
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const { email, password } = await request.json();
    if (email === "folks@gmail.com" && password === "folks-password") {
      return HttpResponse.json({
        accessToken: "mock-token",
        userId: currentProfile.userId,
      });
    }
    return HttpResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }),

  http.post(`${API_BASE}/auth/signup`, async () => {
    return HttpResponse.json(
      { accessToken: "mock-token", userId: currentProfile.userId },
      { status: 200 }
    );
  }),

  http.get(`${API_BASE}/user/me`, () => {
    return HttpResponse.json(currentProfile);
  }),

  http.patch(`${API_BASE}/user/me`, async ({ request }) => {
    const data = await request.json();
    currentProfile = { ...currentProfile, ...data };
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
        return { userId: p.userId, username: p.username, imageUrl: p.imageUrl };
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
        return { userId: p.userId, username: p.username, imageUrl: p.imageUrl };
      });
    }
    const list = followingMap[id].filter((u) => !blockedUsers.has(u.userId));
    return HttpResponse.json(list);
  }),

  http.get(`${API_BASE}/user/:id`, ({ params }) => {
    const { id } = params as { id: string };
    return HttpResponse.json(randomProfile(id));
  }),

  http.get(`${API_BASE}/posts/:id`, ({ params }) => {
    const { id } = params as { id: string };
    return HttpResponse.json({
      id: 'abc123',
      title: 'The Art of Effortless Chic',
      content: "<p>Hello...</p><img src='/mock/spring-outfit-1.jpg' />",
      hashtags: ['#StreetStyle', '#OOTD', '#Minimalist'],
      author: { name: 'Sophia Lee', initials: 'SL' },
      createdAt: '2025-06-28',
      crewName: 'Fashion Forward Crew',
      likes: 128,
      comments: 34,
    });
  }),

  http.get(`${API_BASE}/posts`, ({ request }) => {
    const url = new URL(request.url);
    const authorType = url.searchParams.get("authorType");
    const limit = Number(url.searchParams.get("limit") ?? "6");
    if (authorType === "BRAND") {
      const posts = Array.from({ length: limit }, (_, i) => {
        const post = randomPost(i + 1);
        post.brand = { id: `brand${i + 1}`, name: `Brand ${i + 1}` };
        return post;
      });
      return HttpResponse.json(posts);
    }
    return HttpResponse.json([]);
  }),

  http.get(`${API_BASE}/crews`, ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword');
    const tag = url.searchParams.get('tag');
    let crews = directoryCrews;
    if (keyword) {
      crews = crews.filter((c) =>
        c.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    if (tag) {
      crews = crews.filter((c) => c.tags.includes(tag));
    }
    return HttpResponse.json(crews);
  }),
  http.get(`${API_BASE}/brands`, ({ request }) => {
    const url = new URL(request.url);
    const hasEvent = url.searchParams.get("hasUpcomingEvent");
    const tag = url.searchParams.get("tag");
    const sort = url.searchParams.get("sort");
    let brands = Array.from({ length: 6 }, (_, i) => randomBrand(i + 1));
    if (hasEvent) {
      brands = brands.filter((b) => b.upcomingEvent);
    }
    if (tag) {
      brands = brands.filter((b) => b.tags.includes(tag));
    }
    if (sort === "popular") {
      brands = brands.sort((a, b) => b.crews.length - a.crews.length);
    }
    return HttpResponse.json(brands);
  }),

  http.get(`${API_BASE}/crews/:id`, ({ params }) => {
    const { id } = params as { id: string };
    if (id === 'crew-1') {
      return HttpResponse.json({
        id: 'crew-1',
        name: 'Shinchon Crew',
        avatarUrl: 'https://picsum.photos/seed/crew-1-banner/1200/675',
        memberCount: 2250,
        description: 'Street fashion crew in Shinchon, Seoul.',
        tags: ['힙합', '스트릿'],
      });
    }
    const found = createdCrews.find((c) => c.id === id);
    if (!crewFollowersMap[id]) {
      crewFollowersMap[id] = Array.from({ length: 5 }, (_, i) => {
        const p = randomProfile(`crew-${id}-follower-${i}`);
        return { userId: p.userId, username: p.username, imageUrl: p.imageUrl };
      });
    }
    if (found) {
      return HttpResponse.json({ ...found, followers: crewFollowersMap[id] });
    }
    return HttpResponse.json({
      id,
      name: `Crew ${id}`,
      profileImage: `https://picsum.photos/seed/crew-${id}/80/80`,
      coverImage: `https://picsum.photos/seed/crew-${id}/1200/300`,
      description: `This is crew ${id}.`,
      links: [{ title: 'Instagram', url: 'https://instagram.com' }],
      ownerId: 'folks',
      followers: crewFollowersMap[id],
    });
  }),

  http.get(`${API_BASE}/crews/:id/posts`, ({ params }) => {
    const { id } = params as { id: string };
    if (id === 'crew-1') {
      return HttpResponse.json([
        {
          id: 'p1',
          title: 'OOTD',
          imageUrl: 'https://picsum.photos/seed/crew-post1/400/500',
          author: { nickname: 'sophie' },
          tags: ['OOTD'],
          likeCount: 132,
        },
        {
          id: 'p2',
          title: '#비건카페',
          imageUrl: 'https://picsum.photos/seed/crew-post2/400/500',
          author: { nickname: 'matt' },
          tags: ['비건카페'],
          likeCount: 136,
        },
      ]);
    }
    const posts = Array.from({ length: 4 }, (_, i) => randomPost(i + 1));
    return HttpResponse.json(posts);
  }),

  http.get(`${API_BASE}/crews/:id/events`, ({ params }) => {
    const { id } = params as { id: string };
    const events = Array.from({ length: 3 }, (_, i) => ({
      id: `${id}-${i + 1}`,
      title: `Event ${i + 1}`,
      date: new Date().toISOString().slice(0, 10),
      location: `Location ${i + 1}`,
      image: `https://picsum.photos/seed/${id}-event-${i}/200/200`,
    }));
    return HttpResponse.json(events);
  }),

  http.get(`${API_BASE}/crews/:id/notices`, ({ params }) => {
    const { id } = params as { id: string };
    const notices = Array.from({ length: 2 }, (_, i) => ({
      id: `${id}-${i + 1}`,
      title: `Notice ${i + 1}`,
      content: `Notice content ${i + 1}`,
      date: new Date().toISOString().slice(0, 10),
    }));
    return HttpResponse.json(notices);
  }),

  http.get(`${API_BASE}/crews/:id/topics`, ({ params }) => {
    const { id } = params as { id: string };
    const topics = ["talk", "column", "look"].map((tag, idx) => ({
      tag: `#${tag}-${id}`,
      count: idx + 1,
    }));
    return HttpResponse.json(topics);
  }),

  http.get(`${API_BASE}/crews/:id/tabs`, ({ params }) => {
    const { id } = params as { id: string };
    if (!crewTabsMap[id]) {
      crewTabsMap[id] = [
        {
          id: 1,
          crewId: Number(id),
          title: "Posts",
          type: "posts",
          isVisible: true,
          order: 0,
        },
        {
          id: 2,
          crewId: Number(id),
          title: "Overview",
          type: "overview",
          isVisible: true,
          order: 1,
        },
        {
          id: 3,
          crewId: Number(id),
          title: "Notice",
          type: "notice",
          isVisible: true,
          order: 2,
        },
        {
          id: 4,
          crewId: Number(id),
          title: "Event",
          type: "event",
          isVisible: true,
          order: 3,
        },
        {
          id: 5,
          crewId: Number(id),
          title: "topic only for tag1",
          type: "topic",
          isVisible: true,
          order: 4,
          hashtag: "tag1",
        },
      ];
    }
    return HttpResponse.json(crewTabsMap[id]);
  }),

  http.put(`${API_BASE}/crews/:id/tabs`, async ({ params, request }) => {
    const { id } = params as { id: string };
    const tabs = (await request.json()) as CrewTab[];
    crewTabsMap[id] = tabs;
    return HttpResponse.json(crewTabsMap[id]);
  }),

  http.post(`${API_BASE}/crews`, async ({ request }) => {
    const body = await request.json();
    crewSeq += 1;
    const newCrew: Crew = {
      id: String(crewSeq),
      name: body.name,
      profileImage:
        body.profileImage ?? `https://picsum.photos/seed/crew-${crewSeq}/80/80`,
      coverImage: `https://picsum.photos/seed/crew-${crewSeq}/400/200`,
      description: body.description ?? "",
      links: body.links ?? [],
      ownerId: currentProfile.userId,
      followers: [],
    };
    crewFollowersMap[newCrew.id] = [];
    createdCrews.push(newCrew);
    return HttpResponse.json(newCrew);
  }),

  http.put(`${API_BASE}/crews/:id`, async ({ params, request }) => {
    const { id } = params as { id: string };
    const body = await request.json();
    let crew = createdCrews.find((c) => c.id === id);
    if (!crew) {
      crew = {
        id,
        name: body.name ?? `Crew ${id}`,
        coverImage: `https://picsum.photos/seed/crew-${id}/400/200`,
        description: body.description ?? "",
        links: body.links ?? [],
        ownerId: currentProfile.userId,
      };
      createdCrews.push(crew);
    } else {
      if (body.name !== undefined) crew.name = body.name;
      if (body.description !== undefined) crew.description = body.description;
      if (body.profileImage !== undefined)
        crew.profileImage = body.profileImage;
      if (body.coverImage !== undefined) crew.coverImage = body.coverImage;
      if (body.links !== undefined) crew.links = body.links;
    }
    return HttpResponse.json(crew);
  }),

  http.get(`${API_BASE}/crews/:id/my-role`, ({ params }) => {
    const { id } = params as { id: string };
    const found = createdCrews.find((c) => c.id === id);
    if (found && found.ownerId === currentProfile.userId) {
      return HttpResponse.json({ role: "owner" });
    }
    if (masterCrewIds.has(id)) {
      return HttpResponse.json({ role: "master" });
    }
    return HttpResponse.json({ role: "member" });
  }),

  http.delete(`${API_BASE}/crews/:id`, ({ params }) => {
    const { id } = params as { id: string };
    createdCrews = createdCrews.filter((c) => c.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_BASE}/brands/:id`, ({ params }) => {
    const { id } = params as { id: string };
    return HttpResponse.json({
      id,
      name: `Brand ${id}`,
      logo: `https://picsum.photos/seed/brand-${id}/200/200`,
      description: `This is brand ${id}.`,
      links: [{ title: "Website", url: "https://example.com" }],
    });
  }),

  http.get(`${API_BASE}/brands/:id/posts`, ({ params }) => {
    const { id } = params as { id: string };
    const posts = Array.from({ length: 4 }, (_, i) => randomPost(i + 1));
    return HttpResponse.json(posts);
  }),

  http.get(`${API_BASE}/posts/:postId/comments`, ({ params }) => {
    const { postId } = params as { postId: string };
    if (postId) {
      return HttpResponse.json([
        {
          id: 'c1',
          author: { name: 'Alex Kim', initials: 'AK' },
          createdAt: '2025-06-29',
          content: 'Love these tips!'
        },
        {
          id: 'c2',
          author: { name: 'Jessica Wong', initials: 'JW' },
          createdAt: '2025-06-29',
          content: 'Effortless chic is my favorite!'
        },
        {
          id: 'c3',
          author: { name: 'Mark Chen', initials: 'MC' },
          createdAt: '2025-06-30',
          content: 'Great post, Sophia!'
        }
      ]);
    }
    return HttpResponse.json([]);
  }),

  http.post(
    `${API_BASE}/posts/:postId/comments`,
    async ({ params, request }) => {
      const { postId } = params as { postId: string };
      const { text } = await request.json();
      const newComment: Comment = {
        id: String(Date.now()),
        postId,
        text,
        author: {
          userId: currentProfile.userId,
          username: currentProfile.username,
          imageUrl: currentProfile.imageUrl,
        },
      };
      commentsMap[postId] = [...(commentsMap[postId] ?? []), newComment];
      return HttpResponse.json(newComment, { status: 201 });
    }
  ),

  http.put(`${API_BASE}/comments/:id`, async ({ params, request }) => {
    const { id } = params as { id: string };
    const { text } = await request.json();
    for (const postId of Object.keys(commentsMap)) {
      const idx = commentsMap[postId].findIndex((c) => c.id === id);
      if (idx >= 0) {
        commentsMap[postId][idx].text = text;
        return HttpResponse.json(commentsMap[postId][idx]);
      }
    }
    return HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  http.delete(`${API_BASE}/comments/:id`, ({ params }) => {
    const { id } = params as { id: string };
    for (const postId of Object.keys(commentsMap)) {
      const idx = commentsMap[postId].findIndex((c) => c.id === id);
      if (idx >= 0) {
        commentsMap[postId].splice(idx, 1);
        return new HttpResponse(null, { status: 204 });
      }
    }
    return new HttpResponse(null, { status: 404 });
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

  // Folks HomePage mock APIs
  http.get('/tags/hot', () => {
    return HttpResponse.json(hotTags);
  }),
  http.get('/posts', ({ request }) => {
    const url = new URL(request.url);
    const cursor = url.searchParams.get('cursor');
    const start = cursor ? parseInt(cursor, 10) : 0;
    const pageSize = 6;
    const posts = feedPosts.slice(start, start + pageSize);
    const next = start + pageSize < feedPosts.length ? String(start + pageSize) : undefined;
    return HttpResponse.json({ posts, nextCursor: next });
  }),
  http.get('/users/me', () => {
    return HttpResponse.json(me);
  }),

  http.post(`${API_BASE}/posts`, async ({ request }) => {
    await request.json();
    return HttpResponse.json({ success: true, postId: 'abc123' }, { status: 201 });
  }),

  http.post(`${API_BASE}/posts/draft`, async ({ request }) => {
    await request.json();
    return HttpResponse.json({ success: true }, { status: 201 });
  }),
];

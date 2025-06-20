import { http, HttpResponse } from 'msw';

const PUBLIC_API_URL =
  typeof window === 'undefined'
    ? process.env.PUBLIC_API_URL
    : (import.meta as any).env.PUBLIC_API_URL;
const API_BASE = PUBLIC_API_URL ?? 'http://localhost:3000';

interface Profile {
  userId: string;
  email: string;
  username: string;
  bio?: string;
  imageUrl?: string;
  website?: string;
  backgroundUrl?: string;
}

let currentProfile: Profile = {
  userId: 'folks',
  email: 'folks@gmail.com',
  username: 'folks',
  bio: 'Mock user',
  imageUrl: 'https://picsum.photos/seed/folks/200',
  website: 'https://example.com',
  backgroundUrl: 'https://picsum.photos/seed/folks-bg/1200/400',
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
  };
}

function randomPost(id: number) {
  const seed = Math.random().toString(36).slice(2, 8);
  const author = randomProfile(`user${id}`);
  const content = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: `Random post ${id}` },
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
    author: { userId: author.userId, username: author.username, imageUrl: author.imageUrl },
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
  const tags = ['디자이너', '빈티지', '스트릿', '서울팝업'];
  const brandTags = [tags[id % tags.length], tags[(id + 1) % tags.length]];
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
    if (email === 'folks@gmail.com' && password === 'folks-password') {
      return HttpResponse.json({ accessToken: 'mock-token', userId: currentProfile.userId });
    }
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),

  http.post(`${API_BASE}/auth/signup`, async () => {
    return HttpResponse.json({ accessToken: 'mock-token', userId: currentProfile.userId }, { status: 200 });
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

  http.get(`${API_BASE}/user/:id`, ({ params }) => {
    const { id } = params as { id: string };
    return HttpResponse.json(randomProfile(id));
  }),

  http.get(`${API_BASE}/posts/:id`, ({ params }) => {
    const { id } = params as { id: string };
    return HttpResponse.json(randomPost(Number(id)));
  }),

  http.get(`${API_BASE}/posts`, ({ request }) => {
    const url = new URL(request.url);
    const authorType = url.searchParams.get('authorType');
    const limit = Number(url.searchParams.get('limit') ?? '6');
    if (authorType === 'BRAND') {
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
    const hasEvent = url.searchParams.get('hasUpcomingEvent');
    const tag = url.searchParams.get('tag');
    const sort = url.searchParams.get('sort');
    let crews = Array.from({ length: 6 }, (_, i) => randomCrew(i + 1));
    if (hasEvent) {
      crews = crews.filter((c) => c.upcomingEvent);
    }
    if (tag) {
      crews = crews.filter((c) => c.tags.includes(tag));
    }
    if (sort === 'popular') {
      crews = crews.sort((a, b) => b.memberCount - a.memberCount);
    }
    return HttpResponse.json(crews);
  }),

  http.get(`${API_BASE}/brands`, ({ request }) => {
    const url = new URL(request.url);
    const hasEvent = url.searchParams.get('hasUpcomingEvent');
    const tag = url.searchParams.get('tag');
    const sort = url.searchParams.get('sort');
    let brands = Array.from({ length: 6 }, (_, i) => randomBrand(i + 1));
    if (hasEvent) {
      brands = brands.filter((b) => b.upcomingEvent);
    }
    if (tag) {
      brands = brands.filter((b) => b.tags.includes(tag));
    }
    if (sort === 'popular') {
      brands = brands.sort((a, b) => b.crews.length - a.crews.length);
    }
    return HttpResponse.json(brands);
  }),

  http.get(`${API_BASE}/crews/:id`, ({ params }) => {
    const { id } = params as { id: string };
    return HttpResponse.json({
      id,
      name: `Crew ${id}`,
      coverImage: `https://picsum.photos/seed/crew-${id}/1200/300`,
      description: `This is crew ${id}.`,
      links: [
        { title: 'Instagram', url: 'https://instagram.com' },
      ],
    });
  }),

  http.get(`${API_BASE}/crews/:id/posts`, ({ params }) => {
    const { id } = params as { id: string };
    const posts = Array.from({ length: 4 }, (_, i) => randomPost(i + 1));
    return HttpResponse.json(posts);
  }),

  http.get(`${API_BASE}/brands/:id`, ({ params }) => {
    const { id } = params as { id: string };
    return HttpResponse.json({
      id,
      name: `Brand ${id}`,
      logo: `https://picsum.photos/seed/brand-${id}/200/200`,
      description: `This is brand ${id}.`,
      links: [
        { title: 'Website', url: 'https://example.com' },
      ],
    });
  }),

  http.get(`${API_BASE}/brands/:id/posts`, ({ params }) => {
    const { id } = params as { id: string };
    const posts = Array.from({ length: 4 }, (_, i) => randomPost(i + 1));
    return HttpResponse.json(posts);
  }),
];

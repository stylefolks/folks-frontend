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
    const seed = Math.random().toString(36).slice(2, 8);
    const content = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: `Random post ${id}` },
            { type: 'text', text: `this is new text` },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: '다양한 스타일의 문단 ' ,
              marks: [
                { type: 'font', attrs: { name: 'Georgia' } },
                { type: 'color', attrs: { color: 'blue' } },
              ],
            },
            { type: 'text', text: '😊' },
          ],
        },
        {
          type: 'image',
          attrs: {
            src: `https://picsum.photos/seed/${seed+1}/600/400`,
            alt: 'random image',
          },
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Comic Sans 폰트의 문단입니다.',
              marks: [
                { type: 'font', attrs: { name: 'Comic Sans MS' } },
              ],
            },
          ],
        },
      ],
    };
    return HttpResponse.json({
      id: Number(id),
      title: `Post title ${id}`,
      image: `https://picsum.photos/seed/${seed}/600/400`,
      date: new Date().toISOString(),
      content,
    });
  }),
];

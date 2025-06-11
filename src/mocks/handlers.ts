import { rest } from 'msw';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

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
  rest.post(`${API_BASE}/auth/login`, async (req, res, ctx) => {
    const { email, password } = await req.json();
    if (email === 'folks@gmail.com' && password === 'folks-password') {
      return res(ctx.json({ accessToken: 'mock-token', userId: currentProfile.userId }));
    }
    return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }));
  }),

  rest.post(`${API_BASE}/auth/signup`, async (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({}));
  }),

  rest.get(`${API_BASE}/user/me`, (_req, res, ctx) => {
    return res(ctx.json(currentProfile));
  }),

  rest.patch(`${API_BASE}/user/me`, async (req, res, ctx) => {
    const data = await req.json();
    currentProfile = { ...currentProfile, ...data };
    return res(ctx.json(currentProfile));
  }),

  rest.patch(`${API_BASE}/user/me/password`, async (_req, res, ctx) => {
    return res(ctx.status(200));
  }),

  rest.get(`${API_BASE}/user/me/posts`, (_req, res, ctx) => {
    return res(ctx.json([]));
  }),

  rest.get(`${API_BASE}/user/me/following`, (_req, res, ctx) => {
    return res(ctx.json([]));
  }),

  rest.get(`${API_BASE}/user/:id`, (req, res, ctx) => {
    const { id } = req.params as { id: string };
    return res(ctx.json(randomProfile(id)));
  }),
];

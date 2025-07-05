import { setToken } from '../src/lib/auth';
import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  getMyPosts,
  getFollowedCrews,
  getProfile,
  getUserPosts,
  getFollowers,
  getFollowing,
  getUserCrews,
  getFollowedBrands,
} from '../src/lib/profile';
import { describe, it, expect, beforeEach, vi } from 'vitest';

declare global {
   
  var localStorage: Storage;
  // using 'any' to simplify mock typing
  var fetch: any;
}

class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string) {
    return this.store[key] ?? null;
  }
  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }
}

describe('profile api', () => {
  beforeEach(() => {
    global.localStorage = new LocalStorageMock() as any;
    global.fetch = vi.fn();
    setToken('token');
  });

  it('fetches profile with auth header', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ userId: '1', email: 'a', username: 'u' }) });
    await getMyProfile();
    expect(global.fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer token');
  });

  it('fetches another user profile', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ userId: '2', email: 'b', username: 'v' }) });
    await getProfile('2');
    expect(global.fetch.mock.calls[0][0]).toContain('/user/2');
  });

  it('updates profile with PATCH', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ userId: '1', email: 'a', username: 'x' }) });
    await updateMyProfile({ username: 'x' });
    expect(global.fetch.mock.calls[0][0]).toContain('/user/me');
    expect(global.fetch.mock.calls[0][1].method).toBe('PATCH');
  });

  it('changes password', async () => {
    global.fetch.mockResolvedValue({ ok: true });
    await changeMyPassword('old', 'new');
    expect(global.fetch.mock.calls[0][0]).toContain('/user/me/password');
    expect(global.fetch.mock.calls[0][1].method).toBe('PATCH');
  });

  it('gets posts with category', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [] });
    await getMyPosts('OOTD');
    const calledUrl = new URL(global.fetch.mock.calls[0][0]);
    expect(calledUrl.pathname).toContain('/user/me/posts');
    expect(calledUrl.searchParams.get('category')).toBe('OOTD');
  });

  it('fetches followed crews', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [] });
    await getFollowedCrews();
    expect(global.fetch.mock.calls[0][0]).toContain('/user/me/following');
  });

  it('fetches posts for a user', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [] });
    await getUserPosts('99', 'OOTD');
    const url = new URL(global.fetch.mock.calls[0][0]);
    expect(url.pathname).toContain('/user/99/posts');
    expect(url.searchParams.get('category')).toBe('OOTD');
  });

  it('fetches followers', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [] });
    await getFollowers('1');
    expect(global.fetch.mock.calls[0][0]).toContain('/user/1/followers');
  });

  it('fetches following', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [] });
    await getFollowing('1');
    expect(global.fetch.mock.calls[0][0]).toContain('/user/1/following');
  });

  it('fetches user crews', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [] });
    await getUserCrews('1');
    expect(global.fetch.mock.calls[0][0]).toContain('/user/1/crews');
  });

  it('fetches followed brands', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [] });
    await getFollowedBrands('1');
    expect(global.fetch.mock.calls[0][0]).toContain('/user/1/brands');
  });
});

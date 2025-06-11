import { setToken } from '../src/lib/auth';
import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  getMyPosts,
  getFollowedCrews,
  getProfile,
} from '../src/lib/profile';

declare global {
  // eslint-disable-next-line no-var
  var localStorage: Storage;
  var fetch: jest.Mock;
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
    global.fetch = jest.fn();
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
});

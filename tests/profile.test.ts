import { setToken } from '../src/lib/auth';
import { getMyProfile, updateMyProfile } from '../src/lib/profile';

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

  it('updates profile with PATCH', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ userId: '1', email: 'a', username: 'x' }) });
    await updateMyProfile({ username: 'x' });
    expect(global.fetch.mock.calls[0][0]).toContain('/user/me');
    expect(global.fetch.mock.calls[0][1].method).toBe('PATCH');
  });
});

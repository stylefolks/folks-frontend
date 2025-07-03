import {
  setToken,
  getToken,
  TOKEN_KEY,
  login,
  signup,
  logout,
  getUserId,
  USER_ID_KEY,
  getMyId,
} from '../src/lib/auth';
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
  removeItem(key: string) {
    delete this.store[key];
  }
}

describe('auth helpers', () => {
  beforeEach(() => {
    global.localStorage = new LocalStorageMock() as any;
    global.fetch = vi.fn();
  });

  it('stores and retrieves tokens', () => {
    setToken('abc');
    expect(getToken()).toBe('abc');
    setToken('def');
    expect(getToken()).toBe('def');
  });

  it('returns null when removed', () => {
    localStorage.setItem(TOKEN_KEY, 'xyz');
    localStorage.removeItem(TOKEN_KEY);
    expect(getToken()).toBeNull();
  });

  it('logout removes the token', () => {
    setToken('bye');
    logout();
    expect(getToken()).toBeNull();
  });

  it('login saves token from API with legacy field', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ accessToken: 'token123', userId: 'me' }),
    });
    await login('a@a.com', 'pass');
    expect(getToken()).toBe('token123');
    expect(getUserId()).toBe('me');
  });

  it('login saves token from API with new field', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ token: 'token456', user: { id: 'you' } }),
    });
    await login('b@b.com', 'pass');
    expect(getToken()).toBe('token456');
    expect(getUserId()).toBe('you');
  });

  it('signup then login stores token', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ accessToken: 't' }) });
    await signup('b@b.com', 'user', 'pw');
    expect(getToken()).toBe('t');
    expect(global.fetch.mock.calls[0][0]).toContain('/auth/signup');
    expect(global.fetch.mock.calls[1][0]).toContain('/auth/login');
  });

  it('getMyId returns stored id without calling API', async () => {
    localStorage.setItem(USER_ID_KEY, 'stored');
    const id = await getMyId();
    expect(id).toBe('stored');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('getMyId fetches id when not stored', async () => {
    global.localStorage = new LocalStorageMock() as any;
    setToken('tok');
    localStorage.removeItem(USER_ID_KEY);
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ userId: 'fetched' }),
    });
    const id = await getMyId();
    expect(id).toBe('fetched');
    expect(localStorage.getItem(USER_ID_KEY)).toBe('fetched');
    expect(global.fetch.mock.calls[0][0]).toContain('/user/me');
  });
});

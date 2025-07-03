import { describe, it, beforeEach, expect, vi } from 'vitest';
import { fetchPostDetail, fetchPostComments } from '../src/lib/postDetail';

declare global {
  var fetch: any;
}

describe('post detail api', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
  });

  it('fetchPostDetail requests post detail', async () => {
    await fetchPostDetail('abc123');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/posts/abc123'),
      expect.objectContaining({ cache: 'no-store' })
    );
  });

  it('fetchPostComments requests comments', async () => {
    await fetchPostComments('abc123');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/posts/abc123/comments'),
      expect.objectContaining({ cache: 'no-store' })
    );
  });
});

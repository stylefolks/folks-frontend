import { describe, it, beforeEach, expect, vi } from 'vitest';
import {
  fetchPostDetail,
  fetchPostComments,
  addPostComment,
  updatePostComment,
  deletePostComment,
  likePost,
  unlikePost,
} from '../src/lib/postDetail';

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

  it('addPostComment posts comment', async () => {
    await addPostComment('1', 'hi');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/posts/1/comments'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'hi' }),
      })
    );
  });

  it('likePost sends POST request', async () => {
    await likePost('1');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/posts/1/like'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('unlikePost sends DELETE request', async () => {
    await unlikePost('1');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/posts/1/unlike'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('updatePostComment sends PATCH request', async () => {
    await updatePostComment('c1', 'edit');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/comment/c1'),
      expect.objectContaining({
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'edit' }),
      })
    );
  });

  it('deletePostComment sends DELETE request', async () => {
    await deletePostComment('c1');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/comment/c1'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});

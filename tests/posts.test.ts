import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPost, searchPosts, type CreatePostDto } from '../src/lib/posts';
import { extractMentionsFromDoc } from '../src/lib/mentions';

declare global {
  var fetch: any;
}

describe('posts helpers', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });
  });

  it('createPost sends POST request with JSON body', async () => {
    const dto: CreatePostDto = {
      title: 't',
      type: 'BASIC',
      content: {},
      crewMentions: [1],
      userMentions: [5],
    };
    await createPost(dto);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/posts'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      }),
    );
  });

  it('searchPosts requests with query params', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [] });
    await searchPosts({ query: 'q', tags: ['a', 'b'], tab: 'COLUMN' });
    const called = global.fetch.mock.calls[0][0] as string;
    const url = new URL(called, 'http://example.com');
    expect(url.pathname).toContain('/posts');
    expect(url.searchParams.get('query')).toBe('q');
    expect(url.searchParams.get('tag')).toBe('a,b');
    expect(url.searchParams.get('tab')).toBe('COLUMN');
  });

  it('extractMentionsFromDoc parses ids', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'mention', attrs: { id: '1', type: 'crew', label: 'c' } },
            { type: 'text', text: 'hello' },
            { type: 'mention', attrs: { id: '2', type: 'user', label: 'u' } },
            { type: 'mention', attrs: { id: '1', type: 'crew', label: 'c' } },
          ],
        },
      ],
    } as any;
    const result = extractMentionsFromDoc(doc);
    expect(result.crewIds).toEqual([1]);
    expect(result.userIds).toEqual([2]);
  });
});

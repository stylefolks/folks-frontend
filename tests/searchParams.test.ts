import { describe, it, expect } from 'vitest';
import { buildSearchParams, parseSearchParams } from '../src/lib/searchParams';

describe('search params utils', () => {
  it('builds comma separated tags', () => {
    const params = buildSearchParams({ tags: ['a', 'b'] });
    expect(params.get('tag')).toBe('a,b');
  });

  it('omits query and type when not provided or ALL', () => {
    const params = buildSearchParams({ query: '', type: 'ALL', tags: [] });
    expect(params.toString()).toBe('');
  });

  it('includes query and type', () => {
    const params = buildSearchParams({ query: 'hello', tags: ['t'], type: 'COLUMN' });
    expect(params.get('query')).toBe('hello');
    expect(params.get('tag')).toBe('t');
    expect(params.get('type')).toBe('COLUMN');
  });

  it('parses values back', () => {
    const opts = parseSearchParams('query=x&tag=a,b&type=BASIC');
    expect(opts.query).toBe('x');
    expect(opts.tags).toEqual(['a', 'b']);
    expect(opts.type).toBe('BASIC');
  });
});

import { describe, it, expect } from 'vitest';
import { buildSearchParams, parseSearchParams } from '../src/lib/searchParams';

describe('search params utils', () => {
  it('builds comma separated tags', () => {
    const params = buildSearchParams({ tags: ['a', 'b'] });
    expect(params.get('tag')).toBe('a,b');
  });

  it('omits query and tab when not provided or ALL', () => {
    const params = buildSearchParams({ query: '', tab: 'ALL', tags: [] });
    expect(params.toString()).toBe('');
  });

  it('includes query and tab', () => {
    const params = buildSearchParams({ query: 'hello', tags: ['t'], tab: 'COLUMN' });
    expect(params.get('query')).toBe('hello');
    expect(params.get('tag')).toBe('t');
    expect(params.get('tab')).toBe('COLUMN');
  });

  it('parses values back', () => {
    const opts = parseSearchParams('query=x&tag=a,b&tab=BASIC');
    expect(opts.query).toBe('x');
    expect(opts.tags).toEqual(['a', 'b']);
    expect(opts.tab).toBe('BASIC');
  });
});

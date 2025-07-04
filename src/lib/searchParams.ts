import type { SearchPostType } from './posts';

export interface SearchOptions {
  query?: string;
  tags?: string[];
  type?: SearchPostType;
}

export function buildSearchParams({ query, tags, type }: SearchOptions): URLSearchParams {
  const params = new URLSearchParams();
  if (query) params.set('query', query);
  if (tags && tags.length) params.set('tag', tags.join(','));
  if (type && type !== 'ALL') params.set('type', type);
  return params;
}

export function parseSearchParams(search: string | URLSearchParams): SearchOptions {
  const params = typeof search === 'string' ? new URLSearchParams(search) : search;
  const query = params.get('query') ?? undefined;
  const tag = params.get('tag');
  const tags = tag ? tag.split(',').filter(Boolean) : [];
  const type = (params.get('type') as SearchPostType) ?? 'ALL';
  return { query, tags, type };
}

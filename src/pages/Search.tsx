import { useState, useEffect, useCallback } from 'react';
import SearchInput from '@/components/search/SearchInput';
import PostTypeTabs, { PostType } from '@/components/search/PostTypeTabs';
import TagFilterChips from '@/components/search/TagFilterChips';
import EmptyState from '@/components/search/EmptyState';
import PostCard from '@/components/PostCard';
import useInfiniteScroll from '@/components/useInfiniteScroll';
import { getNextPosts, type Post } from '@/lib/posts';
import { useMeta } from '@/lib/meta';

const TAGS = ['빈티지', '루즈핏', '페미닌룩', '테크노', '홍대파티'];
const PAGE_SIZE = 10;

function filterByType(post: Post, type: PostType) {
  switch (type) {
    case 'CREW':
      return !!post.crew;
    case 'BRAND':
      return !!post.brand;
    case 'TALK':
      return !post.crew && !post.brand;
    case 'COLUMN':
      return !!post.author;
    default:
      return true;
  }
}

export default function SearchPage() {
  useMeta({ title: 'Search - Stylefolks' });
  const [query, setQuery] = useState('');
  const [type, setType] = useState<PostType>('ALL');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextId, setNextId] = useState(0);

  const applyFilters = useCallback(
    (list: Post[]) =>
      list.filter((p) => {
        const matchesQuery = !query || p.title.includes(query);
        const matchesTags = selectedTags.every((t) => p.tags?.includes(t));
        const matchesType = filterByType(p, type);
        return matchesQuery && matchesTags && matchesType;
      }),
    [query, selectedTags, type]
  );

  const loadMore = useCallback(() => {
    const fetched = getNextPosts(nextId, PAGE_SIZE);
    const filtered = applyFilters(fetched);
    setPosts((prev) => [...prev, ...filtered]);
    setNextId((id) => id + PAGE_SIZE);
  }, [nextId, applyFilters]);

  const ref = useInfiniteScroll(loadMore);

  useEffect(() => {
    const initial = applyFilters(getNextPosts(0, PAGE_SIZE));
    setPosts(initial);
    setNextId(PAGE_SIZE);
  }, [query, selectedTags, type, applyFilters]);

  return (
    <div className="p-4 space-y-4">
      <SearchInput value={query} onChange={setQuery} />
      <PostTypeTabs value={type} onChange={setType} />
      <TagFilterChips tags={TAGS} selected={selectedTags} onChange={setSelectedTags} />
      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          <div ref={ref} />
        </div>
      )}
    </div>
  );
}

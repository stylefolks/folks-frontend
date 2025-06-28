import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import SearchInput from "@/components/search/SearchInput";
import PostTypeTabs from "@/components/search/PostTypeTabs";
import TagFilterChips from "@/components/search/TagFilterChips";
import EmptyState from "@/components/search/EmptyState";
import PostCard from "@/components/PostCard";
import useInfiniteScroll from "@/components/useInfiniteScroll";
import { getNextPosts, PostType, SearchPostType, type Post } from "@/lib/posts";
import { useMeta } from "@/lib/meta";
import { TAGS } from "@/mocks/tags";

const PAGE_SIZE = 10;

function filterByType(post: Post, type: SearchPostType) {
  switch (type) {
    case "TALK":
      return post.type === "BASIC";
    case "COLUMN":
      return post.type === "COLUMN";
    default:
      return true;
  }
}

export default function SearchPage() {
  useMeta({ title: "Search - Stylefolks" });
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SearchPostType>("ALL");
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tag = params.get("tag");
    if (tag) {
      setSelectedTags([tag]);
    }
  }, [location.search]);

  return (
    <div className="p-4 space-y-4">
      <SearchInput value={query} onChange={setQuery} />
      <PostTypeTabs value={type} onChange={setType} />
      <TagFilterChips
        tags={TAGS}
        selected={selectedTags}
        onChange={setSelectedTags}
      />
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

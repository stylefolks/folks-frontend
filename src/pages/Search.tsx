import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchInput from "@/components/search/SearchInput";
import PostTypeTabs from "@/components/search/PostTypeTabs";
import TagFilterChips from "@/components/search/TagFilterChips";
import EmptyState from "@/components/search/EmptyState";
import PostCard from "@/components/PostCard";
import { searchPosts, SearchPostType, type Post } from "@/lib/posts";
import { buildSearchParams, parseSearchParams } from "@/lib/searchParams";
import { useMeta } from "@/lib/meta";
import { TAGS } from "@/mocks/tags";

const DEBOUNCE_MS = 500;

export default function SearchPage() {
  useMeta({ title: "Search - Stylefolks" });
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = parseSearchParams(searchParams);
  const [query, setQuery] = useState(initial.query ?? "");
  const [tab, setTab] = useState<SearchPostType>(initial.tab ?? "ALL");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initial.tags ?? []
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [debounced, setDebounced] = useState(initial.query ?? "");

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    searchPosts({ query: debounced, tags: selectedTags, tab })
      .then(setPosts)
      .catch(() => setPosts([]));
  }, [debounced, selectedTags, tab]);

  useEffect(() => {
    const parsed = parseSearchParams(searchParams);
    setQuery(parsed.query ?? "");
    setSelectedTags(parsed.tags ?? []);
    setTab(parsed.tab ?? "ALL");
  }, [searchParams]);

  useEffect(() => {
    const params = buildSearchParams({
      query: debounced,
      tags: selectedTags,
      tab,
    });
    setSearchParams(params);
  }, [debounced, selectedTags, tab, setSearchParams]);

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
      <PostTypeTabs value={tab} onChange={setTab} />
      <TagFilterChips
        tags={TAGS}
        selected={selectedTags}
        onChange={setSelectedTags}
      />
      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="columns-2 gap-4 sm:columns-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

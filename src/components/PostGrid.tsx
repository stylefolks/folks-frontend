'use client';

import { useCallback, useEffect, useState } from "react";
import PostCard from "./PostCard";
import useInfiniteScroll from "./useInfiniteScroll";
import { getPosts, type Post } from "@/lib/posts";

const PAGE_SIZE = 20;

export default function PostGrid() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);

  const loadMore = useCallback(() => {
    const newPosts = getPosts(page, PAGE_SIZE);
    setPosts((prev) => [...prev, ...newPosts]);
    setPage((p) => p + 1);
  }, [page]);

  useEffect(() => {
    loadMore();
  }, []); // initial

  const ref = useInfiniteScroll(loadMore);

  return (
    <div className="columns-2 md:columns-3 gap-4 p-4">
      {posts.map((post) => (
        <div key={post.id} className="break-inside-avoid">
          <PostCard post={post} />
        </div>
      ))}
      <div ref={ref} />
    </div>
  );
}

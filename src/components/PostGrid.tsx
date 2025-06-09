"use client";

import { useCallback, useState } from "react";
import PostCard from "./PostCard";
import useInfiniteScroll from "./useInfiniteScroll";
import { getPosts, type Post } from "@/lib/posts";

const PAGE_SIZE = 20;

export default function PostGrid() {
  const [posts, setPosts] = useState<Post[]>(() => getPosts(0, PAGE_SIZE));
  const [page, setPage] = useState(1);

  const loadMore = useCallback(() => {
    const newPosts = getPosts(page, PAGE_SIZE);
    setPosts((prev) => [...prev, ...newPosts]);
    setPage((p) => p + 1);
  }, [page]);

  const ref = useInfiniteScroll(loadMore);

  return (
    <div className="columns-2 md:columns-3 gap-4 p-4">
      {posts.map((post) => (
        <div key={`post-${post.id}`} className="break-inside-avoid">
          <PostCard post={post} />
        </div>
      ))}
      <div ref={ref} />
    </div>
  );
}

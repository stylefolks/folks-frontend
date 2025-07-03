import React, { useEffect, useRef, useState } from "react";
import FeedCard from "./FeedCard";

interface Post {
  id: string;
  title: string;
  imageUrl: string;
  author: { nickname: string };
  tags: string[];
  likeCount: number;
}

interface PostResponse {
  posts: Post[];
  nextCursor?: string;
}

export default function PostFeedGrid() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>("start");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (cursor === null) return;
    fetch(`/posts${cursor && cursor !== "start" ? `?cursor=${cursor}` : ""}`)
      .then((res) => res.json())
      .then((data: PostResponse) => {
        setPosts((prev) => [...prev, ...data.posts]);
        setNextCursor(data.nextCursor ?? null);
        setCursor(null);
      })
      .catch(() => setCursor(null));
  }, [cursor]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextCursor) {
        setCursor(nextCursor);
      }
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, nextCursor]);

  return (
    <div className="columns-2 gap-4 p-4" role="feed">
      {posts.map((post) => (
        <div key={post.id} className="break-inside-avoid">
          <FeedCard post={post} />
        </div>
      ))}
      {nextCursor && <div ref={loaderRef} className="h-4" />}
    </div>
  );
}

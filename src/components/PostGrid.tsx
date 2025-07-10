import { useCallback, useState } from "react";
import PostCard from "./PostCard";
import useInfiniteScroll from "./useInfiniteScroll";
import { getPosts } from "@/lib/posts";
import { useNavigate } from "react-router-dom";
import { Post } from "@/types/post";

const PAGE_SIZE = 20;

export default function PostGrid() {
  const [posts, setPosts] = useState<Post[]>(() => getPosts(0, PAGE_SIZE));
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const loadMore = useCallback(() => {
    const newPosts = getPosts(page, PAGE_SIZE);
    setPosts((prev) => [...prev, ...newPosts]);
    setPage((p) => p + 1);
  }, [page]);

  const ref = useInfiniteScroll(loadMore);

  const handlePostClick = (id: string) => {
    document.startViewTransition(() => {
      navigate(`/posts/${id}`);
    });
  };

  return (
    <>
      <h2 className="p-4 text-l font-bold">Latest Posts</h2>
      <div className="columns-2 gap-4 p-4 sm:columns-3">
        {posts.map((post) => (
          <PostCard key={`post-${post.id}`} post={post} />
        ))}
        <div ref={ref} />
      </div>
    </>
  );
}

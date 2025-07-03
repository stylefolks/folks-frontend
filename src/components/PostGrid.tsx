import { useCallback, useState } from 'react';
import PostCard from './PostCard';
import useInfiniteScroll from './useInfiniteScroll';
import { getPosts, type Post } from '@/lib/posts';
import { useNavigate } from 'react-router-dom';
import FeedCard from './FeedCard';

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
    <h2 className="text-l font-bold p-4">Latest Posts</h2>
    <div className="columns-2 md:columns-3 gap-4 p-4">
      {posts.map((post) => (
        <div
          key={`post-${post.id}`}
          className="break-inside-avoid"
          onClick={() => handlePostClick(String(post.id))}
          style={{ cursor: 'pointer' }}
        >
          <PostCard post={post} />
        </div>
      ))}
      <div ref={ref} />
    </div>
    </>
  );
}

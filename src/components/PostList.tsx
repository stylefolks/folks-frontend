import PostCard from './PostCard';
import type { Post } from '@/lib/posts';
import { useNavigate } from 'react-router-dom';

export default function PostList({ posts }: { posts: Post[] }) {
  const navigate = useNavigate();
  if (posts.length === 0) return <p>No posts</p>;
  return (
    <div className="grid grid-cols-2 gap-4">
      {posts.map((post) => (
        <div key={post.id} onClick={() => navigate(`/post/${post.id}`)}>
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}

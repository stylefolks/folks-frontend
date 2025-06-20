import BrandPostCard from './BrandPostCard';
import type { Post } from '@/lib/posts';

export default function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return <p>No posts</p>;
  const promoted = posts.filter((p) => p.isPromoted);
  const normal = posts.filter((p) => !p.isPromoted);
  return (
    <div className="grid grid-cols-2 gap-4">
      {promoted.map((post) => (
        <BrandPostCard key={post.id} post={post} />
      ))}
      {normal.map((post) => (
        <BrandPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

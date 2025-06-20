import type { Post } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import AdBadge from '@/components/AdBadge';

export default function BrandPostCard({ post }: { post: Post }) {
  return (
    <div className="relative">
      {post.isSponsored && <AdBadge />}
      <PostCard post={post} />
    </div>
  );
}

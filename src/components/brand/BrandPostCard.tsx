import PostCard from "@/components/PostCard";
import AdBadge from "@/components/AdBadge";
import { Post } from "@/types/post";

export default function BrandPostCard({ post }: { post: Post }) {
  return (
    <div className="relative">
      {post.isSponsored && <AdBadge />}
      <PostCard post={post} />
    </div>
  );
}

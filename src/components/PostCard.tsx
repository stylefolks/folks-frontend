import type { Post } from "@/lib/posts";
import ImageWithSkeleton from './ImageWithSkeleton';

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  // Height based on id for consistent randomness
  const height = 150 + (post.id % 3) * 50;

  return (
    <div className="mb-4 block w-full transition-opacity hover:opacity-80">
      <div
        style={{ height, viewTransitionName: `post-${post.id}` }}
        className="relative w-full overflow-hidden rounded-lg bg-gray-100"
      >
        {post.image ? (
          <ImageWithSkeleton
            src={post.image}
            alt={post.title}
            className="h-full w-full"
          />
        ) : (
          <h3 className="mt-2 text-sm font-medium">{post.title}</h3>
        )}
      </div>
    </div>
  );
}

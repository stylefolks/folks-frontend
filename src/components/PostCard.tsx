import type { Post } from "@/lib/posts";
import ImageWithSkeleton from "./ImageWithSkeleton";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

interface Props {
  post: Post;
  withTitle?: boolean;
}

export default function PostCard({ post, withTitle }: Props) {
  // Height based on id for consistent randomness
  const navigate = useNavigate();
  const height = 150 + (post.id % 3) * 50;

  return (
    <div className="mb-4 block w-full transition-opacity hover:opacity-80">
      <div
        style={{ height, viewTransitionName: `post-${post.id}` }}
        className="relative w-full overflow-hidden rounded-lg bg-gray-100 cursor-pointer"
        onClick={() => navigate(`/post/${post.id}`)}
      >
        {post.image ? (
          <>
            <ImageWithSkeleton
              src={post.image}
              alt={post.title}
              className="h-full w-full"
            />
          </>
        ) : (
          <Skeleton className={cn("absolute inset-0")} />
        )}
      </div>
      {withTitle && (
        <h3 className="mt-2 text-sm font-medium text-black text-center">
          {post.title}
        </h3>
      )}
    </div>
  );
}

import type { Post } from "@/lib/posts";
import ImageWithSkeleton from "./ImageWithSkeleton";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface Props {
  post: Post;
  withTitle?: boolean;
}

export default function PostCard({ post, withTitle = true }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/posts/${post.id}`)}
      className="mb-4 break-inside-avoid cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-opacity hover:opacity-80"
    >
      {post.image ? (
        <ImageWithSkeleton
          src={post.image}
          alt={post.title}
          className="aspect-[4/5] w-full"
        />
      ) : (
        <div className="aspect-[4/5] w-full">
          <Skeleton className="h-full w-full" />
        </div>
      )}
      <div className="space-y-1 p-3">
        {withTitle && (
          <div className="text-sm font-semibold text-black">{post.title}</div>
        )}
        <div className="flex items-center justify-between text-sm text-neutral-500">
          <span className="flex items-center gap-1">
            <span role="img" aria-label="likes">
              ❤️
            </span>
            {post.likeCount}
          </span>
          <div className="flex items-center gap-1">
            {post.author.imageUrl && (
              <img
                src={post.author.imageUrl}
                alt={post.author.username}
                className="h-5 w-5 rounded-full"
              />
            )}
            <span className="text-xs">@{post.author.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

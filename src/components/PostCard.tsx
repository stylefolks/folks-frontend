import ImageWithSkeleton from "./ImageWithSkeleton";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import { Heart, MessageCircleIcon } from "lucide-react";
import type { PostDto } from "@/dto/postDto";

type Props = {
  post: PostDto;
  withTitle?: boolean;
};

export default function PostCard({ post, withTitle = true }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/posts/${post.id}`)}
      className="mb-4 break-inside-avoid cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-opacity hover:opacity-80"
    >
      <div className="relative">
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
        <span className="absolute flex items-center gap-1 bottom-0 bg-white px-2 rounded-tr-xl py-1">
          <span role="img" aria-label="likes">
            <Heart size={12} fill="black" />
          </span>
          <span className="text-xs">{post.likeCount || 0}</span>
        </span>
      </div>

      <div className="py-1 px-3">
        <div className="text-sm font-semibold text-black">{post.title}</div>
        <div className="flex items-center justify-between text-sm text-neutral-500 py-1">
          <div className="flex items-center gap-1">
            {post.author?.imageUrl && (
              <img
                src={post.author.imageUrl}
                alt={post.author.username}
                className="h-5 w-5 rounded-full"
              />
            )}

            <span className="text-xs">{post.author?.username}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircleIcon size={12} />
            <span className="text-xs">{post.commentCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

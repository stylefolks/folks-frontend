import { SimpleUser } from "@/types/user";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export interface CrewPost {
  id: string;
  title: string;
  imageUrl: string;
  author: SimpleUser;
  tags: string[];
  likeCount: number;
}

export default function CrewFeedCard({ post }: { post: CrewPost }) {
  const firstTag = post.tags[0];
  return (
    <Link
      to={`/posts/${post.id}`}
      className="mb-4 block break-inside-avoid overflow-hidden rounded-xl bg-white shadow-md"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="h-full w-full object-cover"
        />
        {firstTag && (
          <span className="absolute left-2 top-2 rounded-full bg-muted px-2 py-1 text-xs">
            #{firstTag}
          </span>
        )}
      </div>
      <div className="space-y-1 p-3">
        <div className="text-sm font-semibold text-black">{post.title}</div>
        <div className="flex items-center justify-between text-sm text-neutral-500">
          <span className="flex items-center gap-1">
            <Heart size={14} /> {post.likeCount}
          </span>
          <span className="text-xs">{post.author.username}</span>
        </div>
      </div>
    </Link>
  );
}

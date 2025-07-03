import React from "react";
import { Heart } from "lucide-react";

interface Post {
  id: string;
  title: string;
  imageUrl: string;
  author: { nickname: string };
  tags: string[];
  likeCount: number;
}

export default function FeedCard({ post }: { post: Post }) {
  return (
    <div className="mb-3 w-full">
      <div className="overflow-hidden rounded-lg bg-muted aspect-[4/5]">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="h-full w-full object-cover"
        />
      </div>
      <h3 className="mt-2 text-sm font-semibold">{post.title}</h3>
      <div className="mt-1 flex items-center justify-between text-sm opacity-80">
        <span>{post.author.nickname}</span>
        <span className="flex items-center gap-1">
          <Heart size={14} /> {post.likeCount}
        </span>
      </div>
    </div>
  );
}

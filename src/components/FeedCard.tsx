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
    <div className="mb-4 w-full">
      <div className="rounded-2xl overflow-hidden bg-muted">
        <img src={post.imageUrl} alt={post.title} className="w-full object-cover" />
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {post.tags.map((t) => (
          <span key={t} className="text-xs text-gray-500">#{t}</span>
        ))}
      </div>
      <h3 className="font-semibold mt-1 text-sm">{post.title}</h3>
      <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
        <span>{post.author.nickname}</span>
        <span className="flex items-center gap-1">
          <Heart size={14} /> {post.likeCount}
        </span>
      </div>
    </div>
  );
}

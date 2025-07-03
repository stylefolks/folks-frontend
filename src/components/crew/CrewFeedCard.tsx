import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CrewPost {
  id: string;
  title: string;
  imageUrl: string;
  author: { nickname: string };
  tags: string[];
  likeCount: number;
}

export default function CrewFeedCard({ post }: { post: CrewPost }) {
  const firstTag = post.tags[0];
  return (
    <Link to={`/posts/${post.id}`} className="block break-inside-avoid mb-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md">
        <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
        {firstTag && (
          <span className="absolute left-2 top-2 rounded-full bg-muted px-2 py-1 text-xs">#{firstTag}</span>
        )}
      </div>
      <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
        <span>{post.author.nickname}</span>
        <span className="flex items-center gap-1">
          <Heart size={14} /> {post.likeCount}
        </span>
      </div>
    </Link>
  );
}

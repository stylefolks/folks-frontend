import { Post } from '@/lib/posts';
import { Heart } from 'lucide-react';



export default function MyPostCard({ post }: { post: Post }) {
  return (
    <a className="mb-3 w-full break-inside-avoid" href={`/posts/${post.id}`}>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
        <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
          <Heart size={12} /> {post.likeCount}
        </span>
      </div>
      <h3 className="mt-1 text-sm font-semibold">{post.title}</h3>
      <div className="mt-1 text-xs text-blue-500">{post.tags?.join(",")}</div>
    </a>
  );
}

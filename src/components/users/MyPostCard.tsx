import { Heart } from 'lucide-react';

export interface MyPost {
  id: string;
  title: string;
  subtitle: string;
  hashtags: string[];
  imageUrl: string;
  likeCount: number;
}

export default function MyPostCard({ post }: { post: MyPost }) {
  return (
    <div className="mb-3 w-full break-inside-avoid">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
        <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
          <Heart size={12} /> {post.likeCount}
        </span>
      </div>
      <h3 className="mt-1 text-sm font-semibold">{post.title}</h3>
      <p className="text-xs text-gray-500">{post.subtitle}</p>
      <div className="mt-1 text-xs text-blue-500">{post.hashtags.join(' ')}</div>
    </div>
  );
}

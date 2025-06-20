import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '@/components/PostCard';
import type { Post } from '@/lib/posts';
import { fetchBrandPostPreviews } from '@/lib/brand';

export default function BrandPostPreviewList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBrandPostPreviews(6).then(setPosts);
  }, []);

  if (posts.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 pb-2">
        {posts.map((post) => (
          <div
            key={post.id}
            className="min-w-[160px] flex-shrink-0"
            onClick={() => navigate(`/post/${post.id}`)}
          >
            <PostCard post={post} />
            <p className="mt-1 text-xs text-gray-500">
              {new Date(post.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

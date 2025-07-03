import { useEffect, useState } from 'react';
import { useMeta } from '@/lib/meta';
import { getPosts, type Post } from '@/lib/posts';
import PostList from '@/components/PostList';

export default function PostsPage() {
  useMeta({ title: 'Posts - Stylefolks' });
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // 클라이언트 데이터 페칭을 단순화하기 위해 목 데이터를 사용
    setPosts(getPosts(0, 10));
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Posts</h1>
      <PostList posts={posts} />
    </div>
  );
}

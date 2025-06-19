import { useMeta } from '@/lib/meta';

export default function PostsPage() {
  useMeta({ title: 'Posts - Stylefolks' });
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Posts</h1>
      {/* TODO: posts list */}
    </div>
  );
}

import PostGrid from '@/components/PostGrid';
import { useMeta } from '@/lib/meta';
export default function Home() {
  useMeta({ title: 'Home - Stylefolks' });
  return (
    <main className="min-h-screen bg-white">
      <PostGrid />
    </main>
  );
}

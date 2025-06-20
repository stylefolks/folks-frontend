import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMeta } from '@/lib/meta';
import { fetchBrand, fetchBrandPosts, Brand } from '@/lib/brand';
import type { Post } from '@/lib/posts';
import BrandHeader from '@/components/brand/BrandHeader';
import PostList from '@/components/brand/PostList';

export default function BrandDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useMeta({ title: brand ? `${brand.name} - Stylefolks` : 'Brand - Stylefolks' });

  useEffect(() => {
    if (!id) return;
    Promise.all([fetchBrand(id), fetchBrandPosts(id)])
      .then(([b, p]) => {
        setBrand(b);
        setPosts(p);
      })
      .catch(() => {});
  }, [id]);

  if (!brand) return <p className="p-4">Loading...</p>;

  const brandPosts = posts.filter((post: any) => post.type === 'BRAND');

  // latest first
  brandPosts.sort((a, b) => {
    const pA = a.isPromoted === b.isPromoted ? 0 : a.isPromoted ? -1 : 1;
    if (pA !== 0) return pA;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <BrandHeader brand={brand} />
      <PostList posts={brandPosts} />
    </div>
  );
}

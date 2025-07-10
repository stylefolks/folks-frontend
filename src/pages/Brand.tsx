import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMeta } from "@/lib/meta";
import { fetchBrand, fetchBrandPosts, type Brand } from "@/lib/brand";

import PostCard from "@/components/PostCard";
import AdBadge from "@/components/AdBadge";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { Post } from "@/types/post";

export default function BrandPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  useMeta({
    title: brand ? `${brand.name} - Stylefolks` : "Brand - Stylefolks",
  });

  useEffect(() => {
    if (!brandId) return;
    setLoading(true);
    Promise.all([fetchBrand(brandId), fetchBrandPosts(brandId)])
      .then(([b, p]) => {
        setBrand(b);
        setPosts(p);
      })
      .finally(() => setLoading(false));
  }, [brandId]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!brand) return <p className="p-4">No brand</p>;

  return (
    <div className="mx-auto max-w-[720px] space-y-4 p-4">
      <ImageWithSkeleton
        src={brand.logo}
        alt={brand.name}
        className="h-24 w-24 rounded"
      />
      <div>
        <h1 className="text-xl font-bold">{brand.name}</h1>
        <p className="text-sm text-gray-600">{brand.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {posts.map((post) => (
          <div className="relative" key={post.id}>
            <AdBadge />
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import BrandEventBannerSlider from '@/components/brands/BrandEventBannerSlider';
import BrandPostPreviewList from '@/components/brands/BrandPostPreviewList';
import TagFilter from '@/components/brands/TagFilter';
import BrandCard from '@/components/brands/BrandCard';

interface Brand {
  id: number;
  name: string;
  logo: string;
  description: string;
  crew: { id: number; name: string; avatar: string }[];
}

export default function BrandsPage() {
  const [tag, setTag] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const query = tag ? `?tag=${encodeURIComponent(tag)}` : '';
    fetch(`/brands${query}`)
      .then((res) => res.json())
      .then(setBrands);
  }, [tag]);

  return (
    <main className="space-y-6 p-4">
      <h1 className="text-xl font-bold">
        Folks에서 만날 수 있는 브랜드들을 소개할게요
      </h1>

      <section>
        <BrandEventBannerSlider />
      </section>

      <section>
        <BrandPostPreviewList />
      </section>

      <TagFilter onSelect={(t) => setTag(t)} />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {brands.map((b) => (
          <BrandCard key={b.id} {...b} />
        ))}
      </section>
    </main>
  );
}

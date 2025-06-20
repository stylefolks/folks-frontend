import { useEffect, useState } from 'react';
import { useMeta } from '@/lib/meta';
import {
  fetchBrands,
  type BrandSummary,
} from '@/lib/brand';
import BrandEventBannerSlider from '@/components/brands/BrandEventBannerSlider';
import BrandPostPreviewList from '@/components/brands/BrandPostPreviewList';
import TagFilter from '@/components/brands/TagFilter';
import BrandList from '@/components/brands/BrandList';

const TAGS = ['디자이너', '빈티지', '스트릿', '서울팝업'];

export default function BrandsPage() {
  useMeta({ title: 'Brands - Stylefolks' });
  const [recommended, setRecommended] = useState<BrandSummary[]>([]);
  const [tag, setTag] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands({ sort: 'popular' }).then(setRecommended);
  }, []);

  const eventBrands = recommended.filter((b) => b.upcomingEvent);

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-xl font-bold">Folks에서 만날 수 있는 브랜드들을 소개할게요</h1>
      <BrandEventBannerSlider brands={eventBrands} />
      <BrandPostPreviewList />
      <TagFilter tags={TAGS} selected={tag} onChange={setTag} />
      <BrandList tag={tag} />
    </div>
  );
}

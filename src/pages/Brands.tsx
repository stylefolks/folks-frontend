import { useEffect, useState } from "react";
import { useMeta } from "@/lib/meta";
import { fetchBrands, type BrandSummary } from "@/lib/brand";
import BrandEventBannerSlider from "@/components/brands/BrandEventBannerSlider";
import BrandPostPreviewList from "@/components/brands/BrandPostPreviewList";
import TagFilter from "@/components/brands/TagFilter";
import BrandList from "@/components/brands/BrandList";
import { TAGS } from "@/mocks/tags";

export default function BrandsPage() {
  useMeta({ title: "Brands - Stylefolks" });
  const [recommended, setRecommended] = useState<BrandSummary[]>([]);
  const [tag, setTag] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands({ sort: "popular" }).then(setRecommended);
  }, []);

  const eventBrands = recommended.filter((b) => b.upcomingEvent);

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-xl font-bold">
        Folks에서 만날 수 있는 브랜드들을 소개할게요
      </h1>
      <BrandEventBannerSlider brands={eventBrands} />
      <h2 className="text-xl font-bold">브랜드가 만든 최신 콘텐츠</h2>
      <BrandPostPreviewList />
      <div className="flex gap-2">
        <h3 className="text-l font-bold">필터</h3>
        <TagFilter tags={TAGS} selected={tag} onChange={setTag} />
      </div>
      {tag && <h2 className="text-xl font-bold">#{tag}</h2>}
      <BrandList tag={tag} />
    </div>
  );
}

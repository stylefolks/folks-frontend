import { useCallback, useEffect, useState } from "react";
import BrandCard from "./BrandCard";
import useInfiniteScroll from "@/components/useInfiniteScroll";
import { fetchBrands } from "@/lib/brand";
import { BrandSummary } from "@/types/brand";

export default function BrandList({ tag }: { tag?: string | null }) {
  const [brands, setBrands] = useState<BrandSummary[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setBrands([]);
    setPage(0);
  }, [tag]);

  const loadMore = useCallback(() => {
    fetchBrands({ page: String(page + 1), ...(tag ? { tag } : {}) }).then(
      (b) => {
        setBrands((prev) => [...prev, ...b]);
        setPage((p) => p + 1);
      }
    );
  }, [page, tag]);

  const ref = useInfiniteScroll(loadMore);

  return (
    <div className="grid grid-cols-2 gap-4">
      {brands.map((brand) => (
        <BrandCard key={brand.id} brand={brand} />
      ))}
      <div ref={ref} />
    </div>
  );
}

import BrandCard from './BrandCard';
import type { BrandSummary } from '@/lib/brand';

export default function BrandEventBannerSlider({
  brands,
}: {
  brands: BrandSummary[];
}) {
  if (brands.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 pb-2">
        {brands.map((brand) => (
          <div key={brand.id} className="min-w-[200px] flex-shrink-0">
            <BrandCard brand={brand} />
            {brand.upcomingEvent && (
              <p className="mt-1 text-xs text-gray-500">
                {brand.upcomingEvent.title} {brand.upcomingEvent.date}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { BrandSummary } from "@/types/brand";
import { useNavigate } from "react-router-dom";

export default function BrandCard({ brand }: { brand: BrandSummary }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/brand/${brand.id}`)}
      className="cursor-pointer space-y-1"
    >
      <ImageWithSkeleton
        src={brand.logo}
        alt={brand.name}
        className="h-32 w-full rounded object-cover"
      />
      <h3 className="text-sm font-semibold">{brand.name}</h3>
      <p className="text-xs text-gray-500 line-clamp-2">{brand.description}</p>
      {brand.crews && brand.crews.length > 0 && (
        <div className="flex -space-x-2 pt-1">
          {brand.crews.map((c) => (
            <img
              key={c.id}
              src={c.image}
              alt={c.name}
              className="h-6 w-6 rounded-full border border-white"
            />
          ))}
        </div>
      )}
    </div>
  );
}

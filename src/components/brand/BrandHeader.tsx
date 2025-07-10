import { Brand } from "@/types/brand";
import ExternalLinkList from "./ExternalLinkList";

interface Props {
  brand: Brand;
}

export default function BrandHeader({ brand }: Props) {
  return (
    <div className="space-y-2 text-center">
      <img
        src={brand.logo}
        alt={brand.name}
        className="mx-auto h-24 w-24 rounded-full object-cover"
      />
      <h1 className="text-xl font-bold">{brand.name}</h1>
      {brand.description && (
        <p className="text-sm text-gray-600">{brand.description}</p>
      )}
      {brand.links && brand.links.length > 0 && (
        <ExternalLinkList links={brand.links} />
      )}
    </div>
  );
}

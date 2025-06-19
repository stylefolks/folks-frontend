import { useParams } from 'react-router-dom';
import { useMeta } from '@/lib/meta';

export default function BrandPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  useMeta({ title: `Brand ${brandId} - Stylefolks` });
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Brand {brandId}</h1>
      <p className="text-sm text-gray-600">This is the brand page.</p>
    </div>
  );
}

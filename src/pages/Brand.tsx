import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function BrandPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  return (
    <>
      <Helmet>
        <title>Brand {brandId} | Stylefolks</title>
        <meta name="description" content={`Details about brand ${brandId}`} />
      </Helmet>
      <div className="p-4">
        <h1 className="text-xl font-bold">Brand {brandId}</h1>
        <p className="text-sm text-gray-600">This is the brand page.</p>
      </div>
    </>
  );
}

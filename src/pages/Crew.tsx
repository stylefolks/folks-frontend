import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function CrewPage() {
  const params = useParams();
  const crewId = params.crewId as string;
  return (
    <>
      <Helmet>
        <title>Crew {crewId} | Stylefolks</title>
        <meta name="description" content={`Details about crew ${crewId}`} />
      </Helmet>
      <div className="p-4">
        <h1 className="text-xl font-bold">Crew {crewId}</h1>
        <p className="text-sm text-gray-600">This is the crew page.</p>
      </div>
    </>
  );
}

import { useParams } from 'react-router-dom';
import { useMeta } from '@/lib/meta';

export default function CrewPage() {
  const params = useParams();
  const crewId = params.crewId as string;
  useMeta({ title: `Crew ${crewId} - Stylefolks` });
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Crew {crewId}</h1>
      <p className="text-sm text-gray-600">This is the crew page.</p>
    </div>
  );
}

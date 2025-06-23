import ImageWithSkeleton from '@/components/ImageWithSkeleton';
import TagList from '@/components/TagList';
import { useNavigate } from 'react-router-dom';
import type { CrewSummary } from '@/lib/crew';

export default function CrewCard({ crew }: { crew: CrewSummary }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/crew/${crew.id}/posts`)}
      className="cursor-pointer space-y-1"
    >
      <ImageWithSkeleton
        src={crew.coverImage}
        alt={crew.name}
        className="h-32 w-full rounded"
      />
      <h3 className="text-sm font-semibold">{crew.name}</h3>
      {crew.tags && <TagList tags={crew.tags} />}
      <p className="text-xs text-gray-500">멤버 {crew.memberCount}</p>
    </div>
  );
}

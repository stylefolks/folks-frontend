import { useNavigate } from 'react-router-dom';

export default function CrewBanner({ crew }: { crew: { id: string; name: string } }) {
  const navigate = useNavigate();
  if (!crew) return null;
  return (
    <div
      onClick={() => navigate(`/crew/${crew.id}/posts`)}
      className="cursor-pointer rounded bg-blue-100 px-3 py-2 text-sm font-semibold"
    >
      by {crew.name}
    </div>
  );
}

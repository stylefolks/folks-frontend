import { useCallback, useEffect, useState } from 'react';
import CrewCard from './CrewCard';
import useInfiniteScroll from '@/components/useInfiniteScroll';
import { fetchCrews, type CrewSummary } from '@/lib/crew';

export default function CrewList({ tag }: { tag?: string | null }) {
  const [crews, setCrews] = useState<CrewSummary[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setCrews([]);
    setPage(0);
  }, [tag]);

  const loadMore = useCallback(() => {
    fetchCrews({ page: String(page + 1), ...(tag ? { tag } : {}) }).then((c) => {
      setCrews((prev) => [...prev, ...c]);
      setPage((p) => p + 1);
    });
  }, [page, tag]);

  const ref = useInfiniteScroll(loadMore);

  return (
    <div className="grid grid-cols-2 gap-4">
      {crews.map((crew) => (
        <CrewCard key={crew.id} crew={crew} />
      ))}
      <div ref={ref} />
    </div>
  );
}

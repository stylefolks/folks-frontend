import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCrews, type CrewSummary } from '@/lib/crew';
import { useMeta } from '@/lib/meta';
import { Button } from '@/components/ui/button';
import ImageWithSkeleton from '@/components/ImageWithSkeleton';
import HotHashtagChips from '@/components/crew-directory/HotHashtagChips';
import SearchInput from '@/components/crew-directory/SearchInput';

export default function CrewDirectoryPage() {
  useMeta({ title: 'Crews Directory - Stylefolks' });
  const [tag, setTag] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [debounced, setDebounced] = useState('');
  const [crews, setCrews] = useState<CrewSummary[]>([]);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(keyword), 500);
    return () => clearTimeout(id);
  }, [keyword]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (tag) params.tag = tag;
    else if (debounced) params.keyword = debounced;
    fetchCrews(params).then(setCrews).catch(() => setCrews([]));
  }, [tag, debounced]);

  const handleTagSelect = (value: string | null) => {
    setTag(value);
    setKeyword('');
  };

  return (
    <div className="min-h-screen bg-white pb-8">
      <div className="space-y-4 pt-4">
        <section className="px-4">
          <h2 className="pb-2 text-md font-bold">HOT Hashtags</h2>
          <HotHashtagChips selected={tag} onSelect={handleTagSelect} />
        </section>
        <section className="px-4">
          <SearchInput
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="해시태그 또는 크루명을 검색해보세요"
          />
        </section>
        <section className="grid grid-cols-2 gap-3 px-4">
          {crews.map((crew) => (
            <CrewCard key={crew.id} crew={crew} />
          ))}
        </section>
      </div>
    </div>
  );
}

function CrewCard({ crew }: { crew: CrewSummary }) {
  return (
    <Link
      to={`/crew/${crew.id}`}
      className="space-y-1 rounded-2xl transition-all hover:scale-[1.02]">
      <ImageWithSkeleton
        src={crew.coverImage}
        alt={crew.name}
        className="aspect-square rounded-lg"
        skeletonClassName="rounded-lg"
      />
      <div className="space-y-1 px-1">
        <div className="text-sm font-bold">{crew.name}</div>
        <div className="text-xs text-gray-500">
          {crew.memberCount.toLocaleString()} members
        </div>
        <div className="flex flex-wrap gap-1">
          {crew.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-muted px-2 py-0.5 text-xs"
            >
              #{t}
            </span>
          ))}
        </div>
        {/* <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-full px-3 py-1 text-xs"
        >
          
        </Button> */}
      </div>
    </Link>
  );
}

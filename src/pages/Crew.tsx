import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMeta } from '@/lib/meta';
import { fetchCrew, fetchCrewPosts, type Crew } from '@/lib/crew';
import type { Post } from '@/lib/posts';
import PostCard from '@/components/PostCard';

export default function CrewPage() {
  const params = useParams();
  const crewId = params.crewId as string;
  const [crew, setCrew] = useState<Crew | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  useMeta({ title: crew ? `${crew.name} - Stylefolks` : 'Crew - Stylefolks' });

  useEffect(() => {
    if (!crewId) return;
    setLoading(true);
    Promise.all([fetchCrew(crewId), fetchCrewPosts(crewId)])
      .then(([c, p]) => {
        setCrew(c);
        setPosts(p);
      })
      .finally(() => setLoading(false));
  }, [crewId]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!crew) return <p className="p-4">No crew</p>;

  return (
    <div className="mx-auto max-w-[720px] space-y-4 p-4">
      <img src={crew.coverImage} alt={crew.name} className="h-40 w-full rounded object-cover" />
      <div>
        <h1 className="text-xl font-bold">{crew.name}</h1>
        <p className="text-sm text-gray-600">{crew.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import TagList from '@/components/TagList';
import { mockPost, type Post } from '@/lib/posts';

interface CrewItem {
  id: string;
  name: string;
  imageUrl: string;
}

interface ProfileData {
  userId: string;
  username: string;
  bio: string;
  imageUrl: string;
  tags: string[];
  following: number;
  followers: number;
  posts: (Post & { category: 'TALK' | 'COLUMN' | 'CREW' })[];
  crews: CrewItem[];
}

function generateMockProfile(userId: string): ProfileData {
  const base = parseInt(userId.replace(/\D/g, ''), 10) || 1;
  const tags = Array.from({ length: 5 }, (_, i) => `tag${base + i}`);
  const crews = Array.from({ length: 5 }, (_, i) => ({
    id: `crew${base + i}`,
    name: `Crew ${base + i}`,
    imageUrl: `https://picsum.photos/seed/crew-${base + i}/80`,
  }));
  const posts = Array.from({ length: 12 }, (_, i) => {
    const post = mockPost(base * 10 + i) as Post & {
      category: 'TALK' | 'COLUMN' | 'CREW';
    };
    post.category = i % 3 === 0 ? 'TALK' : i % 3 === 1 ? 'COLUMN' : 'CREW';
    return post;
  });
  return {
    userId,
    username: `User ${userId}`,
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque imperdiet.',
    imageUrl: `https://picsum.photos/seed/user-${userId}/100`,
    tags,
    following: 100 + base,
    followers: 200 + base,
    posts,
    crews,
  };
}

export default function UserProfilePage() {
  const params = useParams();
  const navigate = useNavigate();
  const userId = params.userId as string;
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'TALK' | 'COLUMN' | 'CREW'>('ALL');

  useEffect(() => {
    if (userId) {
      setProfile(generateMockProfile(userId));
    }
  }, [userId]);

  if (!profile) return <p className="p-4">Loading...</p>;

  const posts =
    filter === 'ALL'
      ? profile.posts
      : profile.posts.filter((p) => p.category === filter);

  return (
    <div className="mx-auto max-w-xl space-y-4 p-4">
      <div className="flex items-center space-x-4">
        <img
          src={profile.imageUrl}
          alt={profile.username}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-lg font-bold">{profile.username}</p>
          <p
            className="text-sm text-gray-500"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              WebkitLineClamp: 2,
            }}
          >
            {profile.bio}
          </p>
          <TagList tags={profile.tags} />
        </div>
        <button className="rounded border px-3 py-1 text-sm">Follow</button>
      </div>

      <div className="flex justify-around border-y py-2 text-center text-sm">
        <div
          className="cursor-pointer"
          onClick={() => navigate(`/profile/${userId}/following`)}
        >
          <p className="font-semibold">{profile.following}</p>
          <p className="text-gray-500">Following</p>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => navigate(`/profile/${userId}/followers`)}
        >
          <p className="font-semibold">{profile.followers}</p>
          <p className="text-gray-500">Followers</p>
        </div>
        <div className="cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          <p className="font-semibold">{profile.posts.length}</p>
          <p className="text-gray-500">Posts</p>
        </div>
      </div>

      <div>
        <h2 className="mb-2 font-semibold">Crews</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {profile.crews.map((c) => (
            <div
              key={c.id}
              className="w-16 flex-shrink-0 text-center"
              onClick={() => navigate(`/crew/${c.id}/posts`)}
            >
              <img
                src={c.imageUrl}
                alt={c.name}
                className="mx-auto h-14 w-14 rounded-full object-cover"
              />
              <p className="mt-1 text-xs">{c.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex gap-2 pb-2">
          {['ALL', 'TALK', 'COLUMN', 'CREW'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={`rounded px-3 py-1 text-sm ${filter === t ? 'bg-black text-white' : 'border'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {posts.map((post) => (
            <div key={post.id} onClick={() => navigate(`/post/${post.id}`)}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

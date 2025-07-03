import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@/components/ui/avatar';
import MyPostCard, { MyPost } from '@/components/users/MyPostCard';
import { Menu } from 'lucide-react';
import { logout } from '@/lib/auth';

interface Me {
  id: string;
  nickname: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  avatarUrl: string;
}
interface Crew {
  id: string;
  avatarUrl: string;
}

export default function MyPage() {
  const navigate = useNavigate();
  const [me, setMe] = useState<Me | null>(null);
  const [crews, setCrews] = useState<Crew[]>([]);
  const [posts, setPosts] = useState<MyPost[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/users/me')
      .then((res) => res.json())
      .then(setMe)
      .catch(() => setMe(null));
    fetch('/users/me/crews')
      .then((res) => res.json())
      .then(setCrews)
      .catch(() => setCrews([]));
    fetch('/posts?author=me')
      .then((res) => res.json())
      .then(setPosts)
      .catch(() => setPosts([]));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!me) return <p className="p-4">Loading...</p>;

  return (
    <div className="space-y-6 p-4">
      <div className="relative flex flex-col items-center">
        <Avatar src={me.avatarUrl} className="h-16 w-16" />
        <h2 className="mt-2 text-xl font-bold">{me.nickname}</h2>
        <p className="text-sm text-gray-500">{me.bio}</p>
        <p className="mt-1 text-sm">
          {me.followerCount} followers · {me.followingCount} following
        </p>
        <button
          aria-label="menu"
          className="absolute right-0 top-0"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <Menu />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-8 w-32 rounded-md border bg-white shadow">
            <div
              className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
              onClick={handleLogout}
            >
              Logout
            </div>
            <div
              className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
              onClick={() => navigate('/settings')}
            >
              Settings
            </div>
            <div className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100">
              Help Center
            </div>
          </div>
        )}
      </div>
      <div>
        <h3 className="mb-2 font-semibold">Joined Crews</h3>
        <div className="flex space-x-2 overflow-x-auto pb-1">
          {crews.map((c) => (
            <Avatar
              key={c.id}
              src={c.avatarUrl}
              size="sm"
              className="cursor-pointer"
              onClick={() => navigate(`/crew/${c.id}`)}
            />
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-2 font-semibold">My Posts</h3>
        <div className="columns-2 gap-3">
          {posts.map((post) => (
            <MyPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getProfile,
  updateMyProfile,
  changeMyPassword,
  type Profile,
  getUserPosts,
  getFollowers,
  getFollowing,
  getUserCrews,
  getFollowedBrands,
  type Crew,
  type PostSummary,
  type Brand,
  type SimpleUser,
} from '@/lib/profile';
import { getMyId } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [crews, setCrews] = useState<Crew[]>([]);
  const [followers, setFollowers] = useState<SimpleUser[]>([]);
  const [following, setFollowing] = useState<SimpleUser[]>([]);
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const p = await getProfile(userId);
        setProfile(p);
        setUsername(p.username);
        setBio(p.bio ?? '');
        setImageUrl(p.imageUrl ?? '');
        setWebsite(p.website ?? '');
        setBackgroundUrl(p.backgroundUrl ?? '');
        const [userPosts, fwr, fwg, cr, br] = await Promise.all([
          getUserPosts(userId),
          getFollowers(userId),
          getFollowing(userId),
          getUserCrews(userId),
          getFollowedBrands(userId),
        ]);
        setPosts(userPosts);
        setFollowers(fwr);
        setFollowing(fwg);
        setCrews(cr);
        setBrands(br);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      }
      try {
        const id = await getMyId();
        setMyId(id);
      } catch {
        setMyId(null);
      }
      setLoading(false);
    }
    load();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateMyProfile({
        username,
        bio,
        imageUrl,
        website,
        backgroundUrl,
      });
      setProfile(updated);
      if (newPassword) {
        await changeMyPassword(oldPassword, newPassword);
        setOldPassword('');
        setNewPassword('');
      }
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }
  if (!profile) {
    return <p className="p-4 text-red-500">{error || 'No profile'}</p>;
  }

  const isMe = myId === profile.userId;

  return (
    <div className="p-4 space-y-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold">Profile</h1>
      {isMe ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="username">
              Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="bio">
              Bio
            </label>
            <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="imageUrl">
              Image URL
            </label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="website">
              Website
            </label>
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="backgroundUrl">
              Background Image URL
            </label>
            <Input
              id="backgroundUrl"
              value={backgroundUrl}
              onChange={(e) => setBackgroundUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="oldPassword">
              Current Password
            </label>
            <Input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="newPassword">
              New Password
            </label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit">Save</Button>
        </form>
      ) : (
        <div className="space-y-2">
          {profile.imageUrl && (
            <img
              src={profile.imageUrl}
              alt={profile.username}
              className="w-32 h-32 object-cover rounded-full"
            />
          )}
          <p className="font-semibold text-lg">{profile.username}</p>
          {profile.bio && <p>{profile.bio}</p>}
          {profile.website && (
            <a href={profile.website} className="text-blue-600 underline">
              {profile.website}
            </a>
          )}
        </div>
      )}
      <div className="space-y-4">
        {crews.length > 0 && (
          <div>
            <h2 className="font-semibold">Crews</h2>
            <ul className="list-disc pl-5">
              {crews.map((c) => (
                <li key={c.id}>
                  <Link to={`/crew/${c.id}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {following.length > 0 && (
          <div>
            <h2 className="font-semibold">Following</h2>
            <ul className="list-disc pl-5">
              {following.map((u) => (
                <li key={u.userId}>
                  <Link to={`/profile/${u.userId}`}>{u.username}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {followers.length > 0 && (
          <div>
            <h2 className="font-semibold">Followers</h2>
            <ul className="list-disc pl-5">
              {followers.map((u) => (
                <li key={u.userId}>
                  <Link to={`/profile/${u.userId}`}>{u.username}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {brands.length > 0 && (
          <div>
            <h2 className="font-semibold">Brands</h2>
            <ul className="list-disc pl-5">
              {brands.map((b) => (
                <li key={b.id}>
                  <Link to={`/brand/${b.id}`}>{b.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {posts.length > 0 && (
          <div>
            <h2 className="font-semibold">Posts</h2>
            <ul className="list-disc pl-5">
              {posts.map((p) => (
                <li key={p.id}>
                  <Link to={`/post/${p.id}`}>{p.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

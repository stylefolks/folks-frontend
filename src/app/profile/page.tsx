"use client";

import { useEffect, useState } from 'react';
import { getMyProfile, updateMyProfile, type Profile } from '@/lib/profile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    getMyProfile()
      .then((p) => {
        setProfile(p);
        setUsername(p.username);
        setBio(p.bio ?? '');
        setImageUrl(p.imageUrl ?? '');
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateMyProfile({ username, bio, imageUrl });
      setProfile(updated);
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

  return (
    <div className="p-4 space-y-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold">My Profile</h1>
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
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  type Profile,
} from '@/lib/profile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    getMyProfile()
      .then((p) => {
        setProfile(p);
        setUsername(p.username);
        setBio(p.bio ?? '');
        setImageUrl(p.imageUrl ?? '');
        setWebsite(p.website ?? '');
        setBackgroundUrl(p.backgroundUrl ?? '');
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

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
    </div>
  );
}

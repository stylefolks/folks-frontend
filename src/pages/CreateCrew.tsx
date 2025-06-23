import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCrew } from '@/lib/crew';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMeta } from '@/lib/meta';

export default function CreateCrewPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useMeta({ title: 'Create Crew - Stylefolks' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const crew = await createCrew({ name, description });
      navigate(`/crew/${crew.id}/posts`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create crew';
      setError(msg);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md p-10 space-y-6">
        <h1 className="text-2xl font-bold text-center">Create Crew</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </div>
    </div>
  );
}

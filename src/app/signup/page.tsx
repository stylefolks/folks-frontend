"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, username, password);
      router.push('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { login } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Stylefolks</title>
        <meta name="description" content="Login to Stylefolks" />
      </Helmet>
      <div className="flex justify-center">
        <div className="w-full max-w-md py-10 space-y-6">
          <h1 className="text-2xl font-bold text-center">Welcome Back!</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="h-px flex-1 bg-gray-300" />
          OR
          <span className="h-px flex-1 bg-gray-300" />
        </div>
        <p className="text-center text-sm">
          {"Don't have an account?"}{' '}
          <Link to="/signup" className="underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
    </>
  );
}

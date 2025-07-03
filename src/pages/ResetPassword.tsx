import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { API_BASE } from '@/lib/auth';
import { useMeta } from '@/lib/meta';
import { cn } from '@/lib/utils';

export default function ResetPasswordPage() {
  useMeta({ title: 'Reset Password - Stylefolks' });
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEmailValid = /.+@.+\..+/.test(email);
  const canSubmit = email.length > 0 && isEmailValid && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!isEmailValid) {
      setError('Invalid email address');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }
      alert('Password reset email sent');
      navigate('/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md px-6 pt-12 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Folks</h1>
          <p className="text-sm text-gray-400">Make culture</p>
        </div>
        <h2 className="text-2xl font-bold">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn('border rounded-md px-4 py-3 w-full text-base', error && 'border-red-500')}
              placeholder="you@example.com"
            />
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
          <Button
            type="submit"
            disabled={!canSubmit}
            className={cn('h-12 w-full rounded-xl bg-black text-white', !canSubmit && 'bg-gray-200 text-gray-500 cursor-not-allowed')}
          >
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </div>
    </div>
  );
}

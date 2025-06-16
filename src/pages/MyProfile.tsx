import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyId } from '@/lib/auth';

export default function MyProfile() {
  const navigate = useNavigate();

  useEffect(() => {
    async function redirect() {
      try {
        const id = await getMyId();
        if (id) {
          navigate(`/profile/${id}`, { replace: true });
          return;
        }
      } catch {
        // ignore errors and fall through to login
      }
      navigate('/login', { replace: true });
    }
    redirect();
  }, [navigate]);

  return null;
}

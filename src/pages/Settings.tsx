import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth';
import { useMeta } from '@/lib/meta';

export default function SettingsPage() {
  const navigate = useNavigate();
  useMeta({ title: 'Settings - Stylefolks' });
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Settings</h1>
      <Button onClick={handleLogout} variant="outline">
        Logout
      </Button>
    </div>
  );
}

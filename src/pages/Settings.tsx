import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth';
import { Helmet } from 'react-helmet-async';

export default function SettingsPage() {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Helmet>
        <title>Settings | Stylefolks</title>
        <meta name="description" content="Account settings" />
      </Helmet>
      <div className="p-4 space-y-4">
        <h1 className="text-xl font-bold">Settings</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
    </>
  );
}

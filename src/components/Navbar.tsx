'use client';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { getToken, logout } from '@/lib/auth';

export default function Navbar() {
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, [location]);

  useEffect(() => {
    const handler = () => setLoggedIn(!!getToken());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
  };

  return (
    <nav className="flex items-center justify-between border-b px-4 py-4">
      <Link to="/" className="font-bold text-xl">
        Stylefolks
      </Link>
      <div className="flex gap-4 items-center">
        <Link to="/posts" className="hidden sm:inline-block">
          Posts
        </Link>
        <Link to="/crews" className="hidden sm:inline-block">
          Crews
        </Link>
        <Link to="/write" className="hidden sm:inline-block">
          Write
        </Link>
        {loggedIn ? (
          <>
            <Link to="/profile" className="hidden sm:inline-block">
              Profile
            </Link>
            <Button variant="outline" onClick={handleLogout} className="text-sm">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className="hidden sm:inline-block">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

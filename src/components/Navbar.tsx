'use client';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import MobileNav from './MobileNav';
import { getToken } from '@/lib/auth';

export default function Navbar() {
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, [location]);

  useEffect(() => {
    const handler = () => setLoggedIn(!!getToken());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);


  return (
    <>
    <nav className="flex items-center justify-between border-b px-4 py-4">
      <Link to="/" className="font-bold text-xl">
        Folks
      </Link>
      <div className="flex gap-4 items-center">
        <button
          className="sm:hidden p-2"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          &#9776;
        </button>
        <Link to="/posts" className="hidden sm:inline-block">
          Posts
        </Link>
        <Link to="/crews" className="hidden sm:inline-block">
          Crews
        </Link>
        <Link to="/brands" className="hidden sm:inline-block">
          Brands
        </Link>
        <Link to="/write" className="hidden sm:inline-block">
          Write
        </Link>
        {loggedIn ? (
          <>
            <Link to="/profile" className="hidden sm:inline-block">
              Profile
            </Link>
            <Link to="/settings" className="hidden sm:inline-block">
              Settings
            </Link>
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
    <MobileNav
      open={mobileOpen}
      onClose={() => setMobileOpen(false)}
      loggedIn={loggedIn}
    />
    </>
  );
}


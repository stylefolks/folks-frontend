import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MobileNav from './MobileNav';
import { getToken } from '@/lib/auth';
import TopNav from './navigation/TopNav';
import Avatar from './ui/avatar';

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
        {loggedIn && (
          <Link to="/profile/me" aria-label="Profile">
            <Avatar size="sm" />
          </Link>
        )}
        <button
          className="sm:hidden p-2"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          &#9776;
        </button>
        <TopNav loggedIn={loggedIn} />
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


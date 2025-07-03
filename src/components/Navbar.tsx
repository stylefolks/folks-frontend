import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MobileNav from './MobileNav';
import { getToken, getMyId } from '@/lib/auth';
import { getProfile } from '@/lib/profile';
import TopNav from './navigation/TopNav';
import Avatar from './ui/avatar';
import { useAppBarTitle } from '@/lib/appBarTitle';

export default function Navbar() {
  const location = useLocation();
  const title = useAppBarTitle();
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, [location]);

  useEffect(() => {
    const handler = () => setLoggedIn(!!getToken());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  useEffect(() => {
    async function loadProfile() {
      if (!loggedIn) {
        setUserId(null);
        setImageUrl(undefined);
        return;
      }
      try {
        const id = await getMyId();
        setUserId(id);
        if (id) {
          const profile = await getProfile(id);
          setImageUrl(profile.imageUrl);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadProfile();
  }, [loggedIn]);


  return (
    <>
    <nav className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-4">
      {title ? (
        <span className="absolute left-1/2 -translate-x-1/2 truncate text-center text-base font-semibold">
          {title}
        </span>
      ) : (
        <Link to="/" className="font-bold text-xl">
          Folks
        </Link>
      )}
      <div className="ml-auto flex gap-4 items-center">
        {loggedIn && userId && (
          <Link to={`/profile/${userId}`} aria-label="Profile">
            <Avatar size="sm" src={imageUrl} />
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


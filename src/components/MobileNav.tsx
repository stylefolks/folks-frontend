'use client';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  loggedIn: boolean;
}

export default function MobileNav({ open, onClose, loggedIn }: MobileNavProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col sm:hidden transition-opacity duration-300 ',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}
      onClick={onClose}
    >
      <div className="flex-1" />
      <div
        className={cn(
          'bg-background p-4 shadow-md transition-transform duration-300 border-solid border-t-1 border-l-0 border-r-0 border-b-0',
          open ? 'translate-y-0' : 'translate-y-full'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <nav className="flex flex-col gap-4">
          <Link to="/search" onClick={onClose} className="py-2">
            Search
          </Link>
          <Link to="/posts" onClick={onClose} className="py-2">
            Posts
          </Link>
          <Link to="/crews" onClick={onClose} className="py-2">
            Crews
          </Link>
          <Link to="/brands" onClick={onClose} className="py-2">
            Brands
          </Link>
          <Link to="/write" onClick={onClose} className="py-2">
            Write
          </Link>
          {loggedIn ? (
            <>
              <Link to="/profile" onClick={onClose} className="py-2">
                Profile
              </Link>
              <Link to="/settings" onClick={onClose} className="py-2">
                Settings
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" onClick={onClose} className="py-2">
                <Button variant="outline" size="sm" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={onClose} className="py-2">
                <Button size="sm" className="w-full">Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}


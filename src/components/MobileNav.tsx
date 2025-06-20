import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import BottomNav from './navigation/BottomNav';

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
      <BottomNav loggedIn={loggedIn} />
      </div>
    </div>
  );
}


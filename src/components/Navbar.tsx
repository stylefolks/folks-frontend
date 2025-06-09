import Link from 'next/link';
import { Button } from './ui/button';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-4">
      <Link href="/" className="font-bold text-xl">
        Stylefolks
      </Link>
      <div className="flex gap-2">
        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>
        <Link href="/signup">
          <Button>Sign up</Button>
        </Link>
      </div>
    </nav>
  );
}

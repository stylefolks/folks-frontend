import Link from 'next/link';
import { Button } from '../components/ui/button';

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-6 py-10">
      <h1 className="text-3xl font-bold">Welcome to Stylefolks</h1>
      <div className="flex gap-3">
        <Link href="/posts">
          <Button>Posts</Button>
        </Link>
        <Link href="/crews">
          <Button variant="outline">Crews</Button>
        </Link>
      </div>
    </main>
  );
}

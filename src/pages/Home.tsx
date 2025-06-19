import PostGrid from '@/components/PostGrid';
import { Helmet } from 'react-helmet-async';
export default function Home() {
  return (
    <>
      <Helmet>
        <title>Home | Stylefolks</title>
        <meta name="description" content="Stylefolks home" />
      </Helmet>
      <main className="min-h-screen bg-white">
        <PostGrid />
      </main>
    </>
  );
}

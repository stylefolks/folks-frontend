import { Helmet } from 'react-helmet-async';

export default function PostsPage() {
  return (
    <>
      <Helmet>
        <title>Posts | Stylefolks</title>
        <meta name="description" content="Posts list" />
      </Helmet>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Posts</h1>
        {/* TODO: posts list */}
      </div>
    </>
  );
}

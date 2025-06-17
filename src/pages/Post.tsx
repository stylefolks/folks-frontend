import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, getNextPosts } from '@/lib/posts';
import Viewer from '@/components/Viewer';
import Comments from '@/components/Comments';

export default function PostPage() {
  const navigate = useNavigate();
  const params = useParams();
  const id = Number(params.postId ?? params.id);
  const post = getPostById(id);
  const nextPosts = getNextPosts(id, 3);

  const go = (postId: number) => {
    document.startViewTransition(() => {
      navigate(`/post/${postId}`);
    });
  };

  return (
    <div className="mx-auto flex max-w-5xl p-4">
      <article className="flex-1">
        <button onClick={() => navigate(-1)} className="mb-4 text-sm text-blue-500">
          &larr; Back
        </button>
        <h1 className="mb-2 text-2xl font-bold">{post.title}</h1>
        <p className="text-sm text-gray-500">{new Date(post.date).toDateString()}</p>
        <div style={{ viewTransitionName: `post-${post.id}` }}>
          <img src={post.image} alt={post.title} className="my-4 w-full rounded-md" />
        </div>
        <Viewer content={post.content} />
        <Comments postId={String(id)} />
      </article>
      <aside className="ml-8 hidden w-64 space-y-4 md:block">
        {nextPosts.map((p) => (
          <div key={p.id} onClick={() => go(p.id)} className="cursor-pointer">
            <div
              style={{ viewTransitionName: `post-${p.id}`, height: 80 }}
              className="overflow-hidden rounded-md bg-gray-100"
            >
              <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
            </div>
            <h3 className="mt-1 text-sm">{p.title}</h3>
          </div>
        ))}
      </aside>
    </div>
  );
}

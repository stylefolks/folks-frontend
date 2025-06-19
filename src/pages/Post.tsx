import { useParams, useNavigate } from 'react-router-dom';
import { fetchPost, type Post } from '@/lib/posts';
import Viewer from '@/components/Viewer';
import Comments from '@/components/Comments';
import { useEffect, useState } from 'react';

export default function PostPage() {
  const navigate = useNavigate();
  const params = useParams();
  const id = Number(params.postId ?? params.id);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPost(id)
      .then((p) => setPost(p))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!post) return <p className="p-4">No post</p>;

  return (
    <div className="mx-auto max-w-[1440px] space-y-4 p-4">
      <button onClick={() => navigate(-1)} className="text-sm text-blue-500">
        &larr; Back
      </button>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: post.title, url: window.location.href });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied');
            }
          }}
          className="text-sm text-blue-500"
        >
          Share
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <img
          onClick={() => navigate(`/profile/${post.author.userId}`)}
          src={post.author.imageUrl}
          alt={post.author.username}
          className="h-8 w-8 cursor-pointer rounded-full object-cover"
        />
        <button
          className="text-sm font-semibold"
          onClick={() => navigate(`/profile/${post.author.userId}`)}
        >
          {post.author.username}
        </button>
      </div>
      <p className="text-sm text-gray-500">
        {new Date(post.date).toLocaleString()} · {post.views} views
      </p>
      <div style={{ viewTransitionName: `post-${post.id}` }}>
        <img src={post.image} alt={post.title} className="my-4 w-full rounded-md" />
      </div>
      <Viewer content={post.content} className="w-full" />
      <Comments postId={String(id)} />
    </div>
  );
}

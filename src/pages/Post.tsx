import { useParams, useNavigate } from "react-router-dom";

import Viewer from "@/components/Viewer";
import Comments from "@/components/Comments";
import { useEffect, useState } from "react";
import { useMeta } from "@/lib/meta";
import TagList from "@/components/TagList";
import CrewBanner from "@/components/CrewBanner";
import AdBadge from "@/components/AdBadge";
import { PostDto } from "@/dto/postDto";
import { fetchPost } from "@/api/postsApi";

const PostTitlePart = ({ post }: { post: PostDto }) => {
  const navigate = useNavigate();
  if (!post) return null;
  if (!post.author) return null;
  if (!post.author.userId) return null;
  if (!post.author.username) return null;
  if (!post.author.imageUrl) return null;
  if (!post.date) return null;
  if (!post.views) return null;
  if (!post.title) return null;
  if (!post.content) return null;
  if (!post.id) return null;

  return (
    <>
      <button onClick={() => navigate(-1)} className="text-sm text-blue-500">
        &larr; Back
      </button>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div className="space-x-2">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: post.title,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied");
              }
            }}
            className="text-sm text-blue-500"
          >
            Share
          </button>
          <button className="text-sm" onClick={() => alert("Liked!")}>
            ❤️
          </button>
        </div>
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
      {post.tags && <TagList tags={post.tags} />}
      {post.crew && <CrewBanner crew={post.crew} />}
      {post.brand && (
        <div className="relative">
          <AdBadge />
        </div>
      )}
    </>
  );
};

export default function PostPage() {
  const navigate = useNavigate();
  const params = useParams();
  const id = Number(params.postId ?? params.id);
  const [post, setPost] = useState<PostDto | null>(null);
  const [loading, setLoading] = useState(true);
  useMeta({ title: post ? `${post.title} - Stylefolks` : "Post - Stylefolks" });

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
      <PostTitlePart post={post} />
      {/* <div style={{ viewTransitionName: `post-${post.id}` }}>
        <img src={post.image} alt={post.title} className="my-4 w-full rounded-md" />
      </div> */}
      <Viewer content={post.content} className="w-full" />
      <Comments postId={String(id)} />
    </div>
  );
}

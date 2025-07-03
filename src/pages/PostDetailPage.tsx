import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, HeartIcon, MessageSquare, Menu } from 'lucide-react';
import Badge from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  fetchPostDetail,
  fetchPostComments,
  addPostComment,
  likePost,
  unlikePost,
  type PostDetail,
  type PostComment,
} from '@/lib/postDetail';
import { cn } from '@/lib/utils';

const avatarColors = ['bg-blue-400','bg-green-400','bg-yellow-400','bg-pink-400','bg-purple-400'];

function InitialAvatar({ initials }: { initials: string }) {
  const idx = initials.charCodeAt(0) % avatarColors.length;
  const color = avatarColors[idx];
  return (
    <div className={cn('w-8 h-8 rounded-full text-white text-sm flex items-center justify-center', color)}>
      {initials}
    </div>
  );
}

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchPostDetail(id)
      .then((data) => {
        setPost(data);
        setLikeCount(data.likes);
      })
      .catch(() => setPost(null));
    fetchPostComments(id).then(setComments).catch(() => setComments([]));
  }, [id]);

  const toggleLike = async () => {
    if (!id) return;
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    try {
      if (next) await likePost(id);
      else await unlikePost(id);
    } catch {
      setLiked(!next);
      setLikeCount((c) => c - (next ? 1 : -1));
    }
  };

  const handleAddComment = async () => {
    if (!id || !commentInput.trim()) return;
    try {
      await addPostComment(id, commentInput);
      setCommentInput('');
      const updated = await fetchPostComments(id);
      setComments(updated);
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 0);
    } catch {
      // ignore errors for now
    }
  };

  if (!post) return <p className="p-4">Loading...</p>;

  return (
    <div className="pb-16">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-3">
        <button onClick={() => navigate(-1)} aria-label="back">
          <ArrowLeft />
        </button>
        <span className="text-base font-semibold">{post.crewName}</span>
        <button aria-label="menu">
          <Menu />
        </button>
      </header>
      <div className="px-4 pt-2">
        <div className="flex flex-wrap gap-2">
          {post.hashtags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-black"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="mt-2 text-xl font-bold leading-snug">{post.title}</h1>
        <div className="mt-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-pink-400 text-white text-sm flex items-center justify-center">
            {post.author.initials}
          </div>
          <div className="text-sm">
            {post.author.name} · {post.createdAt}
          </div>
        </div>
        <div
          className="prose prose-img:rounded-lg prose-a:text-blue-500 max-w-none mt-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <div className="flex justify-between items-center py-3 border-t mt-6 text-sm">
          <div className="flex items-center gap-1">
            <HeartIcon
              className={cn(
                'w-5 h-5 cursor-pointer transition',
                liked ? 'fill-black stroke-black' : 'stroke-black'
              )}
              onClick={toggleLike}
            />
            <span>{likeCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare size={16} />
            <span>{post.comments}</span>
          </div>
        </div>
        <section className="mt-4 space-y-4">
          <h2 className="text-base font-semibold">Comments ({comments.length})</h2>
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-3">
              <InitialAvatar initials={c.author.initials} />
              <div>
                <div className="text-sm font-semibold">
                  {c.author.name} · {c.createdAt}
                </div>
                <div className="mt-1 text-sm">{c.content}</div>
              </div>
            </div>
          ))}
        </section>
        <div className="mt-6">
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">ME</div>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="댓글을 입력하세요"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <Button className="ml-auto block" type="button" onClick={handleAddComment}>
                등록
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

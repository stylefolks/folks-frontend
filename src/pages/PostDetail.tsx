import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getMyId } from "@/lib/auth";
import {
  addPostComment,
  deletePostComment,
  fetchPostComments,
  fetchPostDetail,
  likePost,
  unlikePost,
  updatePostComment,
} from "@/lib/postDetail";
import { cn } from "@/lib/utils";
import { PostComment, type PostDetail } from "@/types/post";
import { ArrowLeft, HeartIcon, MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const avatarColors = [
  "bg-blue-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-pink-400",
  "bg-purple-400",
];

function InitialAvatar({ initials }: { initials: string }) {
  const idx = initials.charCodeAt(0) % avatarColors.length;
  const color = avatarColors[idx];
  return (
    <div
      className={cn(
        "w-8 h-8 rounded-full text-white text-sm flex items-center justify-center",
        color
      )}
    >
      {initials}
    </div>
  );
}

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [myId, setMyId] = useState<null | string>(null);
  const [editingId, setEditingId] = useState<null | string>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchPostDetail(id)
      .then((data) => {
        setPost(data);
        setLikeCount(data.likes);
      })
      .catch(() => setPost(null));
    fetchPostComments(id)
      .then(setComments)
      .catch(() => setComments([]));
  }, [id]);

  useEffect(() => {
    getMyId()
      .then(setMyId)
      .catch(() => setMyId(null));
  }, []);

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

  const startEdit = (c: PostComment) => {
    setEditingId(c.id);
    setEditText(c.content);
  };

  const handleUpdate = async (commentId: string) => {
    try {
      const updated = await updatePostComment(commentId, editText);
      setComments((cs) => cs.map((c) => (c.id === commentId ? updated : c)));
      setEditingId(null);
    } catch {
      // ignore errors
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deletePostComment(commentId);
      setComments((cs) => cs.filter((c) => c.id !== commentId));
    } catch {
      // ignore errors
    }
  };

  const handleAddComment = async () => {
    const text = commentRef.current?.value ?? "";
    if (!id || !text.trim()) return;
    try {
      await addPostComment(id, text);
      if (commentRef.current) commentRef.current.value = "";
      const updated = await fetchPostComments(id);
      setComments(updated);
      setTimeout(() => {
        window.scrollTo({
          behavior: "smooth",
          top: document.body.scrollHeight,
        });
      }, 0);
    } catch {
      // ignore errors for now
    }
  };

  if (!post) return <p className="p-4">Loading...</p>;

  return (
    <div className="pb-16">
      <div className="px-4 pt-2">
        <div className="flex items-center justify-between">
          <button aria-label="back" onClick={() => navigate(-1)}>
            <ArrowLeft />
          </button>
          <div className="flex flex-wrap gap-2">
            {post.hashtags.map((tag) => (
              <Badge
                className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-black"
                key={tag}
                onClick={() => navigate(`/search?tag=${tag.replace("#", "")}`)}
                variant="outline"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <h1 className="mt-2 text-xl font-bold leading-snug">{post.title}</h1>
        <div className="mt-2 flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full bg-pink-400 text-white text-sm flex items-center justify-center cursor-pointer"
            onClick={() => navigate(`/profile/${post.author.userId}`)}
          >
            {post.author.initials}
          </div>
          <div
            className="text-sm cursor-pointer"
            onClick={() => navigate(`/profile/${post.author.userId}`)}
          >
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
                "w-5 h-5 cursor-pointer transition",
                liked ? "fill-black stroke-black" : "stroke-black"
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
          <h2 className="text-base font-semibold">
            Comments ({comments.length})
          </h2>
          {comments.map((c) => (
            <div className="flex items-start gap-3" key={c.id}>
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/profile/${c.author.userId}`)}
              >
                <InitialAvatar initials={c.author.initials} />
              </div>
              <div className="flex-1">
                {editingId === c.id ? (
                  <div className="space-y-2">
                    <Input
                      onChange={(e) => setEditText(e.target.value)}
                      value={editText}
                    />
                    <div className="space-x-2">
                      <Button onClick={() => handleUpdate(c.id)} size="sm">
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingId(null)}
                        size="sm"
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div
                      className="text-sm font-semibold cursor-pointer"
                      onClick={() => navigate(`/profile/${c.author.userId}`)}
                    >
                      {c.author.name} · {c.createdAt}
                    </div>
                    <div className="mt-1 text-sm">{c.content}</div>
                    {myId === c.author.userId && (
                      <div className="mt-1 space-x-2 text-sm">
                        <Button
                          onClick={() => startEdit(c)}
                          size="sm"
                          variant="outline"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(c.id)}
                          size="sm"
                          variant="outline"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>
        <div className="mt-6">
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">
              ME
            </div>
            <div className="flex-1 space-y-2">
              <Textarea placeholder="댓글을 입력하세요" ref={commentRef} />
              <Button
                className="ml-auto block"
                onClick={handleAddComment}
                type="button"
              >
                등록
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';
import type { Comment } from '@/lib/comments';
import { fetchComments, addComment, updateComment, deleteComment } from '@/lib/comments';

export default function Comments({ postId }: { postId: string }) {
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchComments(postId)
      .then(setComments)
      .catch(() => setComments([]));
  }, [postId]);

  const handleAdd = async () => {
    if (!text.trim()) return;
    try {
      const newComment = await addComment(postId, text);
      setComments([...comments, newComment]);
      setText('');
    } catch {
      // error handling omitted for brevity
    }
  };

  const startEdit = (c: Comment) => {
    setEditingId(c.id);
    setEditText(c.text);
  };

  const handleUpdate = async (id: string) => {
    try {
      const updated = await updateComment(id, editText);
      setComments(comments.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteComment(id);
      setComments(comments.filter((c) => c.id !== id));
    } catch {
      // ignore
    }
  };

  return (
    <div className="mt-6 space-y-3">
      <h2 className="font-semibold">Comments</h2>
      {comments.length === 0 ? (
        <p className="text-sm text-gray-500">No comments yet.</p>
      ) : (
        <ul className="space-y-2">
          {comments.map((c) => (
<<<<<<< HEAD
            <li key={c.id} className="rounded border p-2">
              {editingId === c.id ? (
                <div className="flex items-start space-x-2">
                  <img
                    src={c.author.imageUrl}
                    alt={c.author.username}
                    className="h-8 w-8 rounded-full object-cover cursor-pointer"
                    onClick={() => navigate(`/profile/${c.author.userId}`)}
                  />
=======
            <li key={c.id} className="rounded border p-2 space-y-2">
              {editingId === c.id ? (
                <div className="flex space-x-2">
>>>>>>> 2909d7313c17ff510549ea1b7b13909f6c7cf391
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <Button size="sm" onClick={() => handleUpdate(c.id)}>
                    Save
                  </Button>
                </div>
              ) : (
<<<<<<< HEAD
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <img
                      src={c.author.imageUrl}
                      alt={c.author.username}
                      className="h-8 w-8 rounded-full object-cover cursor-pointer"
                      onClick={() => navigate(`/profile/${c.author.userId}`)}
                    />
                    <span>{c.text}</span>
                  </div>
=======
                <div className="flex justify-between items-center">
                  <span>{c.text}</span>
>>>>>>> 2909d7313c17ff510549ea1b7b13909f6c7cf391
                  <div className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(c)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(c.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="flex space-x-2 pt-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment"
        />
        <Button type="button" onClick={handleAdd} className="shrink-0">
          Post
        </Button>
      </div>
    </div>
  );
}

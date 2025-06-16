import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface Comment {
  id: number;
  text: string;
}

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(`comments-${postId}`);
    if (stored) {
      try {
        setComments(JSON.parse(stored));
      } catch {
        setComments([]);
      }
    }
  }, [postId]);

  const addComment = () => {
    if (!text.trim()) return;
    const newComment = { id: Date.now(), text };
    const updated = [...comments, newComment];
    setComments(updated);
    localStorage.setItem(`comments-${postId}`, JSON.stringify(updated));
    setText('');
  };

  return (
    <div className="mt-6 space-y-3">
      <h2 className="font-semibold">Comments</h2>
      {comments.length === 0 ? (
        <p className="text-sm text-gray-500">No comments yet.</p>
      ) : (
        <ul className="space-y-2">
          {comments.map((c) => (
            <li key={c.id} className="rounded border p-2">
              {c.text}
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
        <Button type="button" onClick={addComment} className="shrink-0">
          Post
        </Button>
      </div>
    </div>
  );
}

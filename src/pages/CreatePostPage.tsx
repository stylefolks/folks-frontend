import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Editor } from '@/components/Editor';
import { initialDoc } from '@/components/Editor/core/doc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Avatar from '@/components/ui/avatar';
import { EditorState, EditorView } from 'prosemirror-state';
import { createPost, savePostDraft, PostType } from '@/lib/posts';

interface Me {
  id: string;
  role: 'USER' | 'INFLUENCER' | 'BRAND' | 'MASTER';
  nickname: string;
  avatarUrl: string;
}

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [me, setMe] = useState<Me | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PostType>('TALK' as PostType);
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const [view, setView] = useState<EditorView | null>(null);

  useEffect(() => {
    fetch('/users/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setMe(data))
      .catch(() => setMe(null));
  }, []);

  const canWriteColumn = me && ['INFLUENCER', 'BRAND', 'MASTER'].includes(me.role);

  const handleSubmit = async () => {
    if (!view) return;
    const content = view.state.doc.toJSON();
    try {
      const res = await createPost({ title, type, content, crewIds: ['crew-123'] as any });
      if (res && (res as any).postId) {
        navigate(`/posts/${(res as any).postId}`);
      }
    } catch (err) {
      alert('Failed to submit');
    }
  };

  const handleSaveDraft = async () => {
    if (!view) return;
    const content = view.state.doc.toJSON();
    try {
      await savePostDraft({ title, type, content });
      alert('Draft saved');
    } catch (err) {
      alert('Failed to save draft');
    }
  };

  return (
    <div className="pb-6">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-3">
        <button onClick={() => navigate(-1)} aria-label="back">
          <ArrowLeft />
        </button>
        <span className="text-xl font-semibold">Create Post</span>
        {me && <Avatar src={me.avatarUrl} className="h-8 w-8" />}
      </header>
      <div className="mx-auto max-w-2xl space-y-4 p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setType('TALK' as PostType)}
            className={`rounded-full border px-4 py-1 text-sm ${type === 'TALK' ? 'bg-black text-white' : ''}`}
          >
            TALK
          </button>
          {canWriteColumn ? (
            <button
              onClick={() => setType('COLUMN' as PostType)}
              className={`rounded-full border px-4 py-1 text-sm ${type === 'COLUMN' ? 'bg-black text-white' : ''}`}
            >
              COLUMN
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                disabled
                className="rounded-full border px-4 py-1 text-sm opacity-50 cursor-not-allowed"
              >
                COLUMN
              </button>
              <span className="text-xs text-gray-500">Requires special permissions</span>
            </div>
          )}
        </div>
        <Input
          placeholder="Enter your post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-4 rounded-md border px-4 py-2 text-base"
        />
        <div className="bg-white border min-h-[300px] px-4 py-3 rounded-lg">
          <Editor value={initialDoc} onChange={setEditorState} onReady={setView} />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveDraft}>
            Save as Draft
          </Button>
          <Button className="bg-black text-white" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

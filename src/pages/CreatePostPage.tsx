import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Editor } from '@/components/Editor';
import { initialDoc } from '@/components/Editor/core/doc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Avatar from '@/components/ui/avatar';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { createPost, savePostDraft, PostType, CreatePostDto } from '@/lib/posts';
import { useMeta } from '@/lib/meta';
import { extractFromDoc } from '@/lib/mentions';
import { getToken } from '@/lib/auth';

const DRAFT_KEY = "write_draft";

interface Me {
  id: string;
  role: 'USER' | 'INFLUENCER' | 'BRAND' | 'MASTER';
  nickname: string;
  avatarUrl: string;
}

export default function CreatePostPage() {
  useMeta({ title: "Write - Stylefolks" });
  const navigate = useNavigate();
  const [me, setMe] = useState<Me | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PostType>('BASIC' as PostType);
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
      const extractResult = extractFromDoc(content, ["brand", "crew", "hashtag"]);
      const { brandIds, crewIds, hashtags } = extractResult;
      const draft: CreatePostDto = {
        title,
        type,
        hashtags,
        crewIds,
        brandIds,
        content,
      };

      if (!getToken()) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        navigate("/login", { state: { from: location } });
        return;
      }
      console.log(draft);
      // try {
      //   await createPost(draft);
      //   clearDraft();
      //   alert("Post submitted");
      // } catch {
      //   alert("Failed to submit");
      // }
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
      <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-4">
        <button className='mr-2' onClick={() => navigate(-1)} aria-label="back">
          <ArrowLeft />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setType('BASIC')}
            className={`rounded-full border px-4 py-1 text-sm ${type === 'BASIC' ? 'bg-black text-white' : ''}`}
          >
            BASIC
          </button>
          {canWriteColumn ? (
            <button
              onClick={() => setType('COLUMN')}
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
      </div>
      <div className="mx-auto max-w-2xl space-y-4 p-4">
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

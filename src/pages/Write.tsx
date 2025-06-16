import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getToken } from '@/lib/auth';
import WriteEditor from '@/components/WriteEditor';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Draft {
  title: string;
  bigCategory: string;
  hashtags: string;
  content: any;
}

const DRAFT_KEY = 'write_draft';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [bigCategory, setBigCategory] = useState('OOTD');
  const [hashtags, setHashtags] = useState('');
  const [content, setContent] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      const draft: Draft = JSON.parse(raw);
      setTitle(draft.title);
      setBigCategory(draft.bigCategory);
      setHashtags(draft.hashtags);
      setContent(draft.content);
    }
  }, []);

  const saveDraft = () => {
    const draft: Draft = { title, bigCategory, hashtags, content };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    alert('Draft saved');
  };

  const handleSubmit = () => {
    const draft: Draft = { title, bigCategory, hashtags, content };
    if (!getToken()) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      navigate('/login', { state: { from: location } });
      return;
    }
    clearDraft();
    alert('Post submitted');
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    alert('Draft cleared');
  };

  return (
    <div className="mx-auto max-w-2xl p-4 space-y-4">
      <h1 className="text-xl font-bold">Write a Post</h1>
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        value={bigCategory}
        onChange={(e) => setBigCategory(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="OOTD">OOTD</option>
        <option value="Column">Column</option>
        <option value="Review">Review</option>
      </select>
      <Input
        placeholder="Hashtags (comma separated)"
        value={hashtags}
        onChange={(e) => setHashtags(e.target.value)}
      />
      <WriteEditor content={content} onChange={setContent} />
      <div className="flex gap-2">
        <Button type="button" onClick={handleSubmit}>
          Submit
        </Button>
        <Button type="button" onClick={saveDraft} variant="outline">
          Save Draft
        </Button>
        <Button type="button" onClick={clearDraft} variant="outline">
          Clear Draft
        </Button>
      </div>
    </div>
  );
}

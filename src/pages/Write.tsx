import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getToken, getMyId } from '@/lib/auth';
import { Editor } from '@/components/Editor';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { initialDoc } from '@/components/Editor/core/doc';
import { EditorState } from 'prosemirror-state';
import { useMeta } from '@/lib/meta';
import { getUserCrews, type Crew } from '@/lib/profile';
import { fetchMyCrewRole, type CrewRole } from '@/lib/crew';

interface Draft {
  title: string;
  bigCategory: string;
  hashtags: string;
  crewId?: string;
  editorState: EditorState | null; //TLDR; 추후 편집 확장성을 위해서 doc만이 아닌 state 전체 저장
}

const DRAFT_KEY = 'write_draft';

export default function WritePage() {
  useMeta({ title: 'Write - Stylefolks' });
  const [title, setTitle] = useState('');
  const [bigCategory, setBigCategory] = useState('OOTD');
  const [hashtags, setHashtags] = useState('');
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const [crews, setCrews] = useState<Crew[]>([]);
  const [selectedCrewId, setSelectedCrewId] = useState('');
  const [crewRole, setCrewRole] = useState<CrewRole | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      const draft: Draft = JSON.parse(raw);
      setTitle(draft.title);
      setBigCategory(draft.bigCategory);
      setHashtags(draft.hashtags);
      setEditorState(draft.editorState);
      if (draft.crewId) {
        setSelectedCrewId(draft.crewId);
      }
    }
  }, []);

  useEffect(() => {
    async function loadCrews() {
      try {
        const id = await getMyId();
        if (!id) return;
        const c = await getUserCrews(id);
        setCrews(c);
        if (!selectedCrewId && c.length > 0) {
          setSelectedCrewId(c[0].id);
        }
      } catch {
        setCrews([]);
      }
    }
    loadCrews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedCrewId) {
      setCrewRole(null);
      return;
    }
    fetchMyCrewRole(selectedCrewId)
      .then(setCrewRole)
      .catch(() => setCrewRole(null));
  }, [selectedCrewId]);

  const saveDraft = () => {
    const draft: Draft = { title, bigCategory, hashtags, crewId: selectedCrewId, editorState };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    alert('Draft saved');
  };

  const handleSubmit = () => {

    const draft: Draft = { title, bigCategory, hashtags, crewId: selectedCrewId, editorState };
    
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

  const handleChange = (value: EditorState) => {
    setEditorState(value);
  }

  const categories = ['OOTD', 'Column', 'Review'];
  if (crewRole === 'owner' || crewRole === 'master') {
    categories.push('Notice', 'Event');
  }

  useEffect(() => {
    if (!categories.includes(bigCategory)) {
      setBigCategory(categories[0]);
    }
  }, [crewRole]);

  return (
    <div className="mx-auto max-w-2xl p-4 space-y-4">
      <h1 className="text-xl font-bold">Write a Post</h1>
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {crews.length > 0 && (
        <select
          value={selectedCrewId}
          onChange={(e) => setSelectedCrewId(e.target.value)}
          className="w-full border p-2 rounded"
        >
          {crews.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      )}
      <select
        value={bigCategory}
        onChange={(e) => setBigCategory(e.target.value)}
        className="w-full border p-2 rounded"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <Input
        placeholder="Hashtags (comma separated)"
        value={hashtags}
        onChange={(e) => setHashtags(e.target.value)}
      />
      <Editor value={initialDoc} onChange={handleChange}  />
      <div className="flex gap-4 flex-col mt-8">
        <Button type="button" onClick={handleSubmit} variant="outline">
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

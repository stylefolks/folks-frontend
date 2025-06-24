import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken, getMyId } from "@/lib/auth";
import { getUserCrews, type Crew as UserCrew } from "@/lib/profile";
import { fetchCrew, type CrewSummary } from "@/lib/crew";
import { Editor } from "@/components/Editor";
import CrewMentionList from "@/components/crews/CrewMentionList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { initialDoc } from "@/components/Editor/core/doc";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { useMeta } from "@/lib/meta";

interface Draft {
  title: string;
  bigCategory: string;
  hashtags: string;
  crewId?: string;
  editorState: EditorState | null; //TLDR; 추후 편집 확장성을 위해서 doc만이 아닌 state 전체 저장
}

const DRAFT_KEY = "write_draft";

export default function WritePage() {
  useMeta({ title: "Write - Stylefolks" });

  const [title, setTitle] = useState("");
  const [bigCategory, setBigCategory] = useState("OOTD");
  const [hashtags, setHashtags] = useState("");
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [crews, setCrews] = useState<UserCrew[]>([]);
  const [crewId, setCrewId] = useState("");
  const [isCrewAdmin, setIsCrewAdmin] = useState(false);
  const [selectedCrewId, setSelectedCrewId] = useState<string | undefined>(
    undefined,
  );
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionPos, setMentionPos] = useState<{
    left: number;
    top: number;
  } | null>(null);
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
    getMyId()
      .then((id) => {
        setMyId(id);
        if (id) {
          getUserCrews(id)
            .then((c) => setCrews(c))
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!crewId) {
      setIsCrewAdmin(false);
      return;
    }
    fetchCrew(crewId)
      .then((crew) => {
        setIsCrewAdmin(crew.ownerId === myId);
      })
      .catch(() => setIsCrewAdmin(false));
  }, [crewId, myId]);

  useEffect(() => {
    if (!editorView) return;
    const handler = () => {
      const { state } = editorView;
      const { from } = state.selection;
      const $from = state.doc.resolve(from);
      const textBefore = $from.parent.textBetween(
        0,
        $from.parentOffset,
        undefined,
        "\uFFFC",
      );
      const match = /@([\w\u3131-\uD79D]*)$/.exec(textBefore);
      if (match) {
        const query = match[1];
        const pos = from - query.length;
        const coords = editorView.coordsAtPos(pos);
        setMentionQuery(query);
        setMentionPos({ left: coords.left, top: coords.bottom });
      } else {
        setMentionQuery("");
        setMentionPos(null);
      }
    };
    editorView.dom.addEventListener("keyup", handler);
    editorView.dom.addEventListener("click", handler);
    return () => {
      editorView.dom.removeEventListener("keyup", handler);
      editorView.dom.removeEventListener("click", handler);
    };
  }, [editorView]);

  const saveDraft = () => {
    const draft: Draft = {
      title,
      bigCategory,
      hashtags,
      crewId: selectedCrewId,
      editorState,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    alert("Draft saved");
  };

  const handleSubmit = () => {
    const draft: Draft = {
      title,
      bigCategory,
      hashtags,
      crewId: selectedCrewId,
      editorState,
    };

    if (!getToken()) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      navigate("/login", { state: { from: location } });
      return;
    }
    clearDraft();
    alert("Post submitted");
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    alert("Draft cleared");
  };

  const handleChange = (value: EditorState) => {
    setEditorState(value);
  };

  const handleMentionSelect = (crew: CrewSummary) => {
    if (!editorView) return;
    const { state } = editorView;
    const { from } = state.selection;
    const start = from - mentionQuery.length - 1;
    const tr = state.tr.replaceWith(
      start,
      from,
      state.schema.text(`@${crew.name} `),
    );
    editorView.dispatch(tr);
    editorView.focus();
    setMentionQuery("");
    setMentionPos(null);
  };

  const categories = ["BASIC", "COLUMN"];

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
          value={crewId}
          onChange={(e) => setCrewId(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Crew (optional)</option>
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
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <Input
        placeholder="Hashtags (comma separated)"
        value={hashtags}
        onChange={(e) => setHashtags(e.target.value)}
      />
      <div className="relative">
        <Editor
          value={initialDoc}
          onChange={handleChange}
          onReady={setEditorView}
        />
        <CrewMentionList
          query={mentionQuery}
          position={mentionPos}
          onSelect={handleMentionSelect}
        />
      </div>
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

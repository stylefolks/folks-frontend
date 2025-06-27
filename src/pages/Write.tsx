import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken } from "@/lib/auth";
import { Editor } from "@/components/Editor";
import {
  BrandMetaType,
  CREW_META_TYPES,
  CrewMetaType,
  PostType,
  type CreatePostDto,
} from "@/lib/posts";
import { extractFromDoc } from "@/lib/mentions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { initialDoc } from "@/components/Editor/core/doc";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { useMeta } from "@/lib/meta";

const DRAFT_KEY = "write_draft";

export default function WritePage() {
  useMeta({ title: "Write - Stylefolks" });

  const [title, setTitle] = useState("");
  const [postType, setPostType] = useState<PostType>("BASIC");
  const [crewMetaType, setCrewMetaType] = useState<CrewMetaType | undefined>(
    undefined
  );
  const [brandMetaType, setBrandMetaType] = useState<BrandMetaType | undefined>(
    undefined
  );
  const [content, setContent] = useState<EditorState | null>(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      const draft: CreatePostDto = JSON.parse(raw);
      setTitle(draft.title);
      setPostType(draft.type);
      if (draft.crewMetaType) setCrewMetaType(draft.crewMetaType);
      setContent(draft.content);
    }
  }, []);

  const saveDraft = () => {
    const extractResult = extractFromDoc(content?.toJSON() || {}, [
      "brand",
      "crew",
      "hashtag",
    ]);
    const { brandIds, crewIds, hashtags } = extractResult;
    const draft: CreatePostDto = {
      title,
      type: postType,
      hashtags,
      brandMetaType,
      crewMetaType,
      crewIds,
      brandIds,
      content,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    alert("Draft saved");
  };

  const handleSubmit = async () => {
    if (!editorView) return;
    const content = editorView.state.doc.toJSON();
    const extractResult = extractFromDoc(content, ["brand", "crew", "hashtag"]);
    const { brandIds, crewIds, hashtags } = extractResult;
    const draft: CreatePostDto = {
      title,
      type: postType,
      hashtags,
      brandMetaType,
      crewMetaType,
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

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    alert("Draft cleared");
  };

  const handleChange = (value: EditorState) => {
    setContent(value);
  };

  const categories = ["BASIC", "COLUMN"];
  const metaTypes = ["EVENT", "NOTICE"];

  return (
    <div className="mx-auto max-w-2xl p-4 space-y-4">
      <h1 className="text-xl font-bold">Write a Post</h1>
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        value={postType}
        onChange={(e) => setPostType(e.target.value as PostType)}
        className="w-full border p-2 rounded"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        value={brandMetaType}
        onChange={(e) => setBrandMetaType(e.target.value as BrandMetaType)}
        className="w-full border p-2 rounded"
      >
        <option value="">브랜드 메타 타입</option>
        {metaTypes.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <select
        value={crewMetaType}
        onChange={(e) => setCrewMetaType(e.target.value as CrewMetaType)}
        className="w-full border p-2 rounded"
      >
        <option value="">크루 메타 타입</option>
        {CREW_META_TYPES.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <div className="relative">
        <Editor
          value={initialDoc}
          onChange={handleChange}
          onReady={setEditorView}
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

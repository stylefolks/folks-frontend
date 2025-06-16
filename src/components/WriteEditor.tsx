import { useEffect, useRef } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { editorSchema } from '@/lib/editorSchema';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap, toggleMark } from 'prosemirror-commands';
import { history } from 'prosemirror-history';
import { dropCursor } from 'prosemirror-dropcursor';

interface Props {
  content: any;
  onChange: (content: any) => void;
}

export default function WriteEditor({ content, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const state = EditorState.create({
      schema: editorSchema,
      doc: content ? editorSchema.nodeFromJSON(content) : undefined,
      plugins: [
        history(),
        dropCursor(),
        keymap({
          Tab: increaseIndent,
          'Shift-Tab': decreaseIndent,
        }),
        keymap(baseKeymap),
      ],
    });

    const view = new EditorView(ref.current, {
      state,
      dispatchTransaction(tr) {
        const newState = view.state.apply(tr);
        view.updateState(newState);
        onChange(newState.doc.toJSON());
      },
    });
    viewRef.current = view;
    return () => {
      view.destroy();
    };
  }, []);

  const applyColor = (color: string) => {
    if (!viewRef.current) return;
    toggleMark(editorSchema.marks.color, { color })(viewRef.current.state, viewRef.current.dispatch);
    viewRef.current.focus();
  };

  const applyFont = (font: string) => {
    if (!viewRef.current) return;
    toggleMark(editorSchema.marks.font, { name: font })(viewRef.current.state, viewRef.current.dispatch);
    viewRef.current.focus();
  };

  return (
    <div>
      <div className="mb-2 flex gap-2 flex-wrap">
        <input
          type="color"
          onChange={(e) => applyColor(e.target.value)}
          title="Text Color"
        />
        <select onChange={(e) => applyFont(e.target.value)} defaultValue="">
          <option value="" disabled>
            Font
          </option>
          <option value="Arial">Arial</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
        </select>
        <button
          type="button"
          onClick={() => increaseIndent(viewRef.current!.state, viewRef.current!.dispatch)}
          className="border px-2"
        >
          Indent
        </button>
        <button
          type="button"
          onClick={() => decreaseIndent(viewRef.current!.state, viewRef.current!.dispatch)}
          className="border px-2"
        >
          Outdent
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file || !viewRef.current) return;
            const reader = new FileReader();
            reader.onload = () => {
              const { state, dispatch } = viewRef.current!;
              const node = editorSchema.nodes.image.create({ src: reader.result });
              const tr = state.tr.replaceSelectionWith(node);
              dispatch(tr);
            };
            reader.readAsDataURL(file);
          }}
        />
      </div>
      <div ref={ref} className="min-h-[300px] border p-2" />
    </div>
  );
}

function updateIndent(state: EditorState, dispatch: any, diff: number) {
  const { from, to } = state.selection;
  let tr = state.tr;
  state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.type === editorSchema.nodes.paragraph) {
      const indent = Math.max(0, (node.attrs.indent || 0) + diff);
      tr = tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent });
    }
  });
  if (tr.docChanged) {
    dispatch(tr);
    return true;
  }
  return false;
}

function increaseIndent(state: EditorState, dispatch: any) {
  return updateIndent(state, dispatch, 1);
}

function decreaseIndent(state: EditorState, dispatch: any) {
  return updateIndent(state, dispatch, -1);
}

import { useEffect, useRef } from 'react';
import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView, Decoration, DecorationSet } from 'prosemirror-view';
import { editorSchema } from '@/lib/editorSchema';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap, toggleMark } from 'prosemirror-commands';
import { wrapInList } from 'prosemirror-schema-list';
import { history } from 'prosemirror-history';
import { dropCursor } from 'prosemirror-dropcursor';

const placeholderPlugin = new Plugin<DecorationSet>({
  state: {
    init() {
      return DecorationSet.empty;
    },
    apply(tr, set) {
      set = set.map(tr.mapping, tr.doc);
      const action = tr.getMeta(this);
      if (action && action.add) {
        const widget = document.createElement('placeholder');
        const deco = Decoration.widget(action.add.pos, widget, {
          id: action.add.id,
        });
        set = set.add(tr.doc, [deco]);
      } else if (action && action.remove) {
        set = set.remove(
          set.find(null, null, (spec) => (spec as any).id === action.remove.id),
        );
      }
      return set;
    },
  },
  props: {
    decorations(state) {
      return (this as any).getState(state);
    },
  },
});

function findPlaceholder(state: EditorState, id: object) {
  const decos = placeholderPlugin.getState(state);
  const found = decos.find(null, null, (spec) => (spec as any).id === id);
  return found.length ? found[0].from : null;
}

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
        placeholderPlugin,
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

  const toggle = (mark: any) => {
    if (!viewRef.current) return;
    toggleMark(mark)(viewRef.current.state, viewRef.current.dispatch);
    viewRef.current.focus();
  };

  const wrapList = (listType: any) => {
    if (!viewRef.current) return;
    wrapInList(listType)(viewRef.current.state, viewRef.current.dispatch);
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
        <button type="button" onClick={() => toggle(editorSchema.marks.strong)} className="border px-2">
          Bold
        </button>
        <button type="button" onClick={() => toggle(editorSchema.marks.em)} className="border px-2">
          Italic
        </button>
        <button type="button" onClick={() => toggle(editorSchema.marks.underline)} className="border px-2">
          Underline
        </button>
        <button type="button" onClick={() => toggle(editorSchema.marks.strike)} className="border px-2">
          Strike
        </button>
        <button type="button" onClick={() => wrapList(editorSchema.nodes.bullet_list)} className="border px-2">
          Bullets
        </button>
        <button type="button" onClick={() => wrapList(editorSchema.nodes.ordered_list)} className="border px-2">
          Numbered
        </button>
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
            startImageUpload(viewRef.current, file);
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

function uploadFile(file: File) {
  const reader = new FileReader();
  return new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    setTimeout(() => reader.readAsDataURL(file), 1500);
  });
}

function startImageUpload(view: EditorView, file: File) {
  const id = {};
  let tr = view.state.tr;
  if (!tr.selection.empty) tr.deleteSelection();
  tr.setMeta(placeholderPlugin, { add: { id, pos: tr.selection.from } });
  view.dispatch(tr);

  uploadFile(file).then(
    (url) => {
      const pos = findPlaceholder(view.state, id);
      if (pos == null) return;
      view.dispatch(
        view.state.tr
          .replaceWith(pos, pos, editorSchema.nodes.image.create({ src: url }))
          .setMeta(placeholderPlugin, { remove: { id } }),
      );
    },
    () => {
      view.dispatch(tr.setMeta(placeholderPlugin, { remove: { id } }));
    },
  );
}

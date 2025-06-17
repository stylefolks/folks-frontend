import { useEffect, useRef } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import type { Schema } from 'prosemirror-model';
import type { Plugin } from 'prosemirror-state';

interface Options {
  schema: Schema;
  doc?: any;
  plugins: Plugin[];
  onChange?: (doc: any) => void;
  editable?: boolean;
}

export default function useProseMirror({
  schema,
  doc,
  plugins,
  onChange,
  editable = true,
}: Options) {
  const ref = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const state = EditorState.create({
      schema,
      doc: doc ? schema.nodeFromJSON(doc) : undefined,
      plugins,
    });
    const view = new EditorView(ref.current, {
      state,
      editable: () => editable,
      dispatchTransaction(tr) {
        const newState = view.state.apply(tr);
        view.updateState(newState);
        onChange?.(newState.doc.toJSON());
      },
    });
    viewRef.current = view;
    return () => view.destroy();
  }, [schema, doc, plugins, onChange, editable]);

  return ref;
}

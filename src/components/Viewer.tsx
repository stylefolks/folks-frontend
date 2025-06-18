import React, { useEffect, useRef } from 'react';
import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { editorSchema } from '@/lib/editorSchema';
import './Editor/core/editor.css';
import { setup } from './Editor/core';

interface Props {
  content: any;
}

export default function Viewer({ content }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const schema = editorSchema;
  const doc = Node.fromJSON(schema, content);
  const plugins = setup({ schema, menuBar: false, history: false });
  const state = EditorState.create({ doc, plugins });

  useEffect(() => {
    if (ref.current && !viewRef.current) {
      viewRef.current = new EditorView(ref.current, {
        state,
        editable: () => false,
      });
    }
  }, [state]);

  return <div ref={ref} className="editor-wrapper" />;
}

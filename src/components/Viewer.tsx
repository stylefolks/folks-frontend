import React, { useEffect, useRef } from 'react';
import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { editorSchema } from '@/lib/editorSchema';
import { cn } from '@/lib/utils';
import './Editor/core/editor.css';
import { setup } from './Editor/core';

interface Props {
  content: any;
  className?: string;
}

export default function Viewer({ content, className }: Props) {
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

  return <div ref={ref} className={cn('editor-wrapper', className)} />;
}

import React, { useEffect, useRef } from 'react';
import OrderedMap from 'orderedmap';
import { Node, NodeSpec, Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { schema as baseSchema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import './Editor/core/editor.css';
import { setup } from './Editor/core';

interface Props {
  content: any;
}

export default function Viewer({ content }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const baseNodes: OrderedMap<NodeSpec> | NodeSpec = addListNodes(
    baseSchema.spec.nodes,
    'paragraph block*',
    'block',
  );
  const nodes = baseNodes.append([]);
  const marks = baseSchema.spec.marks;
  const schema = new Schema({ nodes, marks });
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

import React, { useEffect, useRef } from "react";
import OrderedMap from "orderedmap";

import { Node, NodeSpec } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema } from "prosemirror-model";
import { schema as baseSchema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import "../Editor/core/editor.css"
import { setup } from "./core";

interface EditorProps {
  value: object;
  onChange: (value: EditorState) => void;
}

export const Editor: React.FC<EditorProps> = React.memo(({ value , onChange}: EditorProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorView>(null!);
  const baseNodes: OrderedMap<NodeSpec> | NodeSpec = addListNodes(
    baseSchema.spec.nodes,
    "paragraph block*",
    "block"
  );
  const nodes = baseNodes.append([]);
  const marks = baseSchema.spec.marks;
  const schema = new Schema({ nodes, marks });
  const doc = Node.fromJSON(schema, value);
  const plugins = setup({ schema });
  const state = EditorState.create({ doc, plugins });

  useEffect(() => {
    if (ref.current !== null && !editorRef.current) {
      editorRef.current = new EditorView(ref.current, { state , dispatchTransaction:(transaction)=> {
        const newState = editorRef.current.state.apply(transaction);
        editorRef.current.updateState(newState)
        onChange(newState)
      }});
    }
  }, [state]);

  return <div ref={ref} className="editor-wrapper" />;
});


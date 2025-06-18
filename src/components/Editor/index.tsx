import React, { useEffect, useRef } from "react";
import { Node } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { editorSchema } from "@/lib/editorSchema";
import "../Editor/core/editor.css"
import { setup } from "./core";

interface EditorProps {
  value: object;
  onChange: (value: EditorState) => void;
}

export const Editor: React.FC<EditorProps> = React.memo(({ value , onChange}: EditorProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorView>(null!);
  const schema = editorSchema;
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


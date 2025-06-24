import React, { useEffect, useRef } from "react";
import { Node } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { editorSchema } from "@/lib/editorSchema";
import "../Editor/core/editor.css";
import { setup } from "./core";

interface EditorProps {
  value: object;
  onChange: (value: EditorState) => void;
  onReady?: (view: EditorView) => void;
}

export const Editor: React.FC<EditorProps> = ({
  value,
  onChange,
  onReady,
}: EditorProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (ref.current !== null && !editorRef.current) {
      const schema = editorSchema;
      const doc = Node.fromJSON(schema, value);
      const plugins = setup({ schema });
      const state = EditorState.create({ doc, plugins });

      editorRef.current = new EditorView(ref.current, {
        state,
        dispatchTransaction: (transaction) => {
          if (editorRef.current) {
            const newState = editorRef.current.state.apply(transaction);
            editorRef.current.updateState(newState);
            onChange(newState);
          }
        },
      });
      if (onReady && editorRef.current) {
        onReady(editorRef.current);
      }
    }
  }, [value]);

  return <div ref={ref} className="editor-wrapper" />;
};

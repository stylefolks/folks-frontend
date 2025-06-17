"use client";

import { useEffect, useRef } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema } from "prosemirror-model";
import { schema as basicSchema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { exampleSetup } from "prosemirror-example-setup";

import "prosemirror-view/style/prosemirror.css";
import "prosemirror-menu/style/menu.css";
import "prosemirror-example-setup/style/style.css";

export default function Editor() {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const mySchema = new Schema({
      nodes: addListNodes(basicSchema.spec.nodes, "paragraph block*", "block"),
      marks: basicSchema.spec.marks,
    });

    const state = EditorState.create({
      schema: mySchema,
      plugins: exampleSetup({ schema: mySchema }),
    });

    const view = new EditorView(editorRef.current, {
      state,
    });

    return () => {
      view.destroy();
    };
  }, []);

  return <div ref={editorRef} className="border p-2 rounded" />;
}

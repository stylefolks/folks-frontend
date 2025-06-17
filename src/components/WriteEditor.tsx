import { useEffect, useRef } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { editorSchema } from '@/lib/editorSchema';
import { setup } from './Editor/core';
import "./Editor/core/style.css"; // CSS 파일 임포트가 작동하지 않아 보임.


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
        ...setup({ schema: editorSchema }), // setup 함수로 플러그인 배열 생성
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

  

  return (
      <div ref={ref} className="min-h-[300px] border p-2" />
  );
}


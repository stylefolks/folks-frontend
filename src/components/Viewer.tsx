import { editorSchema } from '@/lib/editorSchema';
import { setup } from './Editor/core';
import useProseMirror from '@/hooks/useProseMirror';
import '@/styles/editor.css';

interface Props {
  content: any;
}

export default function Viewer({ content }: Props) {
  const ref = useProseMirror({
    schema: editorSchema,
    doc: content,
    plugins: setup({ schema: editorSchema, menuBar: false, history: false }),
    editable: false,
  });

  return <div ref={ref} className="min-h-[300px] border p-2" />;
}

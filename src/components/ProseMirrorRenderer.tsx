import { useEffect, useRef } from 'react';
import { DOMSerializer } from 'prosemirror-model';
import { editorSchema } from '@/lib/editorSchema';

interface Props {
  content: any;
}

export default function ProseMirrorRenderer({ content }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    try {
      const node = editorSchema.nodeFromJSON(content);
      const fragment = DOMSerializer.fromSchema(editorSchema).serializeFragment(
        node.content,
      );
      const container = ref.current;
      container.innerHTML = '';
      container.appendChild(fragment);
    } catch {
      ref.current.textContent = 'Invalid content';
    }
  }, [content]);

  return <div ref={ref} />;
}

import { useEffect, useRef } from 'react';
import { DOMSerializer } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';

interface Props {
  content: any;
}

export default function ProseMirrorRenderer({ content }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    try {
      const node = schema.nodeFromJSON(content);
      const fragment = DOMSerializer.fromSchema(schema).serializeFragment(
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

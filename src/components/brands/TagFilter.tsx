'use client';

import { useState } from 'react';

const TAGS = ['디자이너', '빈티지', '스트릿', '서울팝업'];

export default function TagFilter({
  onSelect,
}: {
  onSelect: (tag: string) => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className="flex flex-wrap gap-2 py-4">
      {TAGS.map((tag) => (
        <button
          key={tag}
          onClick={() => {
            setActive(tag);
            onSelect(tag);
          }}
          className={`rounded-full px-3 py-1 text-sm ${
            active === tag ? 'bg-black text-white' : 'bg-gray-100'
          }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}

import React from 'react';

export default function TagList({ tags }: { tags: string[] }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 py-2">
      {tags.map((tag) => (
        <span key={tag} className="rounded bg-gray-200 px-2 py-1 text-xs">
          #{tag}
        </span>
      ))}
    </div>
  );
}

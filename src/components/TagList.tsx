import React from 'react';
import { Link } from 'react-router-dom';

export default function TagList({ tags }: { tags: string[] }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 py-2">
      {tags.map((tag) => (
        <Link
          key={tag}
          to={`/search?tag=${encodeURIComponent(tag)}`}
          className="rounded bg-gray-200 px-2 py-1 text-xs hover:bg-gray-300"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface BrandPost {
  id: number;
  title: string;
  image: string;
  date: string;
}

export default function BrandPostPreviewList() {
  const [posts, setPosts] = useState<BrandPost[]>([]);

  useEffect(() => {
    fetch('/posts?authorType=BRAND&limit=6')
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  if (!posts.length) return null;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`} className="block">
          <img
            src={post.image}
            alt={post.title}
            className="h-32 w-full rounded-md object-cover"
          />
          <h3 className="mt-2 text-sm font-semibold">{post.title}</h3>
          <p className="text-xs text-gray-500">
            {new Date(post.date).toLocaleDateString()}
          </p>
        </Link>
      ))}
    </div>
  );
}

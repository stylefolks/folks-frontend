"use client";

import { getPostById, getNextPosts } from "@/lib/posts";
import { useRouter } from "next/navigation";

export default function PostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = Number(params.id);
  const post = getPostById(id);
  const nextPosts = getNextPosts(id, 3);

  const navigate = (postId: number) => {
    document.startViewTransition(() => {
      router.push(`/posts/${postId}`);
    });
  };

  return (
    <div className="mx-auto flex max-w-5xl p-4">
      <article className="flex-1">
        <button
          onClick={() => router.back()}
          className="mb-4 text-sm text-blue-500"
        >
          &larr; Back
        </button>
        <h1 className="mb-2 text-2xl font-bold">{post.title}</h1>
        <p className="text-sm text-gray-500">
          {new Date(post.date).toDateString()}
        </p>
        <div style={{ viewTransitionName: `post-${post.id}` }}>
          <img
            src={post.image}
            alt={post.title}
            className="my-4 w-full rounded-md"
          />
        </div>
        <p>{post.content}</p>
      </article>
      <aside className="ml-8 hidden w-64 space-y-4 md:block">
        {nextPosts.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(p.id)}
            className="cursor-pointer"
          >
            <div
              style={{ viewTransitionName: `post-${p.id}`, height: 80 }}
              className="overflow-hidden rounded-md bg-gray-100"
            >
              <img
                src={p.image}
                alt={p.title}
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="mt-1 text-sm">{p.title}</h3>
          </div>
        ))}
      </aside>
    </div>
  );
}

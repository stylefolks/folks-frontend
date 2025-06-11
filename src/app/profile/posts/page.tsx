"use client";

import { useEffect, useState } from "react";
import { getMyPosts, type PostSummary } from "@/lib/profile";
import { useSearchParams } from "next/navigation";
import PostCard from "@/components/PostCard";

export default function MyPostsPage() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const category = searchParams.get("category") || undefined;
    getMyPosts(category)
      .then(setPosts)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed"));
  }, [searchParams]);

  return (
    <div className="p-4 space-y-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold">My Posts</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((p) => (
          <PostCard key={p.id} post={{ id: p.id, title: p.title, image: p.imageUrl || "", date: "", content: "" }} />
        ))}
      </div>
    </div>
  );
}

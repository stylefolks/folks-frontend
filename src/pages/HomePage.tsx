import React from "react";
import TopAppBar from "@/components/TopAppBar";
import HashtagChips from "@/components/HashtagChips";
import PostFeedGrid from "@/components/PostFeedGrid";
import FloatingMenu from "@/components/FloatingMenu";

export default function HomePage() {
  return (
    <div className="min-h-screen pb-16 bg-background text-foreground">
      <TopAppBar />
      <section className="px-4 py-2">
        <HashtagChips />
      </section>
      <PostFeedGrid />
      <FloatingMenu />
    </div>
  );
}

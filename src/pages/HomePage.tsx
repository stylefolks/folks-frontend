import React from "react";
import HashtagChips from "@/components/HashtagChips";
import PostFeedGrid from "@/components/PostFeedGrid";
import FloatingMenu from "@/components/FloatingMenu";
import HomeCrewGrid from "@/components/HomeCrewGrid";

export default function HomePage() {
  return (
    <div className="min-h-screen pb-16 bg-background text-foreground">
      <section className="px-4 py-2">
        <HashtagChips />
      </section>
      <HomeCrewGrid />
      <PostFeedGrid />
      <FloatingMenu />
    </div>
  );
}

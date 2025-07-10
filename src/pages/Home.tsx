import React from "react";
import HashtagChips from "@/components/HashtagChips";
import HomeCrewGrid from "@/components/HomeCrewGrid";
import { useMeta } from "@/lib/meta";
import PostGrid from "@/components/PostGrid";

export default function Home() {
  useMeta({
    title: "Home - Stylefolks",
    metas: [
      {
        name: "description",
        content:
          "Welcome to Stylefolks, your go-to platform for the latest in fashion and lifestyle.",
      },
      {
        name: "keywords",
        content: `fashion, lifestyle, style ${new Date().toLocaleString()}`,
      },
    ],
  });

  return (
    <div className="min-h-screen pb-16 bg-background text-foreground">
      <section className="px-4 py-2">
        <HashtagChips />
      </section>
      <HomeCrewGrid />
      <PostGrid />
    </div>
  );
}

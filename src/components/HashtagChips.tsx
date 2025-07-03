import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Tag {
  name: string;
  postCount: number;
}

export default function HashtagChips() {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    fetch("/tags/hot")
      .then((res) => res.json())
      .then((data) => setTags(data))
      .catch(() => setTags([]));
  }, []);

  return (
    <div>
      <h2 className="pb-2 pt-1 text-sm font-bold">HOT Hashtags</h2>
      <div
        className="flex gap-2 overflow-x-auto whitespace-nowrap scroll-snap-x pb-1"
        role="list"
      >
        {tags.map((tag) => (
          <button
            key={tag.name}
            onClick={() => {}}
            className={cn(
              "rounded-full bg-[#F7F7F7] px-3 py-1 text-sm hover:bg-black hover:text-white transition"
            )}
          >
            #{tag.name} ({tag.postCount})
          </button>
        ))}
      </div>
    </div>
  );
}

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
    <div className="flex overflow-x-auto gap-2 pb-1" role="list">
      {tags.map((tag) => (
        <span
          key={tag.name}
          className={cn(
            "px-3 py-1 bg-muted rounded-full text-sm whitespace-nowrap cursor-pointer hover:bg-muted/80"
          )}
        >
          #{tag.name}
        </span>
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Tag } from "@/types/tag";

interface Props {
  selected: string | null;
  onSelect: (tag: string | null) => void;
}

export default function HotHashtagChips({ selected, onSelect }: Props) {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    fetch("/tags/hot")
      .then((res) => res.json())
      .then((data) => setTags(data))
      .catch(() => setTags([]));
  }, []);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="list">
      {tags.map((tag) => (
        <button
          key={tag.name}
          onClick={() => onSelect(selected === tag.name ? null : tag.name)}
          className={cn(
            "active:scale-95",
            "whitespace-nowrap rounded-full bg-[#F5F5F5] px-3 py-1 text-sm transition",
            "hover:bg-black hover:text-white",
            selected === tag.name && "bg-black text-white"
          )}
        >
          #{tag.name} ({tag.postCount})
        </button>
      ))}
    </div>
  );
}

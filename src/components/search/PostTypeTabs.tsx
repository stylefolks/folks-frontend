import { PostType, SEARCH_POST_TYPES, SearchPostType } from "@/lib/posts";
import { cn } from "@/lib/utils";

interface Props {
  value: SearchPostType;
  onChange: (value: SearchPostType) => void;
}

export default function PostTypeTabs({ value, onChange }: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto">
      {SEARCH_POST_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={cn(
            "pb-1 text-sm whitespace-nowrap",
            value === type
              ? "border-b-2 border-black font-semibold"
              : "text-gray-500"
          )}
        >
          {type === "ALL" ? "전체" : type}
        </button>
      ))}
    </div>
  );
}

import { cn } from '@/lib/utils';

interface Props {
  tags: string[];
  selected: string[];
  onChange: (tags: string[]) => void;
}

export default function TagFilterChips({ tags, selected, onChange }: Props) {
  const toggle = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };
  return (
    <div className="flex gap-2 overflow-x-auto py-1">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => toggle(tag)}
          className={cn(
            'rounded-full border px-3 py-1 text-sm whitespace-nowrap',
            selected.includes(tag)
              ? 'bg-black text-white border-black'
              : 'bg-gray-100 text-gray-700'
          )}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}

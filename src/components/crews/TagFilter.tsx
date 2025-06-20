import { cn } from '@/lib/utils';

interface Props {
  tags: string[];
  selected: string | null;
  onChange: (tag: string | null) => void;
}

export default function TagFilter({ tags, selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onChange(selected === tag ? null : tag)}
          className={cn(
            'rounded px-2 py-1 text-sm',
            selected === tag ? 'bg-black text-white' : 'bg-gray-200'
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

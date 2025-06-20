import { cn } from '@/lib/utils';

const TYPES = ['ALL', 'TALK', 'COLUMN', 'CREW', 'BRAND'] as const;
export type PostType = typeof TYPES[number];

interface Props {
  value: PostType;
  onChange: (value: PostType) => void;
}

export default function PostTypeTabs({ value, onChange }: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto">
      {TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={cn(
            'pb-1 text-sm whitespace-nowrap',
            value === type ? 'border-b-2 border-black font-semibold' : 'text-gray-500'
          )}
        >
          {type === 'ALL' ? '전체' : type}
        </button>
      ))}
    </div>
  );
}

import { cn } from '@/lib/utils';
import React from 'react';

export interface TabItem {
  value: string;
  label: string;
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (value: string) => void;
  items: TabItem[];
}

export default function Tabs({ value, onValueChange, items, className }: TabsProps) {
  return (
    <div className={cn('flex border-b', className)}>
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onValueChange(item.value)}
          className={cn(
            'px-4 py-2 text-sm whitespace-nowrap',
            value === item.value
              ? 'font-bold text-black border-b-2 border-black'
              : 'text-muted-foreground'
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

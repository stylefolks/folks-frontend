import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';

interface Props {
  value: string;
  onChange: (v: string) => void;
  isEditable?: boolean;
  as?: keyof JSX.IntrinsicElements;
  placeholder?: string;
  className?: string;
}

export default function EditableText({
  value,
  onChange,
  isEditable,
  as = 'span',
  placeholder,
  className,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);

  useEffect(() => setTemp(value), [value]);

  const Tag = as as any;

  if (editing && isEditable) {
    return (
      <Input
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
        onBlur={() => {
          setEditing(false);
          onChange(temp);
        }}
        autoFocus
        placeholder={placeholder}
        className={className}
      />
    );
  }

  return (
    <Tag
      className={cn(isEditable && 'cursor-pointer', className)}
      onClick={() => isEditable && setEditing(true)}
    >
      {value || placeholder}
    </Tag>
  );
}

import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  src?: string;
  onChange: (file: File) => void;
  isEditable?: boolean;
  className?: string;
  placeholderClassName?: string;
}

export default function EditableImageUpload({
  src,
  onChange,
  isEditable,
  className,
  placeholderClassName,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  return (
    <div
      className={cn('relative group', className)}
      onClick={() => {
        if (isEditable) inputRef.current?.click();
      }}
    >
      {src ? (
        <img src={src} className="h-full w-full object-cover" />
      ) : (
        <div className={cn('flex h-full w-full items-center justify-center bg-gray-100 text-gray-400', placeholderClassName)}>
          No image
        </div>
      )}
      {isEditable && (
        <div className="absolute inset-0 hidden items-center justify-center bg-black/50 text-white group-hover:flex">
          <span className="px-2 py-1 text-sm">Upload</span>
        </div>
      )}
      {isEditable && (
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleFile}
          className="hidden"
        />
      )}
    </div>
  );
}

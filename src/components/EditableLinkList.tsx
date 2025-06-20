import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export interface LinkItem {
  title: string;
  url: string;
}

interface Props {
  links: LinkItem[];
  onChange: (links: LinkItem[]) => void;
  isEditable?: boolean;
}

export default function EditableLinkList({ links, onChange, isEditable }: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleChange = (index: number, field: keyof LinkItem, value: string) => {
    const updated = links.map((l, i) =>
      i === index ? { ...l, [field]: value } : l,
    );
    onChange(updated);
  };

  const remove = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([...links, { title: '', url: '' }]);
    setEditingIndex(links.length);
  };

  if (!isEditable && links.length === 0) return null;

  return (
    <div className="space-y-2">
      {links.map((link, i) => (
        <div key={i} className="flex items-center gap-2">
          {isEditable && editingIndex === i ? (
            <>
              <Input
                value={link.title}
                onChange={(e) => handleChange(i, 'title', e.target.value)}
                placeholder="Title"
                className="w-32"
              />
              <Input
                value={link.url}
                onChange={(e) => handleChange(i, 'url', e.target.value)}
                placeholder="URL"
              />
              <Button
                variant="outline"
                onClick={() => setEditingIndex(null)}
              >
                Done
              </Button>
              <Button variant="outline" onClick={() => remove(i)}>
                Remove
              </Button>
            </>
          ) : (
            <>
              <a href={link.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                {link.title || link.url}
              </a>
              {isEditable && (
                <Button variant="outline" size="sm" onClick={() => setEditingIndex(i)}>
                  Edit
                </Button>
              )}
            </>
          )}
        </div>
      ))}
      {isEditable && (
        <Button variant="outline" size="sm" onClick={add}>
          {links.length === 0 ? 'SNS 추가하기' : 'Add link'}
        </Button>
      )}
    </div>
  );
}

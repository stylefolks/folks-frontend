import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function SearchInput({ className, ...props }: Props) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
      <Input
        type="search"
        className={cn('rounded-full bg-[#F5F5F5] pl-9 py-2 text-sm', className)}
        {...props}
      />
    </div>
  );
}

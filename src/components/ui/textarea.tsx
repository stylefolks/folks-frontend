import { forwardRef, ComponentPropsWithoutRef } from 'react';
import { cn } from '../../lib/utils';

export type TextareaProps = ComponentPropsWithoutRef<'textarea'>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';


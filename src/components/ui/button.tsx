import { cn } from '../../lib/utils';
import { ComponentProps } from 'react';
import React from 'react';

function Slot({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return React.cloneElement(React.Children.only(children) as React.ReactElement, props);
}

export type ButtonProps = ComponentProps<'button'> & {
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  asChild?: boolean;
};

export function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  const variants: Record<string, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline:
      'border border-input hover:bg-accent hover:text-accent-foreground',
  };
  const sizes: Record<string, string> = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
  };

  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

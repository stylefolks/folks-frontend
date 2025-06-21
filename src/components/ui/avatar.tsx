import React from 'react'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Avatar({ src, size = 'md', className, ...props }: AvatarProps) {
  const sizes: Record<string, string> = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }
  if (!src) {
    return <User className={cn(sizes[size], className)} />
  }
  return (
    <img
      src={src}
      className={cn('rounded-full object-cover', sizes[size], className)}
      {...props}
    />
  )
}

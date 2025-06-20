import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  skeletonClassName?: string;
}

export default function ImageWithSkeleton({
  src,
  alt,
  className,
  skeletonClassName,
  ...props
}: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {!loaded && <Skeleton className={cn('absolute inset-0', skeletonClassName)} />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={cn('h-full w-full object-cover', loaded ? 'opacity-100' : 'opacity-0')}
        {...props}
      />
    </div>
  );
}

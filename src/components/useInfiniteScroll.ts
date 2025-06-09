import { useEffect, useRef } from "react";

export default function useInfiniteScroll(
  callback: () => void
): React.RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback();
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [callback]);

  return ref;
}

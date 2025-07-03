import React, { useEffect, useState } from "react";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import type { CrewSummary } from "@/lib/crew";

export default function HomeCrewGrid() {
  const [crews, setCrews] = useState<CrewSummary[]>([]);

  useEffect(() => {
    fetch("/crews?sort=popular")
      .then((res) => res.json())
      .then((data: CrewSummary[]) => setCrews(data.slice(0, 3)))
      .catch(() => setCrews([]));
  }, []);

  return (
    <section className="mt-5 px-4">
      <h2 className="mb-3 text-md font-bold">Crews</h2>
      <div className="grid grid-cols-3 gap-3">
        {crews.map((crew) => (
          <div
            key={crew.id}
            onClick={() => {}}
            className="relative cursor-pointer"
          >
            <ImageWithSkeleton
              src={crew.coverImage}
              alt={crew.name}
              className="aspect-square rounded-lg"
              skeletonClassName="rounded-lg"
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-1 left-1 right-1 text-white">
              <div className="text-sm font-bold leading-none">{crew.name}</div>
              <div className="text-xs">{crew.memberCount.toLocaleString()} members</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import React, { useEffect, useState } from "react";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";

import { useNavigate } from "react-router-dom";
import { CrewSummaryDto } from "@/dto/crewDto";

export default function HomeCrewGrid() {
  const [crews, setCrews] = useState<CrewSummaryDto[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/crews?sort=popular")
      .then((res) => res.json())
      .then((data: CrewSummaryDto[]) => setCrews(data.slice(0)))
      .catch(() => setCrews([]));
  }, []);

  return (
    <section className="mt-5 px-4">
      <h2 className="mb-3 text-md font-bold">Crews</h2>
      <div className="flex flex-row gap-3 overflow-x-auto pb-2 w-full">
        {crews.map((crew) => (
          <div
            key={crew.id}
            onClick={() => navigate(`/crew/${crew.id}`)}
            className="active:scale-95 relative cursor-pointer min-w-[120px]"
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
              <div className="text-xs">
                {crew.memberCount.toLocaleString()} members
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

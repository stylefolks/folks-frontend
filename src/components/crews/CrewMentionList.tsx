import { useEffect, useState } from "react";
import { fetchCrews } from "@/api/crewApi";
import { CrewDto } from "@/dto/crewDto";

interface Props {
  query: string;
  position: { left: number; top: number } | null;
  onSelect: (crew: CrewDto) => void;
}

export default function CrewMentionList({ query, position, onSelect }: Props) {
  const [crews, setCrews] = useState<CrewDto[]>([]);

  useEffect(() => {
    if (!query) {
      setCrews([]);
      return;
    }
    fetchCrews({ search: query, limit: "10" })
      .then(setCrews)
      .catch(() => setCrews([]));
  }, [query]);

  if (!position || crews.length === 0) return null;

  return (
    <ul
      className="absolute z-50 max-h-60 w-40 overflow-auto rounded border bg-white shadow"
      style={{ left: position.left, top: position.top }}
    >
      {crews.map((crew) => (
        <li
          key={crew.id}
          className="cursor-pointer px-2 py-1 hover:bg-gray-100"
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(crew);
          }}
        >
          {crew.name}
        </li>
      ))}
    </ul>
  );
}

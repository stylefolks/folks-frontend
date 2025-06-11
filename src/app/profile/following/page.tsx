"use client";

import { useEffect, useState } from "react";
import { getFollowedCrews, type Crew } from "@/lib/profile";

export default function FollowedCrewsPage() {
  const [crews, setCrews] = useState<Crew[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getFollowedCrews()
      .then(setCrews)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed"));
  }, []);

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold">Following Crews</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <ul className="list-disc pl-5">
        {crews.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
}

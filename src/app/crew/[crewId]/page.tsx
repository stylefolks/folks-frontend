"use client";
import { useParams } from "next/navigation";

export default function CrewPage() {
  const params = useParams();
  const crewId = params.crewId as string;
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Crew {crewId}</h1>
      <p className="text-sm text-gray-600">This is the crew page.</p>
    </div>
  );
}

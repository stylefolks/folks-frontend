"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyProfile } from "@/lib/profile";

export default function MyProfileRedirect() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    getMyProfile()
      .then((p) => router.replace(`/profile/${p.userId}`))
      .catch(() => setError("Failed to load profile"));
  }, [router]);

  if (error) return <p className="p-4 text-red-500">{error}</p>;
  return <p className="p-4">Loading...</p>;
}

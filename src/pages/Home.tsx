import PostGrid from "@/components/PostGrid";
import { useMeta } from "@/lib/meta";
import { useState } from "react";
export default function Home() {
  useMeta({
    title: "Home - Stylefolks",
    metas: [
      {
        name: "description",
        content:
          "Welcome to Stylefolks, your go-to platform for the latest in fashion and lifestyle.",
      },
      {
        name: "keywords",
        content: `fashion, lifestyle, style ${new Date().toLocaleString()}`,
      },
    ],
  });
  const [count, setCount] = useState(0);

  return (
    <main className="min-h-screen bg-white">
      <PostGrid />
    </main>
  );
}

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
      <div>
        <button onClick={() => setCount(count + 1)}>Click me + 1</button>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count - 1)}>Click me - 1</button>
      </div>
      <PostGrid />
    </main>
  );
}

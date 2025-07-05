import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Tabs, { TabItem } from "@/components/ui/tabs";
import CrewFeedCard, { CrewPost } from "@/components/crew/CrewFeedCard";
import { ArrowLeft } from "lucide-react";

interface Crew {
  id: string;
  name: string;
  avatarUrl: string;
  memberCount: number;
  description: string;
  tags: string[];
}

export default function CrewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [crew, setCrew] = useState<Crew | null>(null);
  const [posts, setPosts] = useState<CrewPost[]>([]);
  const [tab, setTab] = useState("all");
  const [me, setMe] = useState<{ avatarUrl: string } | null>(null);

  useEffect(() => {
    fetch("/users/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setMe(data))
      .catch(() => setMe(null));
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`/crews/${id}`)
      .then((res) => res.json())
      .then(setCrew)
      .catch(() => {});
    fetch(`/crews/${id}/posts`)
      .then((res) => res.json())
      .then(setPosts)
      .catch(() => {});
  }, [id]);

  const tabs: TabItem[] = [
    { value: "all", label: "All Posts" },
    { value: "hashtags", label: "Hashtags" },
    { value: "announcements", label: "Announcements" },
    { value: "notices", label: "Notices" },
  ];

  if (!crew) return <p className="p-4">Loading...</p>;

  return (
    <div className="min-h-screen pb-16">
      <section className="relative px-4">
        <img
          src={crew.avatarUrl}
          alt={crew.name}
          className="aspect-[16/9] w-full rounded-lg object-cover"
        />
        <div className="absolute bottom-4 left-8 text-white drop-shadow">
          <h1 className="font-bold">{crew.name}</h1>
          <p className="text-sm text-white/80">{crew.memberCount} members</p>
        </div>
      </section>
      <div className="mt-2 flex flex-wrap gap-2 px-4">
        {crew.tags.map((tag) => (
          <Link
            to={`/search?tag=${tag}`}
            key={tag}
            className="rounded-full bg-muted  bg-[#F7F7F7] px-3 py-1 text-sm hover:bg-black hover:text-white transition"
          >
            #{tag}
          </Link>
        ))}
      </div>
      <p className="px-4 py-2 text-sm text-muted leading-relaxed">
        {crew.description}
      </p>
      <div className="px-4">
        <Button
          className="w-full bg-black text-white"
          onClick={() => alert("Joined!")}
        >
          Join
        </Button>
      </div>
      <Tabs
        value={tab}
        onValueChange={setTab}
        items={tabs}
        className="mt-4 px-4"
      />
      {tab === "all" && (
        <div className="columns-2 gap-4 p-4 sm:columns-3" role="feed">
          {posts.map((post) => (
            <CrewFeedCard key={post.id} post={post} />
          ))}
        </div>
      )}
      {tab !== "all" && (
        <div className="p-4 text-center text-sm text-muted-foreground">
          {tab} content
        </div>
      )}
    </div>
  );
}

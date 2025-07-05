import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Tabs from "@/components/ui/tabs";
import PostCard from "@/components/PostCard";
import { CrewMetaType, Post } from "@/lib/posts";

interface Crew {
  id: string;
  name: string;
  avatarUrl: string;
  memberCount: number;
  description: string;
  tags: string[];
}

export interface TabItem {
  value: CrewMetaType;
  label: string;
}

export default function CrewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [crew, setCrew] = useState<Crew | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [tab, setTab] = useState<CrewMetaType>("POSTS");
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

  // TODO :나중에는 crew config를 호출해서 받아온걸 렌더해야한다.
  const tabs: TabItem[] = [
    { value: "TOPIC", label: "어떤토픽일까요" },
    { value: "POSTS", label: "All Posts" },
    { value: "OVERVIEW", label: "소개" },
    { value: "NOTICE", label: "Notices" },
    { value: "EVENT", label: "이벤트들" },
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
      {tab === "POSTS" && (
        <div className="columns-2 gap-4 p-4 sm:columns-3" role="feed">
          {posts.map((post) => (
            <PostCard post={post} />
          ))}
        </div>
      )}
      {tab === "TOPIC" && (
        <div className="columns-2 gap-4 p-4 sm:columns-3" role="feed">
          {posts.map((post) => (
            <PostCard post={post} />
          ))}
        </div>
      )}
      {tab === "NOTICE" && (
        <div>
          <p className="p-4">공지글입니다.</p>
        </div>
      )}
      {tab === "OVERVIEW" && (
        <div>
          <p className="p-4">소개글입니다.</p>
        </div>
      )}
      {tab === "EVENT" && (
        <div>
          <p className="p-4">이벤트는 준비중입니다.</p>
        </div>
      )}
    </div>
  );
}

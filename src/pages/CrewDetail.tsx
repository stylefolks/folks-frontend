import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Tabs from "@/components/ui/tabs";
import PostCard from "@/components/PostCard";
import EventCard from "@/components/EventCard";
import { MapPin, UserPlus, X } from "lucide-react";
import {
  CrewDto,
  CrewNoticeDto,
  CrewEventDto,
  CrewMetaType,
  CrewRole,
} from "@/dto/crewDto";
import { PostDto } from "@/dto/postDto";
import { joinCrew, leaveCrew, fetchMyCrewRole } from "@/api/crewApi";

export interface TabItem {
  value: CrewMetaType;
  label: string;
}

export default function CrewDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [crew, setCrew] = useState<CrewDto | null>(null);
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [events, setEvents] = useState<CrewEventDto[]>([]);
  const [notices, setNotices] = useState<CrewNoticeDto[]>([]);
  const [description, setDescription] = useState<string>("");
  const [tab, setTab] = useState<CrewMetaType>("POSTS");
  const [me, setMe] = useState<{ avatarUrl: string } | null>(null);
  const [role, setRole] = useState<CrewRole | null>(null);
  const [joined, setJoined] = useState<boolean | null>(null);

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
    fetch(`/crews/${id}/events`)
      .then((res) => res.json())
      .then(setEvents)
      .catch(() => {});
    fetch(`/crews/${id}/notices`)
      .then((res) => res.json())
      .then(setNotices)
      .catch(() => {});
    fetch(`/crews/${id}/description`)
      .then((res) => res.json())
      .then((data) => setDescription(data.description))
      .catch(() => {});

    fetchMyCrewRole(id)
      .then((r) => {
        setRole(r);
        setJoined(true);
      })
      .catch(() => {
        setRole(null);
        setJoined(false);
      });
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
          src={crew.coverImage}
          alt={crew.name}
          className="aspect-[16/9] w-full rounded-lg object-cover"
        />
        {(role === CrewRole.OWNER || role === CrewRole.MANAGER) && (
          <Button
            size="sm"
            variant="outline"
            className="absolute right-4 top-4 z-10 bg-white/80 backdrop-blur"
            onClick={() => navigate(`/crew/${id}/settings`)}
          >
            Settings
          </Button>
        )}
        <div className="absolute bottom-4 left-8 text-white drop-shadow">
          <h1 className="font-bold">{crew.name}</h1>
          <p className="text-sm text-white/80">
            {crew.members?.length || 0} members
          </p>
        </div>
      </section>
      {crew.members && crew.members.length > 0 && (
        <section className="mt-2 px-4">
          <h2 className="mb-2 text-sm font-semibold">Members</h2>
          <div className="flex -space-x-2">
            {crew.members.slice(0, 8).map((f) => (
              <img
                key={f.userId}
                src={f.imageUrl}
                alt={f.username}
                className="h-8 w-8 rounded-full border border-white cursor-pointer"
                onClick={() => navigate(`/profile/${f.userId}`)}
              />
            ))}
            {crew.members.length > 8 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-gray-100 text-xs">
                ...
              </div>
            )}
          </div>
        </section>
      )}
      <div className="mt-2 flex flex-wrap gap-2 px-4">
        {crew?.tags?.map((tag) => (
          <Link
            to={`/search?tag=${tag}`}
            key={tag}
            className="rounded-full bg-muted  bg-[#F7F7F7] px-3 py-1 text-sm hover:bg-black hover:text-white transition"
          >
            #{tag}
          </Link>
        ))}
      </div>
      <div className="flex items-start justify-between px-4 py-2">
        <p className="mr-2 flex-1 text-sm leading-relaxed text-muted">
          {crew.description}
        </p>
        {joined !== null && (
          <button
            onClick={() => {
              if (!id) return;
              if (!joined) {
                joinCrew(id)
                  .then(() => setJoined(true))
                  .catch(() => {});
              } else if (window.confirm("크루를 탈퇴하시겠습니까?")) {
                leaveCrew(id)
                  .then(() => setJoined(false))
                  .catch(() => {});
              }
            }}
            className="rounded p-1 text-gray-500"
            aria-label={joined ? "Dismiss" : "Join"}
          >
            {joined ? <X size={20} /> : <UserPlus size={20} />}
          </button>
        )}
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
        <div className="flex justify-center p-4">
          <div className="w-full max-w-[400px] space-y-4">
            {notices.map((notice, idx) => (
              <div
                key={notice.id}
                onClick={() => navigate(`/posts/${notice.id}`)}
                className="cursor-pointer"
              >
                <div className="rounded-2xl bg-white p-6 shadow-md">
                  <h3 className="text-lg font-bold">{notice.title}</h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <MapPin size={12} />
                    <span>{notice.location}</span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>{notice.date}</span>
                    <span>{notice.commentCount ?? 0} comments</span>
                  </div>
                </div>
                {idx < notices.length - 1 && (
                  <div className="my-4 h-px bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "OVERVIEW" && (
        <div>
          <p className="p-4">{description}</p>
        </div>
      )}
      {tab === "EVENT" && (
        <div className="space-y-2 p-4">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => navigate(`/posts/${event.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

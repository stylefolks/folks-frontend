import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMeta } from "@/lib/meta";
import {
  fetchCrew,
  fetchCrewPosts,
  fetchCrewEvents,
  fetchCrewNotices,
  fetchCrewTopics,
  fetchCrewTabs,
  updateCrewTabs,
  fetchMyCrewRole,
  updateCrew,
  deleteCrew,
  type Crew,
  type Event,
  type Notice,
  type CrewTopic,
  type CrewTab,
  type CrewRole,
} from "@/lib/crew";
import type { Post } from "@/lib/posts";
import { useSetAppBarTitle } from "@/lib/appBarTitle";
import PostCard from "@/components/PostCard";
import EditableText from "@/components/EditableText";
import EditableImageUpload from "@/components/EditableImageUpload";
import CrewSettingsModal from "@/components/crews/CrewSettingsModal";
import CrewTabSettingsModal from "@/components/crews/CrewTabSettingsModal";
import { Settings, LayoutList, UsersRoundIcon } from "lucide-react";
import TabNav from "@/components/TabNav";
import FollowListModal from "@/components/users/FollowListModal";
import type { SimpleUser } from "@/lib/profile";

export default function CrewDetailPage() {
  const params = useParams();
  const crewId = params.id as string;
  const tabParam = params.tab as string | undefined;
  const navigate = useNavigate();
  const location = useLocation();

  const [crew, setCrew] = useState<Crew | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [topics, setTopics] = useState<CrewTopic[]>([]);
  const [tabs, setTabs] = useState<CrewTab[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [tab, setTab] = useState("");
  const [role, setRole] = useState<CrewRole>("member");
  const [about, setAbout] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showTabSettings, setShowTabSettings] = useState(false);
  const [followers, setFollowers] = useState<SimpleUser[]>([]);
  const [showFollowers, setShowFollowers] = useState(false);

  useSetAppBarTitle(crew ? `@${crew.name}` : undefined);

  useEffect(() => {
    if (tabs.length === 0) return;
    const valid = tabs.map((t) => t.type);
    const first = tabs.find((t) => t.isVisible)?.type;
    if (!tabParam || !valid.includes(tabParam)) {
      if (first) navigate(`/crew/${crewId}/${first}`, { replace: true });
    } else {
      setTab(tabParam);
    }
  }, [tabParam, crewId, navigate, tabs]);

  useEffect(() => {
    const topicsParam = new URLSearchParams(location.search).get("topics");
    if (topicsParam) {
      setSelectedTopics(
        topicsParam
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      );
    } else {
      setSelectedTopics([]);
    }
  }, [location.search]);

  useEffect(() => {
    if (!crewId) return;
    fetchCrewPosts(crewId, selectedTopics)
      .then(setPosts)
      .catch(() => {});
  }, [crewId, selectedTopics]);

  useMeta({ title: crew ? `${crew.name} - Stylefolks` : "Crew - Stylefolks" });

  useEffect(() => {
    if (!crewId) return;
    fetchMyCrewRole(crewId)
      .then(setRole)
      .catch(() => setRole("member"));
  }, [crewId]);

  useEffect(() => {
    if (!crewId) return;
    Promise.all([
      fetchCrew(crewId),
      fetchCrewPosts(crewId),
      fetchCrewEvents(crewId).catch(() => []),
      fetchCrewNotices(crewId).catch(() => []),
      fetchCrewTopics(crewId).catch(() => []),
      fetchCrewTabs(crewId).catch(() => []),
    ]).then(([c, p, e, n, t, tabsData]) => {
      setCrew(c);
      setFollowers(c.followers ?? []);
      setPosts(p);
      setEvents(e as Event[]);
      setNotices(n as Notice[]);
      setTopics(t as CrewTopic[]);
      setTabs((tabsData as CrewTab[]).sort((a, b) => a.order - b.order));
      setAbout(c.description);
    });
  }, [crewId]);

  if (!crew) return <p className="p-4">Loading...</p>;

  const isEditable = role === "owner" || role === "master";

  const handleDelete = async () => {
    try {
      await deleteCrew(crewId);
      navigate("/crews");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete crew");
    }
  };

  const currentTab = tabs.find((t) => t.type === tab);

  return (
    <>
      <div className="relative mx-auto max-w-2xl space-y-4 p-4 mt-4">
        {isEditable && (
          <>
            <div className="absolute right-4 top-4 z-20 bg-violet-100">
              <button
                className="absolute right-4 top-4 z-20"
                onClick={() => setShowSettings(true)}
              >
                <Settings size={20} />
              </button>
              <button
                className="absolute right-12 top-4 z-20"
                onClick={() => setShowTabSettings(true)}
              >
                <LayoutList size={20} />
              </button>
            </div>
            <CrewSettingsModal
              open={showSettings}
              crew={crew as Crew}
              onClose={() => setShowSettings(false)}
              onSave={async (data) => {
                setCrew({ ...(crew as Crew), ...data });
                await updateCrew(crewId, data)
                  .then(() => {
                    setShowSettings(false);
                  })
                  .catch(() => {
                    alert("Failed to update crew");
                  });
              }}
              onDelete={handleDelete}
            />
            <CrewTabSettingsModal
              open={showTabSettings}
              tabs={tabs}
              onClose={() => setShowTabSettings(false)}
              onSave={async (next) => {
                setTabs(next);
                await updateCrewTabs(crewId, next)
                  .then(() => {
                    setShowTabSettings(false);
                  })
                  .catch(() => {
                    alert("Failed to update tabs");
                  });
              }}
            />
          </>
        )}
        <EditableImageUpload
          src={crew.coverImage}
          onChange={() => {}}
          isEditable={isEditable}
          className="h-40 w-full rounded"
        />
        {crew.profileImage && (
          <img
            src={crew.profileImage}
            className="mx-auto -mt-8 h-20 w-20 rounded-full object-cover border-2 border-white z-30 relative"
          />
        )}
        <h1 className="text-xl font-bold">{crew.name}</h1>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">{crew.description}</p>
          <div
            className="flex justify-center"
            onClick={() => setShowFollowers(true)}
          >
            <p className="cursor-pointer text-sm text-gray-600 flex items-center gap-1">
              <UsersRoundIcon />
              <span className="font-semibold">{followers.length}</span>{" "}
            </p>
          </div>
        </div>
        <div>
          {topics.map((topic) => {
            return (
              <button
                key={topic.tag}
                className={`mr-2 mb-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200`}
                onClick={() =>
                  navigate(`/search?tag=${encodeURIComponent(topic.tag)}`)
                }
              >
                {topic.tag}
              </button>
            );
          })}
        </div>
        {crew.links.length > 0 &&
          crew.links.map((link) => (
            <a
              href={link.url}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.title || link.url}
            </a>
          ))}

        <TabNav
          tabs={tabs
            .filter((t) => t.isVisible)
            .map((t) => ({ id: t.type, title: t.title }))}
          current={tab}
          onChange={(t) => {
            const qs = location.search
              ? `?${new URLSearchParams(location.search).toString()}`
              : "";
            navigate(`/crew/${crewId}/${t}${qs}`);
          }}
        />
        {currentTab?.type === "posts" && (
          <div className="columns-2 gap-4 sm:columns-3">
            {(selectedTopics.length
              ? posts.filter((post) =>
                  selectedTopics.every((t) => post.tags?.includes(t))
                )
              : posts
            ).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
        {currentTab?.type === "topic" && (
          <div className="columns-2 gap-4 sm:columns-3">
            {posts
              .filter((p) =>
                currentTab?.hashtags?.length
                  ? currentTab.hashtags.some((tag) => p.tags?.includes(tag))
                  : true
              )
              .map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
          </div>
        )}
        {currentTab?.type === "event" && (
          <ul className="divide-y">
            {events.map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-2 py-2 cursor-pointer"
                onClick={() => navigate(`/post/${e.id}`)}
              >
                {e.image && (
                  <img
                    src={e.image}
                    className="h-12 w-12 rounded object-cover"
                  />
                )}
                <span className="flex-1 text-sm">{e.title}</span>
                <span className="text-xs text-gray-500 flex gap-2">
                  <span>💬 {e.commentCount ?? 0}</span>
                  <span>❤️ {e.likeCount ?? 0}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
        {currentTab?.type === "notice" && (
          <ul className="divide-y">
            {notices.map((n) => (
              <li
                key={n.id}
                className="flex items-center gap-2 py-2 cursor-pointer"
                onClick={() => navigate(`/post/${n.id}`)}
              >
                {n.image && (
                  <img
                    src={n.image}
                    className="h-12 w-12 rounded object-cover"
                  />
                )}
                <span className="flex-1 text-sm">{n.title}</span>
                <span className="text-xs text-gray-500 flex gap-2">
                  <span>💬 {n.commentCount ?? 0}</span>
                  <span>❤️ {n.likeCount ?? 0}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
        {currentTab?.type === "overview" && (
          <EditableText
            as="div"
            value={about}
            onChange={setAbout}
            isEditable={isEditable}
            className="min-h-[80px]"
          />
        )}
      </div>
      <FollowListModal
        open={showFollowers}
        onClose={() => setShowFollowers(false)}
        users={followers}
        type="followers"
      />
    </>
  );
}

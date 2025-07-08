import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMeta } from '@/lib/meta';
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
} from '@/lib/crew';
import type { Post } from '@/lib/posts';
import { useSetAppBarTitle } from '@/lib/appBarTitle';
import PostList from '@/components/PostList';
import EditableText from '@/components/EditableText';
import EditableImageUpload from '@/components/EditableImageUpload';
import EditableLinkList from '@/components/EditableLinkList';
import CrewSettingsModal from '@/components/crews/CrewSettingsModal';
import CrewTabSettingsModal from '@/components/crews/CrewTabSettingsModal';
import { Settings, LayoutList } from 'lucide-react';
import TabNav from '@/components/TabNav';
import EventCard from '@/components/EventCard';
import { CrewRole } from '@/constants/user';

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
  const [tab, setTab] = useState('');
  const [role, setRole] = useState<CrewRole>(CrewRole.MEMBER);
  const [about, setAbout] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showTabSettings, setShowTabSettings] = useState(false);

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
    const topicsParam = new URLSearchParams(location.search).get('topics');
    if (topicsParam) {
      setSelectedTopics(
        topicsParam
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
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

  useMeta({ title: crew ? `${crew.name} - Stylefolks` : 'Crew - Stylefolks' });

  useEffect(() => {
    if (!crewId) return;
    fetchMyCrewRole(crewId)
      .then(setRole)
      .catch(() => setRole(CrewRole.MEMBER));
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
      setPosts(p);
      setEvents(e as Event[]);
      setNotices(n as Notice[]);
      setTopics(t as CrewTopic[]);
      setTabs((tabsData as CrewTab[]).sort((a, b) => a.order - b.order));
      setAbout(c.description);
    });
  }, [crewId]);


  if (!crew) return <p className="p-4">Loading...</p>;

  const isEditable = role === CrewRole.OWNER || role === CrewRole.MANAGER;

  const handleDelete = async () => {
    try {
      await deleteCrew(crewId);
      navigate('/crews');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete crew');
    }
  };

  const currentTab = tabs.find((t) => t.type === tab);

  return (
    <div className="relative mx-auto max-w-2xl space-y-4 p-4 mt-4">
      {isEditable && (
        <>
          <button
            className="absolute right-4 top-4"
            onClick={() => setShowSettings(true)}
          >
            <Settings size={20} />
          </button>
          <button
            className="absolute right-12 top-4"
            onClick={() => setShowTabSettings(true)}
          >
            <LayoutList size={20} />
          </button>
          <CrewSettingsModal
            open={showSettings}
            crew={crew as Crew}
            onClose={() => setShowSettings(false)}
            onSave={async (data) => {
              setCrew({ ...(crew as Crew), ...data });
              await updateCrew(crewId, data).catch(() => {});
              setShowSettings(false);
            }}
            onDelete={handleDelete}
          />
          <CrewTabSettingsModal
            open={showTabSettings}
            tabs={tabs}
            onClose={() => setShowTabSettings(false)}
            onSave={async (next) => {
              setTabs(next);
              await updateCrewTabs(crewId, next).catch(() => {});
              setShowTabSettings(false);
            }}
          />
        </>
      )}
      <EditableImageUpload
        src={crew.coverImage}
        onChange={() => {}}
        isEditable={false}
        className="h-40 w-full rounded"
      />
      {crew.profileImage && (
        <img
          src={crew.profileImage}
          className="mx-auto -mt-8 h-20 w-20 rounded-full object-cover border-2 border-white z-30 relative"
        />
      )}
      <h1 className="text-xl font-bold">{crew.name}</h1>
      <p className="text-sm text-gray-600">{crew.description}</p>
      <EditableLinkList links={crew.links} onChange={() => {}} isEditable={false} />
      <TabNav
        tabs={tabs.filter((t) => t.isVisible).map((t) => ({ id: t.type, title: t.title }))}
        current={tab}
        onChange={(t) => {
          const qs = location.search ? `?${new URLSearchParams(location.search).toString()}` : '';
          navigate(`/crew/${crewId}/${t}${qs}`);
        }}
      />
      {currentTab?.type === 'posts' && (
        <PostList
          posts={
            selectedTopics.length
              ? posts.filter((post) =>
                  selectedTopics.every((t) => post.tags?.includes(t)),
                )
              : posts
          }
        />
      )}
      {currentTab?.type === 'topic' && (
        <PostList
          posts={posts.filter((p) =>
            currentTab?.hashtag ? p.tags?.includes(currentTab.hashtag) : true,
          )}
        />
      )}
      {currentTab?.type === 'event' && (
        <div className="space-y-2">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => navigate(`/post/${event.id}`)}
            />
          ))}
        </div>
      )}
      {currentTab?.type === 'notice' && (
        <ul className="space-y-2">
          {notices.map((n) => (
            <li
              key={n.id}
              className="cursor-pointer rounded border p-2"
              onClick={() => navigate(`/post/${n.id}`)}
            >
              <h3 className="font-semibold">{n.title}</h3>
              <p className="text-sm text-gray-500">{n.date}</p>
            </li>
          ))}
        </ul>
      )}
      {currentTab?.type === 'overview' && (
        <EditableText
          as="div"
          value={about}
          onChange={setAbout}
          isEditable={isEditable}
          className="min-h-[80px]"
        />
      )}
    </div>
  );
}

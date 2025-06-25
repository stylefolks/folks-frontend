import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMeta } from '@/lib/meta';
import {
  fetchCrew,
  fetchCrewPosts,
  fetchCrewEvents,
  fetchCrewNotices,
  fetchCrewTopics,
  fetchMyCrewRole,
  updateCrew,
  deleteCrew,
  type Crew,
  type Event,
  type Notice,
  type CrewTopic,
  type CrewRole,
} from '@/lib/crew';
import type { Post } from '@/lib/posts';
import { useSetAppBarTitle } from '@/lib/appBarTitle';
import PostCard from '@/components/PostCard';
import PostList from '@/components/PostList';
import EditableText from '@/components/EditableText';
import EditableImageUpload from '@/components/EditableImageUpload';
import EditableLinkList from '@/components/EditableLinkList';
import CrewSettingsModal from '@/components/crews/CrewSettingsModal';
import { Settings } from 'lucide-react';
import TabNav from '@/components/TabNav';
import EventCard from '@/components/EventCard';

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
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [tab, setTab] = useState('posts');
  const [role, setRole] = useState<CrewRole>('member');
  const [about, setAbout] = useState('');
  useSetAppBarTitle(crew ? `@${crew.name}` : undefined);

  useEffect(() => {
    const validTabs = ['posts', 'topics', 'events', 'notice', 'overview'];
    if (!tabParam || !validTabs.includes(tabParam)) {
      navigate(`/crew/${crewId}/posts`, { replace: true });
    } else {
      setTab(tabParam);
    }
  }, [tabParam, crewId, navigate]);

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
      .catch(() => setRole('member'));
  }, [crewId]);

  useEffect(() => {
    if (!crewId) return;
    Promise.all([
      fetchCrew(crewId),
      fetchCrewPosts(crewId),
      fetchCrewEvents(crewId).catch(() => []),
      fetchCrewNotices(crewId).catch(() => []),
      fetchCrewTopics(crewId).catch(() => []),
    ]).then(([c, p, e, n, t]) => {
      setCrew(c);
      setPosts(p);
      setEvents(e as Event[]);
      setNotices(n as Notice[]);
      setTopics(t as CrewTopic[]);
      setAbout(c.description);
    });
  }, [crewId]);

  useEffect(() => {
    if (tab !== 'topics' || topics.length === 0) return;
    const params = new URLSearchParams(location.search);
    if (!params.get('topics')) {
      params.set('topics', topics[0].tag);
      navigate(`/crew/${crewId}/topics?${params.toString()}`, { replace: true });
    }
  }, [tab, topics, location.search, crewId, navigate]);

  if (!crew) return <p className="p-4">Loading...</p>;

  const isEditable = role === 'owner' || role === 'master';
  const [showSettings, setShowSettings] = useState(false);


  const handleDelete = async () => {
    try {
      await deleteCrew(crewId);
      navigate('/crews');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete crew');
    }
  };

  return (
    <div className="relative mx-auto max-w-2xl space-y-4 p-4">
      {isEditable && (
        <>
          <button
            className="absolute right-4 top-4"
            onClick={() => setShowSettings(true)}
          >
            <Settings size={20} />
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
          className="mx-auto -mt-8 h-20 w-20 rounded-full object-cover border-2 border-white"
        />
      )}
      <h1 className="text-xl font-bold">{crew.name}</h1>
      <p className="text-sm text-gray-600">{crew.description}</p>
      <EditableLinkList links={crew.links} onChange={() => {}} isEditable={false} />
      <TabNav
        tabs={[
          { id: 'posts', title: 'Posts' },
          { id: 'topics', title: 'Topics' },
          { id: 'events', title: 'Events' },
          { id: 'notice', title: 'Notice' },
          { id: 'overview', title: 'Overview' },
        ]}
        current={tab}
        onChange={(t) => {
          const qs = location.search ? `?${new URLSearchParams(location.search).toString()}` : '';
          navigate(`/crew/${crewId}/${t}${qs}`);
        }}
      />
      {tab === 'posts' && (
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
      {tab === 'topics' && (
        <>
          <ul className="flex gap-2 overflow-x-auto py-2">
            {topics.map((t) => {
              const isSelected = selectedTopics.includes(t.tag);
              return (
                <li key={t.tag}>
                  <button
                    className={`rounded-full border px-3 py-1 text-sm ${
                      isSelected ? 'bg-blue-600 text-white border-blue-600' : ''
                    }`}
                    onClick={() => {
                      const params = new URLSearchParams(location.search);
                      const current = params.get('topics')
                        ? params
                            .get('topics')!
                            .split(',')
                            .filter(Boolean)
                        : [];
                      const exists = current.includes(t.tag);
                      const next = exists
                        ? current.filter((c) => c !== t.tag)
                        : [...current, t.tag];
                      if (next.length === 0) {
                        params.delete('topics');
                      } else {
                        params.set('topics', next.join(','));
                      }
                      navigate(`/crew/${crewId}/topics?${params.toString()}`);
                    }}
                  >
                    #{t.tag} ({t.count})
                  </button>
                </li>
              );
            })}
          </ul>
          <PostList
            posts={
              selectedTopics.length
                ? posts.filter((post) =>
                    selectedTopics.every((t) => post.tags?.includes(t)),
                  )
                : posts
            }
          />
        </>
      )}
      {tab === 'events' && (
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
      {tab === 'notice' && (
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
      {tab === 'overview' && (
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

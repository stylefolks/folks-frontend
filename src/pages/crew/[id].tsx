import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMeta } from '@/lib/meta';
import {
  fetchCrew,
  fetchCrewPosts,
  fetchCrewEvents,
  fetchCrewNotices,
  fetchCrewTopics,
  type Crew,
  type Event,
  type Notice,
  type CrewTopic,
} from '@/lib/crew';
import type { Post } from '@/lib/posts';
import { getMyId } from '@/lib/auth';
import { useSetAppBarTitle } from '@/lib/appBarTitle';
import PostCard from '@/components/PostCard';
import EditableText from '@/components/EditableText';
import EditableImageUpload from '@/components/EditableImageUpload';
import EditableLinkList from '@/components/EditableLinkList';
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
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [tab, setTab] = useState('posts');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
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
    const search = new URLSearchParams(location.search).get('search');
    if (search && search.startsWith('#')) {
      setSelectedTopic(search.slice(1));
    } else {
      setSelectedTopic(null);
    }
  }, [location.search]);

  useMeta({ title: crew ? `${crew.name} - Stylefolks` : 'Crew - Stylefolks' });

  useEffect(() => {
    getMyId().then(setCurrentUser).catch(() => {});
  }, []);

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

  if (!crew) return <p className="p-4">Loading...</p>;

  const isEditable = currentUser === crew.ownerId;

  const updateName = (name: string) => setCrew({ ...(crew as Crew), name });
  const updateDescription = (description: string) =>
    setCrew({ ...(crew as Crew), description });
  const updateCover = (file: File) => {
    const url = URL.createObjectURL(file);
    setCrew({ ...(crew as Crew), coverImage: url });
  };
  const updateLinks = (links: any) => setCrew({ ...(crew as Crew), links });

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <EditableImageUpload
        src={crew.coverImage}
        onChange={updateCover}
        isEditable={isEditable}
        className="h-40 w-full rounded"
      />
      <EditableText
        as="h1"
        value={crew.name}
        onChange={updateName}
        isEditable={isEditable}
        className="text-xl font-bold"
      />
      <EditableText
        as="p"
        value={crew.description}
        onChange={updateDescription}
        isEditable={isEditable}
        placeholder="Short description"
        className="text-sm text-gray-600"
      />
      <EditableLinkList
        links={crew.links}
        onChange={updateLinks}
        isEditable={isEditable}
      />
      <TabNav
        tabs={[
          { id: 'posts', title: 'Posts' },
          { id: 'topics', title: 'Topics' },
          { id: 'events', title: 'Events' },
          { id: 'notice', title: 'Notice' },
          { id: 'overview', title: 'Overview' },
        ]}
        current={tab}
        onChange={(t) => navigate(`/crew/${crewId}/${t}`)}
      />
      {tab === 'posts' && (
        <div className="grid grid-cols-2 gap-4">
          {(selectedTopic
            ? posts.filter((post) => post.tags?.includes(selectedTopic || ''))
            : posts
          ).map((post) => (
            <div key={post.id} onClick={() => navigate(`/post/${post.id}`)}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
      {tab === 'topics' && (
        <ul className="flex gap-2 overflow-x-auto py-2">
          {topics.map((t) => {
            const isSelected = selectedTopic === t.tag;
            return (
              <li key={t.tag}>
                <button
                  className={`rounded-full border px-3 py-1 text-sm ${
                    isSelected ? 'bg-blue-600 text-white border-blue-600' : ''
                  }`}
                  onClick={() =>
                    navigate(
                      `/crew/${crewId}/topics?search=${encodeURIComponent(`#${t.tag}`)}`,
                    )
                  }
                >
                  #{t.tag} ({t.count})
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {tab === 'events' && (
        <div className="space-y-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
      {tab === 'notice' && (
        <ul className="space-y-2">
          {notices.map((n) => (
            <li key={n.id} className="rounded border p-2">
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

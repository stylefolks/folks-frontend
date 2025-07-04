import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMeta } from '@/lib/meta';
import {
  CrewTab,
  fetchCrewTabs,
  updateCrewTabs,
  CrewMember,
  fetchCrewMembers,
  updateCrewMemberRole,
  removeCrewMember,
  CrewRole,
} from '@/lib/crew';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Badge from '@/components/ui/badge';

export default function CrewSettingsPage() {
  const { crewId } = useParams<{ crewId: string }>();
  const navigate = useNavigate();
  useMeta({ title: 'Crew Settings - Stylefolks' });
  const [members, setMembers] = useState<CrewMember[]>([]);
  const [tabs, setTabs] = useState<CrewTab[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!crewId) return;
    fetchCrewMembers(crewId).then(setMembers).catch(() => {});
    fetchCrewTabs(crewId).then(setTabs).catch(() => {});
  }, [crewId]);

  const filtered = members.filter((m) =>
    m.nickname.toLowerCase().includes(search.toLowerCase()),
  );

  const changeRole = (userId: string, role: CrewRole) => {
    if (!crewId) return;
    updateCrewMemberRole(crewId, userId, role)
      .then(() =>
        setMembers((ms) => ms.map((m) => (m.userId === userId ? { ...m, role } : m))),
      )
      .catch(() => {});
  };

  const remove = (userId: string) => {
    if (!crewId) return;
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    removeCrewMember(crewId, userId)
      .then(() => setMembers((ms) => ms.filter((m) => m.userId !== userId)))
      .catch(() => {});
  };

  const saveTabs = () => {
    if (!crewId) return;
    updateCrewTabs(crewId, tabs)
      .then(() => navigate(`/crew/${crewId}/posts`))
      .catch(() => {});
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-lg font-bold">Crew Settings</h1>
      <section className="space-y-2">
        <h2 className="font-semibold">Member management</h2>
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className="space-y-2">
          {filtered.map((m) => (
            <li key={m.userId} className="flex items-center gap-2">
              <span className="flex-1 text-sm">{m.nickname}</span>
              <Badge>{m.role.toUpperCase()}</Badge>
              {m.role !== 'owner' && (
                <>
                  <select
                    className="border rounded px-1 text-sm"
                    value={m.role}
                    onChange={(e) => changeRole(m.userId, e.target.value as CrewRole)}
                  >
                    <option value="manager">manager</option>
                    <option value="member">member</option>
                  </select>
                  <Button variant="outline" size="sm" onClick={() => remove(m.userId)}>
                    Delete
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
      <section className="space-y-2">
        <h2 className="font-semibold">Tab management</h2>
        <ul className="space-y-2">
          {tabs.map((t, i) => (
            <li key={t.id} className="flex items-center gap-2">
              <span className="flex-1">
                <Input
                  value={t.title}
                  onChange={(e) =>
                    setTabs((tabs) =>
                      tabs.map((tab) => (tab.id === t.id ? { ...tab, title: e.target.value } : tab)),
                    )
                  }
                />
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTabs((tabs) => tabs.filter((tab) => tab.id !== t.id))}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setTabs((ts) => [
              ...ts,
              {
                id: Date.now(),
                crewId: Number(crewId),
                title: '',
                type: 'topic',
                isVisible: true,
                order: ts.length,
              },
            ])
          }
        >
          Add Tab
        </Button>
      </section>
      <div className="flex gap-2">
        <Button onClick={saveTabs}>Save</Button>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

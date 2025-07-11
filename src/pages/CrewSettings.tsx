import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMeta } from "@/lib/meta";
import {
  fetchCrewTabs,
  updateCrewTabs,
  fetchCrewMembers,
  updateCrewMemberRole,
  removeCrewMember,
} from "@/api/crewApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import {
  CrewMemberDto,
  CrewTabDto,
  CrewRole,
  CrewMetaType,
} from "@/dto/crewDto";
import { CREW_META_TYPES } from "@/constants/crew";

export default function CrewSettingsPage() {
  const { crewId } = useParams<{ crewId: string }>();
  const navigate = useNavigate();
  useMeta({ title: "Crew Settings - Stylefolks" });
  const [members, setMembers] = useState<CrewMemberDto[]>([]);
  const [tabs, setTabs] = useState<CrewTabDto[]>([]);
  const [search, setSearch] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const TAB_OPTIONS = CREW_META_TYPES;

  const isOptionDisabled = (type: string, id: number) => {
    if (type === "TOPIC") {
      const count = tabs.filter(
        (t) => t.type === "TOPIC" && t.id !== id
      ).length;
      return count >= 3 && tabs.find((t) => t.id === id)?.type !== "TOPIC";
    }
    return tabs.some((t) => t.type === type && t.id !== id);
  };

  const changeType = (index: number, newType: CrewMetaType) => {
    setTabs((prev) =>
      prev.map((t, i) => (i === index ? { ...t, type: newType } : t))
    );
  };

  const canAddTab = () => {
    const topicCount = tabs.filter((t) => t.type === "TOPIC").length;
    if (topicCount < 3) return true;
    return ["posts", "overview", "notice", "event"].some(
      (t) => !tabs.some((tab) => tab.type === t)
    );
  };

  const addTab = () => {
    const topicCount = tabs.filter((t) => t.type === "TOPIC").length;
    const nonTopic = CREW_META_TYPES.find(
      (t) => !tabs.some((tab) => tab.type === t)
    );
    const type = nonTopic ?? (topicCount < 3 ? "TOPIC" : undefined);
    if (!type) return;
    setTabs([
      ...tabs,
      {
        id: Date.now(),
        crewId: Number(crewId),
        title: "",
        type,
        isVisible: true,
        order: tabs.length,
      },
    ]);
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    setTabs((ts) => {
      const updated = [...ts];
      const [item] = updated.splice(dragIndex, 1);
      updated.splice(index, 0, item);
      return updated.map((t, i) => ({ ...t, order: i }));
    });
    setDragIndex(null);
  };

  useEffect(() => {
    if (!crewId) return;
    fetchCrewMembers(crewId)
      .then(setMembers)
      .catch(() => {});
    fetchCrewTabs(crewId)
      .then(setTabs)
      .catch(() => {});
  }, [crewId]);

  const filtered = members.filter((m) =>
    m.nickname.toLowerCase().includes(search.toLowerCase())
  );

  const changeRole = (userId: string, role: CrewRole) => {
    if (!crewId) return;
    updateCrewMemberRole(crewId, userId, role)
      .then(() =>
        setMembers((ms) =>
          ms.map((m) => (m.userId === userId ? { ...m, role } : m))
        )
      )
      .catch(() => {});
  };

  const remove = (userId: string) => {
    if (!crewId) return;
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
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
              <Badge>{m.role}</Badge>
              {m.role !== CrewRole.OWNER && (
                <>
                  <select
                    className="border rounded px-1 text-sm"
                    value={m.role}
                    onChange={(e) =>
                      changeRole(m.userId, e.target.value as CrewRole)
                    }
                  >
                    <option value={CrewRole.MANAGER}>manager</option>
                    <option value={CrewRole.MEMBER}>member</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => remove(m.userId)}
                  >
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
            <li
              key={t.id}
              className="space-y-2 border p-2 rounded cursor-move"
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
            >
              <div className="flex items-center gap-2">
                <div className="flex-1 space-y-1">
                  <label
                    htmlFor={`title-${t.id}`}
                    className="block text-sm font-medium"
                  >
                    exposed name
                  </label>
                  <Input
                    id={`title-${t.id}`}
                    value={t.title}
                    onChange={(e) =>
                      setTabs((tabs) =>
                        tabs.map((tab) =>
                          tab.id === t.id
                            ? { ...tab, title: e.target.value }
                            : tab
                        )
                      )
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor={`type-${t.id}`}
                    className="block text-sm font-medium"
                  >
                    type
                  </label>
                  <select
                    id={`type-${t.id}`}
                    value={t.type}
                    onChange={(e) =>
                      changeType(i, e.target.value as CrewMetaType)
                    }
                    className="border rounded px-1 text-sm"
                  >
                    {TAB_OPTIONS.map((opt) => (
                      <option
                        key={opt}
                        value={opt}
                        disabled={isOptionDisabled(opt, t.id)}
                      >
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setTabs((tabs) => tabs.filter((tab) => tab.id !== t.id))
                  }
                >
                  Delete
                </Button>
              </div>
              {t.type === "TOPIC" && (
                <div className="space-y-1">
                  <label
                    htmlFor={`hashtags-${t.id}`}
                    className="block text-sm font-medium"
                  >
                    relavant hashtag
                  </label>
                  <Input
                    id={`hashtags-${t.id}`}
                    value={t.hashtags?.join(", ") ?? ""}
                    onChange={(e) =>
                      setTabs((tabs) =>
                        tabs.map((tab) =>
                          tab.id === t.id
                            ? {
                                ...tab,
                                hashtags: e.target.value
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              }
                            : tab
                        )
                      )
                    }
                    placeholder="Hashtags (comma separated)"
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
        <Button
          variant="outline"
          size="sm"
          onClick={addTab}
          disabled={!canAddTab()}
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

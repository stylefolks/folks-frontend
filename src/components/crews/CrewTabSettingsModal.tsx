import { useState } from "react";
import Modal from "../ui/Modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CrewTab } from "@/types/crew";

interface Props {
  open: boolean;
  tabs: CrewTab[];
  onSave: (tabs: CrewTab[]) => void;
  onClose: () => void;
}

const TAB_OPTIONS = [
  { value: "overview", label: "Overview" },
  { value: "posts", label: "Posts" },
  { value: "notice", label: "Notice" },
  { value: "event", label: "Event" },
  { value: "topic", label: "Topic" },
];

export default function CrewTabSettingsModal({
  open,
  tabs,
  onSave,
  onClose,
}: Props) {
  const [localTabs, setLocalTabs] = useState<CrewTab[]>(tabs);

  const handleChange = (index: number, field: keyof CrewTab, value: any) => {
    setLocalTabs((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  const add = () => {
    const id = Date.now();
    const order = localTabs.length;
    setLocalTabs([
      ...localTabs,
      {
        id,
        crewId: tabs[0]?.crewId ?? 0,
        title: "",
        type: "POSTS",
        isVisible: true,
        order,
      },
    ]);
  };

  const remove = (index: number) => {
    setLocalTabs(localTabs.filter((_, i) => i !== index));
  };

  const move = (index: number, dir: -1 | 1) => {
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= localTabs.length) return;
    const updated = [...localTabs];
    const tmp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = tmp;
    updated.forEach((t, i) => (t.order = i));
    setLocalTabs(updated);
  };

  const handleSave = () => {
    const normalized = localTabs.map((t, i) => ({ ...t, order: i }));
    onSave(normalized);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Manage Tabs</h2>
        <div className="space-y-3">
          {localTabs.map((tab, i) => (
            <div key={tab.id} className="space-y-2 rounded border p-2">
              <div className="flex items-center gap-2">
                <Input
                  value={tab.title}
                  onChange={(e) => handleChange(i, "title", e.target.value)}
                  placeholder="Title"
                  className="flex-1"
                />
                <select
                  value={tab.type}
                  onChange={(e) => handleChange(i, "type", e.target.value)}
                  className="border rounded px-1 text-sm"
                >
                  {TAB_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={tab.isVisible}
                    onChange={(e) =>
                      handleChange(i, "isVisible", e.target.checked)
                    }
                  />
                  Visible
                </label>
              </div>
              {tab.type === "TOPIC" && (
                <Input
                  value={tab.hashtags?.join(", ") ?? ""}
                  onChange={(e) =>
                    handleChange(
                      i,
                      "hashtags",
                      e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="Hashtags (comma separated)"
                />
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => move(i, -1)}>
                  Up
                </Button>
                <Button variant="outline" size="sm" onClick={() => move(i, 1)}>
                  Down
                </Button>
                <Button variant="outline" size="sm" onClick={() => remove(i)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={add}>
          Add Tab
        </Button>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </Modal>
  );
}

interface Tab {
  id: string;
  title: string;
}

interface Props {
  tabs: Tab[];
  current: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function TabNav({ tabs, current, onChange, className }: Props) {
  return (
    <div className={`flex border-b ${className || ''}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-3 py-2 text-sm font-medium ${
            current === tab.id
              ? 'border-b-2 border-black'
              : 'text-gray-500'
          }`}
        >
          {tab.title}
        </button>
      ))}
    </div>
  );
}

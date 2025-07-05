import { CrewTab } from "@/lib/crew";
import { CrewMetaType } from "@/lib/posts";
import { cn } from "@/lib/utils";
import { TabItem } from "@/pages/CrewDetailPage";
import React from "react";

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (value: CrewMetaType) => void;
  items: TabItem[];
}

export default function Tabs({
  value,
  onValueChange,
  items,
  className,
}: TabsProps) {
  return (
    <div
      className={cn(
        "flex border-b w-full overflow-hidden overflow-x-scroll",
        className
      )}
    >
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onValueChange(item.value)}
          className={cn(
            "px-4 py-2 text-sm whitespace-nowrap",
            value === item.value
              ? "font-bold text-black border-b-2 border-black"
              : "text-muted-foreground"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

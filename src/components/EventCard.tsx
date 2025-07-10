import { CrewEvent } from "@/types/crew";

interface Props {
  event: CrewEvent;
  onClick?: () => void;
}

export default function EventCard({ event, onClick }: Props) {
  return (
    <div
      className="flex gap-2 rounded border p-2 cursor-pointer"
      onClick={onClick}
    >
      {event.image && (
        <img src={event.image} className="h-20 w-20 rounded object-cover" />
      )}
      <div>
        <h3 className="font-semibold">{event.title}</h3>
        <p className="text-sm text-gray-500">
          {event.date} @ {event.location}
        </p>
      </div>
    </div>
  );
}

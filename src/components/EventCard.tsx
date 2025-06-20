import { Event } from '@/lib/crew';

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="flex gap-2 rounded border p-2">
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
